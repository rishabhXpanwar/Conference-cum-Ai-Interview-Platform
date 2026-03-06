import { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import "../styles/AiMeetingRoom.css";

import MicWaveform from "../components/MicWaveForm";
import AiWaveform from "../components/AiWaveForm";

import * as faceapi from "face-api.js";


export default function AiMeetingRoom () {
    const { aiCode } = useParams();

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const localStream = useRef(null);
    const peerConnections = useRef({});
    const recognitionRef = useRef(null);
    const attentionInterval = useRef(null);

    
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [canSpeak, setCanSpeak] = useState(false);
  const [aiState, setAiState] = useState("idle");
  const [question, setQuestion] = useState("");
  const [interviewId, setInterviewId] = useState(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const [warning, setWarning] = useState("");

  const role = user.role === "interviewer" ? "interviewer" : "candidate";


  const initCamera = async () => {
    if (role === "candidate") {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.current = stream;
      localVideoRef.current.srcObject = stream;

      startAttentionDetection();
    }
  };

  const startAttentionDetection = () => {
    attentionInterval.current = setInterval(async () => {
      if (!localVideoRef.current) return;

      if (!localVideoRef.current || localVideoRef.current.readyState !== 4)
        return;

      const detections = await faceapi.detectAllFaces(
        localVideoRef.current,
        new faceapi.TinyFaceDetectorOptions(),
      );

      if (detections.length === 0) {
        setWarning("Face not detected");
      } else {
        setWarning("");
      }
    }, 2000);
  };

  const setup = async () => {
    await loadModels();

    await initCamera();
  };

  useEffect(() => {

    socket.connect();

    socket.emit("join-ai-room" , {
        aiCode,
        role,
        userId : user._id,

    });

    socket.on("ai-joined", ({interviewId}) => {
        setInterviewId(interviewId);
    });


    socket.on("ai-user-joined" , async({ socketId , role}) => {
        if(role === "interviewer")
        {
            const pc = createPeerConnection(socketId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("ai-offer" , {
                to : socketId,
                offer
            });
        }

    });


    socket.on("ai-offer", async({ from , offer})=> {
        const pc = createPeerConnection(from);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("ai-answer" , {
            to : from,
            answer
        });
    });


    socket.on("ai-answer" , async({from , answer}) => {
        const pc = peerConnections.current[from];
        if(pc)
             await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });


    socket.on("ai-ice-candidate" , async({from , candidate})=> {
        const pc = peerConnections.current[from];

        if(pc)
             await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("ai:speaking", ({ question }) => {
      setAiState("speaking");
      setQuestion(question);

      setCanSpeak(false);

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      speak(question);
    });

    socket.on("ai:thinking", () => {
      setAiState("thinking");
      setCanSpeak(false);

      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });


      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }


    });

    socket.on("ai-completed" , ({score}) => {
        alert("Interview Completed");
        navigate("/ai/activity");
    });

    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    };

    setup();

    return ()=> cleanup();



  } , []);

  

  const createPeerConnection = (socketId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[socketId] = pc;

    if(localStream.current)
    {
        localStream.current?.getTracks().forEach(track => {
            pc.addTrack(track,localStream.current);
        });


    }


    pc.ontrack = (event) => {
         setRemoteStreams((prev) => {
           const exists = prev.find((s) => s.socketId === socketId);

           if (exists) return prev;

           return [
             ...prev,
             {
               socketId,
               stream: event.streams[0],
             },
           ];
         });
    };


    pc.onicecandidate = (event) => {
        if(event.candidate)
        {
            socket.emit("ai-ice-candidate" , {
                to : socketId,
                candidate : event.candidate
            });
        }
    };

    return pc;

  };


  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
      setAiState("listening");
      setCanSpeak(true);

      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
      startListening();
    };

    speechSynthesis.speak(utterance);
  };


  


  const toggleAudio = () => {
    localStream.current?.getAudioTracks().forEach((track) => {
      track.enabled = isMuted; // toggle
    });

    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStream.current?.getVideoTracks().forEach((track) => {
      track.enabled = isVideoOff;
    });

    setIsVideoOff(!isVideoOff);
  };


  
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onend = () => {
      if (canSpeak) {
        recognition.start();
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      socket.emit("ai:answer", {
        interviewId,
        answer: transcript,
      });
    };


    recognition.start();
    recognition.onerror = (e) => {
      console.log("speech error", e);
    };

    recognitionRef.current = recognition;
  };


  const cleanup = () => {
    // stop AI speech
    speechSynthesis.cancel();

    // stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // stop camera
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }

    if (attentionInterval.current) {
      clearInterval(attentionInterval.current);
    }

    // close peer connections
    Object.values(peerConnections.current).forEach((pc) => pc.close());

    peerConnections.current = {};

    // remove socket listeners
    socket.removeAllListeners();

    // disconnect socket
    socket.disconnect();
  };

  const leaveInterview = () => {

  cleanup();

  navigate("/ai/dashboard");

};

  return (
    <div className="ai-room">
      <div className="ai-top">
        <div className={`ai-avatar ${aiState}`}>
          AI
          <AiWaveform active={aiState === "speaking"} />
        </div>
        

        <div className="ai-question">
          {question || "Waiting for interview to start"}
        </div>
      </div>

      <div className="ai-videos">
        {role === "candidate" && (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="ai-video"
          />
        )}

        {remoteStreams.map(({ socketId, stream }) => (
          <video
            key={socketId}
            autoPlay
            playsInline
            className="ai-video"
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
          />
        ))}
      </div>

      {warning && <div className="warning">{warning}</div>}

      {aiState === "listening" && (
        <div className="candidate-wave">
          <MicWaveform stream={localStream.current} />

          <p>Listening...</p>
        </div>
      )}

      <div className="ai-controls">
        {role === "candidate" && (
          <>
            <button disabled={!canSpeak} onClick={toggleAudio}>
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <button onClick={toggleVideo}>
              {isVideoOff ? "Camera On" : "Camera Off"}
            </button>
          </>
        )}

        <button onClick={leaveInterview}>Leave</button>
      </div>
    </div>
  );



}
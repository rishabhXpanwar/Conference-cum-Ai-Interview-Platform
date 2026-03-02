
//----------------------------------------------------------------------------------------
//------------------cleaned version-------------------------------------------------
//-----------------------------------------------------------------------------------------

import { useState, useContext, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import socket from "../socket.js";
import "../styles/MeetingRoom.css";

export default function MeetingRoom() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const localVideoRef = useRef(null);
  const localStream = useRef(null);
  const peerConnections = useRef({});
  const screenStreamRef = useRef(null);

  const [remoteStreams, setRemoteStreams] = useState([]);
  const [participants, setParticipants] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [mySocketId, setMySocketId] = useState(null);

  /* UI-only state — no business logic */
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    // only to get the socket id of the user and set it to state
    socket.on("connect", () => {
      setMySocketId(socket.id);
    });

    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.current = stream;
      localVideoRef.current.srcObject = stream;

      socket.connect();

      // Join meeting room
      socket.emit("join-meeting", {
        meetingCode: code,
        userId: user._id,
        username: user.username,
      });
    };

    init();

    // Initial participants
    // This will give us the list of existing participants when we join, along with their usernames
    socket.on("current-users", ({ participants }) => {
      const map = {};
      participants.forEach((p) => {
        map[p.socketId] = p.username;
      });
      setParticipants(map);
    });

    // New user joined
    socket.on("User-joined", async ({ socketId, username }) => {
      // Add new participant to state
      setParticipants((prev) => ({
        ...prev,
        [socketId]: username,
      }));

      const pc = createPeerConnection(socketId);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", { to: socketId, offer });
    });

    // Offer received
    socket.on("offer", async ({ from, offer }) => {
      const pc = createPeerConnection(from);

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { to: from, answer });
    });

    // Answer received
    socket.on("answer", async ({ from, answer }) => {
      const pc = peerConnections.current[from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // ICE Candidate received
    socket.on("ice-candidate", async ({ from, candidate }) => {
      const pc = peerConnections.current[from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Chat message received
    socket.on("chat-message", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    // only to set the host role and set it to state
    socket.on("meeting-role", ({ isHost }) => {
      setIsHost(isHost);
    });

    // User Left
    socket.on("User-left", (socketId) => {
      if (peerConnections.current[socketId]) {
        peerConnections.current[socketId].close();
        delete peerConnections.current[socketId];
      }

      setRemoteStreams((prev) => prev.filter((s) => s.socketId !== socketId));

      setParticipants((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
    });

    // Kicked by host
    socket.on("kicked", () => {
      cleanup();
      navigate("/dashboard");
    });

    // Force mute by host
    socket.on("force-mute", () => {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
      setIsMuted(true);
    });

    return () => cleanup();
  }, []);

  // Function to create a new RTCPeerConnection and set up event handlers
  const createPeerConnection = (socketId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[socketId] = pc;

    // Add local tracks to the connection
    localStream.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStream.current);
    });

    // When remote stream is received, add it to state
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

    // generate ICE candidate and send to other peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: socketId,
          candidate: event.candidate,
        });
      }
    };

    return pc;
  };

  // Cleanup function to stop all tracks and close connections

  const cleanup = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }

    Object.values(peerConnections.current).forEach((pc) => pc.close());

    peerConnections.current = {};
    socket.removeAllListeners();
    socket.disconnect();
  };

  // Toggle audio on/off
  const toggleAudio = () => {
    localStream.current.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });
    setIsMuted(!isMuted);
  };

  // Toggle video on/off
  const toggleVideo = () => {
    localStream.current.getVideoTracks().forEach((track) => {
      track.enabled = isVideoOff;
    });
    setIsVideoOff(!isVideoOff);
  };

  // Toggle screen share
  const toggleScreenShare = async () => {
    if (!isSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      screenStreamRef.current = screenStream;

      const screenTrack = screenStream.getVideoTracks()[0];

      localVideoRef.current.srcObject = screenStream;

      Object.values(peerConnections.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);
      });

      screenTrack.onended = () => toggleScreenShare();

      setIsSharing(true);
    } else {

      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      const cameraTrack = localStream.current.getVideoTracks()[0];

      localVideoRef.current.srcObject = localStream.current;

      Object.values(peerConnections.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track.kind === "video");
        if (sender) sender.replaceTrack(cameraTrack);
      });

      setIsSharing(false);
    }
  };



  // Send chat message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("chat-message", {
      meetingCode: code,
      message,
      sender: user.username,
    });

    setMessage("");
  };



  // leave meeting
  const handleLeave = () => {
    cleanup();
    navigate("/dashboard");
  };




  // Kick user (only for host)
    const kickUser = (socketId) => {
      socket.emit("kick-user", {
        targetSocketId: socketId,
      });
    };




    // Mute all (only for host)
    const muteAll = () => {
      socket.emit("mute-all");
    };

  // UI
  return (
    <div className="room-page">

      {/* ======== TOP BAR ======== */}
      <header className="room-topbar">
        <div className="room-topbar-left">
          <span className="room-topbar-logo">MeetPro</span>
          <span className="room-code-badge">{code}</span>
        </div>
        <div className="room-topbar-right">
          <span className="room-participant-count">
            {Object.keys(participants).length} participant{Object.keys(participants).length !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      {/* ======== BODY ======== */}
      <div className="room-body">

        {/* ---- VIDEO GRID ---- */}
        <div className={`room-videos${remoteStreams.length === 0 ? " single-layout" : ""}`}>
          {/* Local */}
          <div className="room-video-wrap room-video-wrap--local">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="room-video"
            />
            <div className="room-name-tag">
              {user?.username || "You"} {isVideoOff && <span className="room-vid-off-badge">Cam off</span>}
            </div>
            {isMuted && <div className="room-muted-indicator">🔇</div>}
          </div>

          {/* Remote */}
          {remoteStreams.map(({ socketId, stream }) => (
            <div key={socketId} className="room-video-wrap">
              <video
                autoPlay
                playsInline
                className="room-video"
                ref={(video) => {
                  if (video) video.srcObject = stream;
                }}
              />
              <div className="room-name-tag">
                {participants[socketId] || "User"}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ======== FLOATING PANEL TOGGLE ======== */}
      <button
        className={`room-float-toggle${panelOpen ? " room-float-toggle--open" : ""}`}
        onClick={() => setPanelOpen((v) => !v)}
        title={panelOpen ? "Close panel" : "Chat & People"}
        aria-label="Toggle chat panel"
      >
        💬
      </button>

      {/* ======== FLOATING PANEL ======== */}
      {panelOpen && (
        <aside className="room-float-panel">

          {/* Panel header: tabs + close */}
          <div className="room-float-panel-header">
            <div className="room-panel-tabs">
              <button
                className={`room-tab-btn${activeTab === "chat" ? " room-tab-btn--active" : ""}`}
                onClick={() => setActiveTab("chat")}
              >
                Chat
              </button>
              <button
                className={`room-tab-btn${activeTab === "participants" ? " room-tab-btn--active" : ""}`}
                onClick={() => setActiveTab("participants")}
              >
                People ({Object.keys(participants).length})
              </button>
            </div>
            <button
              className="room-float-close"
              onClick={() => setPanelOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="room-panel-body">
              <div className="room-chat-messages">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`room-chat-bubble${
                      msg.sender === user?.username ? " room-chat-bubble--self" : ""
                    }`}
                  >
                    {msg.sender !== user?.username && (
                      <span className="room-chat-sender">{msg.sender}</span>
                    )}
                    <span className="room-chat-text">{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="room-chat-input">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message…"
                  className="room-chat-field"
                />
                <button onClick={sendMessage} className="room-chat-send">↑</button>
              </div>
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === "participants" && (
            <div className="room-panel-body">
              <ul className="room-participant-list">
                {Object.entries(participants).map(([id, name]) => (
                  <li key={id} className="room-participant-item">
                    <span className="room-participant-dot" />
                    <span className="room-participant-name">
                      {id === mySocketId ? `${name} (You)` : name}
                    </span>
                    {isHost && id !== mySocketId && (
                      <button
                        className="room-kick-btn"
                        onClick={() => kickUser(id)}
                      >
                        Kick
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isHost && (
                <button className="room-mute-all-btn" onClick={muteAll}>
                  Mute All
                </button>
              )}
            </div>
          )}

        </aside>
      )}

      {/* ======== CONTROL BAR ======== */}
      <div className="room-controls">
        <button
          className={`room-ctrl-btn${isMuted ? " room-ctrl-btn--active" : ""}`}
          onClick={toggleAudio}
          title={isMuted ? "Unmute" : "Mute"}
        >
          <span className="room-ctrl-icon">{isMuted ? "🔇" : "🎤"}</span>
        </button>

        <button
          className={`room-ctrl-btn${isVideoOff ? " room-ctrl-btn--active" : ""}`}
          onClick={toggleVideo}
          title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
        >
          <span className="room-ctrl-icon">{isVideoOff ? "📵" : "📷"}</span>
        </button>

        <button
          className={`room-ctrl-btn${isSharing ? " room-ctrl-btn--sharing" : ""}`}
          onClick={toggleScreenShare}
          title={isSharing ? "Stop Sharing" : "Share Screen"}
        >
          <span className="room-ctrl-icon">{isSharing ? "🛑" : "🖥️"}</span>
        </button>

        <button
          className="room-ctrl-btn room-ctrl-btn--leave"
          onClick={handleLeave}
          title="Leave meeting"
        >
          <span className="room-ctrl-icon">📵</span>
        </button>
      </div>

    </div>
  );
}


//--------------------------self version------------------------------------
// import { useState, useContext, useRef, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext.jsx";
// import socket from "../socket.js";
// import "./MeetingRoom.css";

// export default function MeetingRoom() {
//   const { code } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const localVideoRef = useRef(null);
//   const localStream = useRef(null);

//   const peerConnections = useRef({});
//   const [remoteStreams, setRemoteStreams] = useState([]);

//   const [message, setmessage] = useState("");
//   const [chatMessages, setchatMessages] = useState([]);
//   const [isMuted, setisMuted] = useState(false);
//   const [isVideoOff, setisVideoOff] = useState(false);
//   const [participants, setParticipants] = useState({});
//   const [isSharing, setisSharing] = useState(false);
//   //const [participantMap, setParticipantMap] = useState({});
//   const [isHost, setIsHost] = useState(false);

//   const [mySocketId, setMySocketId] = useState(null);

//   useEffect(() => {
//     //only to get the socket id of the user and set it to state
//     socket.on("connect", () => {
//       setMySocketId(socket.id);
//     });

//     const init = async () => {
//       //  Get camera
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       localStream.current = stream;
//       localVideoRef.current.srcObject = stream;

//       socket.connect();

//       socket.emit("join-meeting", {
//         meetingCode: code,
//         userId: user._id,
//         username: user.username,
//       });
//     };

//     init();

//     //  New User Joined
//     socket.on("User-joined", async ({ socketId, username, users }) => {
//       setParticipants((prev) => ({
//         ...prev,
//         [socketId]: username,
//       }));

//       const pc = createPeerConnection(socketId);

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);

//       socket.emit("offer", { to: socketId, offer });
//     });

//     //  Offer Received
//     socket.on("offer", async ({ from, offer ,username }) => {
//       const pc = createPeerConnection(from, username);

//       await pc.setRemoteDescription(new RTCSessionDescription(offer));

//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);

//       socket.emit("answer", { to: from, answer });
//     });

//     //  Answer Received
//     socket.on("answer", async ({ from, answer }) => {
//       const pc = peerConnections.current[from];
//       if (pc) {
//         await pc.setRemoteDescription(new RTCSessionDescription(answer));
//       }
//     });

//     //  ICE Candidate
//     socket.on("ice-candidate", async ({ from, candidate }) => {
//       const pc = peerConnections.current[from];
//       if (pc) {
//         await pc.addIceCandidate(new RTCIceCandidate(candidate));
//       }
//     });

//     // chat message received
//     socket.on("chat-message", (msg) => {
//       setchatMessages((prev) => [...prev, msg]);
//     });

//     socket.on("current-users", ({ participants }) => {
//       const map = {};
//       participants.forEach((p) => {
//         map[p.socketId] = p.username;
//       });
//       setParticipants(map);
//     });

//     // only for host to get the role and set it to state
//     socket.on("meeting-role", ({ isHost }) => {
//       setIsHost(isHost);
//     });

//     socket.on("kicked", () => {
//       alert("You were removed by host");
//       cleanup();
//       navigate("/dashboard");
//     });

//     socket.on("force-mute", () => {
//       localStream.current.getAudioTracks().forEach((track) => {
//         track.enabled = false;
//       });

//       setisMuted(true);
//     });

//     //  User Left
//     socket.on("User-left", (socketId) => {
//       if (peerConnections.current[socketId]) {
//         peerConnections.current[socketId].close();
//         delete peerConnections.current[socketId];
//       }

//       setRemoteStreams((prev) =>
//         prev.filter((stream) => stream.socketId !== socketId),
//       );

//       setParticipants((prev) => prev.filter((id) => id !== socketId));
//       setParticipantMap((prev) => {
//         const copy = { ...prev };
//         delete copy[socketId];
//         return copy;
//       });
//     });

//     return () => cleanup();
//   }, []);

//   const createPeerConnection = (socketId, username) => {
//     const pc = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     peerConnections.current[socketId] = pc;

//     // Add local tracks
//     localStream.current.getTracks().forEach((track) => {
//       pc.addTrack(track, localStream.current);
//     });

//     // Remote stream received
//     pc.ontrack = (event) => {
//       setRemoteStreams((prev) => {
//         const exists = prev.find((s) => s.socketId === socketId);

//         if (exists) return prev;

//         return [
//           ...prev,
//           {
//             socketId,
//             username,
//             stream: event.streams[0],
//           },
//         ];
//       });
//     };

//     //generate  ICE candidate and send to other peer
//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           to: socketId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     return pc;
//   };

//   // Cleanup function to stop all tracks and close connections
//   const cleanup = () => {
//     if (localStream.current) {
//       localStream.current.getTracks().forEach((track) => track.stop());
//     }

//     Object.values(peerConnections.current).forEach((pc) => pc.close());

//     peerConnections.current = {};
//     socket.removeAllListeners();
//     socket.off("offer");
//     socket.off("answer");
//     socket.off("ice-candidate");
//     socket.off("chat-message");
//     socket.off("meeting-role");
//     socket.off("kicked");
//     socket.off("force-mute");
//     socket.off("User-left");

//     socket.disconnect();
//   };

//   // toogle screen share
//   const toogleScreenShare = async () => {
//     if (!isSharing) {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//       });

//       const screenTrack = screenStream.getVideoTracks()[0];
//       localVideoRef.current.srcObject = screenStream;
//       // Replace the video track in each peer connection
//       Object.values(peerConnections.current).forEach((pc) => {
//         const sender = pc.getSenders().find((s) => s.track.kind === "video");
//         if (sender) {
//           sender.replaceTrack(screenTrack);
//         }
//       });

//       screenTrack.onended = () => {
//         toogleScreenShare();
//       };
//       setisSharing(true);
//     } else {
//       const cameraTrack = localStream.current.getVideoTracks()[0];
//       localVideoRef.current.srcObject = localStream.current;
//       Object.values(peerConnections.current).forEach((pc) => {
//         const sender = pc.getSenders().find((s) => s.track.kind === "video");
//         if (sender) sender.replaceTrack(cameraTrack);
//       });

//       setisSharing(false);
//     }
//   };

//   // send chat message
//   const sendMessage = () => {
//     if (!message.trim()) return;

//     socket.emit("chat-message", {
//       meetingCode: code,
//       message,
//       sender: user.username,
//     });

//     setmessage("");
//   };

//   // mute and unmute audio
//   const toogleAudio = () => {
//     if (!localStream.current) return;

//     localStream.current.getAudioTracks().forEach((track) => {
//       track.enabled = isMuted;
//     });

//     setisMuted(!isMuted);
//   };

//   // toogle video on and off
//   const toogleVideo = () => {
//     if (!localStream.current) return;

//     localStream.current.getVideoTracks().forEach((track) => {
//       track.enabled = isVideoOff;
//     });

//     setisVideoOff(!isVideoOff);
//   };

//   // Kick user (only for host)
//   const kickUser = (socketId) => {
//     socket.emit("kick-user", {
//       targetSocketId: socketId,
//     });
//   };

//   // Mute all (only for host)
//   const muteAll = () => {
//     socket.emit("mute-all");
//   };

//   // Leave meeting function
//   const handleLeave = () => {
//     cleanup();
//     navigate("/dashboard");
//   };

//   // UI
//   return (
//     <div className="meeting-container">
//       <h2>Meeting Room : {code}</h2>

//       <div className="video-grid">
//         {/* Local Video */}
//         <video
//           ref={localVideoRef}
//           autoPlay
//           muted
//           playsInline
//           className="video"
//         />

//         {/* Remote Videos */}
//         {remoteStreams.map(({ socketId, stream, username }) => (
//           <div key={socketId} className="video-wrapper">
//             <video
//               autoPlay
//               playsInline
//               className="video"
//               ref={(video) => {
//                 if (video) video.srcObject = stream;
//               }}
//             />

//             <div className="name-overlay">{username}</div>
//           </div>
//         ))}
//       </div>

//       {isHost && <button onClick={muteAll}>Mute All</button>}

//       <button onClick={toogleAudio}>{isMuted ? "Unmute" : "Mute"}</button>

//       <button onClick={toogleVideo}>
//         {isVideoOff ? "Turn Video On" : "Turn Video Off"}
//       </button>

//       <button onClick={toogleScreenShare}>
//         {isSharing ? "Stop Sharing" : "Share Screen"}
//       </button>

//       <div className="participant-list">
//         <h3>Participants ({participants.length})</h3>
//         <ul>
//           {participants.map((id) => (
//             <li key={id}>
//               {id === mySocketId ? "You" : participantMap[id] || id}

//               {isHost && id !== mySocketId && (
//                 <button
//                   onClick={() => kickUser(id)}
//                   style={{ marginLeft: "8px" }}
//                 >
//                   Kick
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button onClick={handleLeave} className="leave-btn">
//         Leave
//       </button>

//       <div className="chat-messages">
//         {chatMessages.map((msg, index) => (
//           <div key={index}>
//             <strong>{msg.sender}:</strong> {msg.message}
//           </div>
//         ))}
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           value={message}
//           placeholder="Type message..."
//           onChange={(e) => setmessage(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>

//       </div>
//     </div>

//   );
// }

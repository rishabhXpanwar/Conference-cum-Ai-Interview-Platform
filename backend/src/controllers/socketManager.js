// neeche vala code self written hai , koi error nhi hai isme bhi

// import { Server } from "socket.io";

// import meetingModel from "../models/meeting.model.js";
// import meetingAttendanceModel from "../models/meetingAttendance.model.js";

// let connections = {};
// let messages = {};

// let timeOnline = {};

// let activeSession = {};
// export const connectToSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: process.env.CLIENT_URL || "http://localhost:5173",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("New client connected: " + socket.id);
//     //connection establish ho gya hai ab join meeting

//     socket.on("join-meeting", async ({ meetingCode, userId, username }) => {
//       //check if meeting code is valid
//       const meeting = await meetingModel.findOne({ meetingCode });
//       if (!meeting)
//         return socket.emit("error", { message: "Invalid Meeting Code" });
//       if (new Date() > meeting.expiresAt)
//         return socket.emit("error", { message: "Meeting Expired" });

//       // room tarcking ke liye connections
//       if (!connections[meetingCode]) {
//         connections[meetingCode] = new Set();
//       }
//       // connections create ho gya
//       //ab hum is connection me us room ke user ko add krenge

//       connections[meetingCode].add(socket.id);

//       // track joining time
//       timeOnline[socket.id] = new Date();

//       //active Session tracking
//       activeSession[socket.id] = {
//         userId,
//         meetingCode,
//         joinedAt: new Date(),
//       };

//       //join the meeting

//       socket.join(meetingCode);

//       console.log(`${username} joined meeting ${meetingCode}`);
//       // notify other users in the meeting that a new user has joined
//       socket.to(meetingCode).emit("User-joined", {
//         socketId: socket.id,
//         userId,
//         username,
//         users: Array.from(connections[meetingCode]),
//       });

//       // old messages in chat agr koi hai tho vo dikha do

//       if (messages[meetingCode]) {
//         messages[meetingCode].forEach((msg) => {
//           socket.emit("chat-message", msg);
//         });
//       }

//       // ****************
//       // chat Message System
//       //********************** */
//       socket.on("chat-message", ({ meetingCode, message, sender }) => {
//         if (!connections[meetingCode]) return;
//         if (!messages[meetingCode]) {
//           messages[meetingCode] = [];
//         }

//         const messageObject = {
//           sender,
//           message,
//           socketId: socket.id,
//         };

//         messages[meetingCode].push(messageObject);

//         // broadcast the message to all users in the meeting
//         io.to(meetingCode).emit("chat-message", messageObject);
//       });

//       const isHost = meeting.host.toString() === userId;

//       socket.emit("meeting-role", { isHost });

//       socket.on("mute-all", async () => {
//         const session = activeSession[socket.id];
//         if (!session) return;

//         const meeting = await meetingModel.findOne({
//           meetingCode: session.meetingCode,
//         });

//         // Security: Sirf host kar sakta hai
//         if (meeting.host.toString() !== session.userId) {
//           return;
//         }

//         // Host ke alawa sabko mute event bhejo
//         socket.to(session.meetingCode).emit("force-mute");
//       });
//       socket.on("kick-user", async ({ targetSocketId }) => {
//         const session = activeSession[socket.id];
//         const meeting = await meetingModel.findOne({
//           meetingCode: session.meetingCode,
//         });

//         if (meeting.host.toString() !== session.userId) {
//           return; // Not host, ignore
//         }

//         io.to(targetSocketId).emit("kicked");
//       });

//       // signaling for WebRTC (video/audio call)

//       /*
//       ==============================
//       SIGNAL (WebRTC Handshake Forwarder)
//       ==============================
//     */
//       socket.on("signal", ({ to, signalData }) => {
//         /*
//         Ye WebRTC ke offer, answer, ICE candidates forward karta hai.
//         Server video stream ko touch nahi karta.
//       */

//         io.to(to).emit("signal", {
//           from: socket.id,
//           signalData,
//         });
//       });

//       // OFFER
//       socket.on("offer", ({ to, offer }) => {
//         io.to(to).emit("offer", {
//           from: socket.id,
//           offer,
//         });
//       });

//       // ANSWER
//       socket.on("answer", ({ to, answer }) => {
//         io.to(to).emit("answer", {
//           from: socket.id,
//           answer,
//         });
//       });

//       // ICE CANDIDATE
//       socket.on("ice-candidate", ({ to, candidate }) => {
//         io.to(to).emit("ice-candidate", {
//           from: socket.id,
//           candidate,
//         });
//       });

//       // handle user leaving the meeting
//       socket.on("disconnect", async () => {
//         // user jab meeting se leave karega toh connections se usko remove krna hai
//         //+ use db me store bhi krna hai
//         const session = activeSession[socket.id];
//         if (session) {
//           const { userId, meetingCode, joinedAt } = session;
//           const leftAt = new Date();
//           const duration = leftAt - joinedAt; // duration
//           console.log(
//             `${userId} left meeting ${meetingCode} after ${duration} seconds`,
//           );

//           await meetingAttendanceModel.create({
//             user: userId,
//             meetingCode,
//             joinedAt,
//             leftAt,
//             duration,
//           });
//         }

//         // removal of user from the rooms

//         socket.rooms.forEach((room) => {
//           if (connections[room]) {
//             connections[room].delete(socket.id);
//             // notify other users in the meeting that a user has left
//             socket.to(room).emit("User-left", socket.id);

//             // if no users are left in the meeting, clean up the connections and messages
//             if (connections[room].size === 0) {
//               delete connections[room];
//               delete messages[room];
//             }
//           }
//         });
//       });
//     });
//   });
// };

//-------------------------------------------------------------------------------------------

// ye wala code thoda sa optimised kraya hai gpt se

import { Server } from "socket.io";
import meetingModel from "../models/meeting.model.js";
import meetingAttendanceModel from "../models/meetingAttendance.model.js";
import AIInterview from "../models/aiInterview.model.js";
import Resume from "../models/resume.model.js";
import {
  generateInterviewQuestion,
  generateInterviewScore,
} from "../services/interviewService.js";





//parse Gemini response for score
const parseScore = (text) => {
  const tech = text.match(/TECHNICAL:\s*(\d+)/);
  const comm = text.match(/COMMUNICATION:\s*(\d+)/);
  const overall = text.match(/OVERALL:\s*(\d+)/);
  const feedback = text.match(/FEEDBACK:\s*([\s\S]*)/);

  return {
    technical: tech ? Number(tech[1]) : 0,
    communication: comm ? Number(comm[1]) : 0,
    overall: overall ? Number(overall[1]) : 0,
    feedback: feedback ? feedback[1].trim() : "",
  };
};






/* =====================================================
   SOCKET CONNECTION SETUP
===================================================== */

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  /* =====================================================
     1️⃣ NORMAL MEETING NAMESPACE
  ===================================================== */

  const meetingNamespace = io.of("/meeting");
  let connections = {}; // meetingCode -> Set(socketIds)
  let messages = {}; // meetingCode -> chat messages
  let activeSession = {}; // socketId -> session info

  // io.on("connection", (socket) => {
  //   console.log("Client connected:", socket.id);
  meetingNamespace.on("connection", (socket) => {
    console.log("Meeting user connected:", socket.id);

    /* =====================================================
       JOIN MEETING
    ===================================================== */
    socket.on("join-meeting", async ({ meetingCode, userId, username }) => {
      const meeting = await meetingModel.findOne({ meetingCode });

      if (!meeting)
        return socket.emit("error", { message: "Invalid Meeting Code" });

      if (new Date() > meeting.expiresAt)
        return socket.emit("error", { message: "Meeting Expired" });

      if (!connections[meetingCode]) {
        connections[meetingCode] = new Set();
      }

      connections[meetingCode].add(socket.id);

      activeSession[socket.id] = {
        userId,
        username,
        meetingCode,
        joinedAt: new Date(),
      };

      socket.join(meetingCode);

      console.log(`${username} joined ${meetingCode}`);

      // Send host role
      const isHost = meeting.host.toString() === userId;
      socket.emit("meeting-role", { isHost });

      // Send existing users list to joining user
      socket.emit("current-users", {
        users: Array.from(connections[meetingCode]),
        participants: Array.from(connections[meetingCode]).map((id) => ({
          socketId: id,
          username: activeSession[id]?.username,
        })),
      });

      // Notify others
      socket.to(meetingCode).emit("User-joined", {
        socketId: socket.id,
        username,
        users: Array.from(connections[meetingCode]),
      });

      // Send previous messages
      if (messages[meetingCode]) {
        messages[meetingCode].forEach((msg) => {
          socket.emit("chat-message", msg);
        });
      }
    });

    /* =====================================================
       CHAT SYSTEM
    ===================================================== */
    socket.on("chat-message", ({ meetingCode, message, sender }) => {
      if (!connections[meetingCode]) return;

      if (!messages[meetingCode]) {
        messages[meetingCode] = [];
      }

      const msgObj = {
        sender,
        message,
        socketId: socket.id,
      };

      messages[meetingCode].push(msgObj);

      meetingNamespace.to(meetingCode).emit("chat-message", msgObj);
    });

    /* =====================================================
       HOST CONTROLS
    ===================================================== */

    // MUTE ALL
    socket.on("mute-all", async () => {
      const session = activeSession[socket.id];
      if (!session) return;

      const meeting = await meetingModel.findOne({
        meetingCode: session.meetingCode,
      });

      if (meeting.host.toString() !== session.userId) return;

      socket.to(session.meetingCode).emit("force-mute");
    });

    // KICK USER
    socket.on("kick-user", async ({ targetSocketId }) => {
      const session = activeSession[socket.id];
      if (!session) return;

      const meeting = await meetingModel.findOne({
        meetingCode: session.meetingCode,
      });

      if (meeting.host.toString() !== session.userId) return;

      const targetSocket = meetingNamespace.sockets.get(targetSocketId);

      if (targetSocket) {
        targetSocket.emit("kicked");
        targetSocket.disconnect(true); // Force disconnect
      }
    });

    /* =====================================================
       WEBRTC SIGNALING
    ===================================================== */

    socket.on("offer", ({ to, offer }) => {
      const session = activeSession[socket.id];

      meetingNamespace.to(to).emit("offer", {
        from: socket.id,
        offer,
        username: session?.username,
      });
    });

    socket.on("answer", ({ to, answer }) => {
      meetingNamespace.to(to).emit("answer", {
        from: socket.id,
        answer,
      });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      meetingNamespace.to(to).emit("ice-candidate", {
        from: socket.id,
        candidate,
      });
    });

    /* =====================================================
       DISCONNECT HANDLER
    ===================================================== */
    socket.on("disconnect", async () => {
      const session = activeSession[socket.id];

      if (session) {
        const { userId, meetingCode, joinedAt } = session;
        const leftAt = new Date();
        const duration = leftAt - joinedAt;

        await meetingAttendanceModel.create({
          user: userId,
          meetingCode,
          joinedAt,
          leftAt,
          duration,
        });

        if (connections[meetingCode]) {
          connections[meetingCode].delete(socket.id);

          socket.to(meetingCode).emit("User-left", socket.id);

          if (connections[meetingCode].size === 0) {
            delete connections[meetingCode];
            delete messages[meetingCode];
          }
        }

        delete activeSession[socket.id];
      }

      console.log("Client disconnected:", socket.id);
    });
  });

  /* =====================================================
     2️⃣ AI INTERVIEW NAMESPACE
  ===================================================== */

  const aiNamespace = io.of("/ai");

  let aiConnections = {};
  let aiSessions = {};

  aiNamespace.on("connection" , (socket) => {
    console.log("AI Interview user connected:", socket.id);

    /* =====================================================
        JOIN AI INTERVIEW
      ===================================================== */
    socket.on("join-ai-room", async ({ aiCode, role, userId }) => {
      const interview = await AIInterview.findOne({ aiCode });
      if (!interview)
        return socket.emit("ai-error", {
          message: "Invalid AI Interview Code",
        });

      if (
        role === "candidate" &&
        interview.candidate &&
        interview.candidate.toString() !== userId
      ) {
        return socket.emit("ai-error", { message: "Not your interview" });
      }

      /* ==========================================
     LOCK CANDIDATE TO THIS INTERVIEW
  ========================================== */

      if (role === "candidate") {
        // agar koi candidate assigned nahi hai
        if (!interview.candidate) {
          interview.candidate = userId;
          await interview.save();
        }

        // agar candidate already assigned hai aur same user nahi hai
        if (interview.candidate.toString() !== userId) {
          return socket.emit("ai-error", {
            message: "This interview is already assigned to another candidate",
          });
        }
      }

      if (!aiConnections[aiCode]) {
        aiConnections[aiCode] = new Set();
      }

      aiConnections[aiCode].add(socket.id);

      aiSessions[socket.id] = {
        userId,
        role,
        aiCode,
      };

      //join the room
      socket.join(aiCode);

      //notify room

      socket.to(aiCode).emit("ai-user-joined", {
        socketId: socket.id,
        role,
      });

      socket.emit("ai-joined", {
        interviewId: interview._id,
        role,
        candidate: interview.candidate,
      });
    });

    //---------------------------------------------------------------------------------------------------------------------
    // AI WebRTC Signaling
    // -------------------------------------------------------------------------------------------------

    socket.on("ai-offer", ({ to, offer }) => {
      aiNamespace.to(to).emit("ai-offer", {
        from: socket.id,
        offer,
      });
    });

    socket.on("ai-answer", ({ to, answer }) => {
      aiNamespace.to(to).emit("ai-answer", {
        from: socket.id,
        answer,
      });
    });

    socket.on("ai-ice-candidate", ({ to, candidate }) => {
      aiNamespace.to(to).emit("ai-ice-candidate", {
        from: socket.id,
        candidate,
      });
    });

    /* =====================================================
        Start AI Interview
      ===================================================== */

    socket.on("ai:start", async ({ interviewId }) => {
      const session = aiSessions[socket.id];

      if (!session || session.role !== "candidate")
        return socket.emit("ai-error", {
          message: "Unauthorized to start interview",
        });

      const interview = await AIInterview.findById(interviewId);
      if (!interview)
        return socket.emit("ai-error", { message: "Interview not found" });

      const resume = await Resume.findOne({ user: interview.candidate });

      if (!resume) {
        return socket.emit("ai-error", {
          message: "Please upload resume before starting interview",
        });
      }

      const first = await generateInterviewQuestion({
        summary: resume.summary,
        phase: interview.phase,
        history: [],
        allowFollowUp: false,
      });

      interview.questions.push({
        type: first.type,
        question: first.question,
      });

      interview.mainQuestionCount = 1;
      interview.status = "active";

      await interview.save();

      aiNamespace.to(session.aiCode).emit("ai-speaking", {
        question: first.question,
        type: first.type,
      });
    });

    /* =====================================================
   ANSWER
===================================================== */

    socket.on("ai:answer", async ({ interviewId, answer }) => {
      try {
        const session = aiSessions[socket.id];

        // Only candidate allowed
        if (!session || session.role !== "candidate") {
          return socket.emit("ai-error", {
            message: "Unauthorized to answer question",
          });
        }

        const interview = await AIInterview.findById(interviewId);

        if (!interview || interview.status === "completed") {
          return socket.emit("ai-error", {
            message: "Interview not found or already completed",
          });
        }

        const resume = await Resume.findOne({ user: interview.candidate });

        /* ==========================================
       SAVE ANSWER
    ========================================== */

        const lastQuestion =
          interview.questions[interview.questions.length - 1];

        if (!lastQuestion) {
          return socket.emit("ai-error", { message: "No question to answer" });
        }

        // prevent overwriting answer
        if (lastQuestion.answer) {
          return socket.emit("ai-error", {
            message: "Question already answered",
          });
        }

        lastQuestion.answer = answer;

        await interview.save();

        /* ==========================================
       CHECK INTERVIEW COMPLETION
    ========================================== */

        if (interview.mainQuestionCount >= 10) {
          const scoreText = await generateInterviewScore({
            summary: resume.summary,
            questions: interview.questions,
          });

          interview.score = parseScore(scoreText);
          interview.status = "completed";

          await interview.save();

          aiNamespace.to(session.aiCode).emit("ai-completed", {
            score: interview.score,
            totalQuestions: interview.questions.length,
          });

          return;
        }

        /* ==========================================
       PREPARE NEXT QUESTION
    ========================================== */

        const allowFollowUp = interview.followUpDepth < 2;
        const history = interview.questions.slice(-3);

        /* ==========================================
       AI THINKING
    ========================================== */

        aiNamespace.to(session.aiCode).emit("ai:thinking");
        await new Promise(resolve => setTimeout(resolve, 600));


        const next = await generateInterviewQuestion({
          summary: resume.summary,
          phase: interview.phase,
          history,
          allowFollowUp,
        });

        /* ==========================================
       AI TYPING
    ========================================== */

        aiNamespace.to(session.aiCode).emit("ai:typing");

        /* ==========================================
       SAVE QUESTION TO DB
    ========================================== */

        interview.questions.push({
          type: next.type,
          question: next.question,
        });

        if (next.type === "main") {
          interview.mainQuestionCount += 1;
          interview.followUpDepth = 0;

          if (interview.mainQuestionCount <= 3) interview.phase = "resume";
          else if (interview.mainQuestionCount <= 7)
            interview.phase = "technical";
          else interview.phase = "behavioral";
        } else {
          interview.followUpDepth += 1;
        }

        await interview.save();

        /* ==========================================
       AI SPEAKING
    ========================================== */

        setTimeout(() => {
          aiNamespace.to(session.aiCode).emit("ai:speaking", {
            question: next.question,
            type: next.type,
          });
        }, 1200);
      } catch (error) {
        console.error("AI ANSWER ERROR:", error);

        socket.emit("ai-error", {
          message: "Failed to process answer",
        });
      }
    });

    /* =====================================================
        End AI Interview
      ===================================================== */
    socket.on("disconnect", () => {
      const session = aiSessions[socket.id];

      if (!session) return;

      const { aiCode } = session;

      if (aiConnections[aiCode]) {
        aiConnections[aiCode].delete(socket.id);

        socket.to(aiCode).emit("ai-user-left", socket.id);

        if (aiConnections[aiCode].size === 0) {
          delete aiConnections[aiCode];
        }
      }

      delete aiSessions[socket.id];

      console.log("AI user disconnected:", socket.id);
    });
  });

  



};

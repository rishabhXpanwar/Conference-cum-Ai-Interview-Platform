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

let connections = {}; // meetingCode -> Set(socketIds)
let messages = {}; // meetingCode -> chat messages
let activeSession = {}; // socketId -> session info

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

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

      io.to(meetingCode).emit("chat-message", msgObj);
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

      const targetSocket = io.sockets.sockets.get(targetSocketId);

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


      io.to(to).emit("offer", {
        from: socket.id,
        offer,
        username: session?.username,
      });
    });

    socket.on("answer", ({ to, answer }) => {
      io.to(to).emit("answer", {
        from: socket.id,
        answer,
      });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("ice-candidate", {
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
};

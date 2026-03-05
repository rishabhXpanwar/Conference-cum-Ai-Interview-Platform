// import swaggerUi from "swagger-ui-express";
// import swaggerSpec from "./src/config/swagger.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { connectDB } from "./src/config/db.js";

import { connectToSocket } from "./src/controllers/socketManager.js";
import router from "./src/routes/users.routes.js";

import userRoutes from "./src/routes/users.routes.js";

import resumeRoutes from "./src/routes/resume.routes.js";
import aiInterviewRoutes from "./src/routes/aiInterview.routes.js";

import meetingRoutes from "./src/routes/meeting.routes.js";
import activityRoutes from "./src/routes/activity.routes.js";
import { transporter } from "./src/utils/mailer.js";
dotenv.config();

const app = express();

const server = createServer(app);

const io = connectToSocket(server);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Default fallback
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use("/api/auth", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/resume", resumeRoutes);


app.use("/api/ai", aiInterviewRoutes);

//console.log("MONGO_URI:", MONGO_URI); // Debugging line to check if MONGO_URI is loaded

const startServer = async () => {
  connectDB(MONGO_URI);
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    transporter.verify((err, success) => {
      if (err) console.log("SMTP ERROR:", err);
      else console.log("SMTP READY");
    });
  });
};

startServer();

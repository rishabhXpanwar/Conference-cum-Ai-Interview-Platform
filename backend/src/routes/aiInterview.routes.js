import express from "express";
import {
  createAIInterview,
  verifyAIInterview,
  getCreatedAIInterviews,
  getCandidateAIInterviews,
} from "../controllers/aiInterview.controller.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

//  Create AI Interview (interviewer only)
router.post("/create", protect, createAIInterview);

//  Join AI Interview (candidate enters code)
router.post("/verify/:aiCode", protect, verifyAIInterview);

//  Interviewer dashboard list
router.get("/created", protect, getCreatedAIInterviews);

//  Candidate activity list
router.get("/my-interviews", protect, getCandidateAIInterviews);

export default router;

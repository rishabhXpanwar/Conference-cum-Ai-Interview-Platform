import express from "express";

import { uploadResume } from "../controllers/resume.controller.js";
import { protect } from "../middlewares/auth.js";


const router = express.Router();

router.post("/upload" , protect , uploadResume);

export default router;
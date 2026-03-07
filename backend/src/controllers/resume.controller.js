import multer from "multer";

import pdfParse from "pdf-parse/lib/pdf-parse.js";
import Resume from "../models/resume.model.js";

import { generateResumeSummary } from "../services/aiService.js";

import fs from "fs";


// fs is file system module in nodejs, we will use it to delete the uploaded file after parsing



// storage function for multer
// this is local storage, in production we can use cloud storage like AWS S3 or Google Cloud Storage
// const storage = multer.diskStorage({
//     destination : (req , file , cb)=>{
//         cb(null, "uploads/");
//     },
//     filename : (req , file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     }
//     }
// );

// ab file ko memoryStorage me dal rhe hai disk ke jagha q ke hum 
// file ko vaise bhi parse ke bad delete he kr rhe hai 
// tho 
// diskStorage flow:

// PDF → disk me save → fs se read → parse → delete

// memoryStorage flow:

// PDF → directly memory me buffer → parse → done


const storage = multer.memoryStorage();


// multer middleware for handling file uploads
//
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {

    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF resumes are allowed"), false);
    }

    cb(null, true);
  },
});



// uploadResume me ARRAY kyun likha hai?

// Ye sabse important part hai.

// export const uploadResume = [
//   upload.single("resume"),
//   async (req, res) => { ... }
// ];

// Ye array actually middleware chain hai.

//  Express Middleware Concept

// Express me route aise hota hai:

// router.post("/upload", middleware1, middleware2, controller);

// But Express allow karta hai:

// router.post("/upload", [middleware1, middleware2]);

// Array = multiple middleware ek saath.

//  Yaha kya ho raha hai?

// Step 1:
// upload.single("resume")
// → File receive karega
// → req.file me store karega

// Step 2:
// async function
// → PDF parse karega
// → DB me save karega

// So array ka matlab:

// "pehle file process karo, phir controller run karo"

//  Agar array nahi likhte toh?

// Toh aise likhte:

// router.post(
//   "/upload",
//   upload.single("resume"),
//   uploadResumeController
// );

// Humne simply compact version likha hai.
export const uploadResume = [
    upload.single("resume"),
    async (req , res) => {

        try {
            
            if(!req.file){
                return res.status(400).json({ message : "No file uploaded" });
            }

            //const filepath = req.file.path;

           // const dataBuffer = fs.readFileSync(filepath);
            // readFileSync normal project me use kr rhe hai 
            // production me hume async version use krna chahiye jisse ki server block na ho
            // q ke ye readFileSync sync blocking nature ka hai
            // production me await fs.promises.readFile(filePath); 

            // now we will parse the pdf file to extract the text content
            if (req.file.mimetype !== "application/pdf") {
  return res.status(400).json({
    message: "Only PDF resumes are allowed",
  });
}
            const pdfData = await pdfParse(req.file.buffer);

            const extractedText = pdfData.text;
            if (!extractedText || extractedText.trim().length < 50) {
    return res.status(400).json({
        message: "Unable to read resume content. Please upload a valid resume.",
    });
}

            // generate summary using gemini (fallback to null if AI is unavailable)
           // generate summary using Gemini
let summary;

try {
    console.log("Resume parsing started");

    summary = await generateResumeSummary(extractedText);

} catch (aiErr) {

    console.error("AI ERROR:", aiErr.message);

    // AI quota / rate limit / busy
    if (aiErr.message === "AI_BUSY") {
        return res.status(503).json({
            message: "AI is busy, please retry after some time.",
        });
    }

    // any other AI error
    return res.status(503).json({
        message: "AI service unavailable. Please try again later.",
    });
}

            // save or update resume in database
            let existingResume = await Resume.findOne({ user : req.user._id});

            if(existingResume){
                existingResume.resumeText = extractedText;
                existingResume.summary = summary;
                await existingResume.save();
            }
            else{
                await Resume.create({
                    user : req.user._id,
                    resumeText : extractedText,
                    summary,
                });
            }
            console.log("Resume parsing ended");
            console.log(summary);
            // fs.unlinkSync(filepath); // delete the uploaded file after parsing

            res.status(200).json({ message : "Resume Uploaded and Parsed Successfully" });
        } catch (err) {
                console.error("UPLOAD RESUME ERROR:", err);
                res.status(500).json({ message : "Resume upload Failed" });
        }


        }

    ];





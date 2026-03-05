import mongoose from "mongoose";

const aiInterviewSchema = new mongoose.Schema(
  {
    aiCode: {
      type: String,
      required: true,
      unique: true,
    },

    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    note : {
        type : String,
    },

    jobRole: {
      type: String,
      required: true,
    },

    phase: {
      type: String,
      enum: ["resume", "technical", "behavioral"],
      default: "resume",
    },

    mainQuestionCount: {
      type: Number,
      default: 0,
    },

    followUpDepth: {
      type: Number,
      default: 0,
    },

    questions: [
      {
        type: {
          type: String,
          enum: ["main", "followup"],
        },
        question: String,
        answer: String,
      },
    ],

    score : {
        technical : Number,
        communication : Number,
        overall : Number,
        feedback : String,
    },

    status: {
      type: String,
      enum: ["created","active", "completed"],
      default: "created",
    },
  },
  { timestamps: true },
);


export default mongoose.model('AIInterview' , aiInterviewSchema);
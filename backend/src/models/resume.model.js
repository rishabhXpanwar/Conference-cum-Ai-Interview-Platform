import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },

    resumeText : {
        type : String,
        required : true,
    },

    summary : {
        type : String,
    }
}, { timestamps : true});

export default mongoose.model('Resume' , resumeSchema);
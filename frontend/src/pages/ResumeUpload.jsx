import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../api/axios";
import "../styles/ResumeUpload.css";

export default function ResumeUpload() {
  const { aiCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { interviewId } = location.state || {};

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  /* ==============================
     Upload / Update Resume
  ============================== */

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      await API.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume uploaded successfully");

      setUploaded(true);
    } catch (err) {
      alert(err.response?.data?.message || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     Start AI Interview
  ============================== */

  const startInterview = () => {
    navigate(`/ai/room/${aiCode}`, {
      state: { interviewId },
    });
  };

  return (
    <div className="resume-page">
      <div className="resume-box">
        <h2>Upload Resume</h2>

        <p>Your resume will be used to generate AI interview questions.</p>

        <label className="file-input-label">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? "Change File" : "Choose PDF"}
        </label>

        {/* Selected file preview */}
        {file && (
          <div className="file-preview">
            <span className="file-icon">📄</span>
            <span className="file-name">{file.name}</span>
          </div>
        )}

        {/* Upload / Update button */}

        <button onClick={handleUpload} disabled={loading}>
          {loading
            ? "Uploading..."
            : uploaded
              ? "Update Resume"
              : "Upload Resume"}
        </button>

        {/* Start Interview button */}

        <button
          className="start-interview-btn"
          disabled={!uploaded}
          onClick={startInterview}
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

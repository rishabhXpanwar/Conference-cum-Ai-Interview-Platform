import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API from "../api/axios";
import StarButton from "../components/StarButton";
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
    if (loading) return;

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

      alert("Resume uploaded successfully. You can now start the interview.");

      setUploaded(true);
    } catch (err) {

  if (err.response?.status === 503) {
    alert("AI is busy. Please retry after some time.");
    return;
  }

  if (err.response?.status === 400) {
    alert(err.response.data.message);
    return;
  }

  alert("Resume upload failed. Please try again.");
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
    <div className="ru-page">
      <div className="ru-box">
        <h2>Upload Resume</h2>

        <p>Your resume will be used to generate AI interview questions.</p>

        <label className="ru-file-label">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {

  const selectedFile = e.target.files[0];

  if (!selectedFile) return;

  if (selectedFile.type !== "application/pdf") {
    alert("Only PDF resumes are allowed");
    return;
  }

  if (selectedFile.size > 5 * 1024 * 1024) {
    alert("Resume must be less than 5MB");
    return;
  }

  setFile(selectedFile);
  setUploaded(false);

}}
          />
          {file ? "Change File" : "Choose PDF"}
        </label>

        {/* Selected file preview */}
        {file && (
          <div className="ru-file-preview">
            <span className="ru-file-icon">📄</span>
            <span className="ru-file-name">{file.name}</span>
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

        <StarButton
          onClick={startInterview}
          disabled={!uploaded}
          variant="primary"
        >
          Start Interview
        </StarButton>
      </div>
    </div>
  );
}

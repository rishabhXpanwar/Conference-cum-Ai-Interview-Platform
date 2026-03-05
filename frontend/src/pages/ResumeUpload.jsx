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

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("interviewId", interviewId);

      await API.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/ai/interview/${aiCode}`, {
        state: { interviewId },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-box">
        <h2>Upload Resume</h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>
    </div>
  );
}

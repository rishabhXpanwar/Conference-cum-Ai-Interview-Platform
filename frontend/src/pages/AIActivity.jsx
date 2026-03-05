import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/AIActivity.css";

export default function AIActivity() {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      let url;

      if (user.role === "interviewer") url = "/api/ai/created";
      else url = "/api/ai/my-interviews";

      const res = await API.get(url);

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ai-activity">
      <h1>AI Interview Activity</h1>

      <table className="ai-table">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Note</th>
            <th>Candidate</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i) => (
            <tr key={i.interviewId}>
              <td>{i.jobRole}</td>

              <td>{i.note}</td>

              <td>{i.candidate === "-" ? "Not Attended" : i.candidate.name}</td>

              <td>{i.score === "-" ? "Not Attended Yet" : i.score.overall}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

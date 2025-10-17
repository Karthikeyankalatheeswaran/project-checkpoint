import { useState, useEffect } from "react";
import { getDashboard, editGameLog, deleteGameLog } from "../services/api";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [statusFilter]);

  const fetchLogs = async () => {
    try {
      const res = await getDashboard(statusFilter);
      setLogs(res.data.logs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (log) => {
    const updated = {
      ...log,
      review: prompt("Edit review:", log.review) || log.review,
    };
    await editGameLog(log.id, updated);
    fetchLogs();
  };

  const handleDelete = async (log_id) => {
    if (window.confirm("Delete this log?")) {
      await deleteGameLog(log_id);
      fetchLogs();
    }
  };

  return (
    <div>
      <h2>My Games</h2>

      <div>
        <button onClick={() => setStatusFilter("")}>All</button>
        <button onClick={() => setStatusFilter("completed")}>Completed</button>
        <button onClick={() => setStatusFilter("playing")}>Playing</button>
        <button onClick={() => setStatusFilter("wishlist")}>Wishlist</button>
      </div>

      {logs.map((log) => (
        <div key={log.id}>
          <h5>
            {log.game.name} ({log.status})
          </h5>
          <p>Hours Played: {log.hours_played}</p>
          <p>Rating: {log.rating}</p>
          <p>Review: {log.review}</p>
          <button onClick={() => handleEdit(log)}>Edit</button>
          <button onClick={() => handleDelete(log.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { getDashboard, editGameLog, deleteGameLog } from "../services/api";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(""); // "" = all

  const fetchLogs = async (status = "") => {
    setLoading(true);
    try {
      const data = await getDashboard(status);
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Error fetching dashboard logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(statusFilter);
  }, [statusFilter]);

  const handleStatusChange = (logId, newStatus) => {
    editGameLog(logId, { status: newStatus })
      .then(() => fetchLogs(statusFilter))
      .catch(console.error);
  };

  const handleDelete = (logId) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      deleteGameLog(logId)
        .then(() => fetchLogs(statusFilter))
        .catch(console.error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Your Game Logs</h1>

      {/* Status Filter */}
      <div className="flex space-x-4 mb-4">
        {["", "playing", "completed", "wishlist", "dropped"].map((status) => (
          <button
            key={status}
            className={`px-3 py-1 rounded ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status === ""
              ? "All"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p>No games logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">Game</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Hours Played</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="px-4 py-2">{log.game.name}</td>
                  <td className="px-4 py-2">{log.status}</td>
                  <td className="px-4 py-2">{log.hours_played}</td>
                  <td className="px-4 py-2">{log.rating || "N/A"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => {
                        const newStatus = prompt(
                          "Update status (playing, completed, wishlist, dropped):",
                          log.status
                        );
                        if (newStatus) handleStatusChange(log.id, newStatus);
                      }}
                      className="px-2 py-1 bg-yellow-400 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { getDashboard, editGameLog, deleteGameLog } from "../services/api";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

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

  // Status badge colors matching Letterboxd aesthetic
  const getStatusBadge = (status) => {
    const statusColors = {
      playing: "warning",
      completed: "success",
      wishlist: "info",
      dropped: "danger",
    };
    return statusColors[status] || "secondary";
  };

  return (
    <div className="container-fluid bg-dark min-vh-100 py-4">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="text-light fw-bold mb-2">Your Game Logs</h1>
            <p className="text-muted">Track your gaming journey</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex flex-wrap gap-2">
              {["", "playing", "completed", "wishlist", "dropped"].map(
                (status) => (
                  <button
                    key={status}
                    className={`btn btn-sm rounded-pill px-3 py-2 ${
                      statusFilter === status
                        ? "btn-success"
                        : "btn-outline-light"
                    }`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === ""
                      ? "All Games"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Logs Cards */}
        {loading ? (
          <div className="row">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card bg-secondary border-0 rounded-3 placeholder-glow h-100">
                  <div className="card-body">
                    <h5 className="card-title placeholder col-8"></h5>
                    <p className="card-text placeholder col-6"></p>
                    <div className="d-flex gap-2 mt-3">
                      <span className="placeholder col-4"></span>
                      <span className="placeholder col-3"></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-joystick display-1 text-muted"></i>
            <h4 className="text-light mt-3">No games logged yet</h4>
            <p className="text-muted">Start tracking your gaming progress</p>
          </div>
        ) : (
          <div className="row">
            {logs.map((log) => (
              <div key={log.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card bg-secondary border-0 rounded-3 shadow-sm h-100">
                  <div className="card-body">
                    {/* Game Header */}
                    <div className="d-flex align-items-start mb-3">
                      <img
                        src={log.game.background_image}
                        alt={log.game.name}
                        className="rounded-2 me-3"
                        style={{
                          width: "60px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="card-title text-light mb-1">
                          {log.game.name}
                        </h6>
                        <p className="text-muted small mb-0">
                          {log.game.released
                            ? new Date(log.game.released).getFullYear()
                            : "TBA"}
                        </p>
                      </div>
                    </div>

                    {/* Status and Stats */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span
                        className={`badge bg-${getStatusBadge(
                          log.status
                        )} bg-opacity-25 text-${getStatusBadge(log.status)}`}
                      >
                        {log.status}
                      </span>
                      <div className="text-end">
                        <div className="text-light small">
                          <i className="bi bi-clock me-1"></i>
                          {log.hours_played || 0}h
                        </div>
                        {log.rating && (
                          <div className="text-warning small">
                            <i className="bi bi-star-fill me-1"></i>
                            {log.rating}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => {
                          const newStatus = prompt(
                            "Update status (playing, completed, wishlist, dropped):",
                            log.status
                          );
                          if (newStatus) handleStatusChange(log.id, newStatus);
                        }}
                        className="btn btn-outline-warning btn-sm flex-fill d-flex align-items-center justify-content-center"
                      >
                        <i className="bi bi-pencil me-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                        style={{ width: "40px" }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

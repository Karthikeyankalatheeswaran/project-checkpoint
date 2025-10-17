import React, { useEffect, useState } from "react";
import { getDashboard, editGameLog, deleteGameLog } from "../services/api";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [editData, setEditData] = useState({});

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

  const handleCardClick = (log) => {
    setSelectedLog(log);
    setEditData({
      status: log.status,
      hours_played: log.hours_played || "",
      rating: log.rating || "",
      review: log.review || "",
    });
    const modal = new window.bootstrap.Modal(
      document.getElementById("logModal")
    );
    modal.show();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await editGameLog(selectedLog.id, editData);
      await fetchLogs(statusFilter);
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("logModal")
      );
      modal.hide();
    } catch (error) {
      console.error("Error updating log:", error);
    }
  };

  const handleDelete = (logId) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      deleteGameLog(logId)
        .then(() => fetchLogs(statusFilter))
        .catch(console.error);
    }
  };

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
    <div className="dashboard-container">
      <div className="container py-5">
        {/* Header Section - Letterboxd-inspired typography */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="dashboard-header">
              <h1 className="display-5 fw-bold text-white mb-2 letter-spacing-tight">
                Your Game Library
              </h1>
              <p className="text-muted fs-5 mb-0">
                Track, rate, and review your gaming journey
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Pills - Clean Letterboxd style */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="filter-pills d-flex flex-wrap gap-2">
              {["", "playing", "completed", "wishlist", "dropped"].map(
                (status) => (
                  <button
                    key={status}
                    className={`btn filter-btn ${
                      statusFilter === status ? "active" : ""
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

        {/* Game Logs Grid - Poster-style layout */}
        {loading ? (
          <div className="row g-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3">
                <div className="game-card skeleton-card">
                  <div className="skeleton-poster"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-state text-center py-5">
            <div className="empty-icon mb-4">
              <i className="bi bi-joystick display-1 text-muted"></i>
            </div>
            <h3 className="text-white mb-2">No games logged yet</h3>
            <p className="text-muted fs-5">
              Start building your gaming collection
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="col-6 col-md-4 col-lg-3"
                onClick={() => handleCardClick(log)}
              >
                {/* Letterboxd-style Poster Card */}
                <div className="game-card">
                  <div className="poster-wrapper">
                    <img
                      src={log.game.background_image}
                      alt={log.game.name}
                      className="poster-image"
                    />

                    {/* Hover Overlay - Letterboxd style */}
                    <div className="poster-overlay">
                      <div className="overlay-content">
                        {/* Rating Display */}
                        {log.rating && (
                          <div className="rating-badge">
                            <i className="bi bi-star-fill"></i>
                            <span>{log.rating}</span>
                          </div>
                        )}

                        {/* Hours Played */}
                        <div className="hours-badge">
                          <i className="bi bi-clock"></i>
                          <span>{log.hours_played || 0}h</span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(log.id);
                          }}
                          className="delete-btn"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>

                    {/* Status Badge - Top Corner */}
                    <div className="status-badge-corner">
                      <span className={`badge status-${log.status}`}>
                        {log.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Info - Clean Typography */}
                  <div className="card-info">
                    <h6 className="game-title">{log.game.name}</h6>
                    <p className="game-year text-muted">
                      {log.game.released
                        ? new Date(log.game.released).getFullYear()
                        : "TBA"}
                    </p>

                    {/* Review Preview */}
                    {log.review && (
                      <p className="review-preview">{log.review}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Modal - Clean & Modern */}
      <div
        className="modal fade"
        id="logModal"
        tabIndex="-1"
        aria-labelledby="logModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content custom-modal">
            <div className="modal-header border-0 pb-0">
              <h4 className="modal-title text-white fw-bold" id="logModalLabel">
                {selectedLog?.game?.name}
              </h4>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body pt-3">
              {selectedLog ? (
                <form onSubmit={handleEditSubmit}>
                  {/* Status Select */}
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium mb-2">
                      Status
                    </label>
                    <select
                      className="form-select custom-select"
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({ ...editData, status: e.target.value })
                      }
                    >
                      <option value="playing">Playing</option>
                      <option value="completed">Completed</option>
                      <option value="wishlist">Wishlist</option>
                      <option value="dropped">Dropped</option>
                    </select>
                  </div>

                  {/* Hours Played */}
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium mb-2">
                      Hours Played
                    </label>
                    <input
                      type="number"
                      className="form-control custom-input"
                      placeholder="0"
                      value={editData.hours_played || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          hours_played: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium mb-2">
                      Rating
                      <span className="text-muted ms-2">(1-10)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      className="form-control custom-input"
                      placeholder="8.5"
                      value={editData.rating || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, rating: e.target.value })
                      }
                    />
                  </div>

                  {/* Review Textarea */}
                  <div className="mb-4">
                    <label className="form-label text-light fw-medium mb-2">
                      Your Review
                    </label>
                    <textarea
                      className="form-control custom-textarea"
                      rows="5"
                      placeholder="Share your thoughts about this game..."
                      value={editData.review || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, review: e.target.value })
                      }
                    ></textarea>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-3 pt-3">
                    <button
                      type="button"
                      className="btn btn-cancel"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-save">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-5">
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

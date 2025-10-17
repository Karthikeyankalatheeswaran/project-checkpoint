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
      platform: log.platform || "",
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
      playing: {
        bg: "linear-gradient(135deg, #f39c12, #e67e22)",
        text: "white",
      },
      completed: {
        bg: "linear-gradient(135deg, #27ae60, #229954)",
        text: "white",
      },
      wishlist: {
        bg: "linear-gradient(135deg, #9b59b6, #8e44ad)",
        text: "white",
      },
      dropped: {
        bg: "linear-gradient(135deg, #e74c3c, #c0392b)",
        text: "white",
      },
    };
    return statusColors[status] || { bg: "#95a5a6", text: "white" };
  };

  const getStatusCount = (status) => {
    return logs.filter((log) => (status === "" ? true : log.status === status))
      .length;
  };

  return (
    <div
      className="container-fluid min-vh-100 py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
              My Game Collection
            </h1>
            <p style={{ color: "#7f8c8d", fontWeight: "500" }}>
              Manage and track your gaming journey
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="custom-card p-4">
              <div className="row text-center">
                <div className="col-6 col-md-3 mb-3">
                  <div
                    className="fw-bold display-6"
                    style={{ color: "#2c3e50" }}
                  >
                    {logs.length}
                  </div>
                  <div style={{ color: "#7f8c8d", fontWeight: "500" }}>
                    Total Games
                  </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <div
                    className="fw-bold display-6"
                    style={{ color: "#27ae60" }}
                  >
                    {getStatusCount("completed")}
                  </div>
                  <div style={{ color: "#7f8c8d", fontWeight: "500" }}>
                    Completed
                  </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <div
                    className="fw-bold display-6"
                    style={{ color: "#f39c12" }}
                  >
                    {getStatusCount("playing")}
                  </div>
                  <div style={{ color: "#7f8c8d", fontWeight: "500" }}>
                    Playing
                  </div>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <div
                    className="fw-bold display-6"
                    style={{ color: "#9b59b6" }}
                  >
                    {getStatusCount("wishlist")}
                  </div>
                  <div style={{ color: "#7f8c8d", fontWeight: "500" }}>
                    Wishlist
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2">
              {["", "playing", "completed", "wishlist", "dropped"].map(
                (status) => {
                  const statusConfig = getStatusBadge(status);
                  return (
                    <button
                      key={status}
                      className="btn fw-bold px-4 py-2 rounded-3 d-flex align-items-center"
                      onClick={() => setStatusFilter(status)}
                      style={{
                        background:
                          statusFilter === status
                            ? statusConfig.bg
                            : "transparent",
                        color:
                          statusFilter === status
                            ? statusConfig.text
                            : "#2c3e50",
                        border: `2px solid ${
                          statusFilter === status ? "transparent" : "#e9ecef"
                        }`,
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        if (statusFilter !== status) {
                          e.target.style.background = statusConfig.bg;
                          e.target.style.color = statusConfig.text;
                          e.target.style.borderColor = "transparent";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (statusFilter !== status) {
                          e.target.style.background = "transparent";
                          e.target.style.color = "#2c3e50";
                          e.target.style.borderColor = "#e9ecef";
                        }
                      }}
                    >
                      {status === ""
                        ? "All Games"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                      <span
                        className="badge bg-light text-dark ms-2"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {getStatusCount(status)}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Logs Grid */}
        {loading ? (
          <div className="row">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                <div
                  className="custom-card skeleton-loader"
                  style={{
                    height: "380px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    animation: "loading 1.5s infinite",
                  }}
                ></div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-5">
            <div className="custom-card p-5">
              <i
                className="bi bi-joystick display-1"
                style={{ color: "#bdc3c7" }}
              ></i>
              <h3 className="mt-3" style={{ color: "#2c3e50" }}>
                No games logged yet
              </h3>
              <p style={{ color: "#7f8c8d" }} className="mb-4">
                Start building your gaming collection
              </p>
              <button
                className="btn fw-bold px-4 py-2 rounded-3"
                style={{
                  background: "linear-gradient(135deg, #3498db, #9b59b6)",
                  color: "white",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 20px rgba(52, 152, 219, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
                onClick={() => (window.location.href = "/")}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Discover Games
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            {logs.map((log) => {
              const statusConfig = getStatusBadge(log.status);
              return (
                <div
                  key={log.id}
                  className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4"
                >
                  <div
                    className="custom-card h-100"
                    style={{
                      cursor: "pointer",
                      height: "380px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Game Image */}
                    <div
                      className="position-relative overflow-hidden"
                      style={{ flex: "0 0 auto" }}
                    >
                      <img
                        src={
                          log.game.background_image ||
                          "https://via.placeholder.com/400x225?text=No+Image"
                        }
                        alt={log.game.name}
                        className="w-100"
                        style={{
                          height: "180px",
                          objectFit: "cover",
                          borderTopLeftRadius: "16px",
                          borderTopRightRadius: "16px",
                        }}
                        onClick={() => handleCardClick(log)}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span
                          className="badge fw-bold px-3 py-2 rounded-pill"
                          style={{
                            background: statusConfig.bg,
                            color: statusConfig.text,
                            fontSize: "0.8rem",
                          }}
                        >
                          {log.status}
                        </span>
                      </div>
                      <div className="position-absolute top-0 start-0 m-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(log.id);
                          }}
                          className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "rgba(231, 76, 60, 0.9)",
                            color: "white",
                            border: "none",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = "#e74c3c";
                            e.target.style.transform = "scale(1.1)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background =
                              "rgba(231, 76, 60, 0.9)";
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>

                    {/* Game Info */}
                    <div
                      className="card-body d-flex flex-column p-4"
                      style={{ flex: "1 1 auto" }}
                      onClick={() => handleCardClick(log)}
                    >
                      <h6
                        className="card-title fw-bold mb-3 line-clamp-2"
                        style={{
                          color: "#2c3e50",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "48px",
                          lineHeight: "1.3",
                        }}
                      >
                        {log.game.name}
                      </h6>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="text-center">
                            <div
                              className="fw-bold"
                              style={{ color: "#2c3e50", fontSize: "1.1rem" }}
                            >
                              {log.hours_played || 0}
                            </div>
                            <div
                              style={{
                                color: "#7f8c8d",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                              }}
                            >
                              Hours
                            </div>
                          </div>

                          <div className="text-center">
                            <div
                              className="fw-bold d-flex align-items-center justify-content-center"
                              style={{ color: "#f39c12", fontSize: "1.1rem" }}
                            >
                              <i className="bi bi-star-fill me-1"></i>
                              {log.rating || "N/A"}
                            </div>
                            <div
                              style={{
                                color: "#7f8c8d",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                              }}
                            >
                              Rating
                            </div>
                          </div>

                          <div className="text-center">
                            <div
                              className="fw-bold"
                              style={{ color: "#2c3e50", fontSize: "1.1rem" }}
                            >
                              {log.game.released
                                ? new Date(log.game.released).getFullYear()
                                : "TBA"}
                            </div>
                            <div
                              style={{
                                color: "#7f8c8d",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                              }}
                            >
                              Released
                            </div>
                          </div>
                        </div>

                        {/* Review Preview */}
                        {log.review && (
                          <div className="mt-3">
                            <p
                              className="small mb-0 line-clamp-2"
                              style={{
                                color: "#7f8c8d",
                                fontStyle: "italic",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              "{log.review}"
                            </p>
                          </div>
                        )}

                        {/* Platform */}
                        {log.platform && (
                          <div className="mt-2">
                            <span
                              className="badge bg-light text-dark px-2 py-1 rounded"
                              style={{ fontSize: "0.7rem" }}
                            >
                              <i className="bi bi-laptop me-1"></i>
                              {log.platform}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      <div
        className="modal fade modal-custom"
        id="logModal"
        tabIndex="-1"
        aria-labelledby="logModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div>
                <h5
                  className="modal-title fw-bold mb-1"
                  style={{ color: "#2c3e50" }}
                >
                  {selectedLog?.game?.name}
                </h5>
                <p className="small mb-0" style={{ color: "#7f8c8d" }}>
                  {selectedLog?.game?.released
                    ? new Date(selectedLog?.game?.released).getFullYear()
                    : "TBA"}
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body pt-0">
              {selectedLog ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label
                        className="form-label fw-bold"
                        style={{ color: "#2c3e50" }}
                      >
                        Status
                      </label>
                      <select
                        className="form-select form-control-custom"
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

                    <div className="col-md-6 mb-4">
                      <label
                        className="form-label fw-bold"
                        style={{ color: "#2c3e50" }}
                      >
                        Platform
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        placeholder="e.g., PS5, PC, Xbox"
                        value={editData.platform || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, platform: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label
                        className="form-label fw-bold"
                        style={{ color: "#2c3e50" }}
                      >
                        Hours Played
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-custom"
                        min="0"
                        step="0.5"
                        value={editData.hours_played || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            hours_played: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <label
                        className="form-label fw-bold"
                        style={{ color: "#2c3e50" }}
                      >
                        Your Rating (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        className="form-control form-control-custom"
                        value={editData.rating || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, rating: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className="form-label fw-bold"
                      style={{ color: "#2c3e50" }}
                    >
                      Your Review
                    </label>
                    <textarea
                      className="form-control form-control-custom"
                      rows="5"
                      placeholder="Share your thoughts about this game..."
                      value={editData.review || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, review: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-3">
                    <button
                      type="button"
                      className="btn fw-bold px-4 py-2 rounded-3"
                      data-bs-dismiss="modal"
                      style={{
                        background: "transparent",
                        color: "#7f8c8d",
                        border: "2px solid #e9ecef",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = "#e9ecef";
                        e.target.style.color = "#2c3e50";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.color = "#7f8c8d";
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn fw-bold px-4 py-2 rounded-3"
                      style={{
                        background: "linear-gradient(135deg, #3498db, #9b59b6)",
                        color: "white",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(52, 152, 219, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div
                    className="spinner-border"
                    style={{ color: "#3498db" }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        
        .custom-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          background: white;
          overflow: hidden;
        }
        
        .custom-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .form-control-custom {
          border-radius: 12px;
          border: 2px solid #e9ecef;
          padding: 12px 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .form-control-custom:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.1);
        }
      `}</style>
    </div>
  );
}

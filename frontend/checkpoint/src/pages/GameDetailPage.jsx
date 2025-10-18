import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGameDetail, logGame, getGameLog } from "../services/api";

export default function GameDetailPage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [log, setLog] = useState(null);
  const [status, setStatus] = useState("");
  const [hoursPlayed, setHoursPlayed] = useState(0);
  const [platform, setPlatform] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const g = await getGameDetail(gameId);
        setGame(g);

        if (isLoggedIn) {
          const existingLog = await getGameLog(g.rawg_id);
          if (existingLog) {
            setLog(existingLog);
            setStatus(existingLog.status);
            setHoursPlayed(existingLog.hours_played || 0);
            setReview(existingLog.review || "");
            setRating(existingLog.rating || "");
            setPlatform(existingLog.platform || "");
          }
        }
      } catch (err) {
        console.error("Error fetching game details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId, isLoggedIn]);

  const handleLogGame = async (newStatus) => {
    if (!isLoggedIn) {
      alert("Please log in to track this game.");
      return;
    }

    try {
      const data = {
        rawg_id: game.rawg_id,
        status: newStatus,
        hours_played: hoursPlayed,
        review,
        rating,
        platform,
      };

      const res = await logGame(data);
      if (res) {
        setLog(res);
        setStatus(newStatus);
        alert("Game log updated successfully!");
      }
    } catch (err) {
      console.error("Error logging game:", err);
      alert("Failed to save log. Check your login session.");
    }
  };

  // Function to create a short description from the full description
  const getShortDescription = (fullDescription) => {
    if (!fullDescription) return "No description available.";

    // Remove HTML tags if any
    const cleanDescription = fullDescription.replace(/<[^>]*>/g, "");

    // Take first 300 characters and add ellipsis if longer
    if (cleanDescription.length > 300) {
      return cleanDescription.substring(0, 300) + "...";
    }

    return cleanDescription;
  };

  if (loading)
    return (
      <div
        className="container-fluid min-vh-100 py-4"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="container">
          <div className="custom-card p-5 text-center">
            <div
              className="spinner-border"
              style={{ color: "#3498db", width: "3rem", height: "3rem" }}
            ></div>
            <h4 className="mt-3" style={{ color: "#2c3e50" }}>
              Loading game details...
            </h4>
          </div>
        </div>
      </div>
    );

  if (!game)
    return (
      <div
        className="container-fluid min-vh-100 py-4"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="container">
          <div className="custom-card p-5 text-center">
            <i
              className="bi bi-emoji-frown display-1"
              style={{ color: "#e74c3c" }}
            ></i>
            <h3 className="mt-3" style={{ color: "#2c3e50" }}>
              Game Not Found
            </h3>
            <p style={{ color: "#7f8c8d" }} className="mb-4">
              The game you're looking for doesn't exist or has been removed.
            </p>
            <button
              className="btn fw-bold px-4 py-2 rounded-3"
              style={{
                background: "linear-gradient(135deg, #3498db, #9b59b6)",
                color: "white",
                border: "none",
              }}
              onClick={() => window.history.back()}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className="container-fluid min-vh-100 py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container">
        <div className="custom-card p-4">
          <div className="row">
            <div className="col-md-4">
              {game.background_image && (
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="img-fluid rounded-3 shadow"
                  style={{
                    maxHeight: "400px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              )}
            </div>
            <div className="col-md-8">
              <h2 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                {game.name}
              </h2>

              <div className="mb-4">
                <span className="badge bg-primary rounded-pill px-3 py-2 me-2 fw-bold">
                  Released: {game.released || "TBA"}
                </span>
                <span className="badge bg-warning text-dark rounded-pill px-3 py-2 fw-bold">
                  Rating: {game.rating ? game.rating.toFixed(1) : "N/A"}
                </span>
              </div>

              {/* Game Description */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                  About this game
                </h5>
                <p
                  style={{
                    color: "#5d6d7e",
                    lineHeight: "1.6",
                    fontWeight: "500",
                    fontSize: "1rem",
                  }}
                >
                  {getShortDescription(game.description)}
                </p>
              </div>

              {isLoggedIn ? (
                <div className="custom-card p-4 mt-4">
                  <h4 className="fw-bold mb-4" style={{ color: "#2c3e50" }}>
                    Track Your Game
                  </h4>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label fw-bold"
                        style={{ color: "#2c3e50" }}
                      >
                        Status
                      </label>
                      <select
                        className="form-select form-control-custom"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="playing">Playing</option>
                        <option value="completed">Completed</option>
                        <option value="wishlist">Wishlist</option>
                        <option value="dropped">Dropped</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
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
                        value={hoursPlayed}
                        onChange={(e) => setHoursPlayed(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label fw-bold"
                        style={{ color: "#2c3e50" }}
                      >
                        Platform
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        placeholder="e.g. PS5, PC, Xbox..."
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        className="form-label fw-bold"
                        style={{ color: "#2c3e50" }}
                      >
                        Your Rating (1-10)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-custom"
                        min="1"
                        max="10"
                        step="0.1"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
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
                      rows="4"
                      placeholder="Share your thoughts about this game..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    onClick={() => handleLogGame(status)}
                    className="btn fw-bold px-4 py-3 rounded-3 w-100"
                    style={{
                      background: "linear-gradient(135deg, #3498db, #9b59b6)",
                      color: "white",
                      border: "none",
                      transition: "all 0.3s ease",
                    }}
                    disabled={!status}
                    onMouseOver={(e) => {
                      if (status) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(52, 152, 219, 0.3)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (status) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    {log ? "Update Log" : "Save Log"}
                  </button>
                </div>
              ) : (
                <div className="alert alert-info mt-4 rounded-3 p-3">
                  <i className="bi bi-info-circle me-2"></i>
                  <a href="/login" className="alert-link fw-bold">
                    Login
                  </a>{" "}
                  to track this game and share your experience.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

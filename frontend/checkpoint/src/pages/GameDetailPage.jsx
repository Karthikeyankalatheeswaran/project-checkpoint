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

  if (loading)
    return (
      <div className="detail-container d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="detail-container d-flex align-items-center justify-content-center min-vh-100">
        <div className="empty-state text-center">
          <h3 className="text-white">Game not found</h3>
          <p className="text-muted">
            The game you're looking for doesn't exist
          </p>
        </div>
      </div>
    );

  return (
    <div className="detail-container">
      <div className="container py-5">
        <div className="row">
          {/* Left Column - Game Poster */}
          <div className="col-12 col-lg-4 mb-4 mb-lg-0">
            <div className="detail-poster-wrapper">
              {game.background_image && (
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="detail-poster"
                />
              )}
            </div>

            {/* Quick Stats Card */}
            <div className="stats-card mt-4">
              <div className="stat-item">
                <span className="stat-label">Released</span>
                <span className="stat-value">{game.released || "N/A"}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Rating</span>
                <span className="stat-value">
                  {game.rating ? `${game.rating}/5` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Game Info */}
          <div className="col-12 col-lg-8">
            {/* Game Title */}
            <div className="detail-header mb-4">
              <h1 className="detail-title">{game.name}</h1>
              <p className="detail-subtitle text-muted">
                {game.released ? new Date(game.released).getFullYear() : "TBA"}
              </p>
            </div>

            {/* Game Description */}
            <div className="detail-section mb-5">
              <h5 className="section-title">About</h5>
              <p className="detail-description">
                {game.description_raw ||
                  game.description ||
                  "No description available."}
              </p>
            </div>

            {/* Tracking Section */}
            {isLoggedIn ? (
              <div className="tracking-section">
                <h5 className="section-title mb-4">Track This Game</h5>

                <div className="tracking-form">
                  {/* Status Select */}
                  <div className="mb-4">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select custom-select"
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

                  {/* Hours Played */}
                  <div className="mb-4">
                    <label className="form-label">Hours Played</label>
                    <input
                      type="number"
                      className="form-control custom-input"
                      min="0"
                      placeholder="0"
                      value={hoursPlayed}
                      onChange={(e) => setHoursPlayed(e.target.value)}
                    />
                  </div>

                  {/* Platform */}
                  <div className="mb-4">
                    <label className="form-label">Platform</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="e.g. PS5, PC, Xbox..."
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                    />
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    <label className="form-label">
                      Rating <span className="text-muted">(out of 5)</span>
                    </label>
                    <input
                      type="number"
                      className="form-control custom-input"
                      min="0"
                      max="5"
                      step="0.5"
                      placeholder="4.5"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    />
                  </div>

                  {/* Review */}
                  <div className="mb-4">
                    <label className="form-label">Your Review</label>
                    <textarea
                      className="form-control custom-textarea"
                      rows="5"
                      placeholder="Share your thoughts about this game..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => handleLogGame(status)}
                    className="btn btn-save w-100"
                    disabled={!status}
                  >
                    Save Log
                  </button>
                </div>
              </div>
            ) : (
              <div className="login-prompt">
                <p className="text-muted">
                  <a href="/login" className="login-link">
                    Log in
                  </a>{" "}
                  to track this game
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

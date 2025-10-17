import React, { useState, useEffect } from "react";
import { logGame, editGameLog } from "../services/api";

export default function GameLogForm({ game, existingLog, onSuccess }) {
  const [status, setStatus] = useState(existingLog?.status || "playing");
  const [hours, setHours] = useState(existingLog?.hours_played || 0);
  const [rating, setRating] = useState(existingLog?.rating || 0);
  const [review, setReview] = useState(existingLog?.review || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (existingLog) {
        await editGameLog(existingLog.id, {
          status,
          hours_played: hours,
          rating,
          review,
        });
      } else {
        await logGame({
          rawg_id: game.rawg_id,
          status,
          hours_played: hours,
          rating,
          review,
        });
      }
      onSuccess(); // refresh dashboard or UI
    } catch (err) {
      console.error("Error logging game:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-card p-4">
      <h4 className="fw-bold mb-4" style={{ color: "#2c3e50" }}>
        Log Your Play
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold" style={{ color: "#2c3e50" }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select form-control-custom"
            >
              <option value="playing">Playing</option>
              <option value="completed">Completed</option>
              <option value="wishlist">Wishlist</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold" style={{ color: "#2c3e50" }}>
              Hours Played
            </label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="form-control form-control-custom"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#2c3e50" }}>
            Rating (out of 10)
          </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="form-control form-control-custom"
            min="0"
            max="10"
            step="0.1"
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold" style={{ color: "#2c3e50" }}>
            Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="form-control form-control-custom"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary-custom btn-custom w-100 py-3 fw-bold"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              {existingLog ? "Updating..." : "Adding..."}
            </>
          ) : existingLog ? (
            "Update Log"
          ) : (
            "Add Log"
          )}
        </button>
      </form>
    </div>
  );
}

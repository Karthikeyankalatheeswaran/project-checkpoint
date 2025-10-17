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
    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded-lg shadow space-y-3"
    >
      <h3 className="text-lg font-semibold">Log Your Play</h3>

      <div>
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-1 rounded ml-2"
        >
          <option value="playing">Playing</option>
          <option value="completed">Completed</option>
          <option value="wishlist">Wishlist</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      <div>
        <label>Hours Played:</label>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="border p-1 rounded ml-2"
        />
      </div>

      <div>
        <label>Rating:</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-1 rounded ml-2"
          min="0"
          max="10"
          step="0.1"
        />
      </div>

      <div>
        <label>Review:</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="border p-1 rounded w-full"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {existingLog ? "Update Log" : "Add Log"}
      </button>
    </form>
  );
}

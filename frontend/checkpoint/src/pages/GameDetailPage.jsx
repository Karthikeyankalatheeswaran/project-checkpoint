import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGameDetail, logGame, getGameLog } from "../services/api";

export default function GameDetailPage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [log, setLog] = useState(null);
  const [status, setStatus] = useState("");
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
        hours_played: 0,
        review: "",
      };

      let res;
      if (log) {
        // If already logged, update
        res = await logGame({ ...data, id: log.id });
      } else {
        // Log new game
        res = await logGame(data);
      }

      if (res) {
        setLog(res);
        setStatus(newStatus);
        alert("Game logged successfully!");
      }
    } catch (err) {
      console.error("Error logging game:", err);
      alert("Failed to log game. Make sure you are logged in.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!game) return <div>Game not found.</div>;

  return (
    <div>
      <h2>{game.name}</h2>
      {game.background_image && (
        <img
          src={game.background_image}
          alt={game.name}
          style={{ maxWidth: "500px" }}
        />
      )}
      <p>
        <strong>Released:</strong> {game.released || "N/A"}
      </p>
      <p>
        <strong>Rating:</strong> {game.rating || "N/A"}
      </p>
      <p>
        {game.description_raw ||
          game.description ||
          "No description available."}
      </p>

      {isLoggedIn ? (
        <div>
          <h3>Track your status:</h3>
          <button
            style={{
              backgroundColor: status === "played" ? "green" : "gray",
              marginRight: "10px",
            }}
            onClick={() => handleLogGame("played")}
          >
            Played
          </button>
          <button
            style={{
              backgroundColor: status === "dropped" ? "red" : "gray",
              marginRight: "10px",
            }}
            onClick={() => handleLogGame("dropped")}
          >
            Dropped
          </button>
          <button
            style={{ backgroundColor: status === "wishlist" ? "blue" : "gray" }}
            onClick={() => handleLogGame("wishlist")}
          >
            Wishlist
          </button>
        </div>
      ) : (
        <p>
          <a href="/login">Login</a> to log this game as played, dropped, or
          wishlist.
        </p>
      )}
    </div>
  );
}

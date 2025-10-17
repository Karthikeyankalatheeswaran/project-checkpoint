import React from "react";
import GameCard from "./GameCard";

export default function GameList({ games }) {
  if (!games || games.length === 0)
    return (
      <div className="text-center py-5">
        <i
          className="bi bi-emoji-frown display-1"
          style={{ color: "#bdc3c7" }}
        ></i>
        <h4 className="mt-3" style={{ color: "#2c3e50" }}>
          No games found
        </h4>
        <p style={{ color: "#7f8c8d" }}>Try adjusting your search or filters</p>
      </div>
    );

  return (
    <div className="row g-4">
      {games.map((game) => (
        <div
          key={game.id || game.rawg_id}
          className="col-6 col-md-4 col-lg-3 col-xl-2"
        >
          <GameCard game={game} />
        </div>
      ))}
    </div>
  );
}

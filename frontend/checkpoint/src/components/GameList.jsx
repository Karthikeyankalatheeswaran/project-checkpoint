import React from "react";
import GameCard from "./GameCard";

export default function GameList({ games }) {
  if (!games || games.length === 0)
    return <p className="text-gray-400">No games found.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {games.map((game) => (
        <GameCard key={game.id || game.rawg_id} game={game} />
      ))}
    </div>
  );
}

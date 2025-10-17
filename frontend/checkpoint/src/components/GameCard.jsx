import React from "react";

export default function GameCard({ game }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition p-2">
      <img
        src={game.background_image || "https://via.placeholder.com/300x150"}
        alt={game.name}
        className="w-full h-40 object-cover"
      />
      <div className="mt-2">
        <h3 className="font-semibold text-lg">{game.name}</h3>
        <p className="text-sm text-gray-500">{game.released}</p>
        <p className="text-yellow-500">⭐ {game.rating || "N/A"}</p>
      </div>
    </div>
  );
}

import React from "react";

export default function GameCard({ game }) {
  return (
    <div className="custom-card h-100" style={{ height: "380px" }}>
      <img
        src={
          game.background_image ||
          "https://via.placeholder.com/400x225?text=No+Image"
        }
        alt={game.name}
        className="w-100"
        style={{
          height: "225px",
          objectFit: "cover",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      />
      <div className="card-body p-4 d-flex flex-column h-100">
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
          {game.name}
        </h6>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <p className="small fw-bold mb-0" style={{ color: "#7f8c8d" }}>
              <i className="bi bi-calendar3 me-1"></i>
              {game.released ? new Date(game.released).getFullYear() : "TBA"}
            </p>
            <p className="small fw-bold mb-0" style={{ color: "#f39c12" }}>
              ⭐ {game.rating || "N/A"}
            </p>
          </div>

          {/* Platforms (if available) */}
          {game.platforms && (
            <div className="mt-2">
              <p className="small fw-bold mb-1" style={{ color: "#7f8c8d" }}>
                Platforms:
              </p>
              <div className="d-flex flex-wrap gap-1">
                {game.platforms.slice(0, 3).map((platform, index) => (
                  <span
                    key={index}
                    className="badge bg-light text-dark px-2 py-1 rounded"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {platform.platform.name}
                  </span>
                ))}
                {game.platforms.length > 3 && (
                  <span
                    className="badge bg-light text-dark px-2 py-1 rounded"
                    style={{ fontSize: "0.7rem" }}
                  >
                    +{game.platforms.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

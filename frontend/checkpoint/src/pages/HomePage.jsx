import { useEffect, useState } from "react";
import { searchGames } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const data = await searchGames("", page);
        setGames(data.results);
        if (data.total_pages) setTotalPages(data.total_pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [page]);

  // Loading skeleton
  if (loading)
    return (
      <div className="home-container">
        <div className="container py-5">
          <div className="row g-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <div className="game-card skeleton-card">
                  <div className="skeleton-poster"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (!games.length)
    return (
      <div className="home-container d-flex align-items-center justify-content-center min-vh-100">
        <div className="empty-state text-center">
          <div className="empty-icon mb-4">
            <i className="bi bi-emoji-frown display-1 text-muted"></i>
          </div>
          <h3 className="text-white mb-2">No games found</h3>
          <p className="text-muted fs-5">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );

  return (
    <div className="home-container">
      <div className="container py-5">
        {/* Hero Section - Optional */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="hero-section">
              <h1 className="display-5 fw-bold text-white mb-2 letter-spacing-tight">
                Discover Games
              </h1>
              <p className="text-muted fs-5">
                Browse, track, and rate your favorite games
              </p>
            </div>
          </div>
        </div>

        {/* Games Grid - Letterboxd Poster Layout */}
        <div className="row g-4">
          {games.map((g) => (
            <div key={g.rawg_id} className="col-6 col-md-4 col-lg-3 col-xl-2">
              <div
                className="game-card"
                onClick={() => navigate(`/game/${g.rawg_id}`)}
              >
                {/* Poster Wrapper */}
                <div className="poster-wrapper">
                  <img
                    src={g.background_image}
                    alt={g.name}
                    className="poster-image"
                  />

                  {/* Hover Overlay */}
                  <div className="poster-overlay">
                    <div className="overlay-content">
                      {/* Rating Badge */}
                      {g.rating && (
                        <div className="rating-badge">
                          <i className="bi bi-star-fill"></i>
                          <span>{g.rating.toFixed(1)}</span>
                        </div>
                      )}

                      {/* View Details Button */}
                      <div className="view-details">
                        <span>View Details</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Corner Badge */}
                  {g.rating && (
                    <div className="rating-corner">
                      <span className="badge rating-badge-sm">
                        {g.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="card-info">
                  <h6 className="game-title">{g.name}</h6>
                  <p className="game-year text-muted">
                    {g.released ? new Date(g.released).getFullYear() : "TBA"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Pagination - Letterboxd Style */}
        <div className="pagination-wrapper">
          <div className="pagination-container">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="btn pagination-btn"
            >
              <i className="bi bi-chevron-left"></i>
              <span className="d-none d-sm-inline ms-2">Previous</span>
            </button>

            <div className="page-indicator">
              <span className="current-page">{page}</span>
              {totalPages > 1 && (
                <>
                  <span className="separator">/</span>
                  <span className="total-pages">{totalPages}</span>
                </>
              )}
            </div>

            <button
              disabled={totalPages && page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="btn pagination-btn"
            >
              <span className="d-none d-sm-inline me-2">Next</span>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div className="container-fluid bg-dark min-vh-100 py-4">
        <div className="container">
          <div className="row g-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <div className="card bg-secondary border-0 rounded-3 placeholder-glow">
                  <div className="card-img-top ratio ratio-2x3 bg-dark placeholder"></div>
                  <div className="card-body">
                    <h5 className="card-title placeholder col-8"></h5>
                    <p className="card-text placeholder col-6"></p>
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
      <div className="container-fluid bg-dark min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center text-light">
          <i className="bi bi-emoji-frown display-1 text-muted"></i>
          <h3 className="mt-3">No games found</h3>
          <p className="text-muted">Try adjusting your search or filters</p>
        </div>
      </div>
    );

  return (
    <div className="container-fluid bg-dark min-vh-100 py-4">
      <div className="container">
        {/* Games Grid */}
        <div className="row g-4">
          {games.map((g) => (
            <div key={g.rawg_id} className="col-6 col-md-4 col-lg-3 col-xl-2">
              <div
                className="card bg-secondary border-0 rounded-3 shadow-sm game-card h-100"
                onClick={() => navigate(`/game/${g.rawg_id}`)}
                style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              >
                {/* Game Poster */}
                <div className="position-relative overflow-hidden rounded-top-3">
                  <img
                    src={g.background_image}
                    alt={g.name}
                    className="card-img-top ratio ratio-2x3 object-fit-cover"
                    style={{ transition: "transform 0.3s ease" }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-success bg-opacity-90 text-dark fw-semibold">
                      {g.rating ? g.rating.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Game Info */}
                <div className="card-body d-flex flex-column">
                  <h6
                    className="card-title text-light mb-2 line-clamp-2"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {g.name}
                  </h6>
                  <p className="card-text text-muted small mb-0 mt-auto">
                    <i className="bi bi-calendar3 me-1"></i>
                    {g.released ? new Date(g.released).getFullYear() : "TBA"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center align-items-center mt-5 pt-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="btn btn-outline-light btn-sm rounded-pill px-4 me-3 d-flex align-items-center"
          >
            <i className="bi bi-chevron-left me-1"></i>
            Prev
          </button>

          <span className="text-light mx-3">
            Page {page} {totalPages > 1 && `of ${totalPages}`}
          </span>

          <button
            disabled={totalPages && page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="btn btn-outline-light btn-sm rounded-pill px-4 ms-3 d-flex align-items-center"
          >
            Next
            <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      </div>

      {/* Custom CSS for hover effects */}
      <style jsx>{`
        .game-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 25px rgba(0, 192, 48, 0.15) !important;
        }
        .game-card:hover .card-img-top {
          transform: scale(1.05);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

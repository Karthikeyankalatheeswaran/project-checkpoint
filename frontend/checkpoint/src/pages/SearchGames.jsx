import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchGames } from "../services/api";

export default function SearchGames() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchGames(query);
        setResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="search-container">
      <div className="container py-5">
        {/* Search Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="search-header">
              <h2 className="search-title">
                Search results for{" "}
                <span className="query-highlight">"{query}"</span>
              </h2>
              {!loading && (
                <p className="text-muted">
                  {results.length} {results.length === 1 ? "game" : "games"}{" "}
                  found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="row g-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3">
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
        )}

        {/* No Results */}
        {!loading && !results.length && (
          <div className="empty-state text-center py-5">
            <div className="empty-icon mb-4">
              <i className="bi bi-search display-1 text-muted"></i>
            </div>
            <h3 className="text-white mb-2">No results found</h3>
            <p className="text-muted fs-5">
              Try different keywords or check your spelling
            </p>
          </div>
        )}

        {/* Search Results Grid */}
        {!loading && results.length > 0 && (
          <div className="row g-4">
            {results.map((g) => (
              <div
                key={g.rawg_id}
                className="col-6 col-md-4 col-lg-3"
                onClick={() => navigate(`/game/${g.rawg_id}`)}
              >
                <div className="game-card">
                  <div className="poster-wrapper">
                    <img
                      src={g.background_image}
                      alt={g.name}
                      className="poster-image"
                    />

                    <div className="poster-overlay">
                      <div className="overlay-content">
                        {g.rating && (
                          <div className="rating-badge">
                            <i className="bi bi-star-fill"></i>
                            <span>{g.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <div className="view-details">
                          <span>View Details</span>
                        </div>
                      </div>
                    </div>

                    {g.rating && (
                      <div className="rating-corner">
                        <span className="badge rating-badge-sm">
                          {g.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

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
        )}
      </div>
    </div>
  );
}

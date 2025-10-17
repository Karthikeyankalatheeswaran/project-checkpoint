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
    <div
      className="container-fluid min-vh-100 py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container">
        <h3 className="fw-bold mb-4" style={{ color: "#2c3e50" }}>
          Search results for: "{query}"
        </h3>

        {loading && (
          <div className="row g-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <div className="custom-card skeleton-loader game-card-fixed"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && !results.length && (
          <div className="text-center py-5">
            <i
              className="bi bi-search display-1"
              style={{ color: "#bdc3c7" }}
            ></i>
            <h4 className="mt-3" style={{ color: "#2c3e50" }}>
              No results found
            </h4>
            <p style={{ color: "#7f8c8d" }}>Try a different search term</p>
          </div>
        )}

        <div className="row g-4">
          {results.map((g) => (
            <div
              key={g.rawg_id}
              className="col-6 col-md-4 col-lg-3 col-xl-2"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/game/${g.rawg_id}`)}
            >
              <div className="custom-card game-card-fixed">
                <img
                  src={g.background_image}
                  alt={g.name}
                  className="card-img-top"
                  style={{
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "16px 16px 0 0",
                  }}
                />
                <div className="card-body p-3">
                  <h6
                    className="card-title fw-bold mb-2"
                    style={{ color: "#2c3e50", minHeight: "48px" }}
                  >
                    {g.name}
                  </h6>
                  <p
                    className="card-text small fw-bold mb-0"
                    style={{ color: "#7f8c8d" }}
                  >
                    <i className="bi bi-calendar3 me-1"></i>
                    {g.released ? new Date(g.released).getFullYear() : "TBA"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

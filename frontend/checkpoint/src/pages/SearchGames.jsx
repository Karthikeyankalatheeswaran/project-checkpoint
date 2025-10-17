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
    <div className="container mt-4">
      <h3>Search results for: “{query}”</h3>
      {loading && <p>Loading...</p>}
      {!loading && !results.length && <p>No results found.</p>}
      <div className="row">
        {results.map((g) => (
          <div
            key={g.rawg_id}
            className="col-md-3 mb-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/game/${g.rawg_id}`)} // 👈 this line enables navigation
          >
            <img
              src={g.background_image}
              alt={g.name}
              width="100%"
              style={{ borderRadius: "8px" }}
            />
            <h6 className="mt-2">{g.name}</h6>
            <p className="text-muted" style={{ fontSize: "0.9em" }}>
              Released: {g.released}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

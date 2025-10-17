import { useEffect, useState } from "react";
import { searchGames } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // current page
  const [totalPages, setTotalPages] = useState(1); // optional if backend returns total pages
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const data = await searchGames("", page); // fetch current page
        setGames(data.results);
        // If backend sends total pages, set it
        if (data.total_pages) setTotalPages(data.total_pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [page]); // re-fetch when page changes

  if (loading) return <div>Loading...</div>;
  if (!games.length) return <div>No games found.</div>;

  return (
    <div>
      {games.map((g) => (
        <div
          key={g.rawg_id}
          onClick={() => navigate(`/game/${g.rawg_id}`)}
          style={{ cursor: "pointer", marginBottom: "20px" }}
        >
          <img src={g.background_image} alt={g.name} width={200} />
          <h3>{g.name}</h3>
          <p>Released: {g.released}</p>
        </div>
      ))}

      {/* Pagination Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          style={{ marginRight: "10px" }}
        >
          Prev
        </button>
        <button
          disabled={totalPages && page >= totalPages} // optional if totalPages available
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

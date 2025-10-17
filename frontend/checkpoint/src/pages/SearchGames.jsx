import { useState } from "react";
import { searchGames, logGame } from "../services/api";

export default function SearchGames() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/search-games/?q=zelda")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = async () => {
    try {
      const res = await searchGames(query);
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLog = async (gameId) => {
    try {
      await logGame({ rawg_id: gameId, status: "completed" });
      alert("Game logged!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search games..."
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {results.map((g) => (
          <div key={g.rawg_id}>
            <h5>{g.name}</h5>
            <img src={g.background_image} width={200} />
            <button onClick={() => handleLog(g.rawg_id)}>Log Game</button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { searchGames } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [franchiseGames, setFranchiseGames] = useState([]);
  const [creatorGames, setCreatorGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [franchiseLoading, setFranchiseLoading] = useState(true);
  const [creatorLoading, setCreatorLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const data = await searchGames("", page);
        const limitedGames = data.results ? data.results.slice(0, 12) : [];
        setGames(limitedGames);
        if (data.total_pages) setTotalPages(data.total_pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFranchiseGames = async () => {
      setFranchiseLoading(true);
      try {
        const franchises = [
          "assassin's creed 2",
          "call of duty modern warfare",
          "grand theft auto v",
          "the witcher 3",
          "final fantasy 7 remake",
          "elder scrolls v skyrim",
        ];
        const franchiseResults = [];

        for (const franchise of franchises) {
          try {
            const data = await searchGames(franchise, 1);
            if (data.results && data.results.length > 0) {
              franchiseResults.push(data.results[0]);
            }
          } catch (err) {
            console.error(`Error fetching ${franchise}:`, err);
          }
        }

        setFranchiseGames(franchiseResults);
      } catch (err) {
        console.error(err);
      } finally {
        setFranchiseLoading(false);
      }
    };

    const fetchCreatorGames = async () => {
      setCreatorLoading(true);
      try {
        const creatorGameTitles = [
          "The Last of Us",
          "Silent Hill 2 Remake",
          "Red Dead Redemption 2",
          "Assassin's Creed 4 Black Flag",
          "Elden Ring",
          "Persona 5",
          "God of War 2018",
          "Final Fantasy VII",
        ];

        const creatorGameResults = [];

        for (const title of creatorGameTitles) {
          try {
            const data = await searchGames(title, 1);
            if (data.results && data.results.length > 0) {
              creatorGameResults.push({
                ...data.results[0],
                inspiration: getInspirationQuote(title),
              });
            }
          } catch (err) {
            console.error(`Error fetching ${title}:`, err);
          }
        }

        setCreatorGames(creatorGameResults);
      } catch (err) {
        console.error(err);
      } finally {
        setCreatorLoading(false);
      }
    };

    fetchGames();
    fetchFranchiseGames();
    fetchCreatorGames();
  }, [page]);

  const getInspirationQuote = (gameTitle) => {
    const quotes = {
      "The Last of Us": "Redefined narrative depth in games",
      "Silent Hill 2 Remake": "Mastered psychological horror",
      "Red Dead Redemption 2": "Demonstrated immersive world-building",
      "Assassin's Creed 4 Black Flag":
        "Brought open-world exploration to new heights",
      "Elden Ring": "Revolutionized open-world RPG design",
      "Persona 5": "Inspired social and time management tracking",
      "God of War 2018": "Showcased emotional storytelling in gaming",
      "Final Fantasy VII": "The RPG that started it all",
    };
    return quotes[gameTitle] || "Inspired Checkpoint's development";
  };

  if (loading)
    return (
      <div
        className="container-fluid min-vh-100 py-4"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="container">
          <div className="row g-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                <div
                  className="custom-card skeleton-loader"
                  style={{
                    height: "380px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    animation: "loading 1.5s infinite",
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div
      className="container-fluid min-vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container py-5">
        {/* Creator's Gaming Journey Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="custom-card p-5 position-relative overflow-hidden">
              {/* Background Elements */}
              <div
                className="position-absolute top-0 end-0 opacity-5"
                style={{
                  width: "300px",
                  height: "300px",
                  background: "linear-gradient(135deg, #3498db, #9b59b6)",
                  borderRadius: "50%",
                  transform: "translate(150px, -150px)",
                }}
              ></div>
              <div
                className="position-absolute bottom-0 start-0 opacity-5"
                style={{
                  width: "200px",
                  height: "200px",
                  background: "linear-gradient(135deg, #f39c12, #e74c3c)",
                  borderRadius: "50%",
                  transform: "translate(-100px, 100px)",
                }}
              ></div>

              <div className="row align-items-center position-relative">
                <div className="col-lg-5 text-center mb-4 mb-lg-0">
                  <div className="position-relative">
                    <div
                      className="rounded-circle mx-auto d-flex align-items-center justify-content-center position-relative"
                      style={{
                        width: "220px",
                        height: "220px",
                        background: "linear-gradient(135deg, #3498db, #9b59b6)",
                        color: "white",
                        fontSize: "4rem",
                        boxShadow: "0 20px 40px rgba(52, 152, 219, 0.3)",
                        border: "8px solid rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      🎮
                    </div>
                    {/* Gaming Stats */}
                    <div
                      className="position-absolute rounded-pill d-flex align-items-center justify-content-center"
                      style={{
                        top: "20px",
                        right: "30px",
                        width: "80px",
                        height: "30px",
                        background: "linear-gradient(135deg, #27ae60, #2ecc71)",
                        color: "white",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        boxShadow: "0 8px 20px rgba(39, 174, 96, 0.3)",
                        transform: "rotate(15deg)",
                      }}
                    >
                      Since 2K
                    </div>
                    <div
                      className="position-absolute rounded-pill d-flex align-items-center justify-content-center"
                      style={{
                        bottom: "30px",
                        left: "20px",
                        width: "70px",
                        height: "25px",
                        background: "linear-gradient(135deg, #f39c12, #f1c40f)",
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        boxShadow: "0 8px 20px rgba(243, 156, 18, 0.3)",
                        transform: "rotate(-10deg)",
                      }}
                    >
                      200+ Games
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="row mt-4 g-3">
                    <div className="col-4">
                      <div className="text-center">
                        <div
                          className="fw-bold display-6"
                          style={{ color: "#3498db" }}
                        >
                          15+
                        </div>
                        <div
                          style={{
                            color: "#7f8c8d",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                          }}
                        >
                          Years Gaming
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center">
                        <div
                          className="fw-bold display-6"
                          style={{ color: "#9b59b6" }}
                        >
                          170+
                        </div>
                        <div
                          style={{
                            color: "#7f8c8d",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                          }}
                        >
                          Completed
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center">
                        <div
                          className="fw-bold display-6"
                          style={{ color: "#27ae60" }}
                        >
                          20K+
                        </div>
                        <div
                          style={{
                            color: "#7f8c8d",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                          }}
                        >
                          Hours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="ps-lg-4">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="rounded-pill px-3 py-1 me-3"
                        style={{
                          background:
                            "linear-gradient(135deg, #e74c3c, #c0392b)",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        Creator's Journey
                      </div>
                      <div className="text-muted small">
                        <i className="bi bi-controller me-1"></i>Veteran Gamer
                      </div>
                    </div>

                    <h2
                      className="fw-bold mb-4 display-5"
                      style={{ color: "#2c3e50", lineHeight: "1.2" }}
                    >
                      From Player to{" "}
                      <span
                        style={{
                          background:
                            "linear-gradient(135deg, #3498db, #9b59b6)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Creator
                      </span>
                    </h2>

                    <div className="mb-4">
                      <p
                        style={{
                          color: "#5d6d7e",
                          lineHeight: "1.8",
                          fontSize: "1.1rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        As an avid gamer who's journeyed through countless
                        virtual worlds, I've experienced the thrill of epic
                        quests, the camaraderie of multiplayer battles, and the
                        joy of discovering hidden gems. Yet, amidst these
                        adventures, I've often found myself longing for a way to
                        document and celebrate my gaming experiences.
                      </p>

                      <p
                        style={{
                          color: "#5d6d7e",
                          lineHeight: "1.8",
                          fontSize: "1.1rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        Checkpoint was born from countless notebooks filled with
                        game progress, hand-drawn maps, and the realization that
                        our gaming stories deserve to be preserved and shared.
                        It's the platform I wish I had during my 15+ years of
                        gaming.
                      </p>
                    </div>

                    {/* Gaming Philosophy */}
                    <div
                      className="custom-card p-4 mb-4"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(155, 89, 182, 0.05))",
                        borderLeft: "4px solid #3498db",
                      }}
                    >
                      <div className="d-flex align-items-start">
                        <div
                          className="me-3 mt-1"
                          style={{ color: "#3498db", fontSize: "1.5rem" }}
                        >
                          💭
                        </div>
                        <div>
                          <h6
                            className="fw-bold mb-2"
                            style={{ color: "#2c3e50" }}
                          >
                            Gaming is More Than Just a Hobby
                          </h6>
                          <p
                            className="mb-0"
                            style={{ color: "#5d6d7e", fontSize: "0.95rem" }}
                          >
                            "Every game tells a story, and every player's
                            journey is unique. Checkpoint is my way of honoring
                            the stories we've lived and the adventures yet to
                            come."
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-3 align-items-center">
                      <button
                        className="btn fw-bold px-4 py-3 rounded-3 d-flex align-items-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #3498db, #9b59b6)",
                          color: "white",
                          border: "none",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 12px 25px rgba(52, 152, 219, 0.4)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                        onClick={() => navigate("/dashboard")}
                      >
                        <i className="bi bi-joystick me-2"></i>
                        Start Your Journey
                      </button>

                      <button
                        className="btn fw-bold px-4 py-3 rounded-3 d-flex align-items-center"
                        style={{
                          background: "transparent",
                          color: "#3498db",
                          border: "2px solid #3498db",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#3498db";
                          e.target.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = "#3498db";
                        }}
                        onClick={() =>
                          document
                            .getElementById("creator-games")
                            .scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        <i className="bi bi-heart me-2"></i>
                        See My Inspirations
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Checkpoint Section */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
              Why Choose Checkpoint?
            </h2>
            <p style={{ color: "#7f8c8d", fontSize: "1.1rem" }}>
              Everything you need to master your gaming journey
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <div className="custom-card p-4 text-center h-100">
              <div className="display-4 mb-3" style={{ color: "#3498db" }}>
                📊
              </div>
              <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                Track Progress
              </h5>
              <p style={{ color: "#7f8c8d" }}>
                Monitor your gaming hours, achievements, and completion status
                across all your favorite games. Never lose track of your gaming
                journey.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="custom-card p-4 text-center h-100">
              <div className="display-4 mb-3" style={{ color: "#9b59b6" }}>
                ⭐
              </div>
              <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                Rate & Review
              </h5>
              <p style={{ color: "#7f8c8d" }}>
                Share your thoughts with the community and discover new games
                through authentic player reviews. Your voice matters.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="custom-card p-4 text-center h-100">
              <div className="display-4 mb-3" style={{ color: "#27ae60" }}>
                🎯
              </div>
              <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                Discover Games
              </h5>
              <p style={{ color: "#7f8c8d" }}>
                Explore thousands of games, filter by platform, genre, and find
                your next gaming adventure. Your next favorite game awaits.
              </p>
            </div>
          </div>
        </div>

        {/* Creator's Inspirational Games */}
        <div id="creator-games" className="row mb-5">
          <div className="col-12">
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                Games That Inspired Checkpoint
              </h2>
              <p style={{ color: "#7f8c8d", fontSize: "1.1rem" }}>
                These masterpieces shaped the vision for our gaming companion
              </p>
            </div>

            {creatorLoading ? (
              <div className="row g-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div
                      className="custom-card skeleton-loader"
                      style={{ height: "320px", borderRadius: "12px" }}
                    ></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="row g-4">
                {creatorGames.map((game) => (
                  <div
                    key={game.id || game.rawg_id}
                    className="col-12 col-md-6 col-lg-4 col-xl-3"
                  >
                    <div
                      className="custom-card h-100"
                      onClick={() =>
                        navigate(`/game/${game.rawg_id || game.id}`)
                      }
                      style={{
                        cursor: "pointer",
                        height: "320px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={
                          game.background_image ||
                          "https://via.placeholder.com/400x225?text=No+Image"
                        }
                        alt={game.name}
                        className="w-100"
                        style={{
                          height: "160px",
                          objectFit: "cover",
                          borderTopLeftRadius: "12px",
                          borderTopRightRadius: "12px",
                        }}
                      />
                      <div className="card-body d-flex flex-column p-3">
                        <h6
                          className="fw-bold mb-2 line-clamp-2"
                          style={{
                            color: "#2c3e50",
                            fontSize: "0.9rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "40px",
                          }}
                        >
                          {game.name}
                        </h6>

                        <p
                          className="small mb-2"
                          style={{
                            color: "#3498db",
                            fontStyle: "italic",
                            fontSize: "0.8rem",
                          }}
                        >
                          {game.inspiration}
                        </p>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-warning text-dark px-2 py-1 rounded-pill small">
                              ⭐ {game.rating ? game.rating.toFixed(1) : "N/A"}
                            </span>
                            <span className="text-muted small">
                              {game.released
                                ? new Date(game.released).getFullYear()
                                : "TBA"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Iconic Franchises Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
                  🎭 Iconic Franchises
                </h2>
                <p style={{ color: "#7f8c8d", fontWeight: "500" }}>
                  Explore games from legendary gaming franchises
                </p>
              </div>
            </div>

            {franchiseLoading ? (
              <div className="row g-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="col-12 col-md-6 col-lg-4 col-xl-2">
                    <div
                      className="custom-card skeleton-loader"
                      style={{ height: "280px", borderRadius: "12px" }}
                    ></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="row g-4">
                {franchiseGames.map((game) => (
                  <div
                    key={game.id || game.rawg_id}
                    className="col-12 col-md-6 col-lg-4 col-xl-2"
                  >
                    <div
                      className="custom-card h-100"
                      onClick={() =>
                        navigate(`/game/${game.rawg_id || game.id}`)
                      }
                      style={{
                        cursor: "pointer",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={
                          game.background_image ||
                          "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={game.name}
                        className="w-100"
                        style={{
                          height: "160px",
                          objectFit: "cover",
                          borderTopLeftRadius: "12px",
                          borderTopRightRadius: "12px",
                        }}
                      />
                      <div className="card-body d-flex flex-column p-3">
                        <h6
                          className="fw-bold mb-2 line-clamp-2"
                          style={{
                            color: "#2c3e50",
                            fontSize: "0.9rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "40px",
                          }}
                        >
                          {game.name}
                        </h6>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-warning text-dark px-2 py-1 rounded-pill small">
                              ⭐ {game.rating ? game.rating.toFixed(1) : "N/A"}
                            </span>
                            <span className="text-muted small">
                              {game.released
                                ? new Date(game.released).getFullYear()
                                : "TBA"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Games Section */}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
                  All Games
                </h2>
                <p style={{ color: "#7f8c8d", fontWeight: "500" }}>
                  Browse our complete game library
                </p>
              </div>
            </div>

            {!games.length ? (
              <div className="text-center py-5">
                <i
                  className="bi bi-emoji-frown display-1"
                  style={{ color: "#bdc3c7" }}
                ></i>
                <h3 className="mt-3" style={{ color: "#2c3e50" }}>
                  No games found
                </h3>
                <p style={{ color: "#7f8c8d" }}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {games.map((game) => (
                  <div
                    key={game.id || game.rawg_id}
                    className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4"
                  >
                    <div
                      className="custom-card h-100"
                      onClick={() =>
                        navigate(`/game/${game.rawg_id || game.id}`)
                      }
                      style={{
                        cursor: "pointer",
                        height: "380px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Game Poster */}
                      <div
                        className="position-relative overflow-hidden"
                        style={{ flex: "0 0 auto" }}
                      >
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
                        <div className="position-absolute top-0 end-0 m-2">
                          <span
                            className="badge fw-bold px-3 py-2 rounded-pill"
                            style={{
                              background:
                                "linear-gradient(135deg, #f39c12, #e67e22)",
                              color: "white",
                              fontSize: "0.8rem",
                            }}
                          >
                            {game.rating ? game.rating.toFixed(1) : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Game Info */}
                      <div
                        className="card-body d-flex flex-column p-4"
                        style={{ flex: "1 1 auto" }}
                      >
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
                            <p
                              className="small fw-bold mb-0"
                              style={{ color: "#7f8c8d" }}
                            >
                              <i className="bi bi-calendar3 me-1"></i>
                              {game.released
                                ? new Date(game.released).getFullYear()
                                : "TBA"}
                            </p>
                            <p
                              className="small fw-bold mb-0"
                              style={{ color: "#f39c12" }}
                            >
                              ⭐ {game.rating || "N/A"}
                            </p>
                          </div>

                          {/* Platforms (if available) */}
                          {game.platforms && (
                            <div className="mt-2">
                              <p
                                className="small fw-bold mb-1"
                                style={{ color: "#7f8c8d" }}
                              >
                                Platforms:
                              </p>
                              <div className="d-flex flex-wrap gap-1">
                                {game.platforms
                                  .slice(0, 3)
                                  .map((platform, index) => (
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
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="d-flex justify-content-center align-items-center mt-5 pt-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="btn fw-bold px-4 py-2 me-3 d-flex align-items-center rounded-3"
                style={{
                  background: page === 1 ? "#f8f9fa" : "transparent",
                  color: page === 1 ? "#bdc3c7" : "#3498db",
                  border: "2px solid",
                  borderColor: page === 1 ? "#e9ecef" : "#3498db",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (page !== 1) {
                    e.target.style.background = "#3498db";
                    e.target.style.color = "white";
                  }
                }}
                onMouseOut={(e) => {
                  if (page !== 1) {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#3498db";
                  }
                }}
              >
                <i className="bi bi-chevron-left me-1"></i>
                Previous
              </button>

              <span
                className="mx-4 fw-bold"
                style={{
                  color: "#2c3e50",
                  minWidth: "120px",
                  textAlign: "center",
                }}
              >
                Page {page} of {totalPages}
              </span>

              <button
                disabled={totalPages && page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="btn fw-bold px-4 py-2 ms-3 d-flex align-items-center rounded-3"
                style={{
                  background:
                    totalPages && page >= totalPages
                      ? "#f8f9fa"
                      : "linear-gradient(135deg, #3498db, #9b59b6)",
                  color: totalPages && page >= totalPages ? "#bdc3c7" : "white",
                  border:
                    totalPages && page >= totalPages
                      ? "2px solid #e9ecef"
                      : "none",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (!(totalPages && page >= totalPages)) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 6px 20px rgba(52, 152, 219, 0.3)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!(totalPages && page >= totalPages)) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                Next
                <i className="bi bi-chevron-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        
        .custom-card {
          border: none;
          border-radius: "16px";
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          background: white;
          overflow: hidden;
        }
        
        .custom-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
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

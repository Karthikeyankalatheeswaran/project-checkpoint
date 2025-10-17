import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const username = localStorage.getItem("username");
      setUser({ name: username || "Player" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">
        GameLog
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          {user && (
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                My Logs
              </Link>
            </li>
          )}
        </ul>

        {/* Search Bar */}
        <form
          className="d-flex me-3"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-light" type="submit">
            Search
          </button>
        </form>

        {/* User Auth Buttons */}
        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-link">Hello, {user.name}</span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

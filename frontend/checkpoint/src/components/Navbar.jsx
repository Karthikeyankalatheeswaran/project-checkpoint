import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (token) {
      setUser({ name: username || "Player" });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${query}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="custom-navbar">
      <div className="container-fluid px-4">
        <div className="navbar-content">
          {/* Logo/Brand */}
          <Link className="navbar-brand" to="/">
            <span className="brand-icon">🎮</span>
            <span className="brand-text">Checkpoint</span>
          </Link>

          {/* Navigation Links */}
          <div className="navbar-links d-none d-lg-flex">
            <Link className="nav-link-item" to="/">
              Home
            </Link>
            {user && (
              <Link className="nav-link-item" to="/dashboard">
                My Library
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <form
            className="navbar-search d-none d-md-block"
            onSubmit={handleSearch}
          >
            <div className="search-wrapper">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="navbar-actions">
            {user ? (
              <>
                <span className="user-name d-none d-sm-inline">
                  {user.name}
                </span>
                <button className="btn btn-logout" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span className="d-none d-sm-inline ms-2">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-link-nav" to="/login">
                  Login
                </Link>
                <Link className="btn btn-signup" to="/register">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
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

  return (
    <nav className="navbar navbar-expand-lg px-4 py-3 border-bottom">
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center"
          to="/"
          style={{ color: "#2c3e50", fontSize: "1.5rem" }}
        >
          <div
            className="me-2"
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #3498db, #9b59b6)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          ></div>
          Checkpoint
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className="nav-link fw-bold px-3 py-2 rounded-3"
                to="/"
                style={{ color: "#2c3e50", transition: "all 0.3s ease" }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Home
              </Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link
                  className="nav-link fw-bold px-3 py-2 rounded-3"
                  to="/dashboard"
                  style={{ color: "#2c3e50", transition: "all 0.3s ease" }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  My Logs
                </Link>
              </li>
            )}
          </ul>

          <form
            className="d-flex me-4 my-2 my-lg-0"
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.search.value.trim();
              if (query) navigate(`/search?q=${query}`);
            }}
          >
            <div className="input-group" style={{ width: "300px" }}>
              <input
                type="text"
                name="search"
                placeholder="Search games..."
                className="form-control border-end-0"
                style={{
                  borderRadius: "12px 0 0 12px",
                  border: "2px solid #e9ecef",
                  padding: "10px 16px",
                  fontWeight: "500",
                }}
              />
              <button
                className="btn border-start-0 d-flex align-items-center justify-content-center"
                type="submit"
                style={{
                  borderRadius: "0 12px 12px 0",
                  border: "2px solid #e9ecef",
                  borderLeft: "none",
                  background: "white",
                  color: "#3498db",
                  width: "50px",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#3498db";
                  e.target.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "#3498db";
                }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item me-3 my-auto">
                  <span
                    className="fw-bold d-flex align-items-center px-3 py-2 rounded-3"
                    style={{
                      color: "#2c3e50",
                      background: "#f8f9fa",
                      fontSize: "0.9rem",
                    }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {user.name}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn fw-bold px-4 py-2 rounded-3"
                    onClick={handleLogout}
                    style={{
                      background: "transparent",
                      color: "#e74c3c",
                      border: "2px solid #e74c3c",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#e74c3c";
                      e.target.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = "#e74c3c";
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <div className="d-flex gap-2">
                <li className="nav-item">
                  <Link
                    className="btn fw-bold px-4 py-2 rounded-3"
                    to="/login"
                    style={{
                      background: "transparent",
                      color: "#3498db",
                      border: "2px solid #3498db",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#3498db";
                      e.target.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = "#3498db";
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn fw-bold px-4 py-2 rounded-3"
                    to="/register"
                    style={{
                      background: "linear-gradient(135deg, #3498db, #9b59b6)",
                      color: "white",
                      border: "none",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 6px 20px rgba(52, 152, 219, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Register
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e9ecef !important;
        }
        
        .navbar-toggler:focus {
          box-shadow: none;
        }
        
        .form-control:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.1);
        }
      `}</style>
    </nav>
  );
}

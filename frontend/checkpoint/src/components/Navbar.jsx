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
          <div className="me-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/686/686589.png"
              alt="Checkpoint"
              style={{
                width: "32px",
                height: "32px",
                objectFit: "contain",
              }}
            />
          </div>
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
                <i className="bi bi-house me-2"></i>
                Home
              </Link>
            </li>

            {user && (
              <>
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
                    <i className="bi bi-joystick me-2"></i>
                    My Logs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link fw-bold px-3 py-2 rounded-3"
                    to="/friends/search"
                    style={{ color: "#2c3e50", transition: "all 0.3s ease" }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <i className="bi bi-people me-2"></i>
                    Find Friends
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link fw-bold px-3 py-2 rounded-3"
                    to={`/profile/${user.name}`}
                    style={{ color: "#2c3e50", transition: "all 0.3s ease" }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <i className="bi bi-person me-2"></i>
                    My Profile
                  </Link>
                </li>
              </>
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
                  <div className="dropdown">
                    <button
                      className="btn fw-bold d-flex align-items-center px-3 py-2 rounded-3 dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      style={{
                        color: "#2c3e50",
                        background: "#f8f9fa",
                        fontSize: "0.9rem",
                        border: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = "#e9ecef";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "#f8f9fa";
                      }}
                    >
                      <i className="bi bi-person-circle me-2"></i>
                      {user.name}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-2">
                      <li>
                        <Link
                          className="dropdown-item d-flex align-items-center py-2 rounded-2"
                          to={`/profile/${user.name}`}
                          style={{
                            color: "#2c3e50",
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = "#f8f9fa";
                            e.target.style.color = "#3498db";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = "transparent";
                            e.target.style.color = "#2c3e50";
                          }}
                        >
                          <i className="bi bi-person me-2"></i>
                          View Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item d-flex align-items-center py-2 rounded-2"
                          to="/dashboard"
                          style={{
                            color: "#2c3e50",
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = "#f8f9fa";
                            e.target.style.color = "#3498db";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = "transparent";
                            e.target.style.color = "#2c3e50";
                          }}
                        >
                          <i className="bi bi-joystick me-2"></i>
                          My Game Logs
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item d-flex align-items-center py-2 rounded-2"
                          to="/friends/search"
                          style={{
                            color: "#2c3e50",
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = "#f8f9fa";
                            e.target.style.color = "#3498db";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = "transparent";
                            e.target.style.color = "#2c3e50";
                          }}
                        >
                          <i className="bi bi-people me-2"></i>
                          Find Friends
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center py-2 rounded-2"
                          onClick={handleLogout}
                          style={{
                            color: "#e74c3c",
                            transition: "all 0.3s ease",
                            border: "none",
                            background: "transparent",
                            width: "100%",
                            textAlign: "left",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = "#f8f9fa";
                            e.target.style.color = "#c0392b";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = "transparent";
                            e.target.style.color = "#e74c3c";
                          }}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
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
                    <i className="bi bi-box-arrow-in-right me-2"></i>
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
                    <i className="bi bi-person-plus me-2"></i>
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
        
        .dropdown-menu {
          min-width: 200px;
          border: 1px solid #e9ecef;
        }
        
        .dropdown-item {
          font-weight: 500;
        }
      `}</style>
    </nav>
  );
}

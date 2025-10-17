import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light">
      <div className="container-fluid px-4">
        <div className="container py-5">
          <div className="row g-4">
            {/* Brand Section */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #3498db, #9b59b6)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  CP
                </div>
                <h5 className="fw-bold mb-0" style={{ color: "white" }}>
                  Checkpoint
                </h5>
              </div>
              <p
                className="text-light mb-4"
                style={{ lineHeight: "1.6", opacity: "0.8" }}
              >
                The ultimate gaming companion for tracking progress, discovering
                new adventures, and connecting with fellow gamers worldwide.
              </p>
              <div className="d-flex gap-3">
                <a
                  href="#"
                  className="text-light text-decoration-none"
                  style={{
                    opacity: "0.7",
                    transition: "all 0.3s ease",
                    fontSize: "1.5rem",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = "0.7";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                  style={{
                    opacity: "0.7",
                    transition: "all 0.3s ease",
                    fontSize: "1.5rem",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = "0.7";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <i className="bi bi-discord"></i>
                </a>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                  style={{
                    opacity: "0.7",
                    transition: "all 0.3s ease",
                    fontSize: "1.5rem",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = "0.7";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <i className="bi bi-github"></i>
                </a>
                <a
                  href="#"
                  className="text-light text-decoration-none"
                  style={{
                    opacity: "0.7",
                    transition: "all 0.3s ease",
                    fontSize: "1.5rem",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = "0.7";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h6
                className="fw-bold mb-3 text-uppercase"
                style={{ color: "#3498db" }}
              >
                Explore
              </h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link
                    to="/"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#3498db";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/dashboard"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#3498db";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    My Logs
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/search"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#3498db";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Search Games
                  </Link>
                </li>
                <li className="mb-2">
                  <a
                    href="#features"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#3498db";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h6
                className="fw-bold mb-3 text-uppercase"
                style={{ color: "#9b59b6" }}
              >
                Support
              </h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#9b59b6";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Help Center
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#9b59b6";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Community
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#9b59b6";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Contact Us
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#9b59b6";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h6
                className="fw-bold mb-3 text-uppercase"
                style={{ color: "#27ae60" }}
              >
                Legal
              </h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#27ae60";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#27ae60";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Terms of Service
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#27ae60";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    Cookie Policy
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#"
                    className="text-light text-decoration-none"
                    style={{
                      opacity: "0.8",
                      transition: "all 0.3s ease",
                      fontSize: "0.95rem",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "#27ae60";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = "0.8";
                      e.target.style.color = "white";
                    }}
                  >
                    GDPR
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h6
                className="fw-bold mb-3 text-uppercase"
                style={{ color: "#f39c12" }}
              >
                Stay Updated
              </h6>
              <p
                className="text-light mb-3"
                style={{ opacity: "0.8", fontSize: "0.9rem" }}
              >
                Get the latest gaming news and updates
              </p>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                    fontSize: "0.9rem",
                  }}
                />
                <button
                  className="btn fw-bold"
                  style={{
                    background: "linear-gradient(135deg, #f39c12, #e67e22)",
                    color: "white",
                    border: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-top"
          style={{ borderColor: "rgba(255,255,255,0.1) !important" }}
        >
          <div className="container py-3">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start">
                <p
                  className="mb-0"
                  style={{ opacity: "0.7", fontSize: "0.9rem" }}
                >
                  © {currentYear} Checkpoint. All rights reserved.
                </p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <p
                  className="mb-0"
                  style={{ opacity: "0.7", fontSize: "0.9rem" }}
                >
                  Made with <span style={{ color: "#e74c3c" }}>♥</span> for
                  gamers worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        footer {
          background: #2c3e50 !important;
          margin-top: auto;
        }
        
        footer a:hover {
          text-decoration: none;
        }
        
        footer .form-control::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        footer .form-control:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: #3498db;
          box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
          color: white;
        }
        
        .container-fluid {
          padding-left: 0;
          padding-right: 0;
        }
      `}</style>
    </footer>
  );
}

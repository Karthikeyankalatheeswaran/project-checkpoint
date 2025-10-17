import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const gamingQuotes = [
    "The right man in the wrong place can make all the difference in the world.",
    "It's dangerous to go alone! Take this.",
    "War. War never changes.",
    "The cake is a lie.",
    "Would you kindly?",
    "No lollygagging.",
    "I used to be an adventurer like you, then I took an arrow in the knee.",
    "You must construct additional pylons!",
    "Stay a while and listen...",
    "It's-a me, Mario!",
    "Finish him!",
    "All your base are belong to us.",
  ];

  const randomQuote =
    gamingQuotes[Math.floor(Math.random() * gamingQuotes.length)];

  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row align-items-center">
          {/* Brand Section */}
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <div className="me-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/686/686589.png"
                  alt="Checkpoint"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ color: "white" }}>
                  Checkpoint
                </h5>
                <p className="small mb-0" style={{ opacity: "0.7" }}>
                  Your Gaming Companion
                </p>
              </div>
            </div>
          </div>

          {/* Gaming Quote */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <p
              className="mb-0 fst-italic"
              style={{ opacity: "0.8", fontSize: "0.9rem" }}
            >
              "{randomQuote}"
            </p>
          </div>

          {/* Social Links */}
          <div className="col-md-4 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a
                href="#"
                className="text-light text-decoration-none"
                style={{
                  opacity: "0.7",
                  transition: "all 0.3s ease",
                  fontSize: "1.3rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = "1";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.color = "#1DA1F2";
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = "0.7";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.color = "white";
                }}
                title="Twitter"
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="#"
                className="text-light text-decoration-none"
                style={{
                  opacity: "0.7",
                  transition: "all 0.3s ease",
                  fontSize: "1.3rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = "1";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.color = "#5865F2";
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = "0.7";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.color = "white";
                }}
                title="Discord"
              >
                <i className="bi bi-discord"></i>
              </a>
              <a
                href="#"
                className="text-light text-decoration-none"
                style={{
                  opacity: "0.7",
                  transition: "all 0.3s ease",
                  fontSize: "1.3rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = "1";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = "0.7";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.color = "white";
                }}
                title="GitHub"
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href="#"
                className="text-light text-decoration-none"
                style={{
                  opacity: "0.7",
                  transition: "all 0.3s ease",
                  fontSize: "1.3rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = "1";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.color = "#FF0000";
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = "0.7";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.color = "white";
                }}
                title="YouTube"
              >
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-3">
          <div className="col-12 text-center">
            <p className="mb-0 small" style={{ opacity: "0.6" }}>
              © {currentYear} Checkpoint. Made with{" "}
              <span style={{ color: "#e74c3c" }}>♥</span> for gamers.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
          .col-md-4 {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </footer>
  );
}

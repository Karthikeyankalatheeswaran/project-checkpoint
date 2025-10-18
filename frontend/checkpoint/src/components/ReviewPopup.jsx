import React from "react";

export default function ReviewPopup({ review, onClose }) {
  if (!review) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold" style={{ color: "#2c3e50" }}>
              <i
                className="bi bi-chat-quote me-2"
                style={{ color: "#3498db" }}
              ></i>
              Full Review
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body pt-0">
            <div
              className="p-4 rounded-3"
              style={{
                backgroundColor: "#f8f9fa",
                borderLeft: "4px solid #3498db",
              }}
            >
              <p
                className="mb-0"
                style={{
                  color: "#5d6d7e",
                  lineHeight: "1.6",
                  fontSize: "1.05rem",
                }}
              >
                "{review}"
              </p>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button
              type="button"
              className="btn fw-bold px-4 py-2 rounded-3"
              onClick={onClose}
              style={{
                background: "linear-gradient(135deg, #3498db, #9b59b6)",
                color: "white",
                border: "none",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

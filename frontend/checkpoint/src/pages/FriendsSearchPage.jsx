import React, { useState } from "react";
import {
  searchUsers,
  sendFriendRequest,
  getFriendStatus,
} from "../services/api";
import { useNavigate } from "react-router-dom";

export default function FriendsSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const data = await searchUsers(searchQuery);
      // Fetch friend status for each user
      const usersWithStatus = await Promise.all(
        data.users.map(async (user) => {
          const statusData = await getFriendStatus(user.username);
          return { ...user, friendStatus: statusData };
        })
      );
      setUsers(usersWithStatus);
    } catch (err) {
      console.error("Error searching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendAction = async (username, currentStatus) => {
    try {
      if (currentStatus.status === "not_friends") {
        await sendFriendRequest(username);
        // Update local state
        setUsers(
          users.map((user) =>
            user.username === username
              ? { ...user, friendStatus: { status: "request_sent" } }
              : user
          )
        );
      }
    } catch (err) {
      console.error("Error with friend action:", err);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
              Find Gamers
            </h1>
            <p style={{ color: "#7f8c8d", fontWeight: "500" }}>
              Connect with fellow gamers and build your gaming community
            </p>
          </div>
        </div>

        {/* Search Form */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="custom-card p-4">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      borderRadius: "12px 0 0 12px",
                      padding: "12px 16px",
                    }}
                  />
                  <button
                    className="btn fw-bold px-4"
                    type="submit"
                    disabled={loading}
                    style={{
                      borderRadius: "0 12px 12px 0",
                      background: "linear-gradient(135deg, #3498db, #9b59b6)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    {loading ? (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <i className="bi bi-search"></i>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="row">
          <div className="col-12">
            {users.length > 0 ? (
              <div className="custom-card p-4">
                <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
                  Search Results ({users.length})
                </h5>
                <div className="row g-3">
                  {users.map((user) => (
                    <UserSearchCard
                      key={user.id}
                      user={user}
                      onFriendAction={handleFriendAction}
                      onViewProfile={() =>
                        navigate(`/profile/${user.username}`)
                      }
                    />
                  ))}
                </div>
              </div>
            ) : (
              searchQuery &&
              !loading && (
                <div className="custom-card p-5 text-center">
                  <i
                    className="bi bi-search display-1"
                    style={{ color: "#bdc3c7" }}
                  ></i>
                  <h4 className="mt-3" style={{ color: "#2c3e50" }}>
                    No users found
                  </h4>
                  <p style={{ color: "#7f8c8d" }}>
                    Try searching with a different username
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// User Search Card Component
function UserSearchCard({ user, onFriendAction, onViewProfile }) {
  const getFriendButtonText = (status) => {
    switch (status) {
      case "friends":
        return "Friends";
      case "request_sent":
        return "Request Sent";
      case "request_received":
        return "Accept Request";
      default:
        return "Add Friend";
    }
  };

  const getFriendButtonStyle = (status) => {
    switch (status) {
      case "friends":
        return {
          background: "linear-gradient(135deg, #27ae60, #229954)",
          color: "white",
        };
      case "request_sent":
        return {
          background: "linear-gradient(135deg, #f39c12, #e67e22)",
          color: "white",
        };
      default:
        return {
          background: "linear-gradient(135deg, #3498db, #9b59b6)",
          color: "white",
        };
    }
  };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="custom-card p-4">
        <div className="d-flex align-items-start mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #3498db, #9b59b6)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow-1">
            <h6 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>
              {user.username}
            </h6>
            <p className="mb-0 small" style={{ color: "#7f8c8d" }}>
              {user.total_games} games • {user.total_hours}h played
            </p>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn fw-bold flex-grow-1 rounded-3"
            onClick={onViewProfile}
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
          >
            View Profile
          </button>

          {user.friendStatus.status !== "friends" && (
            <button
              className="btn fw-bold rounded-3"
              onClick={() => onFriendAction(user.username, user.friendStatus)}
              disabled={user.friendStatus.status === "request_sent"}
              style={{
                ...getFriendButtonStyle(user.friendStatus.status),
                border: "none",
                transition: "all 0.3s ease",
                minWidth: "120px",
              }}
              onMouseOver={(e) => {
                if (user.friendStatus.status === "not_friends") {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 20px rgba(52, 152, 219, 0.3)";
                }
              }}
              onMouseOut={(e) => {
                if (user.friendStatus.status === "not_friends") {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              {getFriendButtonText(user.friendStatus.status)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

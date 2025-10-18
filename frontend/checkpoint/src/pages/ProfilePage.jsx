import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserProfile,
  getUserGameLogs,
  getFriendStatus,
  sendFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../services/api";
import ReviewPopup from "../components/ReviewPopup";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendStatus, setFriendStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("games");
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await getUserProfile(username);
        setUser(userData);

        const logsData = await getUserGameLogs(username);
        setLogs(logsData.logs || []);

        // Only check friend status if it's not the current user's profile
        const currentUsername = localStorage.getItem("username");
        if (username !== currentUsername) {
          const statusData = await getFriendStatus(username);
          setFriendStatus(statusData);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleFriendAction = async () => {
    try {
      if (friendStatus.status === "not_friends") {
        await sendFriendRequest(username);
        setFriendStatus({ status: "request_sent" });
      } else if (friendStatus.status === "friends") {
        await removeFriend(username);
        setFriendStatus({ status: "not_friends" });
      }
    } catch (err) {
      console.error("Error with friend action:", err);
      alert("Failed to perform friend action. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      playing: {
        bg: "linear-gradient(135deg, #f39c12, #e67e22)",
        text: "white",
      },
      completed: {
        bg: "linear-gradient(135deg, #27ae60, #229954)",
        text: "white",
      },
      wishlist: {
        bg: "linear-gradient(135deg, #9b59b6, #8e44ad)",
        text: "white",
      },
      dropped: {
        bg: "linear-gradient(135deg, #e74c3c, #c0392b)",
        text: "white",
      },
    };
    return statusColors[status] || { bg: "#95a5a6", text: "white" };
  };

  if (loading) {
    return (
      <div
        className="container-fluid min-vh-100 py-4"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="container">
          <div className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: "#3498db", width: "3rem", height: "3rem" }}
            ></div>
            <p className="mt-3" style={{ color: "#7f8c8d" }}>
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div
        className="container-fluid min-vh-100 py-4"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="container">
          <div className="text-center py-5">
            <i
              className="bi bi-person-x display-1"
              style={{ color: "#bdc3c7" }}
            ></i>
            <h3 className="mt-3" style={{ color: "#2c3e50" }}>
              {error || "User not found"}
            </h3>
            <p style={{ color: "#7f8c8d" }}>
              {error
                ? "Please try again later."
                : "The user you're looking for doesn't exist."}
            </p>
            <button
              className="btn fw-bold px-4 py-2 rounded-3 mt-3"
              onClick={() => navigate(-1)}
              style={{
                background: "linear-gradient(135deg, #3498db, #9b59b6)",
                color: "white",
                border: "none",
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = username === localStorage.getItem("username");

  return (
    <div
      className="container-fluid min-vh-100 py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container">
        {/* Profile Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="custom-card p-5">
              <div className="row align-items-center">
                <div className="col-md-3 text-center mb-4 mb-md-0">
                  <div
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                    style={{
                      width: "120px",
                      height: "120px",
                      background: "linear-gradient(135deg, #3498db, #9b59b6)",
                      color: "white",
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>

                <div className="col-md-6">
                  <h1 className="fw-bold mb-2" style={{ color: "#2c3e50" }}>
                    {user.username}
                  </h1>
                  {user.profile?.bio && (
                    <p style={{ color: "#5d6d7e", lineHeight: "1.6" }}>
                      {user.profile.bio}
                    </p>
                  )}

                  <div className="row text-center mt-4">
                    <div className="col-4">
                      <div
                        className="fw-bold display-6"
                        style={{ color: "#3498db" }}
                      >
                        {user.total_games || 0}
                      </div>
                      <div style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                        Games
                      </div>
                    </div>
                    <div className="col-4">
                      <div
                        className="fw-bold display-6"
                        style={{ color: "#9b59b6" }}
                      >
                        {user.total_hours || 0}h
                      </div>
                      <div style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                        Hours
                      </div>
                    </div>
                    <div className="col-4">
                      <div
                        className="fw-bold display-6"
                        style={{ color: "#27ae60" }}
                      >
                        {user.friends_count || 0}
                      </div>
                      <div style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                        Friends
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 text-center text-md-end">
                  {!isOwnProfile && friendStatus && (
                    <button
                      className="btn fw-bold px-4 py-2 rounded-3 mb-3"
                      onClick={handleFriendAction}
                      style={{
                        background:
                          friendStatus.status === "friends"
                            ? "linear-gradient(135deg, #e74c3c, #c0392b)"
                            : friendStatus.status === "request_sent"
                            ? "linear-gradient(135deg, #f39c12, #e67e22)"
                            : "linear-gradient(135deg, #3498db, #9b59b6)",
                        color: "white",
                        border: "none",
                        transition: "all 0.3s ease",
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
                      {friendStatus.status === "friends" && "Remove Friend"}
                      {friendStatus.status === "request_sent" && "Request Sent"}
                      {friendStatus.status === "request_received" &&
                        "Accept Request"}
                      {friendStatus.status === "not_friends" && "Add Friend"}
                    </button>
                  )}

                  {user.profile?.location && (
                    <p className="mb-1" style={{ color: "#7f8c8d" }}>
                      <i className="bi bi-geo-alt me-2"></i>
                      {user.profile.location}
                    </p>
                  )}

                  {user.profile?.website && (
                    <p className="mb-0" style={{ color: "#7f8c8d" }}>
                      <i className="bi bi-link me-2"></i>
                      <a
                        href={user.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3498db" }}
                      >
                        Website
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="custom-card p-4">
              <div className="d-flex gap-4">
                <button
                  className={`btn fw-bold px-4 py-2 rounded-3 ${
                    activeTab === "games" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("games")}
                  style={{
                    background:
                      activeTab === "games"
                        ? "linear-gradient(135deg, #3498db, #9b59b6)"
                        : "transparent",
                    color: activeTab === "games" ? "white" : "#2c3e50",
                    border:
                      activeTab === "games" ? "none" : "2px solid #e9ecef",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-joystick me-2"></i>
                  Games ({logs.length})
                </button>

                {isOwnProfile && (
                  <button
                    className={`btn fw-bold px-4 py-2 rounded-3 ${
                      activeTab === "friends" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("friends")}
                    style={{
                      background:
                        activeTab === "friends"
                          ? "linear-gradient(135deg, #3498db, #9b59b6)"
                          : "transparent",
                      color: activeTab === "friends" ? "white" : "#2c3e50",
                      border:
                        activeTab === "friends" ? "none" : "2px solid #e9ecef",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i className="bi bi-people me-2"></i>
                    Friends
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "games" && (
          <GamesTab
            logs={logs}
            navigate={navigate}
            getStatusBadge={getStatusBadge}
            isOwnProfile={isOwnProfile}
            onReviewClick={setSelectedReview}
          />
        )}

        {activeTab === "friends" && isOwnProfile && <FriendsTab />}
      </div>

      {/* Review Popup */}
      <ReviewPopup
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}

// Games Tab Component
function GamesTab({
  logs,
  navigate,
  getStatusBadge,
  isOwnProfile,
  onReviewClick,
}) {
  if (logs.length === 0) {
    return (
      <div className="col-12">
        <div className="custom-card p-5 text-center">
          <i
            className="bi bi-joystick display-1"
            style={{ color: "#bdc3c7" }}
          ></i>
          <h4 className="mt-3" style={{ color: "#2c3e50" }}>
            {isOwnProfile ? "You haven't" : "This user hasn't"} logged any games
            yet
          </h4>
          <p style={{ color: "#7f8c8d" }}>
            {isOwnProfile
              ? "Start tracking your gaming journey!"
              : "Check back later to see their game collection."}
          </p>
          {isOwnProfile && (
            <button
              className="btn fw-bold px-4 py-2 rounded-3 mt-3"
              onClick={() => navigate("/")}
              style={{
                background: "linear-gradient(135deg, #3498db, #9b59b6)",
                color: "white",
                border: "none",
              }}
            >
              Discover Games
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {logs.map((log) => {
        const statusConfig = getStatusBadge(log.status);
        return (
          <div key={log.id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div
              className="custom-card h-100"
              style={{
                cursor: "pointer",
                height: "320px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="position-relative overflow-hidden"
                style={{ flex: "0 0 auto" }}
                onClick={() => navigate(`/game/${log.game.rawg_id}`)}
              >
                <img
                  src={
                    log.game.background_image ||
                    "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={log.game.name}
                  className="w-100"
                  style={{
                    height: "160px",
                    objectFit: "cover",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <span
                    className="badge fw-bold px-3 py-2 rounded-pill"
                    style={{
                      background: statusConfig.bg,
                      color: statusConfig.text,
                      fontSize: "0.7rem",
                    }}
                  >
                    {log.status}
                  </span>
                </div>
              </div>

              <div
                className="card-body d-flex flex-column p-3"
                style={{ flex: "1 1 auto" }}
              >
                <h6
                  className="card-title fw-bold mb-2 line-clamp-2"
                  style={{
                    color: "#2c3e50",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "40px",
                    lineHeight: "1.3",
                    fontSize: "0.9rem",
                  }}
                  onClick={() => navigate(`/game/${log.game.rawg_id}`)}
                >
                  {log.game.name}
                </h6>

                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="text-center">
                      <div
                        className="fw-bold small"
                        style={{ color: "#2c3e50" }}
                      >
                        {log.hours_played || 0}h
                      </div>
                      <div style={{ color: "#7f8c8d", fontSize: "0.7rem" }}>
                        Hours
                      </div>
                    </div>

                    <div className="text-center">
                      <div
                        className="fw-bold small d-flex align-items-center"
                        style={{ color: "#f39c12" }}
                      >
                        <i className="bi bi-star-fill me-1"></i>
                        {log.rating || "N/A"}
                      </div>
                      <div style={{ color: "#7f8c8d", fontSize: "0.7rem" }}>
                        Rating
                      </div>
                    </div>
                  </div>

                  {log.review && (
                    <div
                      className="mt-2 p-2 rounded-2"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => onReviewClick(log.review)}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#e9ecef";
                        e.target.style.borderColor = "#3498db";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#f8f9fa";
                        e.target.style.borderColor = "#e9ecef";
                      }}
                    >
                      <p
                        className="small mb-0 line-clamp-2 text-truncate"
                        style={{
                          color: "#7f8c8d",
                          fontStyle: "italic",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                        title="Click to read full review"
                      >
                        <i
                          className="bi bi-chat-quote me-1"
                          style={{ color: "#3498db" }}
                        ></i>
                        "{log.review}"
                      </p>
                      <div className="text-end mt-1">
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Click to read full review
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Friends Tab Component
function FriendsTab() {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [friendsData, pendingData] = await Promise.all([
          getFriends(),
          getPendingRequests(),
        ]);
        setFriends(friendsData.friends || []);
        setPendingRequests(pendingData.pending_requests || []);
      } catch (err) {
        console.error("Error fetching friends data:", err);
        setError("Failed to load friends data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsData();
  }, []);

  if (loading) {
    return (
      <div className="col-12">
        <div className="text-center py-4">
          <div className="spinner-border" style={{ color: "#3498db" }}></div>
          <p className="mt-2" style={{ color: "#7f8c8d" }}>
            Loading friends...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-12">
        <div className="text-center py-4">
          <i
            className="bi bi-exclamation-triangle display-1"
            style={{ color: "#bdc3c7" }}
          ></i>
          <p className="mt-2" style={{ color: "#7f8c8d" }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="col-12 mb-4">
          <div className="custom-card p-4">
            <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
              <i className="bi bi-clock me-2"></i>
              Pending Friend Requests ({pendingRequests.length})
            </h5>
            <div className="row g-3">
              {pendingRequests.map((request) => (
                <PendingRequestCard
                  key={request.id}
                  request={request}
                  onUpdate={() => window.location.reload()}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="col-12">
        <div className="custom-card p-4">
          <h5 className="fw-bold mb-3" style={{ color: "#2c3e50" }}>
            <i className="bi bi-people me-2"></i>
            Friends ({friends.length})
          </h5>
          {friends.length === 0 ? (
            <div className="text-center py-4">
              <i
                className="bi bi-people display-1"
                style={{ color: "#bdc3c7" }}
              ></i>
              <h6 className="mt-3" style={{ color: "#2c3e50" }}>
                No friends yet
              </h6>
              <p style={{ color: "#7f8c8d" }}>
                Start adding friends to see them here!
              </p>
              <button
                className="btn fw-bold px-4 py-2 rounded-3 mt-2"
                onClick={() => (window.location.href = "/friends/search")}
                style={{
                  background: "linear-gradient(135deg, #3498db, #9b59b6)",
                  color: "white",
                  border: "none",
                }}
              >
                Find Friends
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {friends.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Friend Card Component
function FriendCard({ friend }) {
  const navigate = useNavigate();

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div
        className="custom-card p-3 d-flex align-items-center"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/profile/${friend.username}`)}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #3498db, #9b59b6)",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          {friend.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-grow-1">
          <h6 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>
            {friend.username}
          </h6>
          <p className="mb-0 small" style={{ color: "#7f8c8d" }}>
            {friend.total_games || 0} games • {friend.total_hours || 0}h played
          </p>
        </div>
      </div>
    </div>
  );
}

// Pending Request Card Component
function PendingRequestCard({ request, onUpdate }) {
  const handleAccept = async () => {
    try {
      await acceptFriendRequest(request.id);
      onUpdate();
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert("Failed to accept friend request.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectFriendRequest(request.id);
      onUpdate();
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      alert("Failed to reject friend request.");
    }
  };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="custom-card p-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{
              width: "50px",
              height: "50px",
              background: "linear-gradient(135deg, #3498db, #9b59b6)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            {request.from_user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h6 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>
              {request.from_user?.username || "Unknown User"}
            </h6>
            <p className="mb-0 small" style={{ color: "#7f8c8d" }}>
              Wants to be friends
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm fw-bold rounded-pill"
            onClick={handleAccept}
            style={{
              background: "linear-gradient(135deg, #27ae60, #229954)",
              color: "white",
              border: "none",
              width: "35px",
              height: "35px",
            }}
          >
            <i className="bi bi-check"></i>
          </button>
          <button
            className="btn btn-sm fw-bold rounded-pill"
            onClick={handleReject}
            style={{
              background: "linear-gradient(135deg, #e74c3c, #c0392b)",
              color: "white",
              border: "none",
              width: "35px",
              height: "35px",
            }}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

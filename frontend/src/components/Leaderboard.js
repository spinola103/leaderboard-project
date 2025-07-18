import React, { useState, useEffect} from "react";
import Confetti from "react-confetti"; // install: npm install react-confetti
import { FaTrophy, FaMoon, FaSun } from "react-icons/fa";
import "../App.css";

const Leaderboard = ({ users = [], onProfileClick }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [prevTopUserId, setPrevTopUserId] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);

  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);
  const top3 = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3);

  // Detect when top1 changes to trigger confetti
  useEffect(() => {
    if (top3.length === 0) return;
    if (top3[0]._id !== prevTopUserId) {
      setPrevTopUserId(top3[0]._id);
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 3000);
    }
  }, [top3, prevTopUserId]);

  // Toast auto dismiss
  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  // Handle dark mode toggle
  const toggleDarkMode = () => setDarkMode((d) => !d);

  // Simulate a points claim (you can wire this with your real claims)
  const handleClaimPoints = (user) => {
    // For demo: just show toast & modal
    setToastMsg(`Successfully claimed points for ${user.name}!`);
    setModalUser(user);
  };

  // Ripple effect on button click
  const rippleEffectHandler = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const d = Math.max(button.clientWidth, button.clientHeight);
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${d}px`;
    circle.style.left = `${e.clientX - rect.left - d / 2}px`;
    circle.style.top = `${e.clientY - rect.top - d / 2}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
  };

  return (
    <div className={`leaderboard-app ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <header className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <button
          className="dark-toggle-btn"
          onClick={toggleDarkMode}
          aria-label={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      {/* Podium */}
      <section className="podium" role="list" aria-label="Top 3 players podium">
        {top3.map((user, index) => (
          <div
            key={user._id}
            className={`podium-slot rank-${index + 1}`}
            role="listitem"
            tabIndex={0}
            onClick={() => onProfileClick(user)}
            onKeyDown={(e) => e.key === "Enter" && onProfileClick(user)}
            aria-label={`Rank ${index + 1}. ${user.name} with ${user.totalPoints} points`}
          >
            {index === 0 && (
              <div className="crown floating" aria-hidden="true">
                👑
              </div>
            )}
            <div className="avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={`${user.name}'s avatar`} />
              ) : (
                <div className="initials">{user.name[0]}</div>
              )}
            </div>
            <div className="podium-name">{user.name}</div>
            <div className="podium-points">
              <FaTrophy
                style={{
                  color:
                    index === 0
                      ? "#FFD700"
                      : index === 1
                      ? "#C0C0C0"
                      : "#cd7f32",
                  marginRight: 6,
                }}
                aria-hidden="true"
              />
              {user.totalPoints} pts
            </div>
            <button
              className="claim-points-btn"
              onClick={(e) => {
                e.stopPropagation();
                rippleEffectHandler(e);
                handleClaimPoints(user);
              }}
              aria-label={`Claim points for ${user.name}`}
            >
              Claim
            </button>
          </div>
        ))}
        {confettiActive && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={150}
            gravity={0.3}
            colors={["#FFD700", "#C0C0C0", "#cd7f32"]}
          />
        )}
      </section>

      {/* Rank List */}
      <section
        className="rank-list"
        role="list"
        aria-label="Leaderboard ranks 4 and below"
      >
        {rest.map((user, index) => (
          <div
            key={user._id}
            className="rank-card slide-in"
            role="listitem"
            tabIndex={0}
            onClick={() => onProfileClick(user)}
            onKeyDown={(e) => e.key === "Enter" && onProfileClick(user)}
            aria-label={`Rank ${index + 4}. ${user.name} with ${user.totalPoints} points`}
          >
            <div className="rank-num">{index + 4}</div>
            <div className="avatar-sm">
              {user.avatar ? (
                <img src={user.avatar} alt={`${user.name}'s avatar`} />
              ) : (
                <div className="initials">{user.name[0]}</div>
              )}
            </div>
            <div className="rank-info">
              <div className="rank-name">{user.name}</div>
              <div className="rank-points">
                <FaTrophy color="#FFD700" aria-hidden="true" /> {user.totalPoints} pts
              </div>
            </div>
            <button
              className="claim-points-btn-small"
              onClick={(e) => {
                e.stopPropagation();
                rippleEffectHandler(e);
                handleClaimPoints(user);
              }}
              aria-label={`Claim points for ${user.name}`}
            >
              Claim
            </button>
          </div>
        ))}
      </section>

      {/* Toast Notification */}
      {toastMsg && <Toast message={toastMsg} />}

      {/* User Modal */}
      {modalUser && (
        <UserModal user={modalUser} onClose={() => setModalUser(null)} />
      )}

      {/* Fixed bottom nav */}
      <nav
        className="bottom-nav"
        aria-label="Primary navigation"
        role="navigation"
      >
        <button aria-label="Home" className="nav-btn">
          🏠
        </button>
        <button aria-label="Profile" className="nav-btn">
          👤
        </button>
        <button aria-label="Notifications" className="nav-btn">
          🔔
        </button>
      </nav>
    </div>
  );
};

// Toast component with slide and bounce
const Toast = ({ message }) => {
  return (
    <div className="toast-notification" role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

// User modal (blur background + zoom in)
const UserModal = ({ user, onClose }) => {
  // Mock claim history - replace with API data if needed
  const pointClaims = [
    { id: 1, date: "2025-07-18", points: 50 },
    { id: 2, date: "2025-07-17", points: 100 },
    { id: 3, date: "2025-07-15", points: 75 },
  ];

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <h2 id="modalTitle">{user.name}'s Point Claim History</h2>
        <ul className="claim-history-list">
          {pointClaims.map((claim) => (
            <li key={claim.id}>
              <span>{claim.date}</span>{" "}
              <strong>+{claim.points} pts</strong>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="btn-close-modal" aria-label="Close modal">
          Close
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;

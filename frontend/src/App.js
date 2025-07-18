import React, { useEffect, useState, useCallback } from "react";
import Confetti from "react-confetti";
import {
  FaTrophy,
  FaMoon,
  FaSun,
  FaHome,
  FaUser,
  FaBell,
  FaUserPlus,
  FaCoins,
} from "react-icons/fa";
import AddUser from "./components/AddUser";
import ClaimPoints from "./components/ClaimPoints";
import API from "./api";
import "./App.css";

/**
 * User History Modal - Blur background + zoom in modal
 */
const UserHistoryModal = ({ user, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await API.get(`/claims/history/${user._id}`);
        setHistory(res.data);
      } catch {
        setHistory([]);
      }
    }
    fetchHistory();
  }, [user]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div className="modal-box" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
        <h2 id="modalTitle">{user.name}&apos;s Point Claim History</h2>
        {history.length ? (
          <ul className="claim-history-list">
            {history.map((record) => (
              <li key={record._id || record.id}>
                <span>{new Date(record.timestamp || record.date).toLocaleString()}</span>
                <strong>+{record.pointsClaimed || record.points} pts</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-history">No claim history available.</p>
        )}
        <button className="btn-close-modal" onClick={onClose} aria-label="Close modal">
          Close
        </button>
      </div>
    </div>
  );
};

/**
 * Toast Notification with slide & bounce animation
 */
const Toast = ({ message }) => (
  <div className="toast-notification" role="alert" aria-live="assertive">
    {message}
  </div>
);

/**
 * Main App
 */
export default function App() {
  // STATE
  const [users, setUsers] = useState([]);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [prevTopUserId, setPrevTopUserId] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);

  // Fetch leaderboard users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get("/users/leaderboard");
      setUsers(res.data.map((u) => ({ ...u, totalPoints: u.totalPoints || 0 })));
    } catch {
      setToastMsg("Failed to load users.");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle showing user claim history modal
  const handleShowHistory = (user) => {
    setSelectedUserForHistory(user);
    setShowHistoryModal(true);
  };

  // Toast dismiss
  useEffect(() => {
    if (!toastMsg) return;
    const timeout = setTimeout(() => setToastMsg(null), 3500);
    return () => clearTimeout(timeout);
  }, [toastMsg]);

  // Dark Mode toggle
  const toggleDarkMode = () => setDarkMode((d) => !d);

  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);
  const top3 = sortedUsers.slice(0, 3);
  const rest = sortedUsers.slice(3);

  // Confetti trigger on top 1 change
  useEffect(() => {
    if (top3.length === 0) return;
    if (prevTopUserId !== null && top3[0]._id !== prevTopUserId) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 3000);
    }
    setPrevTopUserId(top3[0]._id);
  }, [top3, prevTopUserId]);

  return (
    <div className="app-outer-container">
      <div className={`app-container ${darkMode ? "dark" : "light"}`}>
        {/* Confetti - positioned to show only within mobile layout */}
        {confettiActive && (
          <Confetti
            width={480}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={100}
            gravity={0.25}
            colors={["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"]}
            confettiSource={{
              x: 240,
              y: 0,
              w: 10,
              h: 10
            }}
          />
        )}

        {/* Fixed header */}
        <header className="app-header" role="banner">
          <h1 tabIndex={-1}>🏆 Leaderboard</h1>
          <button
            onClick={toggleDarkMode}
            aria-label={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
            className="dark-mode-toggle"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </header>

        {/* Main scrollable content area */}
        <main className="main-content">
          {/* Add User input component */}
          <section className="input-section">
            <h2>
              <FaUserPlus /> Add New User
            </h2>
            <AddUser
              onUserAdded={() => {
                fetchUsers();
                setToastMsg("User added successfully!");
              }}
            />
          </section>

          {/* Claim Points component */}
          <section className="input-section">
            <h2>
              <FaCoins /> Claim Points
            </h2>
            <ClaimPoints
              users={users}
              onClaimed={() => {
                fetchUsers();
                setToastMsg("Points claimed successfully!");
              }}
            />
          </section>

          {/* Leaderboard podium */}
          <section
            className="podium"
            role="list"
            aria-label="Top 3 players podium"
            tabIndex={-1}
          >
            {top3.map((user, i) => (
              <article
                key={user._id}
                className={`podium-slot rank-${i + 1}`}
                onClick={() => handleShowHistory(user)}
                tabIndex={0}
                role="listitem"
                aria-label={`Rank ${i + 1}. ${user.name} with ${user.totalPoints} points`}
                onKeyDown={(e) => e.key === "Enter" && handleShowHistory(user)}
              >
                {i === 0 && <div className="crown floating">👑</div>}
                <div className="avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={`${user.name}'s avatar`} loading="lazy" />
                  ) : (
                    <div className="initials" aria-hidden="true">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="podium-name">{user.name}</div>
                <div className="podium-points">
                  <FaTrophy
                    aria-hidden="true"
                    style={{
                      color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : "#cd7f32",
                      marginRight: "6px",
                    }}
                  />
                  {user.totalPoints} pts
                </div>
              </article>
            ))}
          </section>

          {/* Rank list scrollable */}
          <section
            className="rank-list"
            role="list"
            aria-label="Leaderboard ranks 4 and beyond"
            tabIndex={-1}
          >
            {rest.map((user, idx) => (
              <article
                key={user._id}
                className="rank-card slide-in"
                tabIndex={0}
                role="listitem"
                onClick={() => handleShowHistory(user)}
                onKeyDown={(e) => e.key === "Enter" && handleShowHistory(user)}
                aria-label={`Rank ${idx + 4}. ${user.name} with ${user.totalPoints} points`}
              >
                <div className="rank-num">{idx + 4}</div>
                <div className="avatar-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt={`${user.name}'s avatar`} loading="lazy" />
                  ) : (
                    <div className="initials" aria-hidden="true">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="rank-info">
                  <p className="rank-name">{user.name}</p>
                  <p className="rank-points">
                    <FaTrophy aria-hidden="true" color="#FFD700" /> {user.totalPoints} pts
                  </p>
                </div>
              </article>
            ))}
          </section>
        </main>

        {/* Toast notification */}
        {toastMsg && <Toast message={toastMsg} />}

        {/* User claim history modal */}
        {showHistoryModal && selectedUserForHistory && (
          <UserHistoryModal
            user={selectedUserForHistory}
            onClose={() => setShowHistoryModal(false)}
          />
        )}

        {/* Fixed bottom navigation */}
        <nav
          className="bottom-nav"
          aria-label="Primary navigation"
          role="navigation"
        >
          <button aria-label="Home" className="nav-btn">
            <FaHome />
          </button>
          <button aria-label="Profile" className="nav-btn">
            <FaUser />
          </button>
          <button aria-label="Notifications" className="nav-btn">
            <FaBell />
          </button>
        </nav>
      </div>
    </div>
  );
}
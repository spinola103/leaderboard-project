import React, { useState } from 'react';
import API from '../api';


function ClaimPoints({ users, onClaimed }) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [claimedPoints, setClaimedPoints] = useState(null);

  const handleClaim = async () => {
    if (!selectedUserId) return;
    try {
      const res = await API.post(`/api/claims/${selectedUserId}`);
      setClaimedPoints(res.data.pointsClaimed);
      onClaimed(); // Notify parent to refresh leaderboard
    } catch (err) {
      console.error('Claim error:', err);
    }
  };

  return (
    <div className="claim-points">
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={handleClaim} disabled={!selectedUserId}>
        Claim Points
      </button>

      {claimedPoints && (
        <p className="claim-result">
          🎉 {claimedPoints} points awarded!
        </p>
      )}
    </div>
  );
}

export default ClaimPoints;

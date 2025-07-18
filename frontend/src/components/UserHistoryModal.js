import React, { useEffect, useState } from 'react';
import API from '../api';

function UserHistoryModal({ user, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await API.get(`/claims/history/${user._id}`);
      setHistory(res.data);
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Claim History for {user.name}</h3>
        <ul>
          {history.map((item) => (
            <li key={item._id}>
              +{item.pointsClaimed} points at {new Date(item.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UserHistoryModal;

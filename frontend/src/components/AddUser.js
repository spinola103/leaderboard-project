import React, { useState } from 'react';
import API from '../api';
import "../App.css";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState('');

  const handleAdd = async () => {
    if (!name) return;
    await API.post('/api/users', { name });
    setName('');
    onUserAdded();
  };

  return (
    <div className="add-user">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add new user" />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddUser;

import React from 'react';

export function Authenticated({ userName, onLogout }) {
  return (
    <div>
      <h2>Welcome, {userName}!</h2>
      <button className="btn btn-danger mt-3" onClick={onLogout}>Logout</button>
    </div>
  );
}

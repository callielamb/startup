import React, { useState } from 'react';

export function Unauthenticated({ onLogin }) {
  const [userName, setUserName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(userName);
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="form-group mb-3">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          className="form-control"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your username"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
}

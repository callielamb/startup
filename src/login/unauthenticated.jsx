import React, { useState } from 'react';

export function Unauthenticated({ onLogin }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [displayError, setDisplayError] = useState(null);

  // Handle Login
  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  // Handle Account Creation
  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  // Shared Logic for Login and Create
  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ username: userName, password: password }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    if (response?.status === 200) {
      // Successful login or account creation
      localStorage.setItem('userName', userName);
      onLogin(userName);
    } else {
      // Handle error
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <div className="container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          loginUser();
        }}
      >
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
        <div className="form-group mb-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary" disabled={!userName || !password}>
            Login
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={createUser}
            disabled={!userName || !password}
          >
            Create
          </button>
        </div>
      </form>

      {/* Error Message Display */}
      {displayError && (
        <div className="alert alert-danger mt-3" role="alert">
          {displayError}
        </div>
      )}
    </div>
  );
}

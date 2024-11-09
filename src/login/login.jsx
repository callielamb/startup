import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { AuthState } from '../AuthState';

export function Login({ userName, authState, onAuthChange }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // check if user and pass are provided
    if (usernameInput && passwordInput) {
      onAuthChange(usernameInput, AuthState.Authenticated);
      navigate('/home'); // Redirect to home after login
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleCreate = () => {
    if (usernameInput && passwordInput) {
      // For now, treat 'Create' the same as 'Login' for authentication
      onAuthChange(usernameInput, AuthState.Authenticated);
      navigate('/home'); // Redirect to home after account creation
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <main className="container-fluid d-flex align-items-center justify-content-center vh-100">
      <div className="main-content card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <img src="nobackground.png" className="logo-image img-fluid my-3 mx-auto d-block" alt="Circle with pencil logo" width="100" height="100" />
        <section id="login">
          <h3 className="text-center">Login to Play</h3>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">Login</button>
              <button type="button" className="btn btn-secondary" onClick={handleCreate}>Create</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

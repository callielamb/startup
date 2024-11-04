// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Add custom styles for the Login page

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username); // Pass the username back to App.js to handle authentication
      localStorage.setItem('userName', username); // Store in localStorage
      navigate('/home'); // Redirect to the Home page after login
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <div className="login-page">
      {/* Custom Navbar for Login Page */}
      <header>
        <nav className="navbar login-navbar">
          <div className="container-fluid d-flex justify-content-between">
            <Link className="navbar-brand" to="/about">
              <h1 className="h3">In A Blink</h1>
            </Link>
            <ul className="nav">
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Login Form */}
      <main className="container-fluid d-flex align-items-center justify-content-center vh-100">
        <div className="main-content card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <img src={`${process.env.PUBLIC_URL}/nobackground.png`} className="logo-image img-fluid my-3 mx-auto d-block" alt="Circle with pencil logo" width="100" height="100" />
          <section id="login">
            <h3 className="text-center">Login to Play</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">Login</button>
                <button type="button" className="btn btn-secondary">Create Account</button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;

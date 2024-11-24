import React, { useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Login } from './login/login.jsx';
import { Play } from './play/game.jsx';
import { About } from './about/about.jsx';
import { Home } from './home/home.jsx';
import { Lobby } from './play/lobby/lobby.jsx';
import { Draw } from './play/drawing/drawing.jsx';
import { Vote } from './play/voting/voting.jsx';
import { Results } from './play/results/results.jsx';
import { AuthState } from './login/AuthState.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const storedUserName = localStorage.getItem('userName');
  return storedUserName ? children : <Navigate to="/" replace />;
};

export default function App() {
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState('');

  // Check for existing authentication on load
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
      setAuthState(AuthState.Authenticated);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, []);

  const handleAuthChange = async (newUserName, newAuthState) => {
    setAuthState(newAuthState);
    setUserName(newUserName);
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      
      if (response.ok) {
        localStorage.removeItem('userName');
        setUserName('');
        setAuthState(AuthState.Unauthenticated);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server call fails
      localStorage.removeItem('userName');
      setUserName('');
      setAuthState(AuthState.Unauthenticated);
    }
  };

  // Show loading state while checking authentication
  if (authState === AuthState.Unknown) {
    return (
      <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header className="navbar bg-light py-3 mb-4">
          <div className="container-fluid d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <NavLink className="navbar-brand" to={authState === AuthState.Authenticated ? "/home" : "/"}>
                <h1 className="h3">In A Blink</h1>
              </NavLink>
              {authState === AuthState.Authenticated && (
                <div className="d-flex align-items-center">
                  <span className="text-dark mx-3">
                    <strong>{userName}</strong>
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <nav className="d-flex align-items-center">
              <ul className="nav">
                {authState === AuthState.Authenticated ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/home">Home</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/play">Play</NavLink>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/">Login/Register</NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about">About</NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <Routes>
          <Route 
            path="/" 
            element={
              authState === AuthState.Authenticated ? 
                <Navigate to="/home" replace /> : 
                <Login 
                  userName={userName} 
                  authState={authState} 
                  onAuthChange={handleAuthChange} 
                />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/play" 
            element={
              <ProtectedRoute>
                <Play />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vote" 
            element={
              <ProtectedRoute>
                <Vote />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/draw" 
            element={
              <ProtectedRoute>
                <Draw />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lobby" 
            element={
              <ProtectedRoute>
                <Lobby />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="bg-light text-black-50 py-1 mt-3">
          <div className="container text-center">
            <span className="text-reset">Callie Lambourne</span>
            <a className="text-reset ms-2" href="https://github.com/callielamb/startup.git">GitHub</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}
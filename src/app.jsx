import React, { useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './login/login.jsx';
import { Play } from './play/game.jsx';
import { Leaderboard } from './leaderboard/leaderboard.jsx';
import { About } from './about/about.jsx';
import { Home } from './home/home.jsx';
import { Lobby } from './play/lobby/lobby.jsx';
import { Draw } from './play/drawing/drawing.jsx';
import { Vote } from './play/voting/voting.jsx';
import { Results } from './play/results/results.jsx';
import { AuthState } from './AuthState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function App() {
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState('');

  // Check local storage on initial load to determine if the user is logged in
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
      setAuthState(AuthState.Authenticated);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, []);

  // Handle authentication changes
  const handleAuthChange = (newUserName, newAuthState) => {
    setAuthState(newAuthState);
    setUserName(newUserName);
    if (newAuthState === AuthState.Authenticated) {
      localStorage.setItem('userName', newUserName);
    } else {
      localStorage.removeItem('userName');
    }
  };

  //redirects to login if not authenticated
  const PrivateRoute = ({ children }) => {
    return authState === AuthState.Authenticated ? children : <Navigate to="/" />;
  };

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
                <button
                  className="btn btn-secondary ms-3"
                  onClick={() => handleAuthChange('', AuthState.Unauthenticated)}
                >
                  Logout
                </button>
              )}
            </div>
            <nav>
              <ul className="nav">
                {authState === AuthState.Authenticated ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/home">Home</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/play">Play</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink>
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
          {/* Public Routes */}
          <Route
            path="/"
            element={<Login userName={userName} authState={authState} onAuthChange={handleAuthChange} />}
          />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/play" element={<PrivateRoute><Play /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          <Route path="/vote" element={<PrivateRoute><Vote /></PrivateRoute>} />
          <Route path="/draw" element={<PrivateRoute><Draw /></PrivateRoute>} />
          <Route path="/lobby" element={<PrivateRoute><Lobby /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />

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

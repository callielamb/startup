import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { AuthState } from './AuthState';
import { Authenticated } from './authenticated';

export function Login({ userName, authState, onAuthChange }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [displayError, setDisplayError] = useState(null);
  const navigate = useNavigate();

  async function loginOrCreate(endpoint) {
    try {
      const response = await fetch(`/api/auth/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify({ 
          username: usernameInput, 
          password: passwordInput 
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.setItem('userName', usernameInput);
        onAuthChange(usernameInput, AuthState.Authenticated);
        navigate('/home');
      } else {
        const body = await response.json();
        if (endpoint === 'login' && response.status === 401) {
          setDisplayError('Invalid username or password. New user? Try creating an account.');
        } else if (endpoint === 'create' && response.status === 409) {
          setDisplayError('Username already exists. Please try logging in instead.');
        } else {
          setDisplayError(`Error: ${body.msg}`);
        }
      }
    } catch (err) {
      setDisplayError('Unable to connect to the server. Please try again later.');
      onAuthChange(null, AuthState.Unauthenticated);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput && passwordInput) {
      loginOrCreate('login');
    } else {
      setDisplayError('Please enter both username and password');
    }
  };

  const handleCreate = () => {
    if (usernameInput && passwordInput) {
      loginOrCreate('create');
    } else {
      setDisplayError('Please enter both username and password');
    }
  };

  // Show loading state when auth state is unknown
  if (authState === AuthState.Unknown) {
    return (
      <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container-fluid d-flex align-items-center justify-content-center vh-100">
      <div className="main-content card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <img src="nobackground.png" className="logo-image img-fluid my-3 mx-auto d-block" alt="Circle with pencil logo" width="100" height="100" />
        
        {authState === AuthState.Authenticated ? (
          <Authenticated
            userName={userName}
            onLogout={() => {
              localStorage.removeItem('userName');
              onAuthChange(null, AuthState.Unauthenticated);
            }}
          />
        ) : (
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
              
              {displayError && (
                <div className="alert alert-danger" role="alert">
                  {displayError}
                </div>
              )}

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">Login</button>
                <button type="button" className="btn btn-secondary" onClick={handleCreate}>Create</button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
// src/components/Game.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Game.css';

function Game() {
  // State to manage available games and form inputs
  const [availableGames, setAvailableGames] = useState([]);
  const [serverName, setServerName] = useState('');
  const [hostStatus, setHostStatus] = useState('Public');
  const [password, setPassword] = useState('');
  const [playerNumber, setPlayerNumber] = useState('3');

  // Load available games from localStorage on initial render
  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('availableGames')) || [];
    setAvailableGames(savedGames);
  }, []);

  // Save available games to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('availableGames', JSON.stringify(availableGames));
  }, [availableGames]);

  // Handle server creation
  const handleCreateGame = (e) => {
    e.preventDefault();
    if (serverName.trim()) {
      const newGame = {
        name: serverName,
        status: hostStatus,
        password: hostStatus === 'Private' ? password : null,
        playerNumber,
      };

      setAvailableGames([...availableGames, newGame]);
      setServerName('');
      setHostStatus('Public');
      setPassword('');
      setPlayerNumber('3');
    }
  };

  // Conditionally render password field based on host status
  const renderPasswordField = () => {
    if (hostStatus === 'Private') {
      return (
        <div className="mb-2">
          <label htmlFor="privserverkey">Server Password:</label>
          <input
            type="password"
            id="privserverkey"
            name="privserverkey"
            className="form-control"
            placeholder="Password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Navbar */}
      <header className="navbar bg-light py-3 mb-4">
        <div className="container-fluid d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand" to="/home">
              <h1 className="h3">In A Blink</h1>
            </Link>
            <Link to="/" className="btn btn-secondary ms-3">Logout</Link>
          </div>
          <nav>
            <ul className="nav">
              <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/game">Play</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/leaderboard">Leaderboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/">Login/Register</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="row">
          {/* Join Game Section */}
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title text-center">Join a Game</h3>
                {availableGames.length > 0 ? (
                  <ul className="list-group">
                    {availableGames.map((game, index) => (
                      <li key={index} className="list-group-item">
                        {game.name} ({game.status}) - Players: {game.playerNumber}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No available servers. Try creating your own!</p>
                )}
              </div>
            </div>
          </div>

          {/* Host Game Section */}
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title text-center">Host a Game</h3>
                <form onSubmit={handleCreateGame}>
                  <div className="mb-2">
                    <label htmlFor="server-name">Server Name:</label>
                    <input
                      type="text"
                      id="server-name"
                      name="server-name"
                      className="form-control"
                      placeholder="Server name here"
                      required
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="host-status">Host Status:</label>
                    <select
                      id="host-status"
                      name="host-status"
                      className="form-select"
                      value={hostStatus}
                      onChange={(e) => setHostStatus(e.target.value)}
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                  {renderPasswordField()}
                  <div className="mb-2">
                    <label htmlFor="player-number">Number of Players:</label>
                    <select
                      id="player-number"
                      name="player-number"
                      className="form-select"
                      value={playerNumber}
                      onChange={(e) => setPlayerNumber(e.target.value)}
                    >
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Create Game</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Game;

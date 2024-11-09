import React, { useState } from 'react';
import './lobby.css';

export function Lobby() {
  const [gameType, setGameType] = useState(''); // Track the selected game type
  const [password, setPassword] = useState(''); // Track the password input

  const handleGameTypeChange = (event) => {
    setGameType(event.target.value);
    setPassword(''); // Reset the password when the game type changes
  };

  return (
    <main className="container-fluid d-flex flex-column align-items-center justify-content-center">
      <div className="card text-center p-4 shadow-lg">
        <h3 className="card-title">Game Starting Soon...</h3>
        
        <label htmlFor="gameType">Select Game Type:</label>
        <select 
          id="gameType" 
          className="form-select mb-3" 
          value={gameType} 
          onChange={handleGameTypeChange}
        >
          <option value="">Choose Game Type</option>
          <option value="public">Public Game</option>
          <option value="private">Private Game</option>
        </select>

        {/* Conditionally render the password input if "Private Game" is selected */}
        {gameType === 'private' && (
          <div className="form-group mb-3">
            <label htmlFor="password">Enter Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter game password"
            />
          </div>
        )}

        <a href="/draw" className="btn btn-primary mt-3">Start Game</a>
      </div>

      <div className="player-grid mt-4">
        <div className="card player-card p-2 mb-3">
          <h5 className="text-center">Player 1</h5>
        </div>
        <div className="card player-card p-2 mb-3">
          <h5 className="text-center">Player 2</h5>
        </div>
        <div className="card player-card p-2 mb-3">
          <h5 className="text-center">Player 3</h5>
        </div>
        <div className="card player-card p-2 mb-3">
          <h5 className="text-center">Player 4</h5>
        </div>
        <div className="card player-card p-2 mb-3">
          <h5 className="text-center">Player 5</h5>
        </div>
        <div className="card player-card p-2 mb-3">
          <h5 className="text-center">Player 6</h5>
        </div>
      </div>

      <a href="/play" className="btn btn-danger mt-4">Leave Server</a>
    </main>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './lobby.css';

export function Lobby() {
  const [serverName, setServerName] = useState('');
  const [playerCount, setPlayerCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear game image
    sessionStorage.removeItem('gameImage');
    fetch('/api/resetImage');
    
    // Get game settings from sessionStorage
    const storedServerName = sessionStorage.getItem('serverName');
    const storedPlayerCount = sessionStorage.getItem('playerCount');
    
    if (!storedServerName) {
      // If no server name is found, redirect back to game setup
      navigate('/play');
      return;
    }
    
    setServerName(storedServerName);
    setPlayerCount(parseInt(storedPlayerCount || '3'));
  }, [navigate]);

  return (
    <main className="d-flex flex-column justify-content-center align-items-center">
      <div className="card text-center p-4 shadow-lg" style={{ width: "300px" }}>
        <h3 className="card-title">Game Starting Soon...</h3>
        <h4 className="card-subtitle mb-2 text-muted">{serverName}</h4>
        <p className="card-text">[Waiting for players to join.]</p>
        <a href="/draw" className="btn btn-primary mt-3">Start Game</a>
      </div>
      <div className="player-grid mt-4">
        {[...Array(playerCount)].map((_, index) => (
          <div key={index} className="card player-card p-2 mb-3">
            <h5 className="text-center">Player {index + 1}</h5>
          </div>
        ))}
      </div>
      <a href="/play" className="btn btn-danger mt-4">Leave Server</a>
    </main>
  );
}

export default Lobby;
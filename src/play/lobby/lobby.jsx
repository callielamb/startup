import React, { useEffect } from 'react';
import './lobby.css';

export function Lobby() {
  useEffect(() => {
        sessionStorage.removeItem('gameImage');
        fetch('/api/resetImage');
    }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <main className="d-flex flex-column justify-content-center align-items-center">
      <div className="card text-center p-4 shadow-lg" style={{ width: "300px" }}>
        <h3 className="card-title">Game Starting Soon...</h3>
        <p className="card-text">[Waiting for players to join.]</p>
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

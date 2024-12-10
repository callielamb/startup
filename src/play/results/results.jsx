import React, { useState, useEffect } from 'react';
import './results.css';

export function Results() {
  const [winner, setWinner] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState('');

  useEffect(() => {
    const storedWinner = JSON.parse(sessionStorage.getItem('gameWinner'));
    setWinner(storedWinner);
    setOriginalImageUrl(sessionStorage.getItem('gameImage') || '');
  }, []);

  return (
    <div className="results-container">
      {winner && (
        <>
          <h2>{winner.username} is the Winner!</h2>
          <div className="comparison">
            <div>
              <h4>Original Image</h4>
              <img src={originalImageUrl} alt="Original" />
            </div>
            <div>
              <h4>{winner.username}'s Drawing</h4>
              <img src={winner.imageData} alt="Winner's Drawing" />
            </div>
          </div>
        </>
      )}
      <a href="/lobby" className="btn">Back to Lobby</a>
    </div>
  );
}

export default Results;

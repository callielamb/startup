import React from 'react';
import './results.css';

export function Results({ winnerName, originalImageUrl, winnerImageUrl }) {
  return (
    <main className="container my-5 text-center">
      {/* Winner's Name */}
      <h2 className="winner-name mb-4">{winnerName} is the Winner!</h2>
      
      {/* Side-by-Side Comparison */}
      <div className="d-flex justify-content-center align-items-center">
        <div className="comparison-box mx-3">
          <h4>Original Drawing</h4>
          <div className="image-placeholder">
            <img src={originalImageUrl} alt="Original drawing" className="img-fluid" />
          </div>
        </div>

        <div className="comparison-box mx-3">
          <h4>{winnerName}'s Drawing</h4>
          <div className="image-placeholder">
            <img src={winnerImageUrl} alt={`${winnerName}'s drawing`} className="img-fluid" />
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <a href="/lobby" className="btn btn-secondary">Back to Lobby</a>
      </div>
    </main>
  );
}

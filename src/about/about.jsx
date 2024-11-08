import React from 'react';
import './about.css';

export function About() {
  return (
    <main className='container-fluid text-center'>
        <div className="about-section text-center p-4 rounded shadow-sm" style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h2>
                <img src="multiplayer.png" alt="Group of cartoon people to represent multiplayer" width="50" height="50" />
                About In A Blink
                <img src="timer2.png" alt="Stop Watch" width="50" height="50" />
            </h2>
            <p>In A Blink is a fun, fast-paced multiplayer drawing game where players recreate images from memory. Each round, a random image is displayed for a few seconds, and players then draw what they remember. Afterward, participants vote on whose drawing is the most accurate or creative.</p>
            
            <h3>Features:</h3>
            <ul className="list-unstyled">
                <li>Multiplayer gameplay</li>
                <li>Time-limited drawing challenges</li>
                <li>Real-time voting and leaderboard</li>
            </ul>
        </div>
    </main>
  );
}
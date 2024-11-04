import React from 'react';
import './About.css';

export function About() {
  // No dynamic content to load

  return (
    <main className="container">
      <div className="about-section text-center p-4 rounded shadow-sm">
        <h2>
          <img src={`${process.env.PUBLIC_URL}/multiplayer.png`} alt="Multiplayer" width="50" height="50" />
          About In A Blink
          <img src={`${process.env.PUBLIC_URL}/timer2.png`} alt="Stop Watch" width="50" height="50" />
        </h2>
        
        {/* Primary Description */}
        <p>In A Blink is a fun, fast-paced multiplayer drawing game where players recreate images from memory. Each round, a random image is displayed for a few seconds, and players then draw what they remember. Afterward, participants vote on whose drawing is the most accurate or creative.</p>

        {/* Feature List */}
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

export default About;

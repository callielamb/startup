// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <main className="container text-center">
      <h2>Welcome to</h2>
      <img src={`${process.env.PUBLIC_URL}/inablink.png`} className="img-fluid my-3" alt="In a Blink logo with a pencil" width="200" height="200" />

      <div className="homepage-box">
        <p className="lead">Compete with your friends to recreate images from memory. You get just a few seconds to see the image, then it's up to you to draw it!</p>
        <p className="ready">Ready to draw?</p>
        <Link to="/play" className="btn btn-primary">Start a game!</Link>
      </div>
    </main>
  );
}

export default Home;

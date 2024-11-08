import React from 'react';
import './home.css';

export function Home() {
  return (
    <main className="container text-center">
            <h2>Welcome to</h2>
            <img src="INABLINK.png" className="img-fluid my-3" alt="In a Blink logo with a pencil" width="200" height="200" />

            <div className="homepage-box">
                <p className="lead">Compete with your friends to recreate images from memory. You get just a few seconds to see the image, then it's up to you to draw it!</p>
                
                <p className="ready">Ready to draw?</p>
                <a href="/play" className="btn btn-primary">Start a game!</a>
            </div>
        </main>
  );
}
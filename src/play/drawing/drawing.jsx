import React from 'react';
import './drawing.css';

export function Draw() {
  return (
    <main className="container-fluid">
        <p className="lead text-center">Once the drawing is done, you'll vote on your favorite recreation!</p>
        
        <div id="timer" className="d-flex justify-content-center mb-4">
            <div className="timer-box text-center p-2">
                <h3>Time Left: 00:00</h3> 
            </div>
        </div>

        <div className="d-flex justify-content-center">
            <canvas id="drawingCanvas" className="canvas" width="800" height="400">Your browser does not support the HTML5 canvas element.</canvas>
            <p>canvas</p>
        </div>

        <section className="my-4 text-center">
            <h4>Real-Time Updates</h4>
            <p>[WebSocket Data Placeholder]</p>
            <p>Also in the future, there will be 2 popups: 1 for instructions and the other to show the drawing the user will replicate</p>
        </section>

        <div className="text-center">
            <a href="/vote" className="btn btn-primary mt-4">Submit Drawing</a>
        </div>
    </main>
  );
}

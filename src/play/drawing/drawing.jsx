import React, { useState, useEffect, useRef } from 'react';
import './drawing.css';

export function Draw() {
  const [imageUrl, setImageUrl] = useState('placeholder.jpg'); // Image to replicate
  const [showImage, setShowImage] = useState(false); // Controls visibility of the image
  const [showMessage, setShowMessage] = useState(true); // Controls the "Get ready" message
  const [timer, setTimer] = useState(10); // Countdown timer for image display
  const canvasRef = useRef(null); // Ref to access the canvas
  const ctxRef = useRef(null); // Ref to store the canvas context
  const isDrawingRef = useRef(false); // Track if the user is currently drawing

  useEffect(() => {
    // Display "Get ready to memorize!" for 2 seconds
    const startDelay = setTimeout(() => {
      setShowMessage(false); 
      setShowImage(true); 

      // Start the countdown once the image is shown
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setShowImage(false); 
            clearInterval(countdown); // Stop the timer
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 2000); // 2-second delay

    
    return () => {
      clearTimeout(startDelay);
    };
  }, []);

  // Initialize the canvas context only when the canvas is displayed
  useEffect(() => {
    if (!showImage && !showMessage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctxRef.current = ctx;

      // Set the canvas background to white
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set drawing styles
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000000';
    }
  }, [showImage, showMessage]);

  // Handle mouse events for drawing
  const startDrawing = (e) => {
    isDrawingRef.current = true;
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const ctx = ctxRef.current;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const endDrawing = () => {
    isDrawingRef.current = false;
    ctxRef.current.closePath();
  };

  return (
    <main className="container-fluid">
      <p className="lead text-center">
        Once the drawing is done, you'll vote on your favorite recreation!
      </p>
      
      {/* Timer Display */}
      <div id="timer" className="d-flex justify-content-center mb-4">
        <div className="timer-box text-center p-2">
          <h3>Time Left: {showImage ? `00:${timer.toString().padStart(2, '0')}` : '00:00'}</h3>
        </div>
      </div>

      {/* Display Message, Image, or "Time's Up" */}
      <div className="d-flex justify-content-center mb-4">
        {showMessage ? (
          <p className="text-center"><strong>Get ready to memorize!</strong></p>
        ) : showImage ? (
          <div id="picture" className="picture-box">
            <img src={imageUrl} alt="Image to replicate" className="img-fluid" />
          </div>
        ) : (
          <p className="text-center">Time's up! Start your drawing below.</p>
        )}
      </div>

      {/* Conditional Canvas Display */}
      {!showImage && !showMessage && (
        <div className="d-flex justify-content-center">
          <canvas
            id="drawingCanvas"
            className="canvas"
            width="800"
            height="400"
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
          >
            Your browser does not support the HTML5 canvas element.
          </canvas>
        </div>
      )}

      {/* Real-Time Updates Section */}
      <section className="my-4 text-center">
        <h4>Real-Time Updates</h4>
        <p>[WebSocket Data Placeholder]</p>
      </section>

      {/* Submit Button */}
      <div className="text-center">
        <a href="/vote" className="btn btn-primary mt-4">Submit Drawing</a>
      </div>
    </main>
  );
}

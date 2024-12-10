import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './voting.css';

export function Vote() {
  const [drawings, setDrawings] = useState([]);
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws');
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'GET_DRAWINGS',
        serverId: sessionStorage.getItem('serverId'),
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'GAME_DRAWINGS':
          setDrawings(data.drawings);
          break;
        case 'GAME_RESULTS':
          sessionStorage.setItem('gameWinner', JSON.stringify(data.winner));
          navigate('/results');
          break;
        default:
          console.warn('Unhandled message:', data);
      }
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [navigate]);

  const handleVote = (drawingUserId) => {
    if (socket) {
      socket.send(JSON.stringify({
        type: 'SUBMIT_VOTE',
        serverId: sessionStorage.getItem('serverId'),
        voterId: getUserId(),
        votedDrawingUserId: drawingUserId,
      }));
    }
  };

  return (
    <div className="container">
      <h3>Original Image</h3>
      <img src={originalImageUrl} alt="Original" className="img-fluid" />
      <div className="drawings-grid">
        {drawings.map((drawing) => (
          <button key={drawing.userId} onClick={() => handleVote(drawing.userId)}>
            <h5>{drawing.username}</h5>
            <img src={drawing.imageData} alt="Drawing" className="img-fluid" />
          </button>
        ))}
      </div>
    </div>
  );
}

function getUserId() {
  return localStorage.getItem('userId') || 'userID is broken';
}

export default Vote;

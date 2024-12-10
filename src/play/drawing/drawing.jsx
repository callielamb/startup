import React, { useState, useEffect, useRef } from 'react';
import './drawing.css';

export function Draw() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/ws');
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'JOIN_GAME',
        serverId: sessionStorage.getItem('serverId'),
        userId: getUserId(),
        username: getUsername(),
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'VOTING_START') navigate('/vote');
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <div>
      <canvas></canvas>
      <button>Submit</button>
    </div>
  );
}

export default Draw;

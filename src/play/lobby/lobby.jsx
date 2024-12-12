import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './lobby.css';

export function Lobby() {
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [serverName, setServerName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [hostUsername, setHostUsername] = useState('');
  const { serverId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear game image
    sessionStorage.removeItem('gameImage');
    fetch('/api/resetImage');

    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);    
    ws.onopen = () => {
      const userId = getUserId();
      const username = getUsername();
      
      // Join lobby
      ws.send(JSON.stringify({
        type: 'JOIN_LOBBY',
        serverId: serverId,
        userId: userId,
        username: username,
      }));

      // Fetch server details to get server name and host info
      fetch(`/api/serverDetails/${serverId}`)
        .then(response => {
          console.log('FRONTEND: Response status:', response.status);
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.error || 'Failed to fetch server details');
            });
          }
          return response.json();
        })
        .then(data => {
          console.log('FRONTEND: Server details:', data)
          setServerName(data.name);
          setHostUsername(data.hostUsername);
          setIsHost(data.hostUsername === getUsername());
        })
        .catch(error => {
          console.error('FRONTEND: Detailed error fetching server details:', error);
          alert(`Could not fetch server details: ${error.message}. Please try again.`);
        });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'LOBBY_PLAYERS_UPDATE') {
        setPlayers(data.players);
      }
      
      if (data.type === 'GAME_STARTED') {
        navigate('/draw');
      }
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [serverId, navigate]);

  const startGame = () => {
    if (socket && isHost) {
      fetch('/api/startGame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverId })
      })
      .then(response => {
        if (response.ok) {
          socket.send(JSON.stringify({
            type: 'START_GAME',
            serverId: serverId,
          }));
        } else {
          throw new Error('Failed to start game');
        }
      })
      .catch(error => {
        console.error('Error starting game:', error);
        alert('Failed to start game. Please ensure you have enough players.');
      });
    }
  };

  const leaveServer = () => {
    if (socket) {
      socket.send(JSON.stringify({
        type: 'LEAVE_LOBBY',
        serverId: serverId,
        userId: getUserId(),
      }));
      
      // Navigate back to play page
      navigate('/play');
    }
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center">
      <div className="card text-center p-4 shadow-lg" style={{ width: "300px", marginBottom: "20px" }}>
        <h3 className="card-title">Game Starting Soon...</h3>
        <h4 className="card-subtitle mb-2 text-muted">{serverName}</h4>
        <p className="card-text">[Waiting for players to join.]</p>
        
        {isHost && (
          <button 
            onClick={startGame} 
            className="btn btn-primary mt-3"
            disabled={players.length < 2}
          >
            Start Game
          </button>
        )}
        
        <button 
          onClick={leaveServer} 
          className="btn btn-danger mt-3"
        >
          Leave Server
        </button>
      </div>
      
      <div className="player-grid mt-4">
        {[...Array(6)].map((_, index) => {
          const player = players[index];
          const isPlayerHost = player && player.username === hostUsername;
          return (
            <div 
              key={index} 
              className={`card player-card p-2 mb-3 ${player ? 'player-joined' : ''}`}
            >
              {player ? (
                <h5 className="text-center">
                  {player.username}
                  {isPlayerHost && <span className="badge bg-primary ms-2">Host</span>}
                </h5>
              ) : (
                <h5 className="text-center text-muted">Waiting for player...</h5>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function getUserId() {
  return localStorage.getItem('userId') || 'userid broken';
}

function getUsername() {
  return localStorage.getItem('username') || 'username broken';
}

export default Lobby;
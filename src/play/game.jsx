import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Play() {
  // State for creating a new server
  const [serverName, setServerName] = useState('');

  // State for available servers
  const [availableServers, setAvailableServers] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket('ws://localhost:4000/ws');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      // Request initial list of servers
      fetch('/api/getServers')
        .then((res) => res.json())
        .then((data) => {
          console.log('Initial servers:', data);
          setAvailableServers(data);
        })
        .catch((err) => console.error('Error fetching servers:', err));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      
      switch (data.type) {
        case 'NEW_SERVER':
          setAvailableServers((prev) => {
            // Check if server already exists to avoid duplicates
            const exists = prev.some(server => server.id === data.server.id);
            return exists 
              ? prev 
              : [...prev, data.server];
          });
          break;
        case 'SERVER_UPDATED':
          // Handle updates like new players joining or host changing
          setAvailableServers((prev) =>
            prev.map((server) => 
              server.id === data.server.id 
                ? { ...server, ...data.server } 
                : server
            )
          );
          break;
        case 'SERVER_REMOVED':
          // Remove server from available servers
          setAvailableServers((prev) => 
            prev.filter((server) => server.id !== data.serverId)
          );
          break;
        default:
          console.warn('Unhandled WebSocket message:', data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const createServer = (e) => {
    e.preventDefault();
    
    if (!serverName.trim()) {
      alert('Please enter a server name');
      return;
    }

    fetch('/api/createServer', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverName }) 
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Server created:', data);
        
        // Send WebSocket message to broadcast new server
        if (socket) {
          socket.send(JSON.stringify({ 
            type: 'NEW_SERVER', 
            server: { 
              id: data.id, 
              name: data.name || serverName,
              hostUsername: data.hostUsername,
              players: 1, 
              maxPlayers: 6,
              status: 'LOBBY' 
            } 
          }));
        }
        
        // Navigate to lobby
        navigate(`/lobby/${data.id}`);
      })
      .catch((err) => {
        console.error('Error creating server:', err);
        alert('Failed to create server. Please try again.');
      });
  };

  const joinServer = (serverId) => {
    fetch('/api/joinServer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId }),
    })
      .then((res) => {
        if (res.ok) {
          navigate(`/lobby/${serverId}`);
        } else {
          console.error('Error joining server:', res);
          alert('Failed to join server. Please try again.');
        }
      })
      .catch((err) => {
        console.error('Error joining server:', err);
        alert('Failed to join server. Please check your connection.');
      });
  };

  return (
    <main className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title text-center">Join a Game</h3>
              <p>Select from the available games below:</p>
              <ul className="list-group">
                {availableServers.length > 0 ? (
                  availableServers.map((server) => (
                    <li 
                      key={server.id} 
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{server.name || 'Unnamed Server'}</strong>
                        <div className="text-muted small">
                          Host: {server.hostUsername}
                        </div>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {server.players} / {server.maxPlayers}
                      </span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => joinServer(server.id)}
                        disabled={server.players >= server.maxPlayers || server.status !== 'LOBBY'}
                      >
                        Join
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No servers available</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <form onSubmit={createServer}>
                <h3 className="card-title text-center">Host a Game</h3>
                <div className="mb-3">
                  <label htmlFor="server-name" className="form-label">Server Name</label>
                  <input 
                    type="text" 
                    id="server-name" 
                    name="server-name" 
                    className="form-control" 
                    placeholder="Enter server name" 
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Create Game</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Play;
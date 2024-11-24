import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Play() {
  const [hostStatus, setHostStatus] = useState('Public');
  const [serverName, setServerName] = useState('');
  const [serverPassword, setServerPassword] = useState('');
  const [playerCount, setPlayerCount] = useState('3');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!serverName) {
      alert('Please enter a server name');
      return;
    }
    
    if (hostStatus === 'Private' && !serverPassword) {
      alert('Please enter a server password for private games');
      return;
    }
    
    // Store game settings in sessionStorage
    sessionStorage.setItem('serverName', serverName);
    sessionStorage.setItem('playerCount', playerCount);
    
    // Navigate to lobby
    navigate('/lobby');
  };

  return (
    <main className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Join a Game</h3>
              <p>Select from the available games below:</p>
              <ul id="available-games" className="list-group">
                <li className="list-group-item">[Available Game Placeholder 1]</li>
                <li className="list-group-item">[Available Game Placeholder 2]</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <h3 className="card-title text-center">Host a Game</h3>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <label htmlFor="server-name">Server Name: </label>
                    <input 
                      type="text" 
                      id="server-name" 
                      name="server-name" 
                      className="form-control" 
                      placeholder="Server name here" 
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      required 
                    />
                  </li>
                  <li className="mb-2">
                    <label htmlFor="host-status">Host Status: </label>
                    <select 
                      id="host-status" 
                      name="host-status" 
                      className="form-select"
                      value={hostStatus}
                      onChange={(e) => setHostStatus(e.target.value)}
                    >
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </li>
                  {hostStatus === 'Private' && (
                    <li className="mb-2">
                      <label htmlFor="privserverkey">Server Password: </label>
                      <input 
                        type="password" 
                        id="privserverkey" 
                        name="privserverkey" 
                        className="form-control" 
                        placeholder="Password here"
                        value={serverPassword}
                        onChange={(e) => setServerPassword(e.target.value)}
                        required
                      />
                    </li>
                  )}
                  <li className="mb-2">
                    <label htmlFor="player-number">Number of Players: </label>
                    <select 
                      id="player-number" 
                      name="player-number" 
                      className="form-select"
                      value={playerCount}
                      onChange={(e) => setPlayerCount(e.target.value)}
                    >
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                    </select>
                  </li>
                </ul>
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
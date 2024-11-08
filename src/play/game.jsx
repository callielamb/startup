import React from 'react';
import './game.css';

export function Play() {
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
                            <h3 className="card-title text-center">Host a Game</h3>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <label htmlFor="server-name">Server Name: </label>
                                    <input type="text" id="server-name" name="server-name" className="form-control" placeholder="Server name here" required />
                                </li>
                                <li className="mb-2">
                                    <label htmlFor="host-status">Host Status: </label>
                                    <select id="host-status" name="host-status" className="form-select">
                                        <option selected>Public</option>
                                        <option>Private</option>
                                    </select>
                                </li>
                                <li className="mb-2">
                                    <label htmlFor="privserverkey">Server Password: </label>
                                    <input type="password" id="privserverkey" name="privserverkey" className="form-control" placeholder="Password here" />
                                </li>
                                <li className="mb-2">
                                    <label htmlFor="player-number">Number of Players: </label>
                                    <select id="player-number" name="player-number" className="form-select">
                                        <option selected>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                    </select>
                                </li>
                            </ul>
                            <a href= "/lobby" className="btn btn-primary w-100">Create Game</a> 
                        </div>
                    </div>
                </div>
            </div>
        </main>
  );
}
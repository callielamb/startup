import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login.jsx';
import { Play } from './play/game.jsx';
import { Leaderboard } from './leaderboard/leaderboard.jsx';
import { About } from './about/about.jsx';
import { Home } from './home/home.jsx';
import { Lobby } from './play/lobby/lobby.jsx';
import { Draw } from './play/drawing/drawing.jsx';
import { Vote } from './play/voting/voting.jsx';
import { Results } from './play/results/results.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function App() {
    return (
    <BrowserRouter>   
        <div className='body bg-dark text-light'>
            <header className="navbar bg-light py-3 mb-4">
                <div className="container-fluid d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <NavLink className="navbar-brand" to="/home">
                            <h1 className="h3">In A Blink</h1>
                        </NavLink>
                        <NavLink to="/" className="btn btn-secondary ms-3">Logout</NavLink>
                    </div>
                    <nav>
                        <ul className="nav">
                            <li className="nav-item"><NavLink className="nav-link" to="/home">Home</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/play">Play</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/play" element={<Play />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/vote" element={<Vote />} />
                <Route path="/draw" element={<Draw />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/results" element={<Results />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
    
            <footer className="bg-light text-black-50 py-1 mt-3">
                <div className="container text-center">
                    <span className="text-reset">Callie Lambourne</span>
                    <a className="text-reset ms-2" href="https://github.com/callielamb/startup.git">GitHub</a>
                </div>
            </footer>
        </div>
    </BrowserRouter>
    );
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}
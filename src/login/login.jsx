import React from 'react';
import './login.css';

export function Login() {
  return (
    <main className="container-fluid d-flex align-items-center justify-content-center vh-100">
      <div className="main-content card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <img src="nobackground.png" className="logo-image img-fluid my-3 mx-auto d-block" alt="Circle with pencil logo" width="100" height="100" />
        <section id="login">
          <h3 className="text-center">Login to Play</h3>
          <form method="get" action="home.html">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" className="form-control" id="username" name="username" placeholder="Enter your username" required />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password">Password:</label>
              <input type="password" className="form-control" id="password" name="password" placeholder="Enter your password" required />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">Login</button>
              <button type="submit" className="btn btn-secondary">Create</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

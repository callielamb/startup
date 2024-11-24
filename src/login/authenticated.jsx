import React from 'react';
import { useNavigate } from 'react-router-dom';


export function Authenticated({ userName, onLogout }) {
  function logout() {
    // Call the logout API and handle local storage cleanup
    fetch(`/api/auth/logout`, {
      method: 'DELETE',
    })
      .catch(() => {
        // Handle logout failure gracefully (e.g., offline mode)
        console.error('Logout failed. Assuming offline.');
      })
      .finally(() => {
        // Clear user data and trigger the onLogout callback
        localStorage.removeItem('userName');
        onLogout();
      });
  }

  return (
    <div>
      <h2>Welcome, {userName}!</h2>
      <button className="btn btn-danger mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

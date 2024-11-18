import React, { useEffect, useState } from 'react';

export function Leaderboard({ currentUser }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userScore, setUserScore] = useState(0); // Store the current user's score

  useEffect(() => {
    // Fetch leaderboard data from the backend
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setLeaderboard(data);  // Set leaderboard data
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    // Fetch the current user's score
    const fetchUserScore = async () => {
      try {
        const response = await fetch(`/api/score?username=${currentUser}`);
        const data = await response.json();
        setUserScore(data.score); // Set the current user's score
      } catch (error) {
        console.error('Error fetching user score:', error);
      }
    };

    fetchLeaderboard();
    fetchUserScore();
  }, [currentUser]);

  const scoreRows = leaderboard.map((entry, index) => (
    <tr key={index}>
      <td>{index + 1}</td> {/* Rank starts from 1 */}
      <td>{entry.username}</td> {/* Display username */}
      <td>{entry.score}</td>
      <td>{entry.date}</td> {/* You can format the date if necessary */}
    </tr>
  ));

  return (
    <main className="container my-5">
      <h2 className="text-center">Leaderboard</h2>
      {/* Display current user's score */}
      <h4 className="text-center">Your Score: {userScore}</h4>
      
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scoreRows}
        </tbody>
      </table>
    </main>
  );
}

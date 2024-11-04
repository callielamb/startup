import React from 'react';
import './Leaderboard.css';

export function Leaderboard() {
  // State for leaderboard scores
  const [scores, setScores] = React.useState([]);

  // Load scores from localStorage or other data source on mount
  React.useEffect(() => {
    const scoresText = localStorage.getItem('scores');
    if (scoresText) {
      setScores(JSON.parse(scoresText));
    }
  }, []);

  // Render rows based on the scores array
  const scoreRows = scores.length ? (
    scores.map((score, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{score.name}</td>
        <td>{score.score}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3">No scores available. Be the first to score!</td>
    </tr>
  );

  return (
    <main className="container my-5">
      <h2 className="text-center mb-4">Leaderboard</h2>
      <table className="table table-striped table-bordered shadow leaderboard-table">
        <thead className="thead-light">
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>{scoreRows}</tbody>
      </table>
    </main>
  );
}

export default Leaderboard;

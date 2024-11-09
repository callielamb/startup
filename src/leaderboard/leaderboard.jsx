import React, { useEffect, useState } from 'react';

export function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Retrieve scores from local storage
    const storedScores = JSON.parse(localStorage.getItem('scores')) || [];
    setScores(storedScores);
  }, []);

  const scoreRows = [];
  if (scores.length) {
    for (const [i, score] of scores.entries()) {
      scoreRows.push(
        <tr key={i}>
          <td>{i + 1}</td> {/* Rank starts from 1 */}
          <td>{score.name.split('@')[0]}</td> {/* Display name before "@" */}
          <td>{score.score}</td>
          <td>{score.date}</td>
        </tr>
      );
    }
  } else {
    scoreRows.push(
      <tr key='0'>
        <td colSpan='4'>Be the first to score</td>
      </tr>
    );
  }

  return (
    <main className="container my-5">
      <h2 className="text-center">Leaderboard</h2>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{scoreRows}</tbody>
      </table>
    </main>
  );
}

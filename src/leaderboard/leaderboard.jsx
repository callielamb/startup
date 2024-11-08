import React from 'react';
import './leaderboard.css';

export function Leaderboard() {
  return (
    <main className="container my-5">
                {/* Leaderboard Section */}
                <h2 className="text-center mb-4">Leaderboard</h2>
                <table className="table table-striped table-bordered shadow leaderboard-table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Rank</th>
                            <th scope="col">Player</th>
                            <th scope="col">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>[Player Name Placeholder]</td>
                            <td>[Score Placeholder]</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>[Player Name Placeholder]</td>
                            <td>[Score Placeholder]</td>
                        </tr>
                        {/* More rows as needed */}
                    </tbody>
                </table>

                {/* Gallery Section */}
                <section className="your-gallery p-4 my-5 shadow">
                    <h3>Your Gallery</h3>
                    <p className="text-muted">[Displays your drawings from past games (maybe)]</p>
                </section>
    </main>
  );
}
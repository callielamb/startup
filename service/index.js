const express = require('express');
const fetch = require('node-fetch'); // To fetch the image from picsum
const path = require('path');
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Serve static files from the 'build' directory (React build folder)
app.use(express.static(path.join(__dirname, 'build')));

// Store the image URL temporarily in memory for the round
let currentRoundImage = '';

// Fetch image URL for the round from Picsum API
app.get('/api/getImage', async (req, res) => {
  try {
    if (!currentRoundImage) {
      const response = await fetch('https://picsum.photos/200');
      currentRoundImage = response.url;  // Store the image URL for the round
    }
    res.json({ imageUrl: currentRoundImage });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

// Reset the round image when the user returns to the lobby
app.get('/api/resetImage', (req, res) => {
  currentRoundImage = '';  // Reset the image for the next round
  res.status(204).end();
});

let userScore = {}; // Store the user's score by username

// Endpoint to update the current user's score
app.post('/api/updateScore', (req, res) => {
  const { username, points } = req.body;
  
  if (!userScore[username]) {
    userScore[username] = 0;  // Initialize score if it's the first time
  }
  
  userScore[username] += points; // Add points to the current user's score
  res.status(200).send({ message: 'Score updated' });
});

// Endpoint to get the leaderboard
app.get('/api/leaderboard', (req, res) => {
  const leaderboardArray = Object.entries(userScore)
    .map(([username, score]) => ({ username, score }))
    .sort((a, b) => b.score - a.score); // Sort by score descending
  res.json(leaderboardArray);
});

// Endpoint to get the score of a specific user
app.get('/api/score', (req, res) => {
  const username = req.query.username;  // Fetch the username from query params
  const score = userScore[username] || 0;  // Return the user's score (0 if not found)
  res.json({ score });
});

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html')); // Serve the React app
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const express = require('express');
const fetch = require('node-fetch'); // To fetch the image from picsum
const path = require('path');  // Import the 'path' module for serving static files
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); // Ensure static files are served from 'public'

app.use(express.json());

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

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

// Handle user score updates
let userScore = {}; 

app.post('/api/updateScore', (req, res) => {
  const { username, points } = req.body;
  
  if (!userScore[username]) {
    userScore[username] = 0;
  }
  userScore[username] += points;
  res.status(200).send({ message: 'Score updated' });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const leaderboardArray = Object.entries(userScore)
    .map(([username, score]) => ({ username, score }))
    .sort((a, b) => b.score - a.score);
  res.json(leaderboardArray);
});

// Serve the React app's index.html for any other route (handled by React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve index.html for any unmatched route
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

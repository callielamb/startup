const express = require('express');
const fetch = require('node-fetch'); // To fetch the image from picsum
const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Store the image URL temporarily in memory for the round
let currentRoundImage = '';

// Fetch image URL for the round from Picsum API
app.get('/api/getImage', async (req, res) => {
  try {
    // If no image exists for the round, fetch one
    if (!currentRoundImage) {
      // Fetch image from Picsum
      const response = await fetch('https://picsum.photos/200');  // Picsum API URL
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const fetch = require('node-fetch'); // To fetch the image from picsum
const path = require('path');  // Import the 'path' module for serving static files
const app = express();
const WebSocket = require('ws');
const http = require('http');
const { peerProxy } = require('./peerProxy.js');

const authCookieName = 'token';
const DB = require('./database.js');

// Store active game servers
const gameServers = new Map();

//create an HTTP server that will support websockets
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) =>{
  ws.on('message', (message) =>{
    const data = JSON.parse(message);

    switch(data.type){
      case 'JOIN_LOBBY':
        //add a user to a specific game server
        const server = gameServers.get(data.serverId);
        if (server){
          //track connedcted players
          if(!server.players) server.players = [];
          server.players.push({
            id: data.userId,
            username: data.username,
            ready: false
          });

          //updated player list to every player
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "LOBBY_PLAYERS_UPDATE",
                players: server.players,
                serverId: data.serverId
              }));
            }
          });
        }
        break;

      case 'START_GAME':
        //host starts the game
        const gameServer= gameServers.get(data.serverId);
        if (gameServer){
          gameServer.status = 'IN_PROGRESS';

          //broadcast game for every player
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "GAME_STARTED",
                serverId: data.serverId,
                players: gameServer.players
              }));
            }
          });
        }
        break;

      case 'SUBMIT_DRAWING':
        //store users drawing
        const drawingServer = gameServers.get(data.serverId);
        if (drawingServer) {
          if (!drawingServer.drawings) drawingServer.drawings = [];

          drawingServer.drawings.push({
            userId: data.userId,
            username: data.username,
            imageData: data.imageData
          });

          //broadcast drawings to all players
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'DRAWING_SUBMITTED',
                serverId: data.serverId,
                drawingsCount: drawingServer.drawings.length,
                totalPlayers: drawingServer.players.length
              }));
            }
          });
        }
        break;
      
      case 'SUBMIT_VOTE':
        const votingServer = gameServers.get(data.serverId);
        if (votingServer) {
          if (!votingServer.votes) votingServer.votes = {};
          
          // Track votes for each drawing
          if (!votingServer.votes[data.votedDrawingUserId]) {
            votingServer.votes[data.votedDrawingUserId] = 0;
          }
          votingServer.votes[data.votedDrawingUserId]++;

          // Check if all votes are in
          if (Object.keys(votingServer.votes).length === votingServer.players.length) {
            // Determine winner
            const winner = Object.entries(votingServer.votes).reduce(
              (a, b) => b[1] > a[1] ? b : a
            )[0];

            const winnerDrawing = votingServer.drawings.find(
              drawing => drawing.userId === winner
            );

            // Broadcast results to all players
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'GAME_RESULTS',
                  serverId: data.serverId,
                  winner: winnerDrawing,
                  votes: votingServer.votes
                }));
              }
            });
          }
        }
        break;
    }

  });

});




const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); // Ensure static files are served from 'public'

app.use(express.json());

//added
app.use(cookieParser());
app.set('trust proxy', true);

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Store the image URL temporarily in memory for the round
let currentRoundImage = '';

// Fetch image URL for the round from Picsum API
app.get('/api/getImage', async (req, res) => {
  try {
    if (!currentRoundImage) {
      const response = await fetch('https://picsum.photos/200');
      currentRoundImage = response.url;  
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

// Serve the React app's index.html for any other route (handled by React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve index.html for any unmatched route
});

//all the login code
// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser(req.body.username)) {
      res.status(409).send({ msg: 'Existing user' });
    } else {
      const user = await DB.createUser(req.body.username, req.body.password);
  
      // Set the cookie
      setAuthCookie(res, user.token);
  
      res.send({
        id: user._id,
      });
    }
});
// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser(req.body.username);
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        setAuthCookie(res, user.token);
        res.send({ id: user._id });
        return;
      }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});
  
// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// secureApiRouter verifies credentials for endpoints
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Default error handler
app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});
  
  // Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});
  
  // setAuthCookie in the HTTP response
  function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

const httpService = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

peerProxy(httpService);
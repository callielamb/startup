const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const http = require('http');
const { peerProxy } = require('./peerProxy');
const GameServer = require('./gameServer');

const app = express();
const server = http.createServer(app);

const port = process.argv.length > 2 ? process.argv[2] : 5000;

const authCookieName = 'token';

const DB = require('./database.js');

// Middleware setup
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.set('trust proxy', true);

const apiRouter = express.Router();
app.use('/api', apiRouter);

// Authentication APIs 
app.post('/api/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ id: user._id });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user.token);
    res.send({ id: user._id });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// API to create a new game server
app.post('/api/createServer', async (req, res) => {
  try {
    const authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { serverName } = req.body;
    const server = GameServer.createServer(user._id, user.username, serverName);
    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to join a game server
app.post('/api/joinServer', async (req, res) => {
  try {
    const { serverId } = req.body;
    console.log('Join server request:', { serverId });

    const authToken = req.cookies[authCookieName];
    console.log('Auth token:', authToken);

    const user = await DB.getUserByToken(authToken);
    
    if (!user) {
      console.error('Unauthorized join attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('User attempting to join:', user);

    const server = GameServer.joinServer(serverId, user._id, user.username);
    console.log('Server after join:', server);

    res.status(200).json(server);
  } catch (error) {
    console.error('Full error in join server:', error);
    res.status(400).json({ error: error.message });
  }
});

// player leaves the server
app.post('/api/leaveServer', async (req, res) => {
  try {
    const { serverId } = req.body;
    const authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const server = GameServer.leaveServer(serverId, user._id);
    
    if (server) {
      // Use broadcastToAll from peerProxy
      peerProxy.broadcastToAll({
        type: 'SERVER_UPDATED',
        server: {
          id: server.id,
          name: server.name,
          hostUsername: server.hostUsername,
          players: server.players.length,
          maxPlayers: server.maxPlayers,
          status: server.status
        }
      });
    }

    res.status(200).json(server);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API to start a game
app.post('/api/startGame', async (req, res) => {
  try {
    const { serverId } = req.body;
    const authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const server = GameServer.startGame(serverId, user._id);
    res.status(200).json(server);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API to submit a drawing
app.post('/api/submitDrawing', async (req, res) => {
  try {
    const { serverId, imageData } = req.body;
    const authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const server = GameServer.submitDrawing(serverId, user._id, user.username, imageData);
    res.status(200).json(server);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API to submit a vote
app.post('/api/submitVote', async (req, res) => {
  try {
    const { serverId, votedDrawingUserId } = req.body;
    const authToken = req.cookies[authCookieName];
    const user = await DB.getUserByToken(authToken);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = GameServer.submitVote(serverId, user._id, votedDrawingUserId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API to fetch active servers
app.get('/api/getServers', (req, res) => {
  const servers = GameServer.listAvailableServers();
  res.json(servers);
});

// Fetch random image for drawing prompt
app.get('/api/getImage', async (req, res) => {
  try {
    const response = await fetch('https://picsum.photos/200');
    const imageUrl = response.url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

app.get('/api/resetImage', async (req, res) => {
  try {
    const response = await fetch('https://picsum.photos/200');
    const imageUrl = response.url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error resetting image:', error);
    res.status(500).send('Error resetting image');
  }
});

// API to get server details
app.get('/api/serverDetails/:serverId', async (req, res) => {
  const { serverId } = req.params;
  console.log('Received server ID: ', serverId);
  console.log(`BACKEND: Fetching details for server ID: ${serverId}`);
  
  try {
    const server = GameServer.getServerDetails(serverId);
    console.log('BACKEND: Server details found:', server);
    res.json({
      id: server.id,
      name: server.name,
      hostUsername: server.hostUsername,
      hostId: server.hostId,
      status: server.status,
      players: server.players,
      maxPlayers: server.maxPlayers,
    });
  } catch (error) {
    console.error('BACKEND: Detailed error fetching server details:', error);
    res.status(404).json({ 
      error: error.message,
      details: 'Server not found or invalid server ID' 
    });
  }
});



app.delete('/api/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});



// Utility to set auth cookies
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

// Serve React app for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

peerProxy(httpService);
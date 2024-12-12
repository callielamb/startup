const { WebSocketServer } = require('ws');
const GameServer = require('./gameServer');

function peerProxy(httpServer) {
  // Create a WebSocket server attached to the HTTP server
  const wss = new WebSocketServer({ server: httpServer });

  // Track active connections
  const connections = new Map();

  // Track user-to-server mapping
  const userServers = new Map();

  wss.on('connection', (ws, req) => {
    // Unique identifier for this connection
    const connectionId = generateUniqueId();

    // Store the connection
    connections.set(connectionId, ws);

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        
        switch (parsedMessage.type) {
          case 'NEW_SERVER':
            handleNewServer(ws, parsedMessage.server);
            break;
          case 'GET_DRAWINGS':
            handleGetDrawings(ws, parsedMessage.serverId);
            break;
          case 'SUBMIT_DRAWING':
            handleSubmitDrawing(ws, parsedMessage);
            break;
          case 'SUBMIT_VOTE':
            handleSubmitVote(ws, parsedMessage);
            break;
          case 'LEAVE_SERVER':
            handleLeaveServer(ws, parsedMessage);
            break;
          default:
            console.warn('Unhandled message type:', parsedMessage.type);
        }
      } catch (error) {
        console.error('Error processing message:', error);
        ws.send(JSON.stringify({ 
          type: 'ERROR', 
          message: 'Invalid message format' 
        }));
      }
    });

    // Handle connection closure
    ws.on('close', () => {
      // Check if this user was in a server and remove them
      const serverId = userServers.get(connectionId);
      if (serverId) {
        const serverInstance = GameServer.servers.get(serverId);
        if (serverInstance) {
          // Automatically leave the server on connection close
          const updatedServer = GameServer.leaveServer(serverId, serverInstance.hostId);
          
          if (updatedServer) {
            // Broadcast server update
            broadcastToAll({
              type: 'SERVER_UPDATED',
              server: {
                id: updatedServer.id,
                name: updatedServer.name,
                hostUsername: updatedServer.hostUsername,
                players: updatedServer.players.length,
                maxPlayers: updatedServer.maxPlayers,
                status: updatedServer.status
              }
            });
          } else {
            // Server was completely dissolved
            broadcastToAll({
              type: 'SERVER_REMOVED',
              serverId
            });
          }
        }
        userServers.delete(connectionId);
      }
      connections.delete(connectionId);
    });
  });

  // Broadcast to all connected clients
  function broadcastToAll(message) {
    connections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // Handle new server creation
  function handleNewServer(ws, serverData) {
    // Broadcast the new server to all clients
    broadcastToAll({
      type: 'NEW_SERVER',
      server: {
        id: serverData.id,
        name: serverData.name,
        hostUsername: serverData.hostUsername,
        players: serverData.players || 1,
        maxPlayers: serverData.maxPlayers || 6,
        status: serverData.status || 'LOBBY'
      }
    });

    // Associate the connection with the server
    const connectionId = Array.from(connections.entries())
      .find(([, connection]) => connection === ws)?.[0];
    
    if (connectionId) {
      userServers.set(connectionId, serverData.id);
    }
  }

  // Handle leaving a server
  function handleLeaveServer(ws, { serverId, userId, username }) {
    console.log(`User ${username} (${userId}) leaving server ${serverId}`);
    const serverInstance = GameServer.leaveServer(serverId, userId);
    
    if (serverInstance) {
      console.log(`Server ${serverId} still active. Players remaining: ${serverInstance.players.length}`);
      // Server still exists, update clients
      broadcastToAll({
        type: 'SERVER_UPDATED',
        server: {
          id: serverInstance.id,
          name: serverInstance.name,
          hostUsername: serverInstance.hostUsername,
          players: serverInstance.players.length,
          maxPlayers: serverInstance.maxPlayers,
          status: serverInstance.status
        }
      });
    } else {
      console.log(`Server ${serverId} has been dissolved`)
      // Server was dissolved
      broadcastToAll({
        type: 'SERVER_REMOVED',
        serverId
      });
    }
  }

  // Handle getting drawings for a server
  function handleGetDrawings(ws, serverId) {
    try {
      const server = GameServer.servers.get(serverId);
      if (server && server.drawings) {
        ws.send(JSON.stringify({
          type: 'GAME_DRAWINGS',
          drawings: server.drawings
        }));
      }
    } catch (error) {
      console.error('Error getting drawings:', error);
    }
  }

  // Handle submitting a drawing
  function handleSubmitDrawing(ws, message) {
    try {
      const { serverId, userId, username, imageData } = message;
      const server = GameServer.submitDrawing(serverId, userId, username, imageData);
      
      // Broadcast drawings to all clients in this server
      broadcastToServer(serverId, {
        type: 'GAME_DRAWINGS',
        drawings: server.drawings
      });
    } catch (error) {
      console.error('Error submitting drawing:', error);
    }
  }

  // Handle submitting a vote
  function handleSubmitVote(ws, message) {
    try {
      const { serverId, voterId, votedDrawingUserId } = message;
      const result = GameServer.submitVote(serverId, voterId, votedDrawingUserId);
      
      // If all votes are in, broadcast results
      if (result.server.status === 'COMPLETED') {
        broadcastToServer(serverId, {
          type: 'GAME_RESULTS',
          winner: result.winner,
          votes: result.votes
        });
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: error.message
      }));
    }
  }

  // Generate a unique connection ID
  function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }

  return wss;
}

module.exports = { 
  peerProxy,
  broadcastToAll: (message) => {
    // Implementation of broadcastToAll
    connections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
};
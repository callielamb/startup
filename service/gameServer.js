const uuid = require('uuid');

class GameServer {
  constructor() {
    this.servers = new Map();
  }

  getServerDetails(serverId) {
    console.log('DEBUG: Attempting to get server details');
    console.log(`DEBUG: Requested Server ID: ${serverId}`);
    console.log('DEBUG: Current Server IDs:', Array.from(this.servers.keys()));

    // Validate serverId format
    if (!serverId || !serverId.startsWith('server-')) {
      console.error('DEBUG: Invalid server ID format');
      throw new Error('Invalid server ID format');
    }

    const server = this.servers.get(serverId);
    
    if (!server) {
      console.error(`DEBUG: Server with ID ${serverId} not found`);
      console.error('DEBUG: Servers currently in memory:', 
        JSON.stringify(Array.from(this.servers.entries()), null, 2)
      );
      throw new Error(`Server with ID ${serverId} not found`);
    }
    
    return {
      id: server.id,
      name: server.name,
      hostUsername: server.hostUsername,
      hostId: server.hostId,
      status: server.status,
      players: server.players,
      maxPlayers: server.maxPlayers
    };
  }

  createServer(hostId, hostUsername, serverName) {
    const serverId = `server-${uuid.v4()}`;
    const server = {
      id: serverId,
      hostId,
      hostUsername,
      name: serverName || 'Unnamed Server',
      players: [{ id: hostId, username: hostUsername }],
      status: 'LOBBY',
      uniquePlayerIds: new Set([hostId]),
      drawings: [],
      votes: {},
      createdAt: new Date(),
      maxPlayers: 6,
      minPlayersToStart: 3
    };
    this.servers.set(serverId, server);
    
    // Enhanced logging
    console.log('Creating server:', server);
    console.log('Current server map:', JSON.stringify(Array.from(this.servers.entries()), null, 2));
    
    return server;
  }

  joinServer(serverId, userId, username) {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error('Server not found... in join server');
    }

    if (server.players.length >= server.maxPlayers) {
      throw new Error('Server is full');
    }

    if (server.status !== 'LOBBY') {
      throw new Error('Game already in progress');
    }

    // Prevent duplicate joins
    if (!server.uniquePlayerIds.has(userId)) {
      server.players.push({ id: userId, username });
      server.uniquePlayerIds.add(userId);
    }

    return server;
  }

  leaveServer(serverId, userId) {
    const server = this.servers.get(serverId);
    if (!server) {
      console.error(`Attempt to leave non-existent server: ${serverId}`);
      return null;
    }
  
    server.players = server.players.filter((player) => player.id !== userId);
  
    server.uniquePlayerIds.delete(userId);

    // Check if host left and reassign
    if (server.hostId === userId) {
      if (server.players.length > 0) {
        const newHost = server.players[0];
        server.hostId = newHost.id;
        server.hostUsername = newHost.username;
        console.log(`Host left. New host: ${newHost.username}`);
      } else {
        // Set a timeout for server deletion
        server.deletionTimeout = setTimeout(() => {
          console.log(`Deleting empty server: ${serverId} after timeout`);
          this.servers.delete(serverId);
        }, 5 * 60 * 1000); // 5 minutes timeout
      }
    }
  
    // Clear any existing deletion timeout if players join
    if (server.deletionTimeout && server.players.length > 0) {
      clearTimeout(server.deletionTimeout);
      delete server.deletionTimeout;
    }
  
    return server;
  }

  startGame(serverId, hostId) {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error('Server not found... in start game');
    }

    if (server.hostId !== hostId) {
      throw new Error('Only host can start the game');
    }

    if (server.players.length < server.minPlayersToStart) {
      throw new Error(`Need at least ${server.minPlayersToStart} players to start`);
    }

    server.status = 'DRAWING';
    server.startedAt = new Date();
    server.drawings = [];
    server.votes = {};

    return server;
  }

  submitDrawing(serverId, userId, username, imageData) {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error('Server not found');
    }

    if (server.status !== 'DRAWING') {
      throw new Error('Cannot submit drawing at this time');
    }

    // Remove previous drawing if exists
    const existingDrawingIndex = server.drawings.findIndex(d => d.userId === userId);
    
    if (existingDrawingIndex !== -1) {
      server.drawings[existingDrawingIndex] = { userId, username, imageData };
    } else {
      server.drawings.push({ userId, username, imageData });
    }

    // Check if all players have drawn
    if (server.drawings.length === server.players.length) {
      server.status = 'VOTING';
    }

    return server;
  }

  submitVote(serverId, voterId, votedDrawingUserId) {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error('Server not found');
    }

    if (server.status !== 'VOTING') {
      throw new Error('Voting is not currently active');
    }

    // Prevent multiple votes from same user
    server.votes[voterId] = votedDrawingUserId;

    // Check if all players have voted
    if (Object.keys(server.votes).length === server.players.length) {
      return this.calculateGameResults(serverId);
    }

    return server;
  }

  calculateGameResults(serverId) {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error('Server not found');
    }

    // Count votes
    const voteCounts = server.drawings.reduce((acc, drawing) => {
      acc[drawing.userId] = 0;
      return acc;
    }, {});

    Object.values(server.votes).forEach(votedUserId => {
      voteCounts[votedUserId]++;
    });

    // Find winner
    const winner = server.drawings.reduce((max, drawing) => {
      return voteCounts[drawing.userId] > voteCounts[max.userId] ? drawing : max;
    });

    server.status = 'COMPLETED';
    server.winner = {
      ...winner,
      votes: voteCounts[winner.userId]
    };

    return {
      winner: server.winner,
      votes: voteCounts,
      server
    };
  }

  listAvailableServers() {
    return Array.from(this.servers.values())
      .filter(server => server.status === 'LOBBY')
      .map(server => ({
        id: server.id,
        name: server.name,
        hostUsername: server.hostUsername,
        players: server.players.length,
        maxPlayers: server.maxPlayers
      }));
  }
}

module.exports = new GameServer();
const uuid = require('uuid');

class GameServer {
  constructor() {
    this.servers = new Map();
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
      drawings: [],
      votes: {},
      createdAt: new Date(),
      maxPlayers: 6,
      minPlayersToStart: 3
    };
    this.servers.set(serverId, server);
    return server;
  }

  joinServer(serverId, userId, username) {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error('Server not found');
    }

    if (server.players.length >= server.maxPlayers) {
      throw new Error('Server is full');
    }

    if (server.status !== 'LOBBY') {
      throw new Error('Game already in progress');
    }

    // Prevent duplicate joins
    if (!server.players.some(player => player.id === userId)) {
      server.players.push({ id: userId, username });
    }

    return server;
  }

  leaveServer(serverId, userId) {
    const server = this.servers.get(serverId);
    if (!server) {
      return null;
    }

    // Remove the player
    server.players = server.players.filter(player => player.id !== userId);

    // If the host leaves and there are no more players, remove the server
    if (server.hostId === userId) {
      if (server.players.length > 0) {
        // Assign a new host
        const newHost = server.players[0];
        server.hostId = newHost.id;
        server.hostUsername = newHost.username;
      } else {
        // No players left, remove the server
        this.servers.delete(serverId);
        return null;
      }
    }

    return server;
  }

  startGame(serverId, hostId) {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error('Server not found');
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
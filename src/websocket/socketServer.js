const { Server } = require('socket.io');
const logger = require('../utils/logger');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {
    logger.socket(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.socket(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { initializeSocket };
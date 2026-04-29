const express = require('express');
const http = require('http');
const cors = require('cors');
const productRoutes = require('./src/routes/products');
const { initializeSocket } = require('./src/websocket/socketServer');
const logger = require('./src/utils/logger');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    logger.request(req.method, req.originalUrl, res.statusCode);
  });
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Product Catalog API is running'
  });
});

// Routes
app.use('/api/products', productRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Socket.io
const io = initializeSocket(server);
app.set('io', io);

const PORT = 3000;

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
const logger = {
  info(message) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },

  error(message) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  },

  request(method, url, statusCode) {
    console.log(`[${method}] ${url} - ${statusCode}`);
  },

  stockChange(productId, oldStock, newStock) {
    console.log(`Stock updated for product-${productId}: ${oldStock} → ${newStock}`);
  },

  socket(message) {
    console.log(`[SOCKET] ${new Date().toISOString()} - ${message}`);
  }
};

module.exports = logger;
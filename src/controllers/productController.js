const productService = require('../services/productService');
const logger = require('../utils/logger');

const emitEvent = (io, eventName, data) => {
  io.emit(eventName, {
    event: eventName,
    timestamp: new Date().toISOString(),
    data
  });
};

const checkStockAlerts = (io, product, oldStock, newStock) => {
  emitEvent(io, 'stock-updated', {
    id: product.id,
    name: product.name,
    oldStock,
    newStock
  });

  if (newStock === 0 && oldStock > 0) {
    emitEvent(io, 'out-of-stock', {
      id: product.id,
      name: product.name
    });
  }

  if (newStock < 10 && newStock > 0 && oldStock >= 10) {
    emitEvent(io, 'low-stock-alert', {
      id: product.id,
      name: product.name,
      stockQuantity: newStock
    });
  }
};

const getAllProducts = (req, res) => {
  try {
    const products = productService.getAllProducts(req.query);

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};

const getProductById = (req, res) => {
  try {
    const product = productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};

const createProduct = (req, res) => {
  try {
    const product = productService.createProduct(req.body);
    const io = req.app.get('io');

    emitEvent(io, 'product-created', product);

    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error(error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
};

const updateProduct = (req, res) => {
  try {
    const { oldProduct, updatedProduct } = productService.updateProduct(
      req.params.id,
      req.body
    );

    const io = req.app.get('io');

    emitEvent(io, 'product-updated', updatedProduct);

    if (oldProduct.stockQuantity !== updatedProduct.stockQuantity) {
      logger.stockChange(
        updatedProduct.id,
        oldProduct.stockQuantity,
        updatedProduct.stockQuantity
      );

      checkStockAlerts(
        io,
        updatedProduct,
        oldProduct.stockQuantity,
        updatedProduct.stockQuantity
      );
    }

    return res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    logger.error(error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
};

const updateStock = (req, res) => {
  try {
    const { product, oldStock, newStock } = productService.updateStock(
      req.params.id,
      req.body.stockQuantity
    );

    const io = req.app.get('io');

    logger.stockChange(product.id, oldStock, newStock);
    checkStockAlerts(io, product, oldStock, newStock);

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    logger.error(error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
};

const deleteProduct = (req, res) => {
  try {
    const deletedProduct = productService.deleteProduct(req.params.id);
    const io = req.app.get('io');

    emitEvent(io, 'product-deleted', {
      id: deletedProduct.id,
      name: deletedProduct.name
    });

    return res.status(204).send();
  } catch (error) {
    logger.error(error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct
};
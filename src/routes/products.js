const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const {
  createProductValidation,
  updateProductValidation,
  updateStockValidation,
  productIdValidation
} = require('../middleware/validation');

router.post('/', createProductValidation, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productIdValidation, productController.getProductById);
router.put('/:id', productIdValidation, updateProductValidation, productController.updateProduct);
router.patch('/:id/stock', productIdValidation, updateStockValidation, productController.updateStock);
router.delete('/:id', productIdValidation, productController.deleteProduct);

module.exports = router;
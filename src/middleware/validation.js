const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg
    });
  }

  next();
};

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number or 0'),

  body('stockQuantity')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative number'),

  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean'),

  handleValidationErrors
];

const updateProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number or 0'),

  body('stockQuantity')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative number'),

  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean'),

  handleValidationErrors
];

const updateStockValidation = [
  body('stockQuantity')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative number'),

  handleValidationErrors
];

const productIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Product ID is required'),

  handleValidationErrors
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  updateStockValidation,
  productIdValidation
};
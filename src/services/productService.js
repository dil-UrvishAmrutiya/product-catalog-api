let products = [];
let nextId = 1;

const getAllProducts = (query) => {
  let result = [...products];

  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    search,
    sortBy,
    order
  } = query;

  if (category) {
    result = result.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice !== undefined) {
    result = result.filter((product) => product.price >= Number(minPrice));
  }

  if (maxPrice !== undefined) {
    result = result.filter((product) => product.price <= Number(maxPrice));
  }

  if (inStock === 'true') {
    result = result.filter((product) => product.stockQuantity > 0);
  }

  if (inStock === 'false') {
    result = result.filter((product) => product.stockQuantity === 0);
  }

  if (search) {
    const keyword = search.toLowerCase();
    result = result.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(keyword);
      const descriptionMatch = (product.description || '')
        .toLowerCase()
        .includes(keyword);
      return nameMatch || descriptionMatch;
    });
  }

  const allowedSortFields = ['price', 'name', 'stockQuantity'];
  if (sortBy && allowedSortFields.includes(sortBy)) {
    result.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return order === 'desc' ? 1 : -1;
      if (valueA > valueB) return order === 'desc' ? -1 : 1;
      return 0;
    });
  }

  return result;
};

const getProductById = (id) => {
  return products.find((product) => product.id === id);
};

const createProduct = (data) => {
  const existingSku = products.find(
    (product) => product.sku.toLowerCase() === data.sku.toLowerCase()
  );

  if (existingSku) {
    const error = new Error('SKU already exists');
    error.statusCode = 409;
    throw error;
  }

  const timestamp = new Date().toISOString();

  const newProduct = {
    id: String(nextId++),
    name: data.name,
    description: data.description || '',
    category: data.category,
    price: Number(data.price),
    stockQuantity: Number(data.stockQuantity),
    sku: data.sku,
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  products.push(newProduct);
  return newProduct;
};

const updateProduct = (id, data) => {
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const duplicateSku = products.find(
    (product) =>
      product.id !== id &&
      product.sku.toLowerCase() === data.sku.toLowerCase()
  );

  if (duplicateSku) {
    const error = new Error('SKU already exists');
    error.statusCode = 409;
    throw error;
  }

  const existingProduct = products[index];

  const updatedProduct = {
    ...existingProduct,
    name: data.name,
    description: data.description || '',
    category: data.category,
    price: Number(data.price),
    stockQuantity: Number(data.stockQuantity),
    sku: data.sku,
    isActive: data.isActive !== undefined ? data.isActive : existingProduct.isActive,
    updatedAt: new Date().toISOString()
  };

  products[index] = updatedProduct;
  return {
    oldProduct: existingProduct,
    updatedProduct
  };
};

const updateStock = (id, stockQuantity) => {
  const product = products.find((item) => item.id === id);

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const oldStock = product.stockQuantity;
  product.stockQuantity = Number(stockQuantity);
  product.updatedAt = new Date().toISOString();

  return {
    product,
    oldStock,
    newStock: product.stockQuantity
  };
};

const deleteProduct = (id) => {
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const deletedProduct = products[index];
  products.splice(index, 1);

  return deletedProduct;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct
};
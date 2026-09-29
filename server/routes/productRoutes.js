const express = require('express');
const router = express.Router();
const {
  getProducts,
  getSearchSuggestions,
  getFeaturedProducts,
  getTrendingProducts,
  getBestSellers,
  getNewArrivals,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/:identifier', getProductByIdOrSlug);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/stock', protect, admin, updateStock);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  toggleSaveForLater,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateQuantity);
router.delete('/:itemId', removeFromCart);
router.patch('/:itemId/save-for-later', toggleSaveForLater);
router.delete('/', clearCart);

module.exports = router;

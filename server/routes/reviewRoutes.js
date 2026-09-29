const express = require('express');
const router = express.Router();
const {
  addReview,
  getProductReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, addReview);

// Admin routes
router.get('/', protect, admin, getAllReviews);
router.patch('/:id/status', protect, admin, updateReviewStatus);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;

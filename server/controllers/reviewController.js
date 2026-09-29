const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Helper to recalculate product rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const numReviews = reviews.length;
  const rating = numReviews > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews).toFixed(1))
    : 0;

  await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

// @desc    Add review for a product
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      orderStatus: { $ne: 'Cancelled' }
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only verified buyers who have purchased this product can leave a review.'
      });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product.'
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: true
    });

    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query;
    const query = {};

    if (isApproved !== undefined && isApproved !== 'all') {
      query.isApproved = isApproved === 'true';
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('product', 'name images slug')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / pageSize) || 1,
      currentPage,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update review approval status
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = isApproved;
    await review.save();

    await updateProductRating(review.product);

    res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'hidden'} successfully`,
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

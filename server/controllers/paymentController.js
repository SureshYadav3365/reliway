const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Process simulated online payment
// @route   POST /api/payments/process
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { orderId, amount, paymentMethod, cardDetails } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Generate transaction ID
    const transactionId = 'TXN-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

    const payment = await Payment.findOneAndUpdate(
      { order: order._id },
      {
        paymentStatus: 'paid',
        transactionId,
        paymentMethod: paymentMethod || 'online'
      },
      { new: true, upsert: true }
    );

    order.paymentStatus = 'paid';
    order.transactionId = transactionId;
    await order.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      transactionId,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all payments
// @route   GET /api/payments
// @access  Private/Admin
exports.getAllPayments = async (req, res, next) => {
  try {
    const { orderId, paymentStatus, paymentMethod, page = 1, limit = 15 } = req.query;
    const query = {};

    if (orderId) {
      query.orderId = { $regex: orderId.trim(), $options: 'i' };
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('user', 'name phone')
      .populate('order', 'orderId orderStatus totalPrice')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      count: payments.length,
      total,
      pages: Math.ceil(total / pageSize) || 1,
      currentPage,
      payments
    });
  } catch (error) {
    next(error);
  }
};

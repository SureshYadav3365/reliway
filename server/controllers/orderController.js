const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const Payment = require('../models/Payment');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      couponCode
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Please provide complete shipping address' });
    }

    if (!paymentMethod || !['cod', 'online'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Please select a valid payment method' });
    }

    // Verify products and inventory
    let verifiedItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product ${item.name || 'item'} is unavailable` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const activePrice = product.discountPrice || product.price;
      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        price: activePrice,
        quantity: item.quantity,
        variant: item.variant || ''
      });

      itemsPrice += activePrice * item.quantity;
    }

    // Coupon calculation
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      appliedCoupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() }
      });

      if (appliedCoupon) {
        if (itemsPrice >= appliedCoupon.minOrderValue) {
          if (appliedCoupon.discountType === 'percentage') {
            discountAmount = Math.round((itemsPrice * appliedCoupon.discountValue) / 100);
            if (appliedCoupon.maxDiscount > 0 && discountAmount > appliedCoupon.maxDiscount) {
              discountAmount = appliedCoupon.maxDiscount;
            }
          } else {
            discountAmount = appliedCoupon.discountValue;
          }

          // Ensure discount doesn't exceed items price
          if (discountAmount > itemsPrice) {
            discountAmount = itemsPrice;
          }

          // Increment coupon used count
          appliedCoupon.usedCount += 1;
          await appliedCoupon.save();
        }
      }
    }

    const priceAfterDiscount = Math.max(0, itemsPrice - discountAmount);
    const deliveryCharge = priceAfterDiscount >= 500 ? 0 : 50;
    const taxPrice = Math.round(priceAfterDiscount * 0.05); // 5% tax
    const totalPrice = priceAfterDiscount + deliveryCharge + taxPrice;

    // Generate Order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SE-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const paymentStatus = paymentMethod === 'online' ? 'paid' : 'pending';
    const orderStatus = 'Confirmed';

    // Create Order
    const order = await Order.create({
      orderId,
      user: req.user._id,
      orderItems: verifiedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      orderStatus,
      itemsPrice,
      discountAmount,
      deliveryCharge,
      taxPrice,
      totalPrice,
      couponCode: appliedCoupon ? appliedCoupon.code : '',
      statusHistory: [
        {
          status: 'Confirmed',
          date: new Date(),
          comment: paymentMethod === 'online' ? 'Order confirmed with online payment.' : 'Order placed successfully (Cash on Delivery).'
        }
      ]
    });

    // Create Payment Record
    await Payment.create({
      order: order._id,
      orderId: order.orderId,
      user: req.user._id,
      amount: totalPrice,
      paymentMethod,
      paymentStatus,
      transactionId: 'TXN-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000)
    });

    // Deduct stock and increment sold
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    // Clean ordered items from user's active cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      const orderedProductIds = verifiedItems.map(i => i.product.toString());
      cart.items = cart.items.filter(i => i.isSavedForLater || !orderedProductIds.includes(i.product.toString()));
      await cart.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID or orderId
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('user', 'name phone');
    } else {
      order = await Order.findOne({ orderId: id }).populate('user', 'name phone');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization: User can only view their own order unless admin
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer)
// @route   POST /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled as it is already ${order.orderStatus.toLowerCase()}`
      });
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      date: new Date(),
      comment: req.body.reason || 'Cancelled by customer'
    });

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity }
      });
    }

    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
      await Payment.findOneAndUpdate(
        { order: order._id },
        { paymentStatus: 'refunded' }
      );
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all orders with filtering & pagination
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const {
      orderId,
      customer,
      orderStatus,
      paymentStatus,
      startDate,
      endDate,
      page = 1,
      limit = 15
    } = req.query;

    const query = {};

    if (orderId) {
      query.orderId = { $regex: orderId.trim(), $options: 'i' };
    }

    if (orderStatus && orderStatus !== 'all') {
      query.orderStatus = orderStatus;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / pageSize) || 1,
      currentPage,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, comment, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        date: new Date(),
        comment: comment || `Status updated to ${orderStatus} by Admin`
      });

      // If marked Delivered and COD, mark payment as paid
      if (orderStatus === 'Delivered' && order.paymentMethod === 'cod') {
        order.paymentStatus = 'paid';
        await Payment.findOneAndUpdate(
          { order: order._id },
          { paymentStatus: 'paid' }
        );
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      await Payment.findOneAndUpdate(
        { order: order._id },
        { paymentStatus }
      );
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

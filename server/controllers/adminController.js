const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 1. Total Orders & Revenue
    const allOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['Pending', 'Confirmed', 'Processing'] } });

    const totalRevenue = allOrders.reduce((sum, ord) => sum + ord.totalPrice, 0);

    // 2. Today's sales
    const todayOrders = await Order.find({
      createdAt: { $gte: todayStart },
      orderStatus: { $ne: 'Cancelled' }
    });
    const todaySales = todayOrders.reduce((sum, ord) => sum + ord.totalPrice, 0);

    // 3. Total Customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 4. Products & Low stock
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });

    res.json({
      success: true,
      stats: {
        totalSales: totalRevenue,
        todaySales,
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalProducts,
        lowStockProducts,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Analytics (Charts & Reports)
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    const { range = '7days', startDate, endDate } = req.query;

    let start = new Date();
    const now = new Date();

    if (range === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (range === '7days') {
      start.setDate(now.getDate() - 7);
    } else if (range === '30days') {
      start.setDate(now.getDate() - 30);
    } else if (range === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      now.setTime(new Date(endDate).getTime());
    } else {
      start.setDate(now.getDate() - 7);
    }

    // Orders in time range
    const orders = await Order.find({
      createdAt: { $gte: start, $lte: now }
    }).sort({ createdAt: 1 });

    // Group sales and orders by day
    const dayMap = {};
    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      if (!dayMap[dateKey]) {
        dayMap[dateKey] = { date: dateKey, sales: 0, orders: 0 };
      }
      if (order.orderStatus !== 'Cancelled') {
        dayMap[dateKey].sales += order.totalPrice;
      }
      dayMap[dateKey].orders += 1;
    });

    const salesOverview = Object.values(dayMap);

    // Top Selling Products
    const topProducts = await Product.find({ isActive: true })
      .sort({ sold: -1 })
      .select('name sold price stock images rating')
      .limit(6);

    // Category Sales breakdown
    const categories = await Category.find();
    const categorySales = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ category: cat._id });
        const productIds = products.map(p => p._id);
        const count = products.length;
        const totalSold = products.reduce((acc, p) => acc + (p.sold || 0), 0);
        return {
          name: cat.name,
          productCount: count,
          itemsSold: totalSold
        };
      })
    );

    res.json({
      success: true,
      analytics: {
        salesOverview,
        topProducts,
        categorySales
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory & Stock report
// @route   GET /api/admin/inventory
// @access  Private/Admin
exports.getInventoryReport = async (req, res, next) => {
  try {
    const { lowStockOnly, search } = req.query;
    const query = {};

    if (lowStockOnly === 'true') {
      query.stock = { $lte: 10 };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { sku: { $regex: search.trim(), $options: 'i' } },
        { brand: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ stock: 1 });

    res.json({
      success: true,
      count: products.length,
      inventory: products
    });
  } catch (error) {
    next(error);
  }
};

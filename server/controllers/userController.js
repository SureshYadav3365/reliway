const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Admin: Get all customers
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;
    const query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Get order count for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ user: u._id });
        const orders = await Order.find({ user: u._id });
        const totalSpent = orders.reduce((sum, ord) => sum + ord.totalPrice, 0);
        return {
          ...u.toObject(),
          orderCount,
          totalSpent
        };
      })
    );

    res.json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / pageSize) || 1,
      currentPage,
      users: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get user details and orders
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Toggle customer active status
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate admin accounts' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

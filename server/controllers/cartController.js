const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to calculate totals
const formatCartResponse = (cart) => {
  if (!cart || !cart.items) {
    return {
      items: [],
      savedForLater: [],
      subtotal: 0,
      deliveryCharge: 0,
      tax: 0,
      grandTotal: 0
    };
  }

  const activeItems = cart.items.filter(item => !item.isSavedForLater && item.product);
  const savedForLater = cart.items.filter(item => item.isSavedForLater && item.product);

  const subtotal = activeItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  // Delivery: free if > 500, else 50 (if items present)
  const deliveryCharge = activeItems.length === 0 ? 0 : (subtotal >= 500 ? 0 : 50);
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const grandTotal = subtotal + deliveryCharge + tax;

  return {
    _id: cart._id,
    items: activeItems,
    savedForLater,
    subtotal,
    deliveryCharge,
    tax,
    grandTotal
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive brand sku'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out deleted products if any
    cart.items = cart.items.filter(item => item.product !== null);

    res.json({
      success: true,
      cart: formatCartResponse(cart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, variant = '', quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock.`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const price = product.discountPrice || product.price;

    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.variant === variant && !item.isSavedForLater
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Maximum available stock is ${product.stock}`
        });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = price;
    } else {
      cart.items.push({
        product: productId,
        variant,
        quantity: Number(quantity),
        price,
        isSavedForLater: false
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive brand sku'
    });

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: formatCartResponse(populatedCart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateQuantity = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product);
    if (!product) {
      cart.items.pull({ _id: itemId });
      await cart.save();
      return res.status(404).json({ success: false, message: 'Product is no longer available' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    item.quantity = Number(quantity);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive brand sku'
    });

    res.json({
      success: true,
      cart: formatCartResponse(populatedCart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull({ _id: itemId });
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive brand sku'
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: formatCartResponse(populatedCart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Save For Later
// @route   PATCH /api/cart/:itemId/save-for-later
// @access  Private
exports.toggleSaveForLater = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.isSavedForLater = !item.isSavedForLater;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive brand sku'
    });

    res.json({
      success: true,
      message: item.isSavedForLater ? 'Moved to Saved for Later' : 'Moved back to Cart',
      cart: formatCartResponse(populatedCart)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      // Keep saved for later items, clear active
      cart.items = cart.items.filter(item => item.isSavedForLater);
      await cart.save();
    }
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

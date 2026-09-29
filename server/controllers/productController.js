const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    // Search keyword across name, brand, sku, description
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { sku: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Category filter by ID or slug
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // Brand filter
    if (brand && brand !== 'all') {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (rating && Number(rating) > 0) {
      query.rating = { $gte: Number(rating) };
    }

    // Availability filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'popularity') {
      sortOption = { sold: -1 };
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    // Get unique brands for the filter sidebar
    const brands = await Product.distinct('brand', { isActive: true });

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / pageSize) || 1,
      currentPage,
      brands,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Live search suggestions
// @route   GET /api/products/suggestions
// @access  Public
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(q.trim(), 'i');
    const products = await Product.find({
      isActive: true,
      $or: [{ name: regex }, { brand: regex }, { sku: regex }]
    })
      .select('name brand sku price discountPrice images slug category')
      .populate('category', 'name')
      .limit(8);

    res.json({ success: true, suggestions: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
exports.getTrendingProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isTrending: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
exports.getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ sold: -1, rating: -1 })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:identifier
// @access  Public
exports.getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: identifier }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products from the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    })
      .populate('category', 'name')
      .limit(4);

    // Get approved reviews
    const reviews = await Review.find({ product: product._id, isApproved: true })
      .sort({ createdAt: -1 });

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
    });

    res.json({
      success: true,
      product,
      relatedProducts,
      reviews,
      ratingDistribution: distribution
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      description,
      category,
      brand,
      price,
      discountPrice,
      stock,
      images,
      specifications,
      variants,
      isFeatured,
      isTrending,
      isBestSeller,
      isNewArrival,
      isActive
    } = req.body;

    if (!name || !sku || !description || !category || !brand || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory fields' });
    }

    const existingSku = await Product.findOne({ sku: sku.trim().toUpperCase() });
    if (existingSku) {
      return res.status(400).json({ success: false, message: 'Product SKU already exists' });
    }

    const product = await Product.create({
      name,
      sku: sku.trim().toUpperCase(),
      description,
      category,
      brand,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock),
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'],
      specifications: specifications || [],
      variants: variants || [],
      isFeatured: !!isFeatured,
      isTrending: !!isTrending,
      isBestSeller: !!isBestSeller,
      isNewArrival: !!isNewArrival,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.sku && req.body.sku.toUpperCase() !== product.sku) {
      const existingSku = await Product.findOne({ sku: req.body.sku.toUpperCase(), _id: { $ne: product._id } });
      if (existingSku) {
        return res.status(400).json({ success: false, message: 'Product SKU already in use' });
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || isNaN(stock)) {
      return res.status(400).json({ success: false, message: 'Please provide valid stock number' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: Math.max(0, Number(stock)) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Color", "Size", "Storage"
  options: [{ type: String, required: true }] // e.g., ["Black", "Silver"] or ["64GB", "128GB"]
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  sku: {
    type: String,
    required: [true, 'Please provide product SKU'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please assign a category']
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide original price'],
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0,
    default: null
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock count'],
    min: 0,
    default: 0
  },
  sold: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  specifications: [specificationSchema],
  variants: [variantSchema]
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

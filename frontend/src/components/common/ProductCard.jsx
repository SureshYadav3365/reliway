import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import StarRating from './StarRating';
import QuickViewModal from './QuickViewModal';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  if (!product) return null;

  const inWish = isInWishlist(product._id);
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product._id, '', 1);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div className="product-card">
        {/* Image & Action Badges */}
        <div className="product-card-img-wrap">
          <Link to={`/product/${product.slug || product._id}`}>
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              className="product-card-img"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="product-card-badges">
            {discountPercent > 0 && (
              <span className="badge badge-danger">
                -{discountPercent}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="badge badge-warning">
                ★ Best Seller
              </span>
            )}
            {product.isNewArrival && (
              <span className="badge badge-primary">
                New
              </span>
            )}
            {product.stock <= 0 && (
              <span className="badge badge-secondary" style={{ background: '#ef4444', color: '#fff' }}>
                Out of Stock
              </span>
            )}
          </div>

          {/* Floating Actions */}
          <div className="product-card-actions">
            <button
              onClick={handleToggleWishlist}
              className="btn-icon"
              title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
              aria-label="Wishlist"
            >
              {inWish ? <FaHeart style={{ color: '#ef4444' }} /> : <FaRegHeart />}
            </button>
            <button
              onClick={handleQuickView}
              className="btn-icon"
              title="Quick View"
              aria-label="Quick View"
            >
              <FaEye />
            </button>
          </div>
        </div>

        {/* Product Body */}
        <div className="product-card-body">
          <div className="product-card-category">
            {product.category?.name || 'Category'}
          </div>

          <Link to={`/product/${product.slug || product._id}`}>
            <h4 className="product-card-title" title={product.name}>
              {product.name}
            </h4>
          </Link>

          <div className="product-card-rating">
            <StarRating rating={product.rating} numReviews={product.numReviews} />
          </div>

          <div className="product-card-price-row">
            <span className="product-price-current">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {product.discountPrice && (
              <span className="product-price-original">
                ₹{product.price.toLocaleString()}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="product-discount-tag">
                Save ₹{(product.price - product.discountPrice).toLocaleString()}
              </span>
            )}
          </div>

          <div className="product-card-footer">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', gap: '0.4rem' }}
            >
              <FaShoppingCart />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;

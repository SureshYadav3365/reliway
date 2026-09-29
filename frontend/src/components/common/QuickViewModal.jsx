import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaShoppingCart, FaHeart, FaRegHeart, FaCheck, FaTruck, FaUndo } from 'react-icons/fa';
import StarRating from './StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});

  const handleVariantChange = (variantName, option) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const getVariantString = () => {
    return Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, getVariantString(), quantity);
  };

  const inWish = isInWishlist(product._id);
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '820px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}
        >
          <FaTimes />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', padding: '2rem' }}>
          {/* Gallery Side */}
          <div>
            <div style={{
              width: '100%',
              paddingTop: '90%',
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#f1f5f9',
              marginBottom: '1rem'
            }}>
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.category?.name || 'ShopEase'}
            </span>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, margin: '0.35rem 0 0.6rem 0', color: '#0f172a' }}>
              {product.name}
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <StarRating rating={product.rating} numReviews={product.numReviews} />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
                ₹{(product.discountPrice || product.price).toLocaleString()}
              </span>
              {product.discountPrice && (
                <>
                  <span style={{ fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="badge badge-success">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            <p style={{
              color: '#475569',
              fontSize: '0.92rem',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.map((v, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  {v.name}: {selectedVariants[v.name] || 'Select'}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {v.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleVariantChange(v.name, opt)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.85rem',
                        borderRadius: '6px',
                        border: selectedVariants[v.name] === opt ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: selectedVariants[v.name] === opt ? '#eff6ff' : '#ffffff',
                        color: selectedVariants[v.name] === opt ? '#2563eb' : '#334155',
                        fontWeight: selectedVariants[v.name] === opt ? 700 : 500
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', paddingTop: '1rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: '36px', height: '38px', background: '#f8fafc', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  style={{ width: '36px', height: '38px', background: '#f8fafc', fontWeight: 700 }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <FaShoppingCart />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button
                onClick={() => toggleWishlist(product._id)}
                className="btn-icon"
                title="Wishlist"
              >
                {inWish ? <FaHeart style={{ color: '#ef4444' }} /> : <FaRegHeart />}
              </button>
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <Link
                to={`/product/${product.slug || product._id}`}
                onClick={onClose}
                style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 600, textDecoration: 'underline' }}
              >
                View Full Product Specifications & Customer Reviews →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

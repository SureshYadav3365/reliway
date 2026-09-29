import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import StarRating from '../components/common/StarRating';
import EmptyState from '../components/common/EmptyState';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <EmptyState
          icon={<FaHeart style={{ color: '#f43f5e' }} />}
          title="Your Wishlist is Empty"
          description="Explore our best products and tap the heart icon to save items for future purchases!"
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="section" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            My Wishlist ({wishlist.length} items)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            Items you have saved to purchase later or move directly to cart.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
                <Link to={`/product/${product.slug || product._id}`}>
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="btn-icon"
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: '#ffffff',
                    color: '#ef4444'
                  }}
                  title="Remove from Wishlist"
                >
                  <FaTrash style={{ fontSize: '0.85rem' }} />
                </button>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  {product.brand}
                </span>

                <Link to={`/product/${product.slug || product._id}`}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: '0.25rem 0 0.5rem 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.name}
                  </h4>
                </Link>

                <div style={{ marginBottom: '0.75rem' }}>
                  <StarRating rating={product.rating} numReviews={product.numReviews} />
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
                    ₹{(product.discountPrice || product.price).toLocaleString()}
                  </span>
                  {product.discountPrice && (
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '0.82rem' }}>
                  {product.stock > 0 ? (
                    <span style={{ color: '#10b981', fontWeight: 700 }}>In Stock</span>
                  ) : (
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>Out of Stock</span>
                  )}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={() => moveToCart(product._id)}
                    disabled={product.stock <= 0}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', gap: '0.4rem' }}
                  >
                    <FaShoppingCart /> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

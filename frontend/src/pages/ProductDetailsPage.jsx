import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StarRating from '../components/common/StarRating';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaBolt,
  FaCheck,
  FaStar,
  FaChevronRight
} from 'react-icons/fa';

const ProductDetailsPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/products/${identifier}`);
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.images?.[0] || '');
          setRelatedProducts(data.relatedProducts || []);
          setReviews(data.reviews || []);
          setRatingDistribution(data.ratingDistribution || {});
          
          // Pre-select first option for each variant if any
          if (data.product.variants && data.product.variants.length > 0) {
            const initialVars = {};
            data.product.variants.forEach(v => {
              if (v.options && v.options.length > 0) {
                initialVars[v.name] = v.options[0];
              }
            });
            setSelectedVariants(initialVars);
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err.message);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [identifier]);

  if (loading) {
    return <LoadingSpinner size="large" message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem 0' }}>The product you are looking for may have been removed or is temporarily unavailable.</p>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const inWish = isInWishlist(product._id);
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const getVariantString = () => {
    return Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, getVariantString(), quantity);
  };

  const handleBuyNow = async () => {
    const res = await addToCart(product._id, getVariantString(), quantity);
    if (res.success) {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    try {
      setSubmittingReview(true);
      const data = await api.post('/reviews', {
        productId: product._id,
        rating: newRating,
        comment: newComment.trim()
      });
      if (data.success) {
        toast.success(data.message);
        setReviews(prev => [data.review, ...prev]);
        setNewComment('');
        // Refresh product rating
        const refreshed = await api.get(`/products/${identifier}`);
        if (refreshed.success) {
          setProduct(refreshed.product);
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#64748b' }}>Home</Link>
          <FaChevronRight style={{ fontSize: '0.65rem' }} />
          <Link to="/shop" style={{ color: '#64748b' }}>Shop</Link>
          <FaChevronRight style={{ fontSize: '0.65rem' }} />
          <Link to={`/shop?category=${product.category?.slug}`} style={{ color: '#64748b' }}>
            {product.category?.name}
          </Link>
          <FaChevronRight style={{ fontSize: '0.65rem' }} />
          <span style={{ color: '#0f172a', fontWeight: 600, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </span>
        </div>

        {/* Main Product Showcase Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) minmax(340px, 1fr)',
          gap: '3.5rem',
          alignItems: 'start',
          marginBottom: '4rem'
        }} className="product-details-grid">
          {/* Left: Image Gallery */}
          <div>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '95%',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: '1rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
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
              {discountPercent > 0 && (
                <span className="badge badge-danger" style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: selectedImage === img ? '2.5px solid #2563eb' : '1px solid #cbd5e1',
                      flexShrink: 0,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Purchase Options */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {product.brand} • SKU: {product.sku}
              </span>
              <button
                onClick={() => toggleWishlist(product._id)}
                className="btn-icon"
                title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {inWish ? <FaHeart style={{ color: '#ef4444' }} /> : <FaRegHeart />}
              </button>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Rating summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <StarRating rating={product.rating} numReviews={product.numReviews} />
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {product.sold} items sold
              </span>
            </div>

            {/* Pricing */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
                ₹{(product.discountPrice || product.price).toLocaleString()}
              </span>
              {product.discountPrice && (
                <>
                  <span style={{ fontSize: '1.2rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Availability */}
            <div style={{ marginBottom: '1.5rem' }}>
              {product.stock > 10 ? (
                <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <FaCheck /> In Stock ({product.stock} units available)
                </span>
              ) : product.stock > 0 ? (
                <span style={{ color: '#f59e0b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <FaBolt /> Low Stock: Only {product.stock} left in stock!
                </span>
              ) : (
                <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
                  Currently Out of Stock
                </span>
              )}
            </div>

            {/* Short Description */}
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              {product.description}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.map((v, idx) => (
              <div key={idx} style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                  {v.name}: <span style={{ color: '#2563eb' }}>{selectedVariants[v.name]}</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {v.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: opt }))}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.88rem',
                        borderRadius: '8px',
                        border: selectedVariants[v.name] === opt ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        backgroundColor: selectedVariants[v.name] === opt ? '#eff6ff' : '#ffffff',
                        color: selectedVariants[v.name] === opt ? '#2563eb' : '#334155',
                        fontWeight: selectedVariants[v.name] === opt ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity Selector & Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>Quantity:</span>
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
                    style={{ width: '40px', height: '40px', background: '#f8fafc', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ width: '45px', textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    style={{ width: '40px', height: '40px', background: '#f8fafc', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="btn btn-outline-primary btn-lg"
                  style={{ flex: 1 }}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                >
                  <FaBolt /> Buy Now
                </button>
              </div>
            </div>

            {/* Delivery & Return Assurances */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginTop: '2.5rem',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1.5rem'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <FaTruck style={{ color: '#2563eb', fontSize: '1.4rem' }} />
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700 }}>Free Express Delivery</h5>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>On orders above ₹500</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <FaUndo style={{ color: '#10b981', fontSize: '1.4rem' }} />
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700 }}>7 Days Easy Return</h5>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>No questions asked</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications && product.specifications.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            marginBottom: '3.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a' }}>
              Technical Specifications
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.75rem'
            }}>
              {product.specifications.map((spec, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>{spec.key}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          marginBottom: '4rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>
            Customer Reviews & Ratings ({reviews.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '3rem', marginBottom: '2.5rem' }} className="reviews-layout">
            {/* Rating Breakdown card */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit', lineHeight: 1 }}>
                {product.rating}
              </span>
              <div style={{ margin: '0.5rem 0' }}>
                <StarRating rating={product.rating} showCount={false} />
              </div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                Based on {product.numReviews} verified reviews
              </p>

              {/* Progress bars */}
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDistribution[star] || 0;
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                      <span style={{ width: '24px', fontWeight: 600 }}>{star}★</span>
                      <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                      </div>
                      <span style={{ width: '24px', color: '#64748b', textAlign: 'right' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write a Review form */}
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Write a Product Review
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {isAuthenticated
                  ? 'Only verified buyers of this product can submit an authentic customer review.'
                  : 'Please log in to submit a verified buyer review.'}
              </p>

              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Your Rating</label>
                  <StarRating
                    rating={newRating}
                    showCount={false}
                    interactive={true}
                    onRatingChange={(r) => setNewRating(r)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Review Feedback</label>
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience regarding the quality, fit, and delivery..."
                    className="form-control"
                    disabled={!isAuthenticated}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isAuthenticated || submittingReview}
                  className="btn btn-primary btn-sm"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
            {reviews.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '1.5rem 0' }}>
                No reviews yet. Be the first customer to purchase and review this product!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h5 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{r.userName}</h5>
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                          Verified Purchase
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                      <StarRating rating={r.rating} showCount={false} />
                    </div>

                    <p style={{ margin: 0, color: '#475569', fontSize: '0.92rem', lineHeight: 1.5 }}>
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="section-title-wrap">
              <div>
                <span className="section-tag">More To Explore</span>
                <h2 className="section-title">Related Products</h2>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 850px) {
          .product-details-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .reviews-layout { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailsPage;

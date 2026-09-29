import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';
import {
  FaShoppingCart,
  FaTrash,
  FaBookmark,
  FaTag,
  FaShieldAlt,
  FaArrowRight,
  FaCheck
} from 'react-icons/fa';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartItemCount,
    updateQuantity,
    removeFromCart,
    toggleSaveForLater,
    coupon,
    discountAmount,
    deliveryCharge,
    tax,
    grandTotal,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCodeInput.trim());
    setApplyingCoupon(false);
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <EmptyState
          icon={<FaShoppingCart />}
          title="Your Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Explore our top products and find great deals!"
          actionText="Continue Shopping"
          actionLink="/shop"
        />

        {/* Display Saved For Later items if any */}
        {cart.savedForLater && cart.savedForLater.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Saved for Later ({cart.savedForLater.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {cart.savedForLater.map((item) => (
                <div key={item._id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                      {item.product?.name}
                    </h5>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>
                      ₹{item.price.toLocaleString()}
                    </span>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
                      <button
                        onClick={() => toggleSaveForLater(item._id)}
                        className="btn btn-outline-primary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="btn-icon"
                        style={{ width: '28px', height: '28px', fontSize: '0.75rem', color: '#ef4444' }}
                        title="Remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const freeDeliveryThreshold = 500;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - cart.subtotal);

  return (
    <div className="section" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
          Shopping Cart ({cartItemCount} items)
        </h1>

        {/* Free Shipping Alert Banner */}
        {amountNeededForFree > 0 ? (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <span>Add items worth <strong style={{ color: '#2563eb' }}>₹{amountNeededForFree.toLocaleString()}</strong> more to get <strong>FREE Express Delivery</strong>!</span>
            <Link to="/shop" style={{ fontWeight: 700, textDecoration: 'underline' }}>Add items →</Link>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            color: '#065f46',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaCheck /> <strong>Congratulations!</strong> You have unlocked FREE Express Delivery on this order.
          </div>
        )}

        {/* Two-Column Grid: Cart Items + Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '2.5rem',
          alignItems: 'start'
        }} className="cart-grid">
          {/* Left Column: Cart Items List */}
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              {cart.items.map((item, index) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    padding: '1.25rem 0',
                    borderBottom: index === cart.items.length - 1 ? 'none' : '1px solid #f1f5f9',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <Link to={`/product/${item.product?.slug || item.product?._id}`}>
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.product?.name}
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                  </Link>

                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <Link to={`/product/${item.product?.slug || item.product?._id}`}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                        {item.product?.name}
                      </h4>
                    </Link>
                    {item.variant && (
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>
                        Selected: <strong>{item.variant}</strong>
                      </span>
                    )}
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      style={{ width: '32px', height: '34px', background: '#f8fafc', fontWeight: 700 }}
                    >
                      -
                    </button>
                    <span style={{ width: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      style={{ width: '32px', height: '34px', background: '#f8fafc', fontWeight: 700 }}
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div style={{ textAlign: 'right', minWidth: '90px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb', fontFamily: 'Outfit' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => toggleSaveForLater(item._id)}
                      className="btn-icon"
                      title="Save for Later"
                      style={{ width: '34px', height: '34px', fontSize: '0.8rem' }}
                    >
                      <FaBookmark />
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="btn-icon"
                      title="Remove from Cart"
                      style={{ width: '34px', height: '34px', fontSize: '0.8rem', color: '#ef4444' }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Saved for Later Section */}
            {cart.savedForLater && cart.savedForLater.length > 0 && (
              <div style={{
                marginTop: '2.5rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a' }}>
                  Saved for Later ({cart.savedForLater.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.savedForLater.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0',
                        borderBottom: '1px solid #f1f5f9',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={item.product?.images?.[0]}
                          alt={item.product?.name}
                          style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <h5 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700 }}>
                            {item.product?.name}
                          </h5>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#2563eb' }}>
                            ₹{item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => toggleSaveForLater(item._id)}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Move back to Cart
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="btn-icon"
                          style={{ width: '32px', height: '32px', color: '#ef4444' }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              position: 'sticky',
              top: '100px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a' }}>
                Order Summary
              </h3>

              {/* Coupon Form */}
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                {coupon ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ecfdf5',
                    border: '1px dashed #10b981',
                    borderRadius: '8px',
                    padding: '0.65rem 1rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857' }}>
                        <FaTag style={{ marginRight: '4px' }} /> {coupon.code} Applied
                      </span>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#065f46' }}>
                        You saved ₹{discountAmount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="form-control"
                      style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                    />
                    <button
                      type="submit"
                      disabled={applyingCoupon || !couponCodeInput.trim()}
                      className="btn btn-outline-primary btn-sm"
                      style={{ padding: '0 1.25rem' }}
                    >
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
              </div>

              {/* Cost Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Items Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{cart.subtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Coupon Discount</span>
                    <span style={{ fontWeight: 700 }}>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Delivery Charge</span>
                  <span style={{ fontWeight: 600 }}>
                    {deliveryCharge === 0 ? (
                      <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Estimated Taxes (5% GST)</span>
                  <span style={{ fontWeight: 600 }}>₹{tax.toLocaleString()}</span>
                </div>

                <div style={{
                  borderTop: '1.5px solid #e2e8f0',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Grand Total</span>
                  <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#2563eb', fontFamily: 'Outfit' }}>
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.75rem', gap: '0.5rem' }}
              >
                Proceed to Checkout <FaArrowRight />
              </button>

              <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <FaShieldAlt style={{ color: '#10b981' }} /> Safe and Secure Checkout Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CartPage;

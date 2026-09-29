import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaReceipt,
  FaCreditCard,
  FaMoneyBillWave,
  FaLock,
  FaShieldAlt,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, coupon, discountAmount, deliveryCharge, tax, grandTotal, clearCart } = useCart();
  const { user, isAuthenticated, addAddress } = useAuth();

  const [step, setStep] = useState(1); // 1: Address, 2: Review, 3: Payment
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address form
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'
  const [cardData, setCardData] = useState({
    cardNumber: '4532 •••• •••• 8892',
    cardHolder: user?.name || '',
    expiry: '12/28',
    cvv: '891'
  });
  const [placingOrder, setPlacingOrder] = useState(false);

  // Redirect if not logged in or cart empty
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem 0' }}>Please add some items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
      </div>
    );
  }

  const addresses = user?.addresses || [];
  const currentAddress = addresses.length > 0 && !showNewAddressForm
    ? addresses[selectedAddressIndex] || addresses[0]
    : newAddress;

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.house || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }
    const res = await addAddress(newAddress);
    if (res.success) {
      setShowNewAddressForm(false);
      setSelectedAddressIndex(user?.addresses?.length || 0);
    }
  };

  const handleProceedToStep2 = () => {
    if (addresses.length === 0 || showNewAddressForm) {
      if (!newAddress.fullName || !newAddress.phone || !newAddress.house || !newAddress.street || !newAddress.city || !newAddress.pincode) {
        toast.error('Please enter all required address details');
        return;
      }
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleProceedToStep3 = () => {
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      const shipping = addresses.length > 0 && !showNewAddressForm
        ? addresses[selectedAddressIndex] || addresses[0]
        : newAddress;

      const orderPayload = {
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0],
          price: item.price,
          quantity: item.quantity,
          variant: item.variant || ''
        })),
        shippingAddress: {
          fullName: shipping.fullName,
          phone: shipping.phone,
          house: shipping.house,
          street: shipping.street,
          city: shipping.city,
          state: shipping.state,
          pincode: shipping.pincode
        },
        paymentMethod,
        couponCode: coupon ? coupon.code : ''
      };

      const data = await api.post('/orders', orderPayload);
      if (data.success && data.order) {
        toast.success('Order placed successfully!');
        await clearCart();
        navigate(`/order-success/${data.order.orderId}`, { state: { order: data.order } });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="section" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Checkout Stepper Progress Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* Step 1 Pill */}
          <div
            onClick={() => setStep(1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              color: step >= 1 ? '#2563eb' : '#94a3b8',
              fontWeight: 700
            }}
          >
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: step >= 1 ? '#2563eb' : '#e2e8f0',
              color: step >= 1 ? '#ffffff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem'
            }}>
              1
            </span>
            <span>Delivery Address</span>
          </div>

          <div style={{ width: '40px', height: '2px', backgroundColor: step >= 2 ? '#2563eb' : '#cbd5e1' }} />

          {/* Step 2 Pill */}
          <div
            onClick={() => { if (step > 2) setStep(2); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: step >= 2 ? 'pointer' : 'default',
              color: step >= 2 ? '#2563eb' : '#94a3b8',
              fontWeight: 700
            }}
          >
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: step >= 2 ? '#2563eb' : '#e2e8f0',
              color: step >= 2 ? '#ffffff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem'
            }}>
              2
            </span>
            <span>Order Summary</span>
          </div>

          <div style={{ width: '40px', height: '2px', backgroundColor: step >= 3 ? '#2563eb' : '#cbd5e1' }} />

          {/* Step 3 Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: step >= 3 ? '#2563eb' : '#94a3b8',
            fontWeight: 700
          }}>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: step >= 3 ? '#2563eb' : '#e2e8f0',
              color: step >= 3 ? '#ffffff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem'
            }}>
              3
            </span>
            <span>Payment</span>
          </div>
        </div>

        {/* STEP 1: Address */}
        {step === 1 && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaMapMarkerAlt style={{ color: '#2563eb' }} /> Select Delivery Address
              </h2>
              {addresses.length > 0 && (
                <button
                  onClick={() => setShowNewAddressForm(prev => !prev)}
                  className="btn btn-outline-primary btn-sm"
                >
                  {showNewAddressForm ? 'Select Saved Address' : '+ Add New Address'}
                </button>
              )}
            </div>

            {/* Saved Addresses Picker */}
            {!showNewAddressForm && addresses.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {addresses.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    style={{
                      border: selectedAddressIndex === idx ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      backgroundColor: selectedAddressIndex === idx ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{addr.fullName}</h4>
                      {selectedAddressIndex === idx && <FaCheckCircle style={{ color: '#2563eb' }} />}
                    </div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.88rem', color: '#475569' }}>
                      {addr.house}, {addr.street}
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#475569' }}>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
                      Phone: {addr.phone}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* New Address Form */}
            {(showNewAddressForm || addresses.length === 0) && (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Enter Shipping Address
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-responsive">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      placeholder="Receiver's name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">House / Flat / Building *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.house}
                      onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                      placeholder="e.g. Flat 402, Sunshine Apts"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street / Area / Landmark *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      placeholder="e.g. 100 Feet Road, Near Metro"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      placeholder="City"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      placeholder="6-digit Pincode"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/cart" className="btn btn-outline">
                <FaArrowLeft /> Back to Cart
              </Link>
              <button onClick={handleProceedToStep2} className="btn btn-primary btn-lg">
                Proceed to Order Summary <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Review Order Summary */}
        {step === 2 && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaReceipt style={{ color: '#2563eb' }} /> Review Order Summary
            </h2>

            {/* Selected Address Card */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  Shipping To:
                </span>
                <h4 style={{ margin: '0.2rem 0', fontSize: '1rem', fontWeight: 700 }}>
                  {currentAddress.fullName} ({currentAddress.phone})
                </h4>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
                  {currentAddress.house}, {currentAddress.street}, {currentAddress.city}, {currentAddress.state} - {currentAddress.pincode}
                </p>
              </div>
              <button onClick={() => setStep(1)} className="btn btn-outline btn-sm">
                Change Address
              </button>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                Items ({cart.items.length})
              </h4>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                {cart.items.map((item, i) => (
                  <div
                    key={item._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderBottom: i === cart.items.length - 1 ? 'none' : '1px solid #f1f5f9'
                    }}
                  >
                    <img
                      src={item.product?.images?.[0]}
                      alt=""
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', fontWeight: 700 }}>
                        {item.product?.name}
                      </h5>
                      {item.variant && (
                        <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
                          Variant: {item.variant}
                        </span>
                      )}
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary details */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.95rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Items Total</span>
                <span>₹{cart.subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Charge</span>
                <span>{deliveryCharge === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${deliveryCharge}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Taxes (5% GST)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div style={{
                borderTop: '1px solid #cbd5e1',
                paddingTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#2563eb'
              }}>
                <span>Total Amount to Pay</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(1)} className="btn btn-outline">
                <FaArrowLeft /> Back to Address
              </button>
              <button onClick={handleProceedToStep3} className="btn btn-primary btn-lg">
                Proceed to Payment <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === 3 && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaCreditCard style={{ color: '#2563eb' }} /> Select Payment Option
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {/* Option 1: Cash on Delivery */}
              <label style={{
                border: paymentMethod === 'cod' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                backgroundColor: paymentMethod === 'cod' ? '#eff6ff' : '#ffffff',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <FaMoneyBillWave style={{ fontSize: '1.6rem', color: '#10b981' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Cash on Delivery (COD)</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Pay with cash or UPI at your doorstep when your order arrives.
                  </p>
                </div>
              </label>

              {/* Option 2: Online Payment */}
              <label style={{
                border: paymentMethod === 'online' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                backgroundColor: paymentMethod === 'online' ? '#eff6ff' : '#ffffff',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                />
                <FaCreditCard style={{ fontSize: '1.6rem', color: '#2563eb' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                    Online Payment (Instant Confirmation)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Pay securely using UPI, Credit/Debit Card, or Net Banking.
                  </p>
                </div>
              </label>
            </div>

            {/* If Online Payment chosen: Simulated Secure Gateway Card preview */}
            {paymentMethod === 'online' && (
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <FaLock style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Simulated 256-bit Secure Gateway
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Cardholder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardData.cardHolder}
                      onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1.5rem'
            }}>
              <button onClick={() => setStep(2)} className="btn btn-outline">
                <FaArrowLeft /> Back to Summary
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="btn btn-primary btn-lg"
                style={{ minWidth: '220px' }}
              >
                {placingOrder ? 'Processing Order...' : `Pay ₹${grandTotal.toLocaleString()} & Confirm`}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;

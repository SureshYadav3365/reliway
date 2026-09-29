import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import {
  FaCheck,
  FaClock,
  FaTruck,
  FaBox,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaCreditCard,
  FaReceipt,
  FaArrowLeft,
  FaStar
} from 'react-icons/fa';

const ORDER_STEPS = [
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/orders/${id}`);
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Error fetching order:', err.message);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      const data = await api.post(`/orders/${order._id}/cancel`, {
        reason: 'Customer initiated cancellation'
      });
      if (data.success) {
        toast.success('Order has been cancelled successfully');
        setOrder(data.order);
        setCancelModalOpen(false);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading order tracking..." />;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem 0' }}>The specified order could not be located in your account.</p>
        <Link to="/my-orders" className="btn btn-primary">Back to Orders</Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'Cancelled';
  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus);
  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  return (
    <div className="section" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/my-orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
            <FaArrowLeft /> Back to Orders
          </Link>
        </div>

        {/* Order Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Order Tracking
              </span>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                Order #{order.orderId}
              </h1>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {canCancel && (
                <button
                  onClick={() => setCancelModalOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                >
                  Cancel Order
                </button>
              )}
              <span className={`badge ${isCancelled ? 'badge-danger' : order.orderStatus === 'Delivered' ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: '0.9rem', padding: '0.45rem 1rem' }}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Visual Order Progress Timeline */}
          {isCancelled ? (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#991b1b'
            }}>
              <FaTimesCircle style={{ fontSize: '1.5rem', color: '#ef4444' }} />
              <div>
                <h4 style={{ margin: 0, fontWeight: 700 }}>This Order Was Cancelled</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  {order.paymentStatus === 'refunded' ? 'Any payments made have been processed for automatic refund.' : 'No charges were incurred.'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1rem 0' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${ORDER_STEPS.length}, 1fr)`,
                position: 'relative',
                textAlign: 'center'
              }} className="timeline-grid">
                {/* Connecting Line */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '10%',
                  right: '10%',
                  height: '4px',
                  backgroundColor: '#e2e8f0',
                  zIndex: 1
                }}>
                  <div style={{
                    width: currentStepIndex >= 0 ? `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` : '0%',
                    height: '100%',
                    backgroundColor: '#2563eb',
                    transition: 'width 0.4s ease'
                  }} />
                </div>

                {ORDER_STEPS.map((stepName, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={idx} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? '#2563eb' : '#ffffff',
                        border: isCompleted ? '3px solid #2563eb' : '3px solid #cbd5e1',
                        color: isCompleted ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 700,
                        marginBottom: '0.65rem',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none'
                      }}>
                        {isCompleted ? <FaCheck /> : idx + 1}
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: isCompleted ? 700 : 500, color: isCompleted ? '#0f172a' : '#64748b' }}>
                        {stepName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Summary 2-Col Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '2rem',
          alignItems: 'start'
        }} className="order-details-grid">
          {/* Left Column: Items & History */}
          <div>
            {/* Products Card */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                Ordered Products ({order.orderItems.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: idx === order.orderItems.length - 1 ? 'none' : '1px solid #f1f5f9'
                    }}
                  >
                    <img
                      src={item.image}
                      alt=""
                      style={{ width: '68px', height: '68px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <Link to={`/product/${item.product}`}>
                        <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                          {item.name}
                        </h4>
                      </Link>
                      {item.variant && (
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
                          Variant: {item.variant}
                        </span>
                      )}
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History Logs */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                  Status Updates
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.statusHistory.slice().reverse().map((hist, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', fontSize: '0.88rem' }}>
                      <div style={{ minWidth: '120px', color: '#64748b', fontSize: '0.8rem' }}>
                        {new Date(hist.date).toLocaleDateString()} {new Date(hist.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ color: '#2563eb' }}>{hist.status}</strong>
                        {hist.comment && (
                          <p style={{ margin: '0.2rem 0 0 0', color: '#475569' }}>
                            {hist.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Address & Payment Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Delivery Address */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaMapMarkerAlt style={{ color: '#2563eb' }} /> Delivery Address
              </h4>
              <p style={{ margin: '0 0 0.25rem 0', fontWeight: 700, fontSize: '0.92rem' }}>
                {order.shippingAddress?.fullName}
              </p>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.88rem', color: '#475569' }}>
                {order.shippingAddress?.house}, {order.shippingAddress?.street}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#475569' }}>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                Phone: {order.shippingAddress?.phone}
              </span>
            </div>

            {/* Payment Summary */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaReceipt style={{ color: '#2563eb' }} /> Payment Details
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Method:</span>
                  <strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Status:</span>
                  <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ textTransform: 'uppercase' }}>
                    {order.paymentStatus}
                  </span>
                </div>

                {order.transactionId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Txn ID:</span>
                    <span style={{ fontSize: '0.8rem', color: '#334155' }}>{order.transactionId}</span>
                  </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.35rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Items Subtotal</span>
                  <span>₹{order.itemsPrice?.toLocaleString()}</span>
                </div>

                {order.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Coupon ({order.couponCode})</span>
                    <span>-₹{order.discountAmount?.toLocaleString()}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Delivery</span>
                  <span>{order.deliveryCharge === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${order.deliveryCharge}`}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Taxes</span>
                  <span>₹{order.taxPrice?.toLocaleString()}</span>
                </div>

                <div style={{
                  borderTop: '1.5px solid #e2e8f0',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}>
                  <strong style={{ fontSize: '1.05rem' }}>Total Paid</strong>
                  <strong style={{ fontSize: '1.35rem', color: '#2563eb', fontFamily: 'Outfit' }}>
                    ₹{order.totalPrice?.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Cancel This Order?"
        message="Are you sure you want to cancel this order? Any items reserved will be released back to inventory."
        confirmText={cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
        isDanger={true}
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelModalOpen(false)}
      />

      <style>{`
        @media (max-width: 850px) {
          .order-details-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .timeline-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .timeline-grid::before { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default OrderDetailsPage;

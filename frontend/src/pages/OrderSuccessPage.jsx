import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaArrowRight, FaTruck } from 'react-icons/fa';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="section" style={{ paddingTop: '4rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '3.5rem 2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            margin: '0 auto 1.5rem auto'
          }}>
            <FaCheckCircle />
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Thank You For Your Order!
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem' }}>
            Your order has been received and confirmed. We have begun processing your items.
          </p>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            fontSize: '0.92rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Order Number:</span>
              <strong style={{ color: '#2563eb' }}>{orderId}</strong>
            </div>

            {order && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Total Amount:</span>
                  <strong>₹{order.totalPrice?.toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Payment Mode:</span>
                  <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{order.paymentMethod}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Delivery Address:</span>
                  <span style={{ textAlign: 'right', maxWidth: '60%' }}>
                    {order.shippingAddress?.street}, {order.shippingAddress?.city} ({order.shippingAddress?.pincode})
                  </span>
                </div>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#059669', fontSize: '0.85rem' }}>
              <FaTruck /> Estimated Delivery within 2-3 Business Days
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/order/${orderId}`} className="btn btn-primary" style={{ gap: '0.5rem' }}>
              <FaBox /> Track Order Status
            </Link>
            <Link to="/shop" className="btn btn-outline" style={{ gap: '0.5rem' }}>
              Continue Shopping <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

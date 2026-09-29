import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { FaBoxOpen, FaChevronRight, FaCalendarAlt, FaCreditCard, FaTruck } from 'react-icons/fa';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await api.get('/orders/my-orders');
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to load orders:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" message="Loading your orders..." />;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success">Delivered</span>;
      case 'Cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      case 'Shipped':
      case 'Out for Delivery':
        return <span className="badge badge-primary">{status}</span>;
      default:
        return <span className="badge badge-warning">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'delivered') return order.orderStatus === 'Delivered';
    if (activeTab === 'cancelled') return order.orderStatus === 'Cancelled';
    if (activeTab === 'active') return !['Delivered', 'Cancelled'].includes(order.orderStatus);
    return true;
  });

  return (
    <div className="section" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            My Orders
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            Review past purchases, verify delivery status, and track active packages.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}>
          {['all', 'active', 'delivered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                borderBottom: activeTab === tab ? '2.5px solid #2563eb' : '2.5px solid transparent',
                color: activeTab === tab ? '#2563eb' : '#64748b',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              {tab === 'all' ? `All Orders (${orders.length})` : tab}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={<FaBoxOpen />}
            title="No Orders Found"
            description="You don't have any orders in this category yet."
            actionText="Start Shopping"
            actionLink="/shop"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="card"
                style={{ padding: '1.5rem' }}
              >
                {/* Order Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Order ID</span>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#2563eb' }}>
                      {order.orderId}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FaCalendarAlt /> {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FaCreditCard /> Mode: <strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</strong>
                    </div>
                    <div>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.image}
                        alt=""
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>
                          {item.name}
                        </h5>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Tracking Link */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Total Amount: </span>
                    <strong style={{ fontSize: '1.15rem', color: '#0f172a', fontFamily: 'Outfit' }}>
                      ₹{order.totalPrice?.toLocaleString()}
                    </strong>
                  </div>

                  <Link
                    to={`/order/${order.orderId}`}
                    className="btn btn-outline-primary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    View Order Details & Tracking <FaChevronRight style={{ fontSize: '0.75rem' }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

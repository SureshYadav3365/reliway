import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  FaSearch,
  FaEye,
  FaCalendarAlt,
  FaCreditCard,
  FaTimes,
  FaTruck,
  FaCheckCircle
} from 'react-icons/fa';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (orderIdSearch) params.append('orderId', orderIdSearch);
      if (statusFilter !== 'all') params.append('orderStatus', statusFilter);
      if (paymentFilter !== 'all') params.append('paymentStatus', paymentFilter);
      params.append('limit', 50);

      const data = await api.get(`/orders?${params.toString()}`);
      if (data.success) {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus || !selectedOrder) return;
    try {
      setUpdatingStatus(true);
      const res = await api.patch(`/orders/${selectedOrder._id}/status`, {
        orderStatus: newStatus,
        comment: statusComment.trim() || `Status updated to ${newStatus} by Admin`
      });
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setSelectedOrder(res.order);
        setStatusComment('');
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getBadgeClass = (st) => {
    switch (st) {
      case 'Delivered':
        return 'badge-success';
      case 'Cancelled':
        return 'badge-danger';
      case 'Shipped':
      case 'Out for Delivery':
        return 'badge-primary';
      default:
        return 'badge-warning';
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Order Management
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Track fulfillments, dispatch packages, inspect payments, and update shipment progression.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder="Search Order ID (e.g. SE-982...)"
            value={orderIdSearch}
            onChange={(e) => setOrderIdSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
          />
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>Order Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', fontSize: '0.88rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>Payment:</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', fontSize: '0.88rem' }}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <LoadingSpinner size="large" message="Loading orders..." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <strong style={{ color: '#2563eb' }}>{o.orderId}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 700 }}>{o.user?.name || o.shippingAddress?.fullName}</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{o.user?.phone || o.shippingAddress?.phone}</span>
                    </div>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{o.orderItems.length} items</td>
                  <td>
                    <strong>₹{o.totalPrice?.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span className={`badge ${o.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ textTransform: 'uppercase' }}>
                      {o.paymentMethod} • {o.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getBadgeClass(o.orderStatus)}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setNewStatus(o.orderStatus);
                      }}
                      className="btn btn-outline-primary btn-sm"
                      style={{ gap: '0.35rem', fontSize: '0.8rem' }}
                    >
                      <FaEye /> Inspect / Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect & Update Status Modal */}
      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Order Details — {selectedOrder.orderId}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="btn-icon">
                <FaTimes />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Status Update Control */}
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 800, color: '#1e3a8a' }}>
                  Update Order Progression
                </h4>

                <form onSubmit={handleStatusUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="form-control"
                      style={{ flex: 1, backgroundColor: '#ffffff', fontWeight: 700 }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      type="submit"
                      disabled={updatingStatus || newStatus === selectedOrder.orderStatus}
                      className="btn btn-primary btn-sm"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {updatingStatus ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Optional milestone note for the customer..."
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.85rem', backgroundColor: '#ffffff' }}
                  />
                </form>
              </div>

              {/* Shipping Address & Info */}
              <div style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px' }}>
                <h5 style={{ margin: '0 0 0.35rem 0', fontWeight: 700 }}>Recipient & Shipping Address:</h5>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  <strong>{selectedOrder.shippingAddress?.fullName}</strong> ({selectedOrder.shippingAddress?.phone})<br />
                  {selectedOrder.shippingAddress?.house}, {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </p>
              </div>

              {/* Items Breakdown */}
              <h5 style={{ margin: '0 0 0.75rem 0', fontWeight: 700 }}>Order Items:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <img src={item.image} alt="" style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</p>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Qty: {item.quantity} {item.variant ? `(${item.variant})` : ''}</span>
                    </div>
                    <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <span style={{ fontWeight: 600 }}>Payment Method: <strong style={{ textTransform: 'uppercase' }}>{selectedOrder.paymentMethod}</strong></span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>
                  Total: ₹{selectedOrder.totalPrice?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedOrder(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaSearch, FaCreditCard, FaReceipt } from 'react-icons/fa';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('orderId', search);
      if (statusFilter !== 'all') params.append('paymentStatus', statusFilter);
      params.append('limit', 50);

      const data = await api.get(`/payments?${params.toString()}`);
      if (data.success) {
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPayments();
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
            Payment & Gateway Transactions
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Verify settlement entries, transaction hashes, and payment states.
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
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
          />
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', fontSize: '0.88rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <LoadingSpinner size="large" message="Loading transaction logs..." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Payment Status</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pmt) => (
                <tr key={pmt._id}>
                  <td>
                    <code>{pmt.transactionId}</code>
                  </td>
                  <td>
                    <strong style={{ color: '#2563eb' }}>{pmt.orderId}</strong>
                  </td>
                  <td>{pmt.user?.name || 'Customer'}</td>
                  <td>
                    <strong>₹{pmt.amount?.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '0.82rem' }}>
                      {pmt.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${pmt.paymentStatus === 'paid' ? 'badge-success' : pmt.paymentStatus === 'refunded' ? 'badge-danger' : 'badge-warning'}`} style={{ textTransform: 'uppercase' }}>
                      {pmt.paymentStatus}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {new Date(pmt.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;

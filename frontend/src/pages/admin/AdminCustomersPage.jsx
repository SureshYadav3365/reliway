import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaSearch, FaUserCircle, FaEye, FaTimes, FaBan, FaCheck } from 'react-icons/fa';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/users?search=${encodeURIComponent(search)}`);
      if (data.success) {
        setCustomers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleViewCustomer = async (cust) => {
    try {
      setSelectedCustomer(cust);
      setLoadingDetails(true);
      const data = await api.get(`/users/${cust._id}`);
      if (data.success) {
        setSelectedCustomer(data.user);
        setCustomerOrders(data.orders || []);
      }
    } catch (err) {
      toast.error('Failed to load customer details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleStatus = async (customer) => {
    try {
      const data = await api.patch(`/users/${customer._id}/status`);
      if (data.success) {
        toast.success(data.message);
        setCustomers(prev => prev.map(c => c._id === customer._id ? { ...c, isActive: data.user.isActive } : c));
        if (selectedCustomer?._id === customer._id) {
          setSelectedCustomer(prev => ({ ...prev, isActive: data.user.isActive }));
        }
      }
    } catch (err) {
      toast.error(err.message);
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
            Customer Management
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Inspect registered accounts, order records, lifetime spending, and toggle account access.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
          />
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </form>
      </div>

      {/* Customer List */}
      {loading ? (
        <LoadingSpinner size="large" message="Loading customer directory..." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone Number</th>
                <th>Orders Placed</th>
                <th>Total Spent</th>
                <th>Registered Date</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}>
                        {c.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</span>
                    </div>
                  </td>
                  <td><code>{c.phone}</code></td>
                  <td><strong style={{ color: '#2563eb' }}>{c.orderCount || 0}</strong> orders</td>
                  <td><strong>₹{(c.totalSpent || 0).toLocaleString()}</strong></td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {c.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleViewCustomer(c)}
                        className="btn btn-outline-primary btn-sm"
                        style={{ gap: '0.35rem', fontSize: '0.8rem' }}
                      >
                        <FaEye /> View Orders
                      </button>
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`btn btn-sm ${c.isActive ? 'btn-danger' : 'btn-outline'}`}
                        style={{ fontSize: '0.8rem' }}
                        title={c.isActive ? 'Deactivate account' : 'Reactivate account'}
                      >
                        {c.isActive ? <FaBan /> : <FaCheck />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Customer Profile — {selectedCustomer.name}
              </h3>
              <button onClick={() => setSelectedCustomer(null)} className="btn-icon">
                <FaTimes />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <p style={{ margin: '0 0 0.4rem 0' }}><strong>Status:</strong> {selectedCustomer.isActive ? 'Active' : 'Deactivated'}</p>
                <p style={{ margin: 0 }}><strong>Joined:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                Past Orders ({customerOrders.length})
              </h4>

              {loadingDetails ? (
                <LoadingSpinner size="small" message="Loading order history..." />
              ) : customerOrders.length === 0 ? (
                <p style={{ color: '#64748b' }}>No orders placed yet by this customer.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {customerOrders.map((ord) => (
                    <div key={ord._id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <strong style={{ color: '#2563eb' }}>{ord.orderId}</strong>
                        <span className="badge badge-primary">{ord.orderStatus}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                        <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                        <strong style={{ color: '#0f172a' }}>₹{ord.totalPrice?.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedCustomer(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;

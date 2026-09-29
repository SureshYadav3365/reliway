import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaTicketAlt } from 'react-icons/fa';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteCouponId, setDeleteCouponId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: 0,
    maxDiscount: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await api.get('/coupons');
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cpn) => {
    setEditingCoupon(cpn);
    setFormData({
      code: cpn.code,
      discountType: cpn.discountType,
      discountValue: cpn.discountValue,
      minOrderValue: cpn.minOrderValue,
      maxDiscount: cpn.maxDiscount || 0,
      expiryDate: new Date(cpn.expiryDate).toISOString().split('T')[0],
      usageLimit: cpn.usageLimit || 100,
      isActive: cpn.isActive !== undefined ? cpn.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue || !formData.expiryDate) {
      toast.error('Please enter all required fields');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscount: Number(formData.maxDiscount),
        usageLimit: Number(formData.usageLimit)
      };

      if (editingCoupon) {
        const res = await api.put(`/coupons/${editingCoupon._id}`, payload);
        if (res.success) {
          toast.success('Coupon updated successfully');
          setIsModalOpen(false);
          fetchCoupons();
        }
      } else {
        const res = await api.post('/coupons', payload);
        if (res.success) {
          toast.success('Coupon created successfully');
          setIsModalOpen(false);
          fetchCoupons();
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deleteCouponId) return;
    try {
      const res = await api.delete(`/coupons/${deleteCouponId}`);
      if (res.success) {
        toast.success('Coupon deleted successfully');
        setDeleteCouponId(null);
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleActive = async (cpn) => {
    try {
      const res = await api.put(`/coupons/${cpn._id}`, { isActive: !cpn.isActive });
      if (res.success) {
        toast.success(`Coupon ${!cpn.isActive ? 'activated' : 'deactivated'}`);
        setCoupons(prev => prev.map(c => c._id === cpn._id ? { ...c, isActive: !cpn.isActive } : c));
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
            Coupon & Discount Management
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Configure promotional promo codes, maximum savings caps, and redemption limits.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <FaPlus /> Create New Coupon
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="large" message="Loading coupons..." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Max Discount</th>
                <th>Expires</th>
                <th>Redemptions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>
                    <span style={{ fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>
                      {c.code}
                    </span>
                  </td>
                  <td>
                    <strong>
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                    </strong>
                  </td>
                  <td>₹{c.minOrderValue.toLocaleString()}</td>
                  <td>{c.maxDiscount > 0 ? `₹${c.maxDiscount.toLocaleString()}` : 'No Cap'}</td>
                  <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <span>{c.usedCount}</span> / <span style={{ color: '#64748b' }}>{c.usageLimit}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`badge ${c.isActive ? 'badge-success' : 'badge-secondary'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle status"
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="btn-icon"
                        style={{ width: '32px', height: '32px', color: '#2563eb' }}
                        title="Edit Coupon"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteCouponId(c._id)}
                        className="btn-icon"
                        style={{ width: '32px', height: '32px', color: '#ef4444' }}
                        title="Delete Coupon"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Coupon Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FESTIVE20"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Discount Type</label>
                    <select
                      className="form-control"
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Discount Value *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder={formData.discountType === 'percentage' ? 'e.g. 15' : 'e.g. 500'}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Min Order Value (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Discount Cap (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      placeholder="0 for unlimited"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Expiry Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Usage Limit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Coupon Active
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteCouponId}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? Customers will no longer be able to apply it at checkout."
        confirmText="Delete Coupon"
        isDanger={true}
        onConfirm={handleDeleteCoupon}
        onCancel={() => setDeleteCouponId(null)}
      />
    </div>
  );
};

export default AdminCouponsPage;

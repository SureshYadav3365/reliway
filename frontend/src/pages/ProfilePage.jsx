import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaLock,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaHeart,
  FaSignOutAlt,
  FaPlus,
  FaTrash,
  FaCheckCircle
} from 'react-icons/fa';

const ProfilePage = () => {
  const { user, updateProfile, changePassword, addAddress, deleteAddress, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('info'); // 'info', 'addresses', 'security'

  // Personal Info Form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Address Form Modal
  const [showAddressModal, setShowAddressModal] = useState(false);
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
  const [savingAddress, setSavingAddress] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile(profileData);
    setSavingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    const res = await changePassword(
      passwordData.oldPassword,
      passwordData.newPassword,
      passwordData.confirmNewPassword
    );
    setSavingPassword(false);
    if (res.success) {
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    }
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    const res = await addAddress(newAddress);
    setSavingAddress(false);
    if (res.success) {
      setShowAddressModal(false);
      setNewAddress({
        fullName: user?.name || '',
        phone: user?.phone || '',
        house: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
    }
  };

  const confirmDeleteAddress = async () => {
    if (deleteAddressId) {
      await deleteAddress(deleteAddressId);
      setDeleteAddressId(null);
    }
  };

  return (
    <div className="section" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            My Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            Manage your personal profile, addresses, passwords and active preferences.
          </p>
        </div>

        {/* Tab Navigation Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '2.5rem',
          alignItems: 'start'
        }} className="profile-layout">
          {/* Left Sidebar Menu */}
          <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</h4>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>{user.phone}</p>
            </div>

            <button
              onClick={() => setActiveTab('info')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                backgroundColor: activeTab === 'info' ? '#eff6ff' : 'transparent',
                color: activeTab === 'info' ? '#2563eb' : '#475569'
              }}
            >
              <FaUser /> Personal Information
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                backgroundColor: activeTab === 'addresses' ? '#eff6ff' : 'transparent',
                color: activeTab === 'addresses' ? '#2563eb' : '#475569'
              }}
            >
              <FaMapMarkerAlt /> Saved Addresses
            </button>

            <button
              onClick={() => setActiveTab('security')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                backgroundColor: activeTab === 'security' ? '#eff6ff' : 'transparent',
                color: activeTab === 'security' ? '#2563eb' : '#475569'
              }}
            >
              <FaLock /> Change Password
            </button>

            <Link
              to="/my-orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#475569'
              }}
            >
              <FaBoxOpen /> My Orders
            </Link>

            <Link
              to="/wishlist"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#475569'
              }}
            >
              <FaHeart /> My Wishlist
            </Link>

            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#ef4444',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          </div>

          {/* Right Main Content Box */}
          <div className="card" style={{ padding: '2rem' }}>
            {/* Tab 1: Personal Info */}
            {activeTab === 'info' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>
                  Personal Information
                </h3>
                <form onSubmit={handleProfileSubmit} style={{ maxWidth: '500px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number (Account Identifier)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      required
                    />
                    <small style={{ color: '#64748b', fontSize: '0.78rem' }}>
                      Used for order confirmations and OTP communications.
                    </small>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn btn-primary"
                    style={{ marginTop: '0.75rem' }}
                  >
                    {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Saved Shipping Addresses
                  </h3>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    <FaPlus /> Add Address
                  </button>
                </div>

                {user.addresses && user.addresses.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    {user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        style={{
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1.25rem',
                          backgroundColor: '#f8fafc',
                          position: 'relative'
                        }}
                      >
                        {addr.isDefault && (
                          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                            Default Address
                          </span>
                        )}
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700 }}>
                          {addr.fullName}
                        </h4>
                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.88rem', color: '#475569' }}>
                          {addr.house}, {addr.street}
                        </p>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#475569' }}>
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.82rem', fontWeight: 600 }}>
                          Phone: {addr.phone}
                        </p>

                        <button
                          onClick={() => setDeleteAddressId(addr._id)}
                          className="btn-icon"
                          style={{ position: 'absolute', top: '1rem', right: '1rem', width: '30px', height: '30px', color: '#ef4444' }}
                          title="Delete address"
                        >
                          <FaTrash style={{ fontSize: '0.8rem' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b' }}>No saved addresses. Click "Add Address" to save one for quick checkout.</p>
                )}
              </div>
            )}

            {/* Tab 3: Security & Password */}
            {activeTab === 'security' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>
                  Change Account Password
                </h3>
                <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '440px' }}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.confirmNewPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                      placeholder="Repeat new password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="btn btn-primary"
                    style={{ marginTop: '0.75rem' }}
                  >
                    {savingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Add New Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="btn-icon">×</button>
            </div>
            <form onSubmit={handleAddAddressSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
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
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">House / Flat *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAddress.house}
                    onChange={(e) => setNewAddress({ ...newAddress, house: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Street / Area *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
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
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddressModal(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={savingAddress} className="btn btn-primary btn-sm">
                  {savingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Address Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteAddressId}
        title="Delete Address"
        message="Are you sure you want to remove this address from your account?"
        confirmText="Delete"
        isDanger={true}
        onConfirm={confirmDeleteAddress}
        onCancel={() => setDeleteAddressId(null)}
      />

      <style>{`
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;

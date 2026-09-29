import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaShieldAlt, FaPhoneAlt, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('9999999999');
  const [password, setPassword] = useState('Admin@123456');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(phone, password);
    setSubmitting(false);

    if (res.success) {
      if (res.user.role === 'admin') {
        toast.success('Admin authorization granted');
        navigate('/admin');
      } else {
        toast.error('Access denied. You do not have administrator privileges.');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 1rem auto'
          }}>
            <FaShieldAlt />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            ShopEase Admin Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.35rem' }}>
            Authorized Personnel & Administrator Access
          </p>
        </div>

        {/* Demo credentials hint box */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px dashed #93c5fd',
          borderRadius: '10px',
          padding: '0.85rem',
          marginBottom: '1.5rem',
          fontSize: '0.82rem',
          color: '#1e40af'
        }}>
          <strong>Default Admin Credentials:</strong><br />
          Phone: <code>9999999999</code> | Password: <code>Admin@123456</code>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Phone Number</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <FaPhoneAlt style={{ fontSize: '0.85rem' }} />
              </span>
              <input
                type="tel"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <FaLock style={{ fontSize: '0.85rem' }} />
              </span>
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

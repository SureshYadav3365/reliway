import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPhoneAlt, FaLock, FaUserCircle, FaShieldAlt } from 'react-icons/fa';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) return;
    setSubmitting(true);
    const res = await login(phone, password);
    setSubmitting(false);
    if (res.success) {
      if (res.user?.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  const fillCustomerCreds = () => {
    setPhone('9876543210');
    setPassword('Password@123');
  };

  const fillAdminCreds = () => {
    setPhone('9999999999');
    setPassword('Admin@123456');
  };

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              margin: '0 auto 1rem auto'
            }}>
              <FaUserCircle />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Welcome Back
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Sign in with your phone number to access your account.
            </p>
          </div>

          {/* Quick Credential Prefill Buttons for Seamless Testing */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '10px',
            padding: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
              🚀 Quick Fill Test Credentials:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={fillCustomerCreds}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
              >
                Customer (9876543210)
              </button>
              <button
                type="button"
                onClick={fillAdminCreds}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', color: '#2563eb' }}
              >
                Admin (9999999999)
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <FaPhoneAlt style={{ fontSize: '0.85rem' }} />
                </span>
                <input
                  type="tel"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. 9876543210"
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
                  placeholder="Enter your password"
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
              {submitting ? 'Signing In...' : 'Log In'}
            </button>
          </form>

          {/* Footer Register link */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 700 }}>
              Create Account
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <Link to="/admin/login" style={{ fontSize: '0.8rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <FaShieldAlt /> Administrator Portal Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

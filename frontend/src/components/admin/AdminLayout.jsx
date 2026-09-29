import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaShoppingBag,
  FaUsers,
  FaWarehouse,
  FaCreditCard,
  FaTicketAlt,
  FaStar,
  FaChartLine,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaUserCircle
} from 'react-icons/fa';

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not admin, redirect to admin login
  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, end: true },
    { to: '/admin/products', label: 'Products', icon: <FaBoxOpen /> },
    { to: '/admin/categories', label: 'Categories', icon: <FaTags /> },
    { to: '/admin/orders', label: 'Orders', icon: <FaShoppingBag /> },
    { to: '/admin/customers', label: 'Customers', icon: <FaUsers /> },
    { to: '/admin/inventory', label: 'Inventory', icon: <FaWarehouse /> },
    { to: '/admin/payments', label: 'Payments', icon: <FaCreditCard /> },
    { to: '/admin/coupons', label: 'Coupons', icon: <FaTicketAlt /> },
    { to: '/admin/reviews', label: 'Reviews', icon: <FaStar /> },
    { to: '/admin/analytics', label: 'Analytics', icon: <FaChartLine /> }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Sidebar (Desktop) */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: '#0f172a',
          color: '#cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          transition: 'transform 0.25s ease'
        }}
      >
        {/* Brand Header */}
        <div style={{
          height: '70px',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b'
        }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#2563eb',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              S
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit' }}>
                ShopEase
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Admin Portal
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="admin-close-btn"
            style={{ color: '#94a3b8', fontSize: '1.2rem', display: 'none' }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, padding: '1.25rem 0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#2563eb' : 'transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <span style={{ fontSize: '1.05rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div style={{ borderTop: '1px solid #1e293b', padding: '1rem' }}>
          <Link
            to="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.65rem 0.85rem',
              fontSize: '0.85rem',
              color: '#94a3b8',
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }}
          >
            <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} /> View Customer Store
          </Link>

          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.65rem 0.85rem',
              fontSize: '0.85rem',
              color: '#ef4444',
              borderRadius: '8px',
              width: '100%',
              textAlign: 'left',
              fontWeight: 600
            }}
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="admin-main-wrap">
        {/* Top Header */}
        <header style={{
          height: '70px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="admin-hamburger"
              style={{ display: 'none', fontSize: '1.25rem', color: '#0f172a' }}
            >
              <FaBars />
            </button>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
              Management Console
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              to="/"
              className="btn btn-outline btn-sm"
              style={{ gap: '0.4rem', fontSize: '0.82rem' }}
            >
              <FaExternalLinkAlt /> View Store
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.25rem' }}>
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
                A
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                  {user?.name || 'Administrator'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Super Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Child Page Content */}
        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-close-btn {
            display: block !important;
          }
          .admin-main-wrap {
            margin-left: 0 !important;
          }
          .admin-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;

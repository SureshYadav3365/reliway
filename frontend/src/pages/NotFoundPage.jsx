import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
        <h1 style={{ fontSize: '6rem', fontWeight: 800, color: '#2563eb', margin: 0, lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '1rem 0 0.5rem 0' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The page or product you were looking for doesn't exist, has been removed, or was moved to another URL.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <FaHome /> Return to Home
          </Link>
          <Link to="/shop" className="btn btn-outline" style={{ gap: '0.5rem' }}>
            <FaSearch /> Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

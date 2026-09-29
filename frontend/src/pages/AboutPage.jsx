import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaTruck, FaAward, FaHeart } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="section" style={{ paddingTop: '3rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-tag">About ShopEase</span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 1rem 0' }}>
            Everything You Need, All in One Place.
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            Founded with a vision to redefine digital shopping across India, ShopEase connects you with authentic global brands, artisanal essentials, and premium lifestyle goods with speed and ease.
          </p>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '2.5rem',
          marginBottom: '3rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
            Our Core Mission
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            At ShopEase, we believe high quality should never be compromised by inconvenient logistics or complicated checkouts. We curate products with relentless standards for craftsmanship, materials, and durability, guaranteeing that every package delivered brings authentic satisfaction.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <FaAward style={{ color: '#2563eb', fontSize: '1.75rem', marginBottom: '0.75rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>100% Authentic</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Every item is sourced directly from certified makers and brands.</p>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <FaTruck style={{ color: '#10b981', fontSize: '1.75rem', marginBottom: '0.75rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>Express Delivery</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Nationwide logistics network ensuring prompt 2-3 business day arrivals.</p>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <FaShieldAlt style={{ color: '#f59e0b', fontSize: '1.75rem', marginBottom: '0.75rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>Secure Payments</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Industry-standard encryption with flexible Cash on Delivery & UPI.</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Explore the Collection Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

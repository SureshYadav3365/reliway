import React from 'react';
import { Link } from 'react-router-dom';

const CategorySlider = ({ categories = [] }) => {
  return (
    <section className="section" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div>
            <span className="section-tag">Explore By Category</span>
            <h2 className="section-title">Popular Categories</h2>
            <p className="section-subtitle">Browse through our vast catalog of top-tier department collections.</p>
          </div>
          <Link to="/shop" className="btn btn-outline-primary btn-sm">
            View All Categories →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1.25rem'
        }}>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug || cat._id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.25rem 0.75rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 20px -3px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                marginBottom: '0.85rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                border: '2px solid #ffffff'
              }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                {cat.name}
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {cat.productCount ? `${cat.productCount} Products` : 'Explore'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;

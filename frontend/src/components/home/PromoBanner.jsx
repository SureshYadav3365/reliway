import React from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PromoBanner = () => {
  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon "${code}" copied to clipboard!`);
  };

  return (
    <section className="section" style={{ padding: '3.5rem 0', backgroundColor: '#f8fafc' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          color: '#ffffff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'center',
          gap: '2.5rem',
          boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.25)'
        }}>
          <div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              <FaTag /> Limited Time Offer
            </span>

            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '1rem' }}>
              Save Big On Your First Order with ShopEase!
            </h2>
            <p style={{ color: '#dbeafe', fontSize: '1rem', lineHeight: 1.6, maxWidth: '480px', marginBottom: '1.75rem' }}>
              Enjoy instant 10% discount on orders above ₹500 or ₹500 flat off on orders over ₹3000. Stack your cart today!
            </p>

            <Link to="/shop" className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: '#1e3a8a' }}>
              Shop Now & Save
            </Link>
          </div>

          {/* Coupon Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Coupon 1 */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1.5px dashed rgba(255, 255, 255, 0.4)',
              borderRadius: '12px',
              padding: '1.25rem',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: '#fef08a' }}>
                  WELCOME10
                </span>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#bfdbfe' }}>
                  10% OFF up to ₹1,000 on orders above ₹500
                </p>
              </div>
              <button
                onClick={() => copyCoupon('WELCOME10')}
                className="btn btn-sm"
                style={{ backgroundColor: '#ffffff', color: '#1e3a8a', fontWeight: 700, borderRadius: '8px' }}
              >
                <FaCopy /> Copy
              </button>
            </div>

            {/* Coupon 2 */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1.5px dashed rgba(255, 255, 255, 0.4)',
              borderRadius: '12px',
              padding: '1.25rem',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: '#fef08a' }}>
                  SAVE500
                </span>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#bfdbfe' }}>
                  Flat ₹500 OFF on orders above ₹3,000
                </p>
              </div>
              <button
                onClick={() => copyCoupon('SAVE500')}
                className="btn btn-sm"
                style={{ backgroundColor: '#ffffff', color: '#1e3a8a', fontWeight: 700, borderRadius: '8px' }}
              >
                <FaCopy /> Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;

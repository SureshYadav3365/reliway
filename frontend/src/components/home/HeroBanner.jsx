import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt, FaTruck, FaTags } from 'react-icons/fa';

const HeroBanner = () => {
  return (
    <section style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a8a 100%)',
      color: '#ffffff',
      padding: '5rem 0',
      overflow: 'hidden'
    }}>
      {/* Decorative blurred background orb */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '3.5rem'
        }}>
          {/* Left Text */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#93c5fd',
              marginBottom: '1.5rem'
            }}>
              <FaTags style={{ color: '#fbbf24' }} /> Premium Online Shopping Festival
            </div>

            <h1 style={{
              fontSize: '3.25rem',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em'
            }}>
              Everything You Need, <br />
              <span style={{
                background: 'linear-gradient(90deg, #60a5fa, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                All in One Place.
              </span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginBottom: '2.25rem'
            }}>
              Discover hand-picked electronics, high-street fashion, organic groceries, and luxury accessories with rapid doorstep delivery.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-primary btn-lg" style={{ gap: '0.75rem' }}>
                Explore All Products <FaArrowRight />
              </Link>
              <Link to="/shop?offers=true" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
                View Special Offers
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'flex',
              gap: '2.5rem',
              marginTop: '3.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '1.75rem'
            }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>30+</h3>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Premium Items</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>4.9★</h3>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Verified Rating</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>100%</h3>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Authentic Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Hero Product Feature Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '1.5rem',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '4/3',
                backgroundColor: '#0f172a',
                marginBottom: '1.25rem'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="Sony WH-1000XM5 Headphones"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px'
                }}>
                  Trending Deal
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                    Sony WH-1000XM5 ANC
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                    Industry Leading Noise Cancellation
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'Outfit' }}>
                    ₹24,990
                  </span>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹29,990
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <Link
                  to="/product/sony-wh-1000xm5-wireless-noise-cancelling-headphones"
                  className="btn btn-primary"
                  style={{ width: '100%', borderRadius: '12px' }}
                >
                  Buy Now With Instant Discount
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

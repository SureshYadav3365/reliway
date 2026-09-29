import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaUndo,
  FaPaperPlane,
  FaCreditCard,
  FaLock
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to ShopEase newsletter!');
    setNewsletterEmail('');
  };

  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#cbd5e1', paddingTop: '4rem', marginTop: 'auto' }}>
      {/* Trust & Guarantee Banner */}
      <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: '3.5rem' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(37, 99, 235, 0.15)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                <FaTruck />
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.2rem' }}>Free Fast Shipping</h5>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>On all orders over ₹500</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                <FaUndo />
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.2rem' }}>7 Days Return</h5>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Hassle-free easy returns</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                <FaShieldAlt />
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.2rem' }}>100% Secure Checkout</h5>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>256-bit encrypted payments</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(147, 51, 234, 0.15)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                <FaHeadset />
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.2rem' }}>Dedicated Support</h5>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>24/7 friendly assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3.5rem 1.25rem 2.5rem 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 800
              }}>
                S
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                Shop<span style={{ color: '#60a5fa' }}>Ease</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Everything You Need, All in One Place. High quality products curated from leading global brands with guaranteed satisfaction.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem' }}>
              <FaLock /> SSL Certified 100% Safe Shopping
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', fontWeight: 700 }}>
              Top Categories
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><Link to="/shop?category=electronics" style={{ color: '#94a3b8' }}>Electronics & Audio</Link></li>
              <li><Link to="/shop?category=fashion" style={{ color: '#94a3b8' }}>Fashion & Streetwear</Link></li>
              <li><Link to="/shop?category=shoes" style={{ color: '#94a3b8' }}>Footwear & Sneakers</Link></li>
              <li><Link to="/shop?category=home" style={{ color: '#94a3b8' }}>Home & Lighting</Link></li>
              <li><Link to="/shop?category=beauty" style={{ color: '#94a3b8' }}>Beauty & Skincare</Link></li>
              <li><Link to="/shop?category=grocery" style={{ color: '#94a3b8' }}>Organic Pantry & Coffee</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', fontWeight: 700 }}>
              Customer Care
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><Link to="/my-orders" style={{ color: '#94a3b8' }}>Track My Order</Link></li>
              <li><Link to="/profile" style={{ color: '#94a3b8' }}>Manage Account</Link></li>
              <li><Link to="/wishlist" style={{ color: '#94a3b8' }}>My Wishlist</Link></li>
              <li><Link to="/cart" style={{ color: '#94a3b8' }}>Shopping Cart</Link></li>
              <li><Link to="/contact" style={{ color: '#94a3b8' }}>Help & Support</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8' }}>About ShopEase</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h5 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>
              Join Our Newsletter
            </h5>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Subscribe to get exclusive early drops, flash sale coupons, and seasonal discounts.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  padding: '0.7rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', gap: '0.5rem' }}
              >
                <FaPaperPlane /> Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright & Payment Badges */}
      <div style={{ borderTop: '1px solid #1e293b', padding: '1.5rem 0', backgroundColor: '#090d16' }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} ShopEase Inc. All rights reserved. Designed for excellence.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
            <span>Accepted Payments:</span>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>UPI</span> •
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Visa</span> •
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Mastercard</span> •
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>RuPay</span> •
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaBoxOpen,
  FaUserCircle,
  FaShieldAlt,
  FaTags,
  FaChevronDown
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection for navbar shadow/blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  // Click outside listener for search suggestions & user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search suggestions with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await api.get(`/products/suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (data.success) {
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Suggestion error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: isScrolled ? '0 4px 20px -2px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
        transition: 'all 0.2s ease'
      }}>
        {/* Top announcement bar */}
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          fontSize: '0.78rem',
          padding: '0.45rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 500
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🎉 Use code <strong style={{ color: '#f59e0b' }}>WELCOME10</strong> for 10% OFF | Free Shipping above ₹500</span>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <Link to="/about" style={{ opacity: 0.85 }}>About Us</Link>
              <Link to="/contact" style={{ opacity: 0.85 }}>Support</Link>
              {isAdmin && (
                <Link to="/admin" style={{ color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
                  <FaShieldAlt /> Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px', gap: '1.5rem' }}>
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
              }}>
                S
              </div>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>
                  Shop<span style={{ color: '#2563eb' }}>Ease</span>
                </span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '-3px' }}>
                  All in One Place
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '520px' }} className="desktop-search">
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search 1,000+ products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                style={{
                  width: '100%',
                  padding: '0.7rem 3rem 0.7rem 1.15rem',
                  borderRadius: '9999px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem'
                }}
              >
                <FaSearch />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '105%',
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.12)',
                zIndex: 110,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', background: '#f8fafc', textTransform: 'uppercase' }}>
                  Matching Products
                </div>
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item.slug || item._id}`}
                    onClick={() => setShowSuggestions(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.7rem 1rem',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                  >
                    <img
                      src={item.images?.[0]}
                      alt=""
                      style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {item.category?.name} • SKU: {item.sku}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2563eb' }}>
                      ₹{(item.discountPrice || item.price).toLocaleString()}
                    </span>
                  </Link>
                ))}
                <div style={{ padding: '0.65rem 1rem', textAlign: 'center', background: '#f8fafc' }}>
                  <button
                    onClick={handleSearchSubmit}
                    style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700 }}
                  >
                    See all results for "{searchQuery}" →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="desktop-nav">
            <Link to="/" style={{ fontWeight: 600, fontSize: '0.92rem', color: location.pathname === '/' ? '#2563eb' : '#334155' }}>
              Home
            </Link>
            <Link to="/shop" style={{ fontWeight: 600, fontSize: '0.92rem', color: location.pathname === '/shop' ? '#2563eb' : '#334155' }}>
              Shop
            </Link>
            <Link to="/shop?offers=true" style={{ fontWeight: 600, fontSize: '0.92rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FaTags /> Offers
            </Link>
            <Link to="/about" style={{ fontWeight: 600, fontSize: '0.92rem', color: location.pathname === '/about' ? '#2563eb' : '#334155' }}>
              About
            </Link>
            <Link to="/contact" style={{ fontWeight: 600, fontSize: '0.92rem', color: location.pathname === '/contact' ? '#2563eb' : '#334155' }}>
              Contact
            </Link>
          </nav>

          {/* Action Icons: Wishlist, Cart, Account */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="btn-icon"
              style={{ position: 'relative' }}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <FaHeart style={{ color: wishlistCount > 0 ? '#ef4444' : 'inherit' }} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="btn-icon"
              style={{ position: 'relative' }}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#2563eb',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div style={{ position: 'relative' }}>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(prev => !prev)}
                    className="btn btn-outline btn-sm"
                    style={{ gap: '0.5rem', borderRadius: '9999px', padding: '0.45rem 0.95rem' }}
                  >
                    <FaUserCircle style={{ fontSize: '1.15rem', color: '#2563eb' }} />
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name.split(' ')[0]}
                    </span>
                    <FaChevronDown style={{ fontSize: '0.7rem', opacity: 0.6 }} />
                  </button>

                  {userDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '115%',
                      width: '210px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                      zIndex: 110,
                      overflow: 'hidden',
                      padding: '0.5rem 0'
                    }}>
                      <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{user.name}</p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>{user.phone}</p>
                      </div>

                      <Link
                        to="/profile"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1rem', fontSize: '0.88rem', color: '#334155' }}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaUserCircle /> My Profile
                      </Link>

                      <Link
                        to="/my-orders"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1rem', fontSize: '0.88rem', color: '#334155' }}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaBoxOpen /> My Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1rem', fontSize: '0.88rem', color: '#2563eb', fontWeight: 600 }}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <FaShieldAlt /> Admin Dashboard
                        </Link>
                      )}

                      <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.25rem' }}>
                        <button
                          onClick={() => { logout(); setUserDropdownOpen(false); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.65rem 1rem',
                            fontSize: '0.88rem',
                            color: '#ef4444',
                            width: '100%',
                            textAlign: 'left'
                          }}
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to="/login" className="btn btn-primary btn-sm">
                    <FaUser /> Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="btn-icon mobile-menu-btn"
              aria-label="Open Navigation"
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar in second row */}
        <div className="mobile-search-bar" style={{ padding: '0.5rem 1rem 0.75rem 1rem', borderTop: '1px solid #f1f5f9' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products, brands, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 2.8rem 0.65rem 1rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#2563eb',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaSearch style={{ fontSize: '0.8rem' }} />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          zIndex: 1000,
          display: 'flex'
        }}>
          <div style={{
            width: '82%',
            maxWidth: '320px',
            backgroundColor: '#ffffff',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.25s ease'
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#0f172a',
              color: '#ffffff'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>ShopEase</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', fontSize: '1.25rem' }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Drawer Links */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
              <Link to="/" style={{ padding: '0.65rem 0', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                Home
              </Link>
              <Link to="/shop" style={{ padding: '0.65rem 0', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                Shop All Products
              </Link>
              <Link to="/shop?offers=true" style={{ padding: '0.65rem 0', fontWeight: 600, color: '#dc2626', borderBottom: '1px solid #f1f5f9' }}>
                Offers & Discounts
              </Link>
              <Link to="/cart" style={{ padding: '0.65rem 0', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                Cart ({cartItemCount})
              </Link>
              <Link to="/wishlist" style={{ padding: '0.65rem 0', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                Wishlist ({wishlistCount})
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" style={{ padding: '0.65rem 0', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                    My Account ({user.name})
                  </Link>
                  <Link to="/my-orders" style={{ padding: '0.65rem 0', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" style={{ padding: '0.65rem 0', fontWeight: 700, color: '#2563eb', borderBottom: '1px solid #f1f5f9' }}>
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    style={{ padding: '0.65rem 0', fontWeight: 600, color: '#ef4444', textAlign: 'left' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-outline" style={{ width: '100%' }}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .mobile-menu-btn { display: none; }
        .mobile-search-bar { display: none; }

        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
        }

        @media (max-width: 768px) {
          .desktop-search { display: none !important; }
          .mobile-search-bar { display: block; }
          .mobile-menu-btn { display: inline-flex; }
        }
      `}</style>
    </>
  );
};

export default Navbar;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setShowUserMenu(false); }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const categories = [
    { label: 'Saree', value: 'Saree', emoji: '🥻' },
    { label: 'Suit', value: 'Suit', emoji: '👘' },
    { label: 'Lehenga', value: 'Lehenga', emoji: '💃' },
    { label: 'Kurti', value: 'Kurti', emoji: '👚' },
    { label: 'Jeans', value: 'Jeans', emoji: '👖' },
    { label: 'Tops', value: 'Tops', emoji: '👕' },
  ];

  const currentCategory = new URLSearchParams(location.search).get('category');

  return (
    <>
      {/* Offer strip */}
      <div className="offer-strip">
        🎉 FREE shipping on orders above ₹999 &nbsp;|&nbsp; <span>Use code: WELCOME10</span> for 10% off on first order
      </div>

      <nav className={`navbar-custom navbar navbar-expand-lg ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          {/* Brand */}
          <Link className="navbar-brand navbar-brand-custom" to="/" onClick={() => setMenuOpen(false)}>
            Shopper's<span>Stop</span>
          </Link>

          {/* Mobile right icons */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
            {user && (
              <Link to="/cart" className="icon-btn" style={{ position: 'relative' }}>
                <FiShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            )}
            <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

          {/* Desktop nav */}
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
            {/* Category links */}
            <ul className="navbar-nav me-auto ms-3">
              <li className="nav-item">
                <Link to="/products"
                  className={`nav-link nav-link-custom ${location.pathname === '/products' && !currentCategory ? 'active' : ''}`}>
                  All
                </Link>
              </li>
              {categories.map(cat => (
                <li className="nav-item" key={cat.value}>
                  <Link
                    to={`/products?category=${cat.value}`}
                    className={`nav-link nav-link-custom ${currentCategory === cat.value ? 'active' : ''}`}>
                    <span className="d-none d-xl-inline me-1">{cat.emoji}</span>{cat.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="d-none d-lg-block me-3" style={{ minWidth: 220 }}>
              <div className="search-wrapper" style={{ maxWidth: '100%' }}>
                <FiSearch className="search-icon" size={14} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </form>

            {/* Right action icons */}
            <div className="d-flex align-items-center gap-1">
              {user ? (
                <>
                  {/* Wishlist */}
                  <Link to="/wishlist" className="icon-btn d-none d-lg-flex" title="Wishlist">
                    <FiHeart size={20} />
                  </Link>

                  {/* Cart */}
                  <Link to="/cart" className="icon-btn d-none d-lg-flex" style={{ position: 'relative' }} title="Cart">
                    <FiShoppingCart size={20} />
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </Link>

                  {/* User dropdown */}
                  <div style={{ position: 'relative' }} ref={userMenuRef}>
                    <button
                      className="icon-btn d-none d-lg-flex"
                      style={{ alignItems: 'center', gap: 6, borderRadius: 24, padding: '6px 12px', background: showUserMenu ? 'rgba(192,57,43,0.08)' : 'none' }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      aria-label="User menu"
                    >
                      {/* Avatar */}
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #c0392b, #d4ac0d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#333', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.name?.split(' ')[0]}
                      </span>
                      <FiChevronDown size={13} color="#999" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {/* Dropdown */}
                    {showUserMenu && (
                      <div style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        background: 'white', borderRadius: 16,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        border: '1px solid #e8e0d8',
                        padding: '8px', minWidth: 210, zIndex: 999,
                        animation: 'slideUp 0.2s ease'
                      }}>
                        {/* Profile header */}
                        <div style={{ padding: '10px 14px 14px', borderBottom: '1px solid #f0e8e0', marginBottom: 6 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{user.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                          {user.role === 'admin' && (
                            <span style={{ background: '#fff3cd', color: '#856404', padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 700, marginTop: 4, display: 'inline-block' }}>
                              ⚙️ Admin
                            </span>
                          )}
                        </div>

                        {/* Menu items */}
                        {[
                          { to: '/orders', icon: FiPackage, label: 'My Orders' },
                          { to: '/wishlist', icon: FiHeart, label: 'Wishlist' },
                          { to: '/cart', icon: FiShoppingCart, label: `Cart${cartCount > 0 ? ` (${cartCount})` : ''}` },
                        ].map(item => (
                          <Link key={item.to} to={item.to}
                            onClick={() => setShowUserMenu(false)}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', color: '#333', fontSize: '0.88rem', borderRadius: 10, transition: 'all 0.15s', textDecoration: 'none' }}
                            onMouseOver={e => e.currentTarget.style.background = '#f8f4f0'}
                            onMouseOut={e => e.currentTarget.style.background = 'none'}>
                            <item.icon size={15} color="#c0392b" />
                            {item.label}
                          </Link>
                        ))}

                        <div style={{ borderTop: '1px solid #f0e8e0', marginTop: 4, paddingTop: 4 }}>
                          <button onClick={handleLogout}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', color: '#e74c3c', fontSize: '0.88rem', borderRadius: 10, background: 'none', border: 'none', width: '100%', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}
                            onMouseOver={e => e.currentTarget.style.background = '#fff0f0'}
                            onMouseOut={e => e.currentTarget.style.background = 'none'}>
                            <FiLogOut size={15} />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="d-none d-lg-flex align-items-center gap-2">
                  <button className="btn-outline-brand" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={onLoginClick}>
                    Login
                  </button>
                  <button className="btn-primary-brand" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={onRegisterClick}>
                    Sign Up Free
                  </button>
                </div>
              )}
            </div>

            {/* Mobile expanded menu */}
            <div className="d-lg-none mt-3 pt-3" style={{ borderTop: '1px solid #e8e0d8' }}>
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mb-3">
                <div className="search-wrapper" style={{ maxWidth: '100%' }}>
                  <FiSearch className="search-icon" size={14} />
                  <input type="text" className="search-input" placeholder="Search products..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%' }} />
                </div>
              </form>

              {!user ? (
                <div style={{ display: 'flex', gap: 10, paddingBottom: 12 }}>
                  <button className="btn-outline-brand" style={{ flex: 1, padding: '10px', fontSize: '0.88rem', justifyContent: 'center' }} onClick={() => { onLoginClick(); setMenuOpen(false); }}>Login</button>
                  <button className="btn-primary-brand" style={{ flex: 1, padding: '10px', fontSize: '0.88rem', justifyContent: 'center' }} onClick={() => { onRegisterClick(); setMenuOpen(false); }}>Sign Up</button>
                </div>
              ) : (
                <div style={{ paddingBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #c0392b, #d4ac0d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{user.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Link to="/orders" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}><button className="btn-outline-brand" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>📦 Orders</button></Link>
                    <Link to="/wishlist" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}><button className="btn-outline-brand" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>❤️ Wishlist</button></Link>
                    <button onClick={handleLogout} style={{ padding: '8px 14px', fontSize: '0.82rem', background: 'none', border: '1.5px solid #e74c3c', color: '#e74c3c', borderRadius: 50, cursor: 'pointer', fontWeight: 600 }}>Logout</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

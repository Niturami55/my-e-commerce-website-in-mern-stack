import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">Shopper's<span>Stop</span></div>
            <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 20 }}>
              Your one-stop destination for the finest Indian ethnic and western wear. From elegant sarees to trendy jeans, we bring fashion to your doorstep.
            </p>
            <div className="d-flex gap-2">
              {[FiInstagram, FiFacebook, FiTwitter, FiYoutube].map((Icon, i) => (
                <div key={i} className="social-icon"><Icon /></div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <div className="footer-heading">Shop</div>
            <ul className="footer-links">
              {['Saree', 'Suit', 'Lehenga', 'Kurti', 'Jeans', 'Tops'].map(cat => (
                <li key={cat}><Link to={`/products?category=${cat}`}>{cat}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-3 col-6">
            <div className="footer-heading">Support</div>
            <ul className="footer-links">
              {['Track Order', 'Returns & Exchange', 'Size Guide', 'Shipping Policy', 'Privacy Policy', 'Terms of Service'].map(link => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-heading">Contact Us</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <FiMapPin style={{ color: '#c0392b', flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: '#aaa', fontSize: '0.88rem' }}>123, Fashion Street, Connaught Place, New Delhi - 110001</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <FiPhone style={{ color: '#c0392b', flexShrink: 0 }} />
                <span style={{ color: '#aaa', fontSize: '0.88rem' }}>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <FiMail style={{ color: '#c0392b', flexShrink: 0 }} />
                <span style={{ color: '#aaa', fontSize: '0.88rem' }}>support@shoppersstop.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div style={{ marginTop: 24 }}>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: 10, fontSize: '0.9rem' }}>Newsletter</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="email" placeholder="your@email.com" style={{
                  flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8, padding: '8px 14px', color: 'white', fontSize: '0.85rem'
                }} />
                <button className="btn-primary-brand" style={{ padding: '8px 18px', fontSize: '0.82rem', borderRadius: 8 }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>© 2024 Shopper's Stop. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Visa', 'Mastercard', 'UPI', 'Razorpay', 'COD'].map(p => (
              <span key={p} style={{
                background: 'rgba(255,255,255,0.08)', padding: '3px 10px',
                borderRadius: 6, fontSize: '0.75rem', color: '#ccc'
              }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

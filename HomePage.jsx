import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiRotateCcw, FiTruck, FiHeadphones } from 'react-icons/fi';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const categories = [
  { name: 'Saree', count: '500+', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', emoji: '🥻' },
  { name: 'Suit', count: '300+', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80', emoji: '👘' },
  { name: 'Lehenga', count: '200+', image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&q=80', emoji: '💃' },
  { name: 'Kurti', count: '800+', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80', emoji: '👚' },
  { name: 'Jeans', count: '400+', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', emoji: '👖' },
  { name: 'Tops', count: '600+', image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80', emoji: '👕' },
];

const features = [
  { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: FiRotateCcw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: FiShield, title: 'Secure Payment', desc: 'SSL encrypted transactions' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated customer care' },
];

const HomePage = ({ onLoginClick }) => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featRes, trendRes] = await Promise.all([
          axios.get(`${API_URL}/products?featured=true&limit=8`),
          axios.get(`${API_URL}/products?trending=true&limit=8`)
        ]);
        setFeatured(featRes.data.products);
        setTrending(trendRes.data.products);
      } catch {
        // fallback silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero */}
      <HeroSlider />

      {/* Features Strip */}
      <section style={{ background: 'white', borderBottom: '1px solid #e8e0d8', padding: '24px 0' }}>
        <div className="container">
          <div className="row g-3">
            {features.map((f, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: 'rgba(192,57,43,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <f.icon size={20} color="#c0392b" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e' }}>{f.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#999' }}>{f.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '70px 0', background: '#faf6f1' }}>
        <div className="container">
          <div className="text-center mb-4">
            <p style={{ color: '#c0392b', fontWeight: 600, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Browse by Category</p>
            <h2 className="section-title">Shop by Collection</h2>
            <p className="section-subtitle">From timeless ethnic wear to modern western styles</p>
          </div>
          <div className="row g-3">
            {categories.map((cat, i) => (
              <div className={`col-6 ${i < 2 ? 'col-md-4' : 'col-md-2'}`} key={cat.name}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/products?category=${cat.name}`}>
                    <div className="category-card" style={{ aspectRatio: i < 2 ? '2/3' : '1/1.3' }}>
                      <img className="category-img" src={cat.image} alt={cat.name} loading="lazy" />
                      <div className="category-overlay">
                        <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{cat.emoji}</div>
                        <div className="category-name">{cat.name}</div>
                        <div className="category-count">{cat.count} Styles</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '70px 0', background: 'white' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <p style={{ color: '#c0392b', fontWeight: 600, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Editor's Pick</p>
              <h2 className="section-title mb-1">Featured Collection</h2>
              <p style={{ color: '#999' }}>Handpicked styles just for you</p>
            </div>
            <Link to="/products?featured=true" className="btn-outline-brand">
              View All <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner-brand" /></div>
          ) : (
            <div className="row g-3">
              {featured.map(product => (
                <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                  <ProductCard product={product} onLoginClick={onLoginClick} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Offer Banner */}
      <section style={{ padding: '40px 0', background: '#faf6f1' }}>
        <div className="container">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="offer-card" style={{ minHeight: 220 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: 2, color: '#d4ac0d', textTransform: 'uppercase', marginBottom: 12 }}>🔥 MEGA SALE</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: 8 }}>Up to <span style={{ color: '#d4ac0d' }}>70% OFF</span></h3>
                <p style={{ color: '#aaa', marginBottom: 20, fontSize: '0.9rem' }}>On all ethnic wear. Limited time offer!</p>
                <Link to="/products?category=Saree" className="btn-gold">Shop Now</Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="offer-card" style={{ minHeight: 220, background: 'linear-gradient(135deg, #c0392b, #922b21)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: 2, color: '#f7dc6f', textTransform: 'uppercase', marginBottom: 12 }}>💃 NEW ARRIVALS</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: 8 }}>Bridal <span style={{ color: '#f7dc6f' }}>Lehenga</span></h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 20, fontSize: '0.9rem' }}>Exquisite collection for your special day</p>
                <Link to="/products?category=Lehenga" className="btn-gold">Explore</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section style={{ padding: '70px 0', background: 'white' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <p style={{ color: '#c0392b', fontWeight: 600, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>What's Hot</p>
              <h2 className="section-title mb-1">🔥 Trending Now</h2>
              <p style={{ color: '#999' }}>Most loved styles this season</p>
            </div>
            <Link to="/products?trending=true" className="btn-outline-brand">
              See All Trending <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner-brand" /></div>
          ) : (
            <div className="row g-3">
              {trending.map(product => (
                <div className="col-6 col-md-4 col-lg-3" key={product._id}>
                  <ProductCard product={product} onLoginClick={onLoginClick} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '70px 0', background: '#1a1a2e' }}>
        <div className="container">
          <div className="text-center mb-5">
            <p style={{ color: '#d4ac0d', fontWeight: 600, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Customer Love</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: 'white', marginBottom: 4 }}>What Our Customers Say</h2>
          </div>
          <div className="row g-4">
            {[
              { name: 'Priya Sharma', review: "The Banarasi saree I ordered was absolutely breathtaking! The quality is top-notch and delivery was super fast. Will definitely order again!", rating: 5, city: 'Mumbai', avatar: 'PS' },
              { name: 'Anita Gupta', review: "Got a lehenga for my sister's wedding. Everyone was asking where I bought it from. Truly premium quality at affordable price!", rating: 5, city: 'Delhi', avatar: 'AG' },
              { name: 'Kavya Reddy', review: "The kurti collection is amazing! Ordered 3 pieces and all of them fit perfectly. The fabric quality is excellent.", rating: 4, city: 'Hyderabad', avatar: 'KR' },
            ].map((t, i) => (
              <div className="col-md-4" key={i}>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
                  <div style={{ color: '#d4ac0d', fontSize: '1.2rem', marginBottom: 12 }}>{'★'.repeat(t.rating)}</div>
                  <p style={{ color: '#ccc', fontSize: '0.92rem', lineHeight: 1.8, marginBottom: 20 }}>"{t.review}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #c0392b, #d4ac0d)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.9rem'
                    }}>{t.avatar}</div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 600 }}>{t.name}</div>
                      <div style={{ color: '#888', fontSize: '0.78rem' }}>{t.city}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

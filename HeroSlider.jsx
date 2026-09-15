import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=90',
    badge: '✨ New Collection 2024',
    title: 'Elegance in Every',
    highlight: 'Thread',
    description: 'Discover our curated collection of handcrafted sarees, suits, and lehengas that celebrate timeless Indian craftsmanship.',
    cta: 'Explore Sarees',
    link: '/products?category=Saree',
    color: '#1a1a2e'
  },
  {
    image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=1600&q=90',
    badge: '🔥 Trending Now',
    title: 'Wear the',
    highlight: 'Celebration',
    description: 'Step into the spotlight with our stunning bridal lehengas and party wear collection. Make every moment unforgettable.',
    cta: 'Shop Lehengas',
    link: '/products?category=Lehenga',
    color: '#0f3460'
  },
  {
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1600&q=90',
    badge: '💃 Western Vibes',
    title: 'Your Style,',
    highlight: 'Your Rules',
    description: 'From high-waist jeans to boho tops, explore western wear that speaks your language.',
    cta: 'Shop Western',
    link: '/products?category=Jeans',
    color: '#16213e'
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent(prev => (prev + 1) % slides.length);

  return (
    <section className="hero-section" style={{ minHeight: '90vh' }}>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="hero-content"
            style={{ maxWidth: 580 }}
          >
            <span className="hero-badge">{slides[current].badge}</span>
            <h1 className="hero-title">
              {slides[current].title} <br />
              <span className="highlight">{slides[current].highlight}</span>
            </h1>
            <p className="hero-description">{slides[current].description}</p>
            <div className="d-flex gap-3 flex-wrap align-items-center">
              <Link to={slides[current].link} className="btn-primary-brand" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                {slides[current].cta}
              </Link>
              <Link to="/products" className="btn-outline-brand" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', fontSize: '1rem', padding: '12px 28px' }}>
                All Collections
              </Link>
            </div>

            {/* Dots */}
            <div className="hero-dots mt-4">
              {slides.map((_, i) => (
                <button key={i} className={`hero-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow controls */}
      <button onClick={prev} style={{
        position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
        width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'white', zIndex: 3, transition: 'all 0.2s'
      }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(192,57,43,0.7)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
        <FiChevronLeft size={22} />
      </button>
      <button onClick={next} style={{
        position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
        width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'white', zIndex: 3, transition: 'all 0.2s'
      }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(192,57,43,0.7)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
        <FiChevronRight size={22} />
      </button>

      {/* Stats bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.15)', padding: '16px 0', zIndex: 3
      }}>
        <div className="container">
          <div className="row text-center text-white">
            {[
              { num: '50,000+', label: 'Happy Customers' },
              { num: '5,000+', label: 'Products' },
              { num: '100+', label: 'Brands' },
              { num: '4.8★', label: 'Average Rating' }
            ].map((stat, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700 }}>{stat.num}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.8, letterSpacing: 1, textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;

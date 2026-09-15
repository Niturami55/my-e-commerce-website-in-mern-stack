import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiGrid, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const categories = ['Saree', 'Suit', 'Lehenga', 'Kurti', 'Jeans', 'Tops', 'Dress'];
const occasions = ['Casual', 'Formal', 'Party', 'Wedding', 'Festive', 'Daily Wear'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

const ProductsPage = ({ onLoginClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const fetchRef = useRef(0); // prevent stale fetches

  // Read all filters directly from URL
  const category = searchParams.get('category') || '';
  const occasion = searchParams.get('occasion') || '';
  const size = searchParams.get('size') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const featured = searchParams.get('featured') || '';
  const trending = searchParams.get('trending') || '';

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page'); // reset to page 1 on any filter change
    setSearchParams(next);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  // Fetch whenever URL params change
  useEffect(() => {
    const id = ++fetchRef.current;
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (occasion) params.set('occasion', occasion);
    if (size) params.set('size', size);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (page) params.set('page', page);
    if (featured) params.set('featured', featured);
    if (trending) params.set('trending', trending);
    params.set('limit', '12');

    axios.get(`${API_URL}/products?${params.toString()}`)
      .then(({ data }) => {
        if (id !== fetchRef.current) return; // stale
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => { if (id === fetchRef.current) setLoading(false); });
  }, [searchParams.toString()]);

  const activeFilterCount = [category, occasion, size, minPrice, maxPrice].filter(Boolean).length;

  const FilterPanel = () => (
    <div className="filter-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="filter-title mb-0">
          Filters {activeFilterCount > 0 && (
            <span style={{ background: '#c0392b', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: 6 }}>
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div className="filter-group">
        <div className="filter-group-label">Category</div>
        {categories.map(cat => (
          <span key={cat}
            className={`filter-chip ${category === cat ? 'active' : ''}`}
            onClick={() => updateParam('category', category === cat ? '' : cat)}>
            {cat}
          </span>
        ))}
      </div>

      {/* Occasion */}
      <div className="filter-group">
        <div className="filter-group-label">Occasion</div>
        {occasions.map(occ => (
          <span key={occ}
            className={`filter-chip ${occasion === occ ? 'active' : ''}`}
            onClick={() => updateParam('occasion', occasion === occ ? '' : occ)}>
            {occ}
          </span>
        ))}
      </div>

      {/* Size */}
      <div className="filter-group">
        <div className="filter-group-label">Size</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {sizes.map(s => (
            <span key={s}
              className={`filter-chip ${size === s ? 'active' : ''}`}
              onClick={() => updateParam('size', size === s ? '' : s)}
              style={{ padding: '4px 12px' }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <div className="filter-group-label">Price Range (₹)</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="form-control-brand" type="number" placeholder="Min"
            value={minPrice} onChange={e => updateParam('minPrice', e.target.value)} style={{ width: '50%' }} />
          <input className="form-control-brand" type="number" placeholder="Max"
            value={maxPrice} onChange={e => updateParam('maxPrice', e.target.value)} style={{ width: '50%' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {[['Under ₹500', '', '500'], ['₹500–₹2K', '500', '2000'], ['₹2K–₹5K', '2000', '5000'], ['₹5K+', '5000', '']].map(([label, mn, mx]) => (
            <span key={label} className="filter-chip"
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                mn ? next.set('minPrice', mn) : next.delete('minPrice');
                mx ? next.set('maxPrice', mx) : next.delete('maxPrice');
                next.delete('page');
                setSearchParams(next);
              }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const pageTitle = search ? `Search: "${search}"` : category || 'All Collections';

  return (
    <div style={{ padding: '28px 0 80px', background: '#fafafa', minHeight: '80vh' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb-brand mb-3">
          <Link to="/">Home</Link> ›{' '}
          {category ? <><Link to="/products">All</Link> › <span className="current">{category}</span></> : <span className="current">{pageTitle}</span>}
        </div>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', marginBottom: 4 }}>
              {pageTitle}
            </h1>
            <p style={{ color: '#999', fontSize: '0.88rem', margin: 0 }}>
              {loading ? 'Loading...' : `${total.toLocaleString('en-IN')} product${total !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', border: '1.5px solid #e8e0d8', borderRadius: 10, overflow: 'hidden' }}>
              {[['grid', FiGrid], ['list', FiList]].map(([m, Icon]) => (
                <button key={m} onClick={() => setViewMode(m)}
                  style={{ padding: '8px 12px', border: 'none', cursor: 'pointer', background: viewMode === m ? '#c0392b' : 'white', color: viewMode === m ? 'white' : '#999', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}>
                  <Icon size={15} />
                </button>
              ))}
            </div>
            {/* Sort */}
            <select
              style={{ border: '1.5px solid #e8e0d8', borderRadius: 10, padding: '9px 14px', fontSize: '0.88rem', cursor: 'pointer', background: 'white', color: '#333', minWidth: 160 }}
              value={sort}
              onChange={e => updateParam('sort', e.target.value)}>
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {/* Mobile filter */}
            <button className="btn-outline-brand d-md-none" onClick={() => setShowFilter(true)} style={{ padding: '8px 16px', fontSize: '0.85rem', gap: 6 }}>
              <FiFilter size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {[['category', category], ['occasion', occasion], ['size', size], ['minPrice', minPrice && `Min ₹${minPrice}`], ['maxPrice', maxPrice && `Max ₹${maxPrice}`]].map(([key, val]) => val ? (
              <span key={key} style={{
                background: '#fff0ef', border: '1px solid #f5c6c4', color: '#c0392b',
                padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                {val}
                <button onClick={() => updateParam(key, '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', padding: 0, lineHeight: 1 }}>
                  <FiX size={12} />
                </button>
              </span>
            ) : null)}
          </div>
        )}

        <div className="row g-3">
          {/* Sidebar – desktop */}
          <div className="col-md-3 d-none d-md-block">
            <FilterPanel />
          </div>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {showFilter && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500 }}
                  onClick={() => setShowFilter(false)} />
                <motion.div
                  initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 310, background: 'white', overflowY: 'auto', zIndex: 501, padding: 20 }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 style={{ fontFamily: "'Playfair Display', serif", margin: 0 }}>Filters</h3>
                    <button onClick={() => setShowFilter(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={20} /></button>
                  </div>
                  <FilterPanel />
                  <button className="btn-primary-brand" onClick={() => setShowFilter(false)} style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                    Show {total} Results
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products grid */}
          <div className="col-md-9">
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${viewMode === 'grid' ? 3 : 1}, 1fr)`, gap: 16 }}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} style={{ borderRadius: 14, overflow: 'hidden', background: 'white', border: '1px solid #e8e0d8' }}>
                    <div style={{ aspectRatio: '3/4', background: 'linear-gradient(90deg, #f0e8e0 25%, #f8f4f0 50%, #f0e8e0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                    <div style={{ padding: 14 }}>
                      <div style={{ height: 12, background: '#f0e8e0', borderRadius: 6, marginBottom: 8, width: '60%' }} />
                      <div style={{ height: 10, background: '#f0e8e0', borderRadius: 6, width: '80%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state" style={{ padding: '80px 20px' }}>
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No Products Found</h3>
                <p className="empty-text">
                  {activeFilterCount > 0
                    ? 'Try removing some filters to see more products'
                    : 'No products available in this category yet'}
                </p>
                <button className="btn-primary-brand" onClick={clearFilters}>
                  Browse All Products
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'row g-3'
                  : 'row g-3'}>
                  {products.map((product, i) => (
                    <motion.div
                      className={viewMode === 'grid' ? 'col-6 col-lg-4' : 'col-12'}
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.4) }}
                    >
                      {viewMode === 'grid' ? (
                        <ProductCard product={product} onLoginClick={onLoginClick} />
                      ) : (
                        <div style={{ display: 'flex', gap: 16, background: 'white', borderRadius: 14, border: '1px solid #e8e0d8', padding: 16, transition: 'all 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
                          onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                          <img src={product.images?.[0]?.url} alt={product.name}
                            style={{ width: 100, height: 120, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ color: '#c0392b', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>{product.category}</div>
                            <Link to={`/products/${product._id}`}>
                              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', marginBottom: 6 }}>{product.name}</h4>
                            </Link>
                            <p style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>₹{product.price?.toLocaleString('en-IN')}</span>
                              {product.originalPrice > product.price && <span style={{ color: '#aaa', textDecoration: 'line-through', fontSize: '0.85rem' }}>₹{product.originalPrice?.toLocaleString('en-IN')}</span>}
                              {product.discount > 0 && <span style={{ background: '#e8f8f0', color: '#27ae60', padding: '2px 8px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{product.discount}% off</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 48 }}>
                    <button onClick={() => setPage(page - 1)} disabled={page === 1}
                      style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid #e8e0d8', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                      <FiChevronLeft size={16} />
                    </button>
                    {[...Array(pages)].map((_, i) => (
                      i === 0 || i === pages - 1 || Math.abs(i + 1 - page) <= 1 ? (
                        <button key={i} onClick={() => setPage(i + 1)}
                          style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s', borderColor: page === i + 1 ? '#c0392b' : '#e8e0d8', background: page === i + 1 ? '#c0392b' : 'white', color: page === i + 1 ? 'white' : '#333' }}>
                          {i + 1}
                        </button>
                      ) : i === 1 || i === pages - 2 ? (
                        <span key={i} style={{ color: '#bbb' }}>…</span>
                      ) : null
                    ))}
                    <button onClick={() => setPage(page + 1)} disabled={page === pages}
                      style={{ width: 38, height: 38, borderRadius: 10, border: '1.5px solid #e8e0d8', background: 'white', cursor: page === pages ? 'not-allowed' : 'pointer', opacity: page === pages ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
};

export default ProductsPage;

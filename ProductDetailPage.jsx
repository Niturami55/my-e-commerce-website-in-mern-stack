import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiHeart, FiShoppingCart, FiStar, FiTruck, FiRotateCcw, FiShare2, FiChevronLeft } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const ProductDetailPage = ({ onLoginClick }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWishlist, isWishlisted } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setProduct(data.product);
        if (data.product.colors?.length) setSelectedColor(data.product.colors[0].name);
        if (data.product.sizes?.length) setSelectedSize(data.product.sizes[0]);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const wished = product ? isWishlisted(product._id) : false;

  const handleAddToCart = async () => {
    if (!user) { onLoginClick?.(); return; }
    if (!selectedSize) { toast.error('Please select a size'); return; }
    setAddingToCart(true);
    try {
      await addToCart(product._id, selectedSize, selectedColor, quantity);
      toast.success('Added to cart! 🛍️');
    } catch {
      toast.error('Could not add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) { onLoginClick?.(); return; }
    await toggleWishlist(product._id);
    toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { onLoginClick?.(); return; }
    setSubmittingReview(true);
    try {
      await axios.post(`${API_URL}/reviews/${product._id}`, reviewForm);
      toast.success('Review submitted!');
      const { data } = await axios.get(`${API_URL}/products/${id}`);
      setProduct(data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<FaStar key={i} color="#d4ac0d" />);
      else if (i - rating < 1) stars.push(<FaStarHalfAlt key={i} color="#d4ac0d" />);
      else stars.push(<FaRegStar key={i} color="#ddd" />);
    }
    return stars;
  };

  if (loading) return <div className="page-loader"><div className="spinner-brand" /></div>;
  if (!product) return null;

  return (
    <div style={{ padding: '30px 0 80px', background: '#fafafa' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb-brand mb-4">
          <a href="/">Home</a> ›
          <Link to={`/products?category=${product.category}`}>{product.category}</Link> ›
          <span className="current">{product.name}</span>
        </div>

        <div className="row g-4">
          {/* Image Gallery */}
          <div className="col-md-6">
            <div style={{ display: 'flex', gap: 12 }}>
              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {product.images.map((img, i) => (
                    <div key={i} onClick={() => setSelectedImage(i)}
                      style={{
                        width: 70, height: 85, borderRadius: 10, overflow: 'hidden',
                        cursor: 'pointer', border: i === selectedImage ? '2px solid #c0392b' : '2px solid transparent',
                        flexShrink: 0
                      }}>
                      <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
              {/* Main Image */}
              <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', background: '#f8f4f0', position: 'relative' }}>
                <img
                  src={product.images?.[selectedImage]?.url || ''}
                  alt={product.name}
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
                />
                {product.discount > 0 && (
                  <div style={{
                    position: 'absolute', top: 16, left: 16,
                    background: '#c0392b', color: 'white', padding: '6px 14px',
                    borderRadius: 20, fontSize: '0.8rem', fontWeight: 700
                  }}>
                    {product.discount}% OFF
                  </div>
                )}
                <button onClick={handleWishlist} style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'white', border: 'none', borderRadius: '50%',
                  width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', color: wished ? '#c0392b' : '#666'
                }}>
                  <FiHeart fill={wished ? 'currentColor' : 'none'} size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-6">
            <div style={{ padding: '0 8px' }}>
              {/* Category & Brand */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: '#c0392b', fontWeight: 600, fontSize: '0.8rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  {product.category} · {product.fabric || product.subCategory}
                </span>
                {product.isTrending && (
                  <span style={{ background: '#fff3cd', color: '#856404', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>🔥 Trending</span>
                )}
              </div>

              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: 12, lineHeight: 1.3 }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 2 }}>{renderStars(product.rating)}</div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.rating}</span>
                <span style={{ color: '#999', fontSize: '0.85rem' }}>({product.numReviews} reviews)</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span style={{ fontSize: '1.1rem', color: '#aaa', textDecoration: 'line-through' }}>
                      ₹{product.originalPrice?.toLocaleString('en-IN')}
                    </span>
                    <span style={{ background: '#e8f8f0', color: '#27ae60', padding: '4px 12px', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem' }}>
                      {product.discount}% off
                    </span>
                  </>
                )}
              </div>

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', marginBottom: 10 }}>
                    Color: <span style={{ color: '#1a1a2e' }}>{selectedColor}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {product.colors.map((c, i) => (
                      <div key={i} onClick={() => setSelectedColor(c.name)} title={c.name}
                        style={{
                          width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
                          background: c.hex, border: selectedColor === c.name ? '3px solid #c0392b' : '2px solid #ddd',
                          boxShadow: selectedColor === c.name ? '0 0 0 2px white, 0 0 0 4px #c0392b' : 'none',
                          transition: 'all 0.2s'
                        }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', marginBottom: 10 }}>
                    Size: <span style={{ color: '#1a1a2e' }}>{selectedSize}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {product.sizes.map(size => (
                      <button key={size} className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#666', marginBottom: 10 }}>Quantity</div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-display">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <span style={{ fontSize: '0.8rem', color: product.stock < 10 ? '#e74c3c' : '#27ae60', marginTop: 6, display: 'block' }}>
                  {product.stock < 10 ? `Only ${product.stock} left!` : '✓ In Stock'}
                </span>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <button className="btn-primary-brand" onClick={handleAddToCart} disabled={addingToCart}
                  style={{ flex: 1, minWidth: 160, justifyContent: 'center', padding: '14px 24px', fontSize: '1rem' }}>
                  <FiShoppingCart size={18} />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button className="btn-outline-brand" onClick={handleWishlist}
                  style={{ flex: 1, minWidth: 140, justifyContent: 'center', padding: '14px 24px', fontSize: '1rem' }}>
                  <FiHeart fill={wished ? 'currentColor' : 'none'} />
                  Wishlist
                </button>
              </div>

              {/* Info strips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { icon: FiTruck, text: 'Free delivery on orders above ₹999' },
                  { icon: FiRotateCcw, text: '30-day easy returns & exchanges' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 14px', background: '#f8f4f0', borderRadius: 10 }}>
                    <item.icon color="#c0392b" size={16} />
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{ borderTop: '1px solid #e8e0d8', paddingTop: 20 }}>
                <h4 style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.95rem' }}>Product Description</h4>
                <p style={{ color: '#666', lineHeight: 1.8, fontSize: '0.9rem' }}>{product.description}</p>
                {product.occasion && (
                  <div style={{ marginTop: 12 }}>
                    <span className="tag-pill">🎯 {product.occasion}</span>
                    {product.fabric && <span className="tag-pill">🧵 {product.fabric}</span>}
                    {product.brand && <span className="tag-pill">🏷️ {product.brand}</span>}
                    {product.tags?.map(tag => <span key={tag} className="tag-pill">#{tag}</span>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: 60 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 28 }}>
            Customer Reviews ({product.numReviews})
          </h2>
          <div className="row g-4">
            {/* Review List */}
            <div className="col-lg-8">
              {product.reviews?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8f4f0', borderRadius: 16 }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⭐</div>
                  <p style={{ color: '#999' }}>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                product.reviews.map((review, i) => (
                  <div key={i} className="review-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #c0392b, #d4ac0d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                          {review.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.name}</div>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {[...Array(5)].map((_, j) => (
                              <FaStar key={j} size={11} color={j < review.rating ? '#d4ac0d' : '#ddd'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#aaa' }}>{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write Review */}
            <div className="col-lg-4">
              <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e8e0d8' }}>
                <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Write a Review</h4>
                {!user ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#999', fontSize: '0.88rem', marginBottom: 12 }}>Login to write a review</p>
                    <button className="btn-primary-brand" onClick={onLoginClick}>Login</button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    <div style={{ marginBottom: 16 }}>
                      <label className="form-label-brand">Rating</label>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar key={star} size={24} color={star <= reviewForm.rating ? '#d4ac0d' : '#ddd'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))} />
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label className="form-label-brand">Your Review</label>
                      <textarea className="form-control-brand" rows={4} placeholder="Share your experience..."
                        value={reviewForm.comment} onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))} required />
                    </div>
                    <button type="submit" className="btn-primary-brand" style={{ width: '100%', justifyContent: 'center' }} disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

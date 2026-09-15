import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const WishlistPage = ({ onLoginClick }) => {
  const { user, wishlist, toggleWishlist } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !wishlist.length) { setLoading(false); return; }
    const fetchWishlistProducts = async () => {
      try {
        // Fetch each product
        const promises = wishlist.slice(0, 20).map(id => axios.get(`${API_URL}/products/${id}`).catch(() => null));
        const results = await Promise.all(promises);
        setProducts(results.filter(r => r).map(r => r.data.product));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [user, wishlist]);

  const handleRemove = async (productId, name) => {
    await toggleWishlist(productId);
    setProducts(prev => prev.filter(p => p._id !== productId));
    toast.success(`Removed from wishlist`);
  };

  if (!user) {
    return (
      <div className="empty-state" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="empty-icon">❤️</div>
        <h2 className="empty-title">Login to view your wishlist</h2>
        <button className="btn-primary-brand" onClick={onLoginClick} style={{ margin: '0 auto' }}>Login</button>
      </div>
    );
  }

  if (loading) return <div className="page-loader"><div className="spinner-brand" /></div>;

  if (!products.length) {
    return (
      <div className="empty-state" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="empty-icon">❤️</div>
        <h2 className="empty-title">Your wishlist is empty</h2>
        <p className="empty-text">Save your favourite items to wishlist</p>
        <Link to="/products" className="btn-primary-brand" style={{ margin: '0 auto', textDecoration: 'none' }}>
          <FiHeart /> Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 0 80px', background: '#fafafa', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 28 }}>
          My Wishlist <span style={{ fontSize: '1rem', color: '#999', fontFamily: 'Inter', fontWeight: 400 }}>({products.length} items)</span>
        </h1>
        <div className="row g-3">
          {products.map(product => (
            <div className="col-6 col-md-4 col-lg-3" key={product._id}>
              <div style={{ position: 'relative' }}>
                <button onClick={() => handleRemove(product._id, product.name)}
                  style={{
                    position: 'absolute', top: 10, right: 10, zIndex: 10,
                    background: 'white', border: 'none', borderRadius: '50%',
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: '#c0392b'
                  }}>
                  <FiTrash2 size={14} />
                </button>
                <ProductCard product={product} onLoginClick={onLoginClick} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

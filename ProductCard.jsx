import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onLoginClick }) => {
  const { user, toggleWishlist, isWishlisted } = useAuth();
  const { addToCart } = useCart();
  const wished = isWishlisted(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { onLoginClick?.(); return; }
    await toggleWishlist(product._id);
    toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { onLoginClick?.(); return; }
    if (!product.sizes?.length) {
      toast.error('Please select size on product page');
      return;
    }
    try {
      await addToCart(product._id, product.sizes[0], '', 1);
      toast.success('Added to cart! 🛍️');
    } catch {
      toast.error('Could not add to cart');
    }
  };

  return (
    <div className="product-card h-100">
      <div className="product-image-wrapper">
        <Link to={`/products/${product._id}`}>
          <img
            className="product-image"
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        {product.discount > 0 && (
          <span className="product-badge">{product.discount}% OFF</span>
        )}
        {product.isTrending && !product.discount && (
          <span className="product-badge trending">🔥 Trending</span>
        )}

        {/* Actions */}
        <div className="product-actions">
          <button
            className={`action-btn ${wished ? 'wished' : ''}`}
            onClick={handleWishlist}
            title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart fill={wished ? 'currentColor' : 'none'} />
          </button>
          <Link to={`/products/${product._id}`} className="action-btn" title="View details">
            <FiEye />
          </Link>
        </div>
      </div>

      <div className="product-info">
        <div className="product-category-tag">{product.category}</div>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="star-rating mb-2">
            <span className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={11} color={i < Math.round(product.rating) ? '#d4ac0d' : '#ddd'} />
              ))}
            </span>
            <span>({product.numReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="product-price">
          <span className="current-price">₹{product.price?.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
          {product.discount > 0 && (
            <span className="discount-tag">{product.discount}% off</span>
          )}
        </div>

        {/* Colors preview */}
        {product.colors?.length > 0 && (
          <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
            {product.colors.slice(0, 4).map((c, i) => (
              <div key={i} title={c.name} style={{
                width: 14, height: 14, borderRadius: '50%',
                background: c.hex, border: '1.5px solid #ddd'
              }} />
            ))}
          </div>
        )}
      </div>

      <button className="quick-add-btn" onClick={handleQuickAdd}>
        <FiShoppingCart size={14} style={{ marginRight: 6 }} />
        Quick Add
      </button>
    </div>
  );
};

export default ProductCard;

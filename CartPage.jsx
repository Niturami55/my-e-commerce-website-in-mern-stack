import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage = ({ onLoginClick }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="empty-state" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="empty-icon">🛒</div>
        <h2 className="empty-title">Please login to view your cart</h2>
        <p className="empty-text">Login to access your saved cart items</p>
        <button className="btn-primary-brand" onClick={onLoginClick} style={{ margin: '0 auto' }}>Login Now</button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-state" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="empty-icon">🛒</div>
        <h2 className="empty-title">Your cart is empty!</h2>
        <p className="empty-text">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn-primary-brand" style={{ margin: '0 auto', textDecoration: 'none' }}>
          <FiShoppingBag /> Start Shopping
        </Link>
      </div>
    );
  }

  const shippingPrice = cartTotal > 999 ? 0 : 99;
  const taxPrice = Math.round(cartTotal * 0.05);
  const totalPrice = cartTotal + shippingPrice + taxPrice;

  const handleRemove = async (itemId, name) => {
    await removeFromCart(itemId);
    toast.success(`Removed "${name}" from cart`);
  };

  return (
    <div style={{ padding: '30px 0 80px', background: '#fafafa', minHeight: '80vh' }}>
      <div className="container">
        <div className="d-flex align-items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
            <FiArrowLeft size={20} />
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', margin: 0 }}>
            Shopping Cart <span style={{ color: '#999', fontSize: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>({cartItems.length} items)</span>
          </h1>
        </div>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            {cartItems.map(item => {
              const product = item.product;
              if (!product) return null;
              return (
                <div className="cart-item" key={item._id}>
                  <img
                    className="cart-item-img"
                    src={product.images?.[0]?.url || ''}
                    alt={product.name}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Link to={`/products/${product._id}`}>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: 4, color: '#1a1a2e', fontSize: '0.95rem' }}>{product.name}</div>
                        </Link>
                        <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: 8 }}>
                          Size: <strong>{item.size}</strong>
                          {item.color && <> · Color: <strong>{item.color}</strong></>}
                        </div>
                      </div>
                      <button onClick={() => handleRemove(item._id, product.name)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', padding: '4px' }}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                        <span className="qty-display">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>₹{(product.price * item.quantity).toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '0.78rem', color: '#999' }}>₹{product.price?.toLocaleString('en-IN')} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="order-summary-card">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', marginBottom: 20 }}>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span style={{ fontWeight: 600 }}>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className={`summary-row ${shippingPrice === 0 ? 'free' : ''}`}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600 }}>{shippingPrice === 0 ? 'FREE 🎉' : `₹${shippingPrice}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5% GST)</span>
                <span style={{ fontWeight: 600 }}>₹{taxPrice.toLocaleString('en-IN')}</span>
              </div>
              {shippingPrice > 0 && (
                <div style={{ background: '#fff3cd', borderRadius: 10, padding: '10px 14px', marginBottom: 8, fontSize: '0.82rem', color: '#856404' }}>
                  🎁 Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more to get FREE shipping!
                </div>
              )}
              <div className="summary-row total" style={{ paddingTop: 14, marginTop: 4 }}>
                <span>Total</span>
                <span style={{ color: '#c0392b' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              {/* Coupon */}
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <FiTag style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} size={14} />
                  <input className="form-control-brand" placeholder="Coupon code" style={{ paddingLeft: 36, fontSize: '0.85rem' }} />
                </div>
                <button className="btn-outline-brand" style={{ padding: '10px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Apply</button>
              </div>

              <button className="btn-primary-brand" onClick={() => navigate('/checkout')}
                style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '14px', fontSize: '1rem' }}>
                Proceed to Checkout
              </button>

              <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: '#999', fontSize: '0.85rem', textDecoration: 'none' }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

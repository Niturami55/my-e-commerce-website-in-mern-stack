import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shippingPrice = cartTotal > 999 ? 0 : 99;
  const taxPrice = Math.round(cartTotal * 0.05);
  const totalPrice = cartTotal + shippingPrice + taxPrice;

  const handleAddressChange = e => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return;
    setLoading(true);
    try {
      const items = cartItems.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0]?.url || '',
        price: item.product.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity
      }));

      const { data } = await axios.post(`${API_URL}/orders`, {
        items,
        shippingAddress: address,
        paymentMethod
      });

      setOrderId(data.order._id);
      setOrderPlaced(true);
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div style={{ textAlign: 'center', padding: '100px 20px' }}><Link to="/" className="btn-primary-brand">Go Home</Link></div>;

  if (orderPlaced) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fafafa' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#e8f8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FiCheckCircle size={40} color="#27ae60" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: 12 }}>Order Placed! 🎉</h1>
          <p style={{ color: '#666', lineHeight: 1.8, marginBottom: 8 }}>
            Your order has been placed successfully. You'll receive a confirmation email shortly.
          </p>
          <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: 28 }}>Order ID: #{orderId}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/orders" className="btn-primary-brand">Track My Orders</Link>
            <Link to="/products" className="btn-outline-brand">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const states = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'];

  return (
    <div style={{ padding: '30px 0 80px', background: '#fafafa', minHeight: '80vh' }}>
      <div className="container">
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 28 }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 36, background: 'white', borderRadius: 14, padding: '4px', border: '1px solid #e8e0d8', width: 'fit-content' }}>
          {['Shipping', 'Payment', 'Review'].map((s, i) => (
            <button key={s} onClick={() => i + 1 < step && setStep(i + 1)}
              style={{
                padding: '10px 24px', borderRadius: 10, border: 'none', cursor: i + 1 < step ? 'pointer' : 'default',
                background: step === i + 1 ? '#c0392b' : 'transparent',
                color: step === i + 1 ? 'white' : '#999',
                fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s'
              }}>
              {i + 1}. {s}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-8">
            <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #e8e0d8' }}>
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>Shipping Address</h3>
                  <div className="row g-3">
                    {[
                      { name: 'name', label: 'Full Name *', placeholder: 'Enter full name', col: 6 },
                      { name: 'phone', label: 'Phone Number *', placeholder: '+91 98765 43210', col: 6 },
                      { name: 'email', label: 'Email Address *', placeholder: 'your@email.com', col: 12 },
                      { name: 'street', label: 'Street Address *', placeholder: 'House no, Street, Area', col: 12 },
                      { name: 'city', label: 'City *', placeholder: 'Enter city', col: 6 },
                      { name: 'pincode', label: 'Pincode *', placeholder: '110001', col: 6 },
                    ].map(field => (
                      <div className={`col-md-${field.col}`} key={field.name}>
                        <label className="form-label-brand">{field.label}</label>
                        <input name={field.name} type="text" className="form-control-brand"
                          placeholder={field.placeholder} value={address[field.name]}
                          onChange={handleAddressChange} required />
                      </div>
                    ))}
                    <div className="col-md-12">
                      <label className="form-label-brand">State *</label>
                      <select name="state" className="form-control-brand" value={address.state} onChange={handleAddressChange} required>
                        <option value="">Select State</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className="btn-primary-brand" onClick={() => setStep(2)} style={{ marginTop: 24, padding: '12px 32px' }}
                    disabled={!address.name || !address.phone || !address.street || !address.city || !address.state || !address.pincode}>
                    Continue to Payment →
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>Payment Method</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                      { value: 'UPI', label: 'UPI Payment', icon: '📱', desc: 'PhonePe, GPay, Paytm, etc.' },
                      { value: 'Card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                      { value: 'Razorpay', label: 'Razorpay', icon: '⚡', desc: 'All payment methods via Razorpay' },
                    ].map(method => (
                      <label key={method.value} style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                        border: `2px solid ${paymentMethod === method.value ? '#c0392b' : '#e8e0d8'}`,
                        borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                        background: paymentMethod === method.value ? 'rgba(192,57,43,0.04)' : 'white'
                      }}>
                        <input type="radio" value={method.value} checked={paymentMethod === method.value}
                          onChange={e => setPaymentMethod(e.target.value)} style={{ accentColor: '#c0392b' }} />
                        <span style={{ fontSize: '1.3rem' }}>{method.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{method.label}</div>
                          <div style={{ fontSize: '0.78rem', color: '#999' }}>{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button className="btn-outline-brand" onClick={() => setStep(1)} style={{ padding: '12px 24px' }}>← Back</button>
                    <button className="btn-primary-brand" onClick={() => setStep(3)} style={{ padding: '12px 32px' }}>Review Order →</button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 24 }}>Review Your Order</h3>
                  <div style={{ background: '#f8f4f0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>Shipping To</div>
                    <p style={{ margin: 0, lineHeight: 2, fontSize: '0.92rem' }}>
                      {address.name}<br />
                      {address.street}, {address.city}, {address.state} - {address.pincode}<br />
                      📞 {address.phone} · ✉️ {address.email}
                    </p>
                  </div>
                  <div style={{ background: '#f8f4f0', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                    <div style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>Order Items</div>
                    {cartItems.map(item => (
                      <div key={item._id} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'center' }}>
                        <img src={item.product?.images?.[0]?.url} alt={item.product?.name} style={{ width: 50, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.product?.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#999' }}>Size: {item.size} · Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: 700 }}>₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#f8f4f0', borderRadius: 12, padding: '12px 20px', marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Payment via</span>
                      <span style={{ fontWeight: 600 }}>{paymentMethod}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-outline-brand" onClick={() => setStep(2)} style={{ padding: '12px 24px' }}>← Back</button>
                    <button className="btn-primary-brand" onClick={handlePlaceOrder} disabled={loading} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
                      {loading ? 'Placing Order...' : `Place Order · ₹${totalPrice.toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div className="order-summary-card">
              <h4 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>Order Summary</h4>
              {cartItems.slice(0, 3).map(item => (
                <div key={item._id} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                  <img src={item.product?.images?.[0]?.url} alt="" style={{ width: 44, height: 52, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3 }}>{item.product?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              ))}
              {cartItems.length > 3 && <p style={{ color: '#999', fontSize: '0.8rem', textAlign: 'center' }}>+{cartItems.length - 3} more items</p>}
              <div style={{ borderTop: '1px solid #e8e0d8', marginTop: 16, paddingTop: 16 }}>
                <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                <div className={`summary-row ${shippingPrice === 0 ? 'free' : ''}`}><span>Shipping</span><span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span></div>
                <div className="summary-row"><span>GST (5%)</span><span>₹{taxPrice}</span></div>
                <div className="summary-row total"><span>Total</span><span style={{ color: '#c0392b' }}>₹{totalPrice.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiPackage, FiChevronDown, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const statusColors = {
  Placed: { bg: '#e8f4fd', color: '#1a73e8', label: '📦 Placed' },
  Processing: { bg: '#fff3cd', color: '#856404', label: '⚙️ Processing' },
  Shipped: { bg: '#d1ecf1', color: '#0c5460', label: '🚚 Shipped' },
  'Out for Delivery': { bg: '#d4edda', color: '#155724', label: '🏃 Out for Delivery' },
  Delivered: { bg: '#d4edda', color: '#155724', label: '✅ Delivered' },
  Cancelled: { bg: '#f8d7da', color: '#721c24', label: '❌ Cancelled' },
  Returned: { bg: '#e2e3e5', color: '#383d41', label: '↩️ Returned' },
};

const OrdersPage = ({ onLoginClick }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/orders/my`);
        setOrders(data.orders);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    setCancelling(orderId);
    try {
      await axios.put(`${API_URL}/orders/${orderId}/cancel`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    } finally {
      setCancelling(null);
    }
  };

  if (!user) {
    return (
      <div className="empty-state" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="empty-icon">📦</div>
        <h2 className="empty-title">Please login to view orders</h2>
        <button className="btn-primary-brand" onClick={onLoginClick} style={{ margin: '0 auto' }}>Login</button>
      </div>
    );
  }

  if (loading) return <div className="page-loader"><div className="spinner-brand" /></div>;

  if (orders.length === 0) {
    return (
      <div className="empty-state" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="empty-icon">📦</div>
        <h2 className="empty-title">No orders yet</h2>
        <p className="empty-text">Start shopping to see your orders here.</p>
        <Link to="/products" className="btn-primary-brand" style={{ margin: '0 auto', textDecoration: 'none' }}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 0 80px', background: '#fafafa', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 28 }}>My Orders</h1>

        {orders.map(order => {
          const status = statusColors[order.orderStatus] || statusColors.Placed;
          const isExpanded = expandedOrder === order._id;

          return (
            <div key={order._id} style={{
              background: 'white', borderRadius: 16, border: '1px solid #e8e0d8',
              marginBottom: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              {/* Order Header */}
              <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, cursor: 'pointer' }}
                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 4 }}>
                    Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#999' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    &nbsp;·&nbsp; {order.items?.length} item{order.items?.length > 1 ? 's' : ''}
                    &nbsp;·&nbsp; ₹{order.totalPrice?.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ background: status.bg, color: status.color, padding: '5px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>
                    {status.label}
                  </span>
                  <FiChevronDown size={16} color="#999" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #f0e8e0', padding: '20px 24px' }}>
                  {/* Items */}
                  <div style={{ marginBottom: 20 }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 12, alignItems: 'center' }}>
                        <img src={item.image} alt={item.name} style={{ width: 60, height: 72, objectFit: 'cover', borderRadius: 10 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#999' }}>Size: {item.size} · Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div style={{ background: '#f8f4f0', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: 6, color: '#666' }}>Shipping Address</div>
                    <div style={{ color: '#555', lineHeight: 1.8 }}>
                      {order.shippingAddress?.name}<br />
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </div>
                  </div>

                  {/* Payment & Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      Payment: <strong>{order.paymentMethod}</strong>
                      &nbsp;|&nbsp; Status: <strong style={{ color: status.color }}>{order.paymentStatus}</strong>
                    </div>
                    {['Placed', 'Processing'].includes(order.orderStatus) && (
                      <button onClick={() => handleCancel(order._id)} disabled={cancelling === order._id}
                        style={{
                          background: 'none', border: '1.5px solid #e74c3c', color: '#e74c3c',
                          padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#e74c3c'; }}>
                        {cancelling === order._id ? 'Cancelling...' : '✕ Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;

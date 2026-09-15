import React, { useState } from 'react';
import { FiX, FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthModal = ({ mode, onClose, onSwitchMode }) => {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (mode === 'register' && !form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        setSuccess(true);
        toast.success('Welcome back! 🎉');
        setTimeout(onClose, 800);
      } else {
        await register(form.name, form.email, form.password, form.phone);
        setSuccess(true);
        toast.success("Welcome to Shopper's Stop! 🛍️");
        setTimeout(onClose, 800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) setErrors({ email: msg });
      else if (msg.toLowerCase().includes('password')) setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal" style={{ position: 'relative', maxWidth: 460 }}>

        {/* Success overlay */}
        {success && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 28,
            background: 'white', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', zIndex: 10,
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16, animation: 'bounceIn 0.5s ease'
            }}>
              <FiCheckCircle size={36} color="white" />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: 6 }}>
              {mode === 'login' ? 'Welcome Back!' : 'Account Created!'}
            </h3>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Redirecting you now...</p>
          </div>
        )}

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 18, right: 18,
          background: '#f5f0eb', border: 'none', cursor: 'pointer',
          color: '#666', borderRadius: '50%', width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', zIndex: 5
        }}
          onMouseOver={e => { e.currentTarget.style.background = '#e8e0d8'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#f5f0eb'; }}>
          <FiX size={16} />
        </button>

        {/* Logo + Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #c0392b, #922b21)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', boxShadow: '0 4px 15px rgba(192,57,43,0.35)'
          }}>
            <span style={{ color: '#d4ac0d', fontSize: '1.5rem' }}>👗</span>
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 700, marginBottom: 4 }}>
            Shopper's<span style={{ color: '#d4ac0d' }}>Stop</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p style={{ color: '#999', fontSize: '0.85rem' }}>
            {mode === 'login'
              ? 'Access your orders, wishlist & more'
              : 'Join 50,000+ fashion lovers today'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label className="form-label-brand">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input
                  name="name" type="text"
                  className="form-control-brand"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  style={{ paddingLeft: 38, borderColor: errors.name ? '#e74c3c' : '' }}
                />
              </div>
              {errors.name && <p style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: 4 }}>⚠ {errors.name}</p>}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="form-label-brand">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input
                name="email" type="email"
                className="form-control-brand"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                style={{ paddingLeft: 38, borderColor: errors.email ? '#e74c3c' : '' }}
              />
            </div>
            {errors.email && <p style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: 4 }}>⚠ {errors.email}</p>}
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label className="form-label-brand">Phone Number <span style={{ color: '#bbb' }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                <FiPhone size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input
                  name="phone" type="tel"
                  className="form-control-brand"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ paddingLeft: 38 }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label-brand" style={{ margin: 0 }}>Password *</label>
              {mode === 'login' && (
                <button type="button" style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>
                  Forgot password?
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <FiLock size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control-brand"
                placeholder={mode === 'register' ? 'Min. 6 characters' : 'Enter your password'}
                value={form.password}
                onChange={handleChange}
                style={{ paddingLeft: 38, paddingRight: 44, borderColor: errors.password ? '#e74c3c' : '' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#aaa',
                display: 'flex', alignItems: 'center'
              }}>
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: 4 }}>⚠ {errors.password}</p>}
            {mode === 'register' && !errors.password && form.password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: form.password.length >= i * 2
                        ? i <= 1 ? '#e74c3c' : i <= 2 ? '#e67e22' : i <= 3 ? '#f1c40f' : '#27ae60'
                        : '#e8e0d8',
                      transition: 'all 0.3s'
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#999', marginTop: 4, display: 'block' }}>
                  {form.password.length < 4 ? 'Weak' : form.password.length < 6 ? 'Fair' : form.password.length < 9 ? 'Good' : 'Strong'} password
                </span>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 50,
              border: 'none',
              background: loading
                ? 'linear-gradient(135deg, #e8a09a, #c9806a)'
                : 'linear-gradient(135deg, #c0392b, #922b21)',
              color: 'white',
              fontSize: '0.98rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(192,57,43,0.4)',
              letterSpacing: 0.5,
              fontFamily: "'Inter', sans-serif"
            }}>
            {loading ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'login' ? '🔐 Sign In' : '🚀 Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e8e0d8' }} />
          <span style={{ color: '#bbb', fontSize: '0.8rem' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#e8e0d8' }} />
        </div>

        {/* Switch mode */}
        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#777' }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button style={{ background: 'none', border: 'none', color: '#c0392b', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
                onClick={() => onSwitchMode('register')}>
                Sign Up for Free →
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button style={{ background: 'none', border: 'none', color: '#c0392b', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
                onClick={() => onSwitchMode('login')}>
                Sign In →
              </button>
            </>
          )}
        </div>

        {/* Trust signals */}
        <div style={{
          marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20,
          padding: '14px', background: '#faf6f1', borderRadius: 12
        }}>
          {['🔒 Secure', '📦 Free Returns', '⭐ 4.8 Rating'].map(t => (
            <span key={t} style={{ fontSize: '0.75rem', color: '#888', fontWeight: 500 }}>{t}</span>
          ))}
        </div>

        {/* Demo credentials hint */}
        {mode === 'login' && (
          <div style={{
            marginTop: 12, padding: '8px 14px', background: '#fff8e1',
            borderRadius: 10, fontSize: '0.76rem', color: '#8a6d3b',
            textAlign: 'center', border: '1px solid #ffe082'
          }}>
            💡 Demo Admin: <strong>admin@shoppersstop.com</strong> / <strong>admin123</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

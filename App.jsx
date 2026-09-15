import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import AuthModal from './components/AuthModal';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openLogin = () => { setAuthMode('login'); setShowAuthModal(true); };
  const openRegister = () => { setAuthMode('register'); setShowAuthModal(true); };

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage onLoginClick={openLogin} />} />
                <Route path="/products" element={<ProductsPage onLoginClick={openLogin} />} />
                <Route path="/products/:id" element={<ProductDetailPage onLoginClick={openLogin} />} />
                <Route path="/cart" element={<CartPage onLoginClick={openLogin} />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage onLoginClick={openLogin} />} />
                <Route path="/wishlist" element={<WishlistPage onLoginClick={openLogin} />} />
              </Routes>
            </main>
            <Footer />
            {showAuthModal && (
              <AuthModal
                mode={authMode}
                onClose={() => setShowAuthModal(false)}
                onSwitchMode={(m) => setAuthMode(m)}
              />
            )}
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

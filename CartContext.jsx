import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/cart`);
      setCartItems(data.cart?.items || []);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, size, color, quantity = 1) => {
    const { data } = await axios.post(`${API_URL}/cart`, { productId, size, color, quantity });
    setCartItems(data.cart.items);
    return data;
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await axios.put(`${API_URL}/cart/${itemId}`, { quantity });
    setCartItems(data.cart.items);
  };

  const removeFromCart = async (itemId) => {
    const { data } = await axios.delete(`${API_URL}/cart/${itemId}`);
    setCartItems(data.cart.items);
  };

  const clearCart = async () => {
    await axios.delete(`${API_URL}/cart/clear/all`);
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

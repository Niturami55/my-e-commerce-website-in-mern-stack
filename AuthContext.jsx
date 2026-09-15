import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ss_token') || null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/me`);
      setUser(data.user);
      setWishlist(data.user.wishlist?.map(w => w._id || w) || []);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem('ss_token', data.token);
    setToken(data.token);
    setUser(data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password, phone });
    localStorage.setItem('ss_token', data.token);
    setToken(data.token);
    setUser(data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ss_token');
    setToken(null);
    setUser(null);
    setWishlist([]);
    delete axios.defaults.headers.common['Authorization'];
  };

  const toggleWishlist = async (productId) => {
    if (!user) return false;
    try {
      const { data } = await axios.put(`${API_URL}/auth/wishlist/${productId}`);
      setWishlist(data.wishlist);
      return data.wishlist.includes(productId);
    } catch {
      return false;
    }
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  return (
    <AuthContext.Provider value={{ user, token, loading, wishlist, login, register, logout, toggleWishlist, isWishlisted }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shopease_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user details if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to authenticate session:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (phone, password) => {
    try {
      const data = await api.post('/auth/login', { phone, password });
      if (data.success) {
        localStorage.setItem('shopease_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return { success: true, user: data.user };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const register = async (name, phone, password, confirmPassword) => {
    try {
      const data = await api.post('/auth/register', { name, phone, password, confirmPassword });
      if (data.success) {
        localStorage.setItem('shopease_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success('Account created successfully!');
        return { success: true, user: data.user };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('shopease_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (formData) => {
    try {
      const data = await api.put('/auth/profile', formData);
      if (data.success) {
        setUser(prev => ({ ...prev, ...data.user }));
        toast.success('Profile updated successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const changePassword = async (oldPassword, newPassword, confirmNewPassword) => {
    try {
      const data = await api.put('/auth/change-password', { oldPassword, newPassword, confirmNewPassword });
      if (data.success) {
        toast.success('Password changed successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const addAddress = async (addressData) => {
    try {
      const data = await api.post('/auth/addresses', addressData);
      if (data.success) {
        setUser(prev => ({ ...prev, addresses: data.addresses }));
        toast.success('Address added');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const data = await api.put(`/auth/addresses/${addressId}`, addressData);
      if (data.success) {
        setUser(prev => ({ ...prev, addresses: data.addresses }));
        toast.success('Address updated');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const data = await api.delete(`/auth/addresses/${addressId}`);
      if (data.success) {
        setUser(prev => ({ ...prev, addresses: data.addresses }));
        toast.success('Address removed');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

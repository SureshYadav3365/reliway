import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    savedForLater: [],
    subtotal: 0,
    deliveryCharge: 0,
    tax: 0,
    grandTotal: 0
  });
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend whenever user is authenticated
  const fetchCart = async () => {
    if (!token) {
      setCart({
        items: [],
        savedForLater: [],
        subtotal: 0,
        deliveryCharge: 0,
        tax: 0,
        grandTotal: 0
      });
      return;
    }
    try {
      setLoading(true);
      const data = await api.get('/cart');
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Fetch cart error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId, variant = '', quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your cart');
      return { success: false, requireAuth: true };
    }
    try {
      const data = await api.post('/cart', { productId, variant, quantity });
      if (data.success && data.cart) {
        setCart(data.cart);
        toast.success('Added to Cart!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const data = await api.put(`/cart/${itemId}`, { quantity });
      if (data.success && data.cart) {
        setCart(data.cart);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const data = await api.delete(`/cart/${itemId}`);
      if (data.success && data.cart) {
        setCart(data.cart);
        toast.success('Item removed');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    }
  };

  const toggleSaveForLater = async (itemId) => {
    try {
      const data = await api.patch(`/cart/${itemId}/save-for-later`);
      if (data.success && data.cart) {
        setCart(data.cart);
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart(prev => ({
        ...prev,
        items: [],
        subtotal: 0,
        deliveryCharge: 0,
        tax: 0,
        grandTotal: 0
      }));
      setCoupon(null);
    } catch (error) {
      console.error('Clear cart error:', error.message);
    }
  };

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      toast.error('Please enter a coupon code');
      return { success: false };
    }
    try {
      const data = await api.post('/coupons/validate', {
        code: code.trim(),
        cartTotal: cart.subtotal
      });
      if (data.success && data.coupon) {
        setCoupon(data.coupon);
        toast.success(`Coupon applied: -₹${data.coupon.discountAmount}`);
        return { success: true, coupon: data.coupon };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.success('Coupon removed');
  };

  // Compute final total considering applied coupon
  const discountAmount = coupon ? coupon.discountAmount : 0;
  const priceAfterDiscount = Math.max(0, cart.subtotal - discountAmount);
  const deliveryCharge = cart.items.length === 0 ? 0 : (priceAfterDiscount >= 500 ? 0 : 50);
  const tax = Math.round(priceAfterDiscount * 0.05);
  const grandTotalWithDiscount = priceAfterDiscount + deliveryCharge + tax;

  const cartItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    cart,
    loading,
    cartItemCount,
    coupon,
    discountAmount,
    deliveryCharge,
    tax,
    grandTotal: grandTotalWithDiscount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleSaveForLater,
    clearCart,
    applyCoupon,
    removeCoupon
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

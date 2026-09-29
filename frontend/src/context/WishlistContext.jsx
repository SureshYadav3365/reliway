import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const { fetchCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!token) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const data = await api.get('/wishlist');
      if (data.success && data.wishlist) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error('Fetch wishlist error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item) === productId);
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save items to your wishlist');
      return { success: false, requireAuth: true };
    }
    try {
      const data = await api.post('/wishlist/toggle', { productId });
      if (data.success) {
        setWishlist(data.wishlist);
        toast.success(data.message);
        return { success: true, added: data.added };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const data = await api.delete(`/wishlist/${productId}`);
      if (data.success) {
        setWishlist(data.wishlist);
        toast.success('Removed from wishlist');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    }
  };

  const moveToCart = async (productId) => {
    try {
      const data = await api.post(`/wishlist/${productId}/move-to-cart`);
      if (data.success) {
        setWishlist(prev => prev.filter(item => (item._id || item) !== productId));
        await fetchCart();
        toast.success('Moved to Cart!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false };
    }
  };

  const value = {
    wishlist,
    loading,
    wishlistCount: wishlist.length,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    moveToCart,
    fetchWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);

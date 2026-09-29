import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/home/HeroBanner';
import CategorySlider from '../components/home/CategorySlider';
import PromoBanner from '../components/home/PromoBanner';
import ReviewsSection from '../components/home/ReviewsSection';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../services/api';
import { FaArrowRight, FaFire, FaAward, FaBolt } from 'react-icons/fa';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, trendRes, bestRes, newRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/trending'),
          api.get('/products/best-sellers'),
          api.get('/products/new-arrivals')
        ]);

        if (catRes.success) setCategories(catRes.categories);
        if (trendRes.success) setTrendingProducts(trendRes.products);
        if (bestRes.success) setBestSellers(bestRes.products);
        if (newRes.success) setNewArrivals(newRes.products);
      } catch (err) {
        console.error('Failed to load homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" message="Loading ShopEase Store..." />;
  }

  return (
    <div>
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Featured Categories */}
      <CategorySlider categories={categories} />

      {/* 3. Trending Products Section */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="section-tag" style={{ color: '#ef4444', backgroundColor: '#fee2e2' }}>
                <FaFire style={{ marginRight: '4px' }} /> Trending Now
              </span>
              <h2 className="section-title">Trending This Week</h2>
              <p className="section-subtitle">The most coveted items shoppers are adding to their carts right now.</p>
            </div>
            <Link to="/shop?sort=popularity" className="btn btn-outline-primary btn-sm">
              View All Trending <FaArrowRight />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {trendingProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Coupon Banner */}
      <PromoBanner />

      {/* 5. Best-Selling Products Section */}
      <section className="section" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="section-tag" style={{ color: '#d97706', backgroundColor: '#fef3c7' }}>
                <FaAward style={{ marginRight: '4px' }} /> Top Rated & Purchased
              </span>
              <h2 className="section-title">Best-Selling Essentials</h2>
              <p className="section-subtitle">Consistent customer favorites with over 4.7+ verified star ratings.</p>
            </div>
            <Link to="/shop?sort=rating" className="btn btn-outline-primary btn-sm">
              Explore Best Sellers <FaArrowRight />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {bestSellers.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. New Arrivals Section */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="section-tag">
                <FaBolt style={{ marginRight: '4px' }} /> Fresh In Stock
              </span>
              <h2 className="section-title">Latest Arrivals</h2>
              <p className="section-subtitle">Fresh additions dropped this season across fashion, gadgets, and home.</p>
            </div>
            <Link to="/shop?sort=newest" className="btn btn-outline-primary btn-sm">
              Discover New Drops <FaArrowRight />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews Section */}
      <ReviewsSection />
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import { FaFilter, FaTimes, FaSearch, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL query or defaults
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const brandParam = searchParams.get('brand') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const ratingParam = searchParams.get('rating') || '';

  // Local state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search input local state
  const [localSearch, setLocalSearch] = useState(keywordParam);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/categories');
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when query params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (keywordParam) params.append('keyword', keywordParam);
        if (categoryParam && categoryParam !== 'all') params.append('category', categoryParam);
        if (brandParam && brandParam !== 'all') params.append('brand', brandParam);
        if (minPriceParam) params.append('minPrice', minPriceParam);
        if (maxPriceParam) params.append('maxPrice', maxPriceParam);
        if (ratingParam) params.append('rating', ratingParam);
        if (inStockParam) params.append('inStock', 'true');
        if (sortParam) params.append('sort', sortParam);
        params.append('page', pageParam);
        params.append('limit', 12);

        const data = await api.get(`/products?${params.toString()}`);
        if (data.success) {
          setProducts(data.products);
          setTotal(data.total);
          setPages(data.pages);
          if (data.brands) setBrands(data.brands);
        }
      } catch (err) {
        console.error('Error fetching products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keywordParam, categoryParam, brandParam, sortParam, pageParam, minPriceParam, maxPriceParam, inStockParam, ratingParam]);

  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || val === 'all' || val === false) {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    // Reset to page 1 on filter change if not changing page
    if (!('page' in updates)) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    setSearchParams(new URLSearchParams());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ keyword: localSearch.trim() });
  };

  const activeFiltersCount = [
    keywordParam,
    categoryParam !== 'all' ? categoryParam : null,
    brandParam !== 'all' ? brandParam : null,
    minPriceParam,
    maxPriceParam,
    ratingParam,
    inStockParam ? 'inStock' : null
  ].filter(Boolean).length;

  return (
    <div className="section" style={{ paddingTop: '2.5rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Breadcrumb & Sorting */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '1.25rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              All Products
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              Showing {products.length} of {total} results
              {keywordParam && <span> for "<strong>{keywordParam}</strong>"</span>}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn btn-outline btn-sm mobile-filter-btn"
              style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}
            >
              <FaFilter /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>
                Sort by:
              </label>
              <select
                value={sortParam}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="form-control"
                style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '8px' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'start' }} className="shop-layout">
          {/* Desktop Filters Sidebar */}
          <aside className="filters-sidebar" style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaFilter style={{ fontSize: '0.9rem', color: '#2563eb' }} /> Filters
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Search Filter */}
            <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Search SKU / Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Sony, ELEC-001..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="form-control"
                  style={{ paddingRight: '2.2rem', fontSize: '0.85rem' }}
                />
                <button type="submit" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                  <FaSearch />
                </button>
              </div>
            </form>

            {/* Categories */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Category</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto' }}>
                <label style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={categoryParam === 'all'}
                    onChange={() => updateFilters({ category: 'all' })}
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((c) => (
                  <label key={c._id} style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="category"
                      checked={categoryParam === c.slug || categoryParam === c._id}
                      onChange={() => updateFilters({ category: c.slug || c._id })}
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Brand</label>
                <select
                  value={brandParam}
                  onChange={(e) => updateFilters({ brand: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="all">All Brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Price Range (₹)</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceParam}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
                <span style={{ color: '#94a3b8' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceParam}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                  className="form-control"
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Minimum Rating */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontSize: '0.82rem' }}>Rating</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[4, 3, 2].map((r) => (
                  <label key={r} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="rating"
                      checked={ratingParam === String(r)}
                      onChange={() => updateFilters({ rating: r })}
                    />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                      {Array.from({ length: r }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                      <span style={{ color: '#475569', marginLeft: '4px' }}>& above</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <label style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) => updateFilters({ inStock: e.target.checked })}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Listing Grid Area */}
          <div>
            {loading ? (
              <LoadingSpinner size="medium" message="Fetching products..." />
            ) : products.length === 0 ? (
              <EmptyState
                icon={<FaSearch />}
                title="No Products Found"
                description="We couldn't find any products matching your specific filters or search keywords."
                actionText="Reset All Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2.5rem'
                }}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1.5rem 0',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <button
                      onClick={() => updateFilters({ page: pageParam - 1 })}
                      disabled={pageParam <= 1}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '0.3rem' }}
                    >
                      <FaChevronLeft /> Prev
                    </button>

                    {Array.from({ length: pages }).map((_, idx) => {
                      const p = idx + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => updateFilters({ page: p })}
                          className={`btn btn-sm ${pageParam === p ? 'btn-primary' : 'btn-outline'}`}
                          style={{ minWidth: '38px', height: '38px', padding: 0 }}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => updateFilters({ page: pageParam + 1 })}
                      disabled={pageParam >= pages}
                      className="btn btn-outline btn-sm"
                      style={{ gap: '0.3rem' }}
                    >
                      Next <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          zIndex: 1000,
          display: 'flex'
        }}>
          <div style={{
            width: '85%',
            maxWidth: '340px',
            backgroundColor: '#ffffff',
            height: '100%',
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="btn-icon">
                <FaTimes />
              </button>
            </div>

            {/* Same filter items for mobile drawer */}
            <div style={{ flex: 1 }}>
              {/* Category radio */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Category</label>
                <select
                  value={categoryParam}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  className="form-control"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug || c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Price Range</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceParam}
                    onChange={(e) => updateFilters({ minPrice: e.target.value })}
                    className="form-control"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceParam}
                    onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              {/* In stock */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={inStockParam}
                    onChange={(e) => updateFilters({ inStock: e.target.checked })}
                  />
                  In Stock Only
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button onClick={clearAllFilters} className="btn btn-outline" style={{ flex: 1 }}>
                Reset
              </button>
              <button onClick={() => setMobileFilterOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .shop-layout { grid-template-columns: 1fr !important; }
          .filters-sidebar { display: none !important; }
          .mobile-filter-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;

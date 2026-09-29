import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaImage,
  FaCheck,
  FaTimes,
  FaEye,
  FaTimesCircle
} from 'react-icons/fa';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    sku: '',
    category: '',
    brand: '',
    price: '',
    discountPrice: '',
    stock: '',
    description: '',
    images: [''],
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get(`/products?limit=100&category=${selectedCategory}`),
        api.get('/categories?all=true')
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err) {
      console.error('Failed to load products/categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [selectedCategory]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      category: prod.category?._id || prod.category,
      brand: prod.brand,
      price: prod.price,
      discountPrice: prod.discountPrice || '',
      stock: prod.stock,
      description: prod.description,
      images: prod.images && prod.images.length > 0 ? prod.images : [''],
      isFeatured: !!prod.isFeatured,
      isTrending: !!prod.isTrending,
      isBestSeller: !!prod.isBestSeller,
      isNewArrival: !!prod.isNewArrival,
      isActive: prod.isActive !== undefined ? prod.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.price || formData.stock === '') {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setSaving(true);
      const cleanedImages = formData.images.filter(img => img.trim() !== '');
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        images: cleanedImages.length > 0 ? cleanedImages : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80']
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, payload);
        if (res.success) {
          toast.success('Product updated successfully');
          setIsModalOpen(false);
          fetchProductsAndCategories();
        }
      } else {
        const res = await api.post('/products', payload);
        if (res.success) {
          toast.success('Product created successfully');
          setIsModalOpen(false);
          fetchProductsAndCategories();
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    try {
      const res = await api.delete(`/products/${deleteProductId}`);
      if (res.success) {
        toast.success('Product deleted successfully');
        setDeleteProductId(null);
        fetchProductsAndCategories();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    try {
      const res = await api.patch(`/products/${productId}/stock`, { stock: newStock });
      if (res.success) {
        toast.success('Stock updated');
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: newStock } : p));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header & Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Product Catalog Management
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Add, update pricing, manage stock, and edit product specifications.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            placeholder="Search by name, SKU, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
          />
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
            style={{ width: 'auto', fontSize: '0.88rem' }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug || c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <LoadingSpinner size="large" message="Loading products list..." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.images?.[0]}
                        alt=""
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 700, color: '#0f172a', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td><code>{p.sku}</code></td>
                  <td>{p.category?.name || 'Unassigned'}</td>
                  <td>{p.brand}</td>
                  <td>
                    <strong>₹{(p.discountPrice || p.price).toLocaleString()}</strong>
                    {p.discountPrice && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        ₹{p.price.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        type="number"
                        defaultValue={p.stock}
                        onBlur={(e) => handleStockUpdate(p._id, Number(e.target.value))}
                        style={{ width: '60px', padding: '0.25rem 0.4rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                      {p.stock <= 10 && (
                        <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Low</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {p.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-secondary">Inactive</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="btn-icon"
                        style={{ width: '32px', height: '32px', color: '#2563eb' }}
                        title="Edit Product"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteProductId(p._id)}
                        className="btn-icon"
                        style={{ width: '32px', height: '32px', color: '#ef4444' }}
                        title="Delete Product"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sony WH-1000XM5 Headphones"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SKU *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                      placeholder="e.g. ELEC-001"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brand *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. Sony"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Regular price"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Discount Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                      placeholder="Offer price"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="Available inventory units"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Description *</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter comprehensive product features and details..."
                    required
                  />
                </div>

                {/* Image URLs */}
                <div className="form-group">
                  <label className="form-label">Image URLs (At least one)</label>
                  {formData.images.map((imgUrl, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={imgUrl}
                        onChange={(e) => {
                          const newImgs = [...formData.images];
                          newImgs[i] = e.target.value;
                          setFormData({ ...formData, images: newImgs });
                        }}
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = formData.images.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, images: newImgs });
                          }}
                          className="btn-icon"
                          style={{ color: '#ef4444' }}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                    className="btn btn-outline btn-sm"
                    style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
                  >
                    + Add Another Image URL
                  </button>
                </div>

                {/* Flags Checkboxes */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    Featured
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    />
                    Trending
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    />
                    Best Seller
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    />
                    New Arrival
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    Active in Store
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteProductId}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product? This action cannot be reversed."
        confirmText="Delete Product"
        isDanger={true}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteProductId(null)}
      />
    </div>
  );
};

export default AdminProductsPage;

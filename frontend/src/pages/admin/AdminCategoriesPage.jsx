import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get('/categories?all=true');
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image,
      isActive: cat.isActive !== undefined ? cat.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    try {
      setSaving(true);
      if (editingCategory) {
        const res = await api.put(`/categories/${editingCategory._id}`, formData);
        if (res.success) {
          toast.success('Category updated successfully');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await api.post('/categories', formData);
        if (res.success) {
          toast.success('Category created successfully');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    try {
      const res = await api.delete(`/categories/${deleteCategoryId}`);
      if (res.success) {
        toast.success('Category deleted successfully');
        setDeleteCategoryId(null);
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      const res = await api.put(`/categories/${cat._id}`, { isActive: !cat.isActive });
      if (res.success) {
        toast.success(`Category ${!cat.isActive ? 'activated' : 'deactivated'}`);
        setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isActive: !cat.isActive } : c));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
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
            Category Management
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Manage store departments, slugs, promotional banners, and visibility.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <FaPlus /> Add New Category
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="large" message="Loading categories..." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Active Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={c.image}
                        alt=""
                        style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</span>
                    </div>
                  </td>
                  <td><code>{c.slug}</code></td>
                  <td style={{ maxWidth: '280px', color: '#64748b', fontSize: '0.85rem' }}>
                    {c.description || 'No description'}
                  </td>
                  <td>
                    <span className="badge badge-primary">{c.productCount || 0} Products</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`badge ${c.isActive ? 'badge-success' : 'badge-secondary'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle status"
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="btn-icon"
                        style={{ width: '32px', height: '32px', color: '#2563eb' }}
                        title="Edit Category"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteCategoryId(c._id)}
                        className="btn-icon"
                        style={{ width: '32px', height: '32px', color: '#ef4444' }}
                        title="Delete Category"
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Footwear"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short department overview..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.88rem', marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active (Visible on store)
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteCategoryId}
        title="Delete Category"
        message="Are you sure you want to delete this category? Make sure no products are currently assigned to it."
        confirmText="Delete Category"
        isDanger={true}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteCategoryId(null)}
      />
    </div>
  );
};

export default AdminCategoriesPage;

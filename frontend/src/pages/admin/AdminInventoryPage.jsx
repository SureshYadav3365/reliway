import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaWarehouse, FaSearch, FaExclamationTriangle, FaCheckCircle, FaSave } from 'react-icons/fa';

const AdminInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [stockUpdates, setStockUpdates] = useState({});

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/admin/inventory?lowStockOnly=${lowStockOnly}&search=${encodeURIComponent(search)}`);
      if (data.success) {
        setInventory(data.inventory || []);
      }
    } catch (err) {
      console.error('Failed to load inventory report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleStockInputChange = (productId, val) => {
    setStockUpdates(prev => ({
      ...prev,
      [productId]: val
    }));
  };

  const handleSaveStock = async (productId) => {
    const newStock = stockUpdates[productId];
    if (newStock === undefined || newStock === '') return;
    try {
      const res = await api.patch(`/products/${productId}/stock`, { stock: Number(newStock) });
      if (res.success) {
        toast.success('Stock updated successfully');
        setInventory(prev => prev.map(item => item._id === productId ? { ...item, stock: Number(newStock) } : item));
        setStockUpdates(prev => {
          const cp = { ...prev };
          delete cp[productId];
          return cp;
        });
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const lowStockCount = inventory.filter(p => p.stock <= 10).length;

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
            Inventory & Stock Watch
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Monitor warehouse replenishment, low stock warnings, and sold velocity.
          </p>
        </div>

        {lowStockCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            <FaExclamationTriangle /> {lowStockCount} Products Need Restocking
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            placeholder="Search by product SKU or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
          />
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </form>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          Show Low Stock Warnings Only (≤ 10 units)
        </label>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <LoadingSpinner size="large" message="Loading warehouse inventory..." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Units Sold</th>
                <th>Stock Status</th>
                <th>Restock / Update</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const isDirty = stockUpdates[item._id] !== undefined;

                return (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={item.images?.[0]}
                          alt=""
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 700, color: '#0f172a', maxWidth: '260px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td><code>{item.sku}</code></td>
                    <td>{item.category?.name || 'Department'}</td>
                    <td>
                      <strong style={{ fontSize: '1rem', color: item.stock <= 10 ? '#ef4444' : '#0f172a' }}>
                        {item.stock}
                      </strong>
                    </td>
                    <td>
                      <span style={{ color: '#2563eb', fontWeight: 700 }}>{item.sold}</span> sold
                    </td>
                    <td>
                      {item.stock === 0 ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : item.stock <= 10 ? (
                        <span className="badge badge-warning">Low Stock ({item.stock})</span>
                      ) : (
                        <span className="badge badge-success">Optimal Stock</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="number"
                          placeholder={String(item.stock)}
                          value={stockUpdates[item._id] !== undefined ? stockUpdates[item._id] : item.stock}
                          onChange={(e) => handleStockInputChange(item._id, e.target.value)}
                          style={{
                            width: '75px',
                            padding: '0.35rem 0.5rem',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '0.85rem'
                          }}
                        />
                        {isDirty && (
                          <button
                            onClick={() => handleSaveStock(item._id)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.35rem 0.65rem' }}
                            title="Save stock count"
                          >
                            <FaSave />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryPage;

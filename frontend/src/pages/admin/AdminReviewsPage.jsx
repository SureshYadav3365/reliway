import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import StarRating from '../../components/common/StarRating';
import toast from 'react-hot-toast';
import { FaTrash, FaCheck, FaEyeSlash } from 'react-icons/fa';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await api.get('/reviews?limit=50');
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (review) => {
    try {
      const res = await api.patch(`/reviews/${review._id}/status`, {
        isApproved: !review.isApproved
      });
      if (res.success) {
        toast.success(res.message);
        setReviews(prev => prev.map(r => r._id === review._id ? { ...r, isApproved: !review.isApproved } : r));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteReview = async () => {
    if (!deleteReviewId) return;
    try {
      const res = await api.delete(`/reviews/${deleteReviewId}`);
      if (res.success) {
        toast.success('Review deleted');
        setDeleteReviewId(null);
        fetchReviews();
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
            Customer Reviews Moderation
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Inspect buyer feedback, audit star ratings, and toggle visibility.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="large" message="Loading reviews..." />
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Feedback Comment</th>
                <th>Date</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={r.product?.images?.[0]}
                        alt=""
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 700, color: '#0f172a', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.product?.name || 'Product'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{r.userName}</span>
                  </td>
                  <td>
                    <StarRating rating={r.rating} showCount={false} />
                  </td>
                  <td style={{ maxWidth: '300px', color: '#475569', fontSize: '0.85rem' }}>
                    "{r.comment}"
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`badge ${r.isApproved ? 'badge-success' : 'badge-secondary'}`}>
                      {r.isApproved ? 'Approved' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleToggleApproval(r)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                        title={r.isApproved ? 'Hide review' : 'Approve review'}
                      >
                        {r.isApproved ? <FaEyeSlash /> : <FaCheck />}
                      </button>
                      <button
                        onClick={() => setDeleteReviewId(r._id)}
                        className="btn-icon"
                        style={{ width: '30px', height: '30px', color: '#ef4444' }}
                        title="Delete review"
                      >
                        <FaTrash style={{ fontSize: '0.75rem' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Review Modal */}
      <ConfirmModal
        isOpen={!!deleteReviewId}
        title="Delete Customer Review"
        message="Are you sure you want to permanently delete this customer review? The product's aggregate rating will be recalculated."
        confirmText="Delete Review"
        isDanger={true}
        onConfirm={handleDeleteReview}
        onCancel={() => setDeleteReviewId(null)}
      />
    </div>
  );
};

export default AdminReviewsPage;

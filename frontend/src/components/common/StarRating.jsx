import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, numReviews, showCount = true, interactive = false, onRatingChange }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (interactive) {
      stars.push(
        <FaStar
          key={i}
          className={`cursor-pointer transition-colors ${i <= rating ? 'text-amber-400' : 'text-slate-300'}`}
          style={{ color: i <= rating ? '#f59e0b' : '#cbd5e1', cursor: 'pointer', fontSize: '1.25rem' }}
          onClick={() => onRatingChange && onRatingChange(i)}
        />
      );
    } else {
      if (rating >= i) {
        stars.push(<FaStar key={i} style={{ color: '#f59e0b' }} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} style={{ color: '#f59e0b' }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: '#cbd5e1' }} />);
      }
    }
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {stars}
      </div>
      {showCount && numReviews !== undefined && (
        <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.25rem' }}>
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default StarRating;

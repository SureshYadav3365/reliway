import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon,
  title = 'No items found',
  description = 'Try adjusting your filters or search criteria.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      maxWidth: '600px',
      margin: '2rem auto',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      {icon && (
        <div style={{
          fontSize: '3.5rem',
          color: '#94a3b8',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', marginBottom: '1.75rem', lineHeight: 1.5 }}>
        {description}
      </p>
      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn btn-primary">
            {actionText}
          </Link>
        ) : (
          <button onClick={onAction} className="btn btn-primary">
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;

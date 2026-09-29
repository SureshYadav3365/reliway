import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {isDanger && <FaExclamationTriangle style={{ color: '#ef4444', fontSize: '1.2rem' }} />}
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{title}</h4>
          </div>
          <button onClick={onCancel} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-outline btn-sm">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn btn-sm ${isDanger ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

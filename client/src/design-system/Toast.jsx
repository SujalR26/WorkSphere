import React from 'react';
import Icons from './Icons.jsx';

export const Toast = ({ message, type = 'success', onClose }) => {
  const borderColors = {
    success: 'border-start border-4 border-success',
    danger: 'border-start border-4 border-danger',
    warning: 'border-start border-4 border-warning',
    info: 'border-start border-4 border-info'
  };

  const icons = {
    success: <Icons.Check className="text-success" size={18} />,
    danger: <Icons.Alert className="text-danger" size={18} />,
    warning: <Icons.Alert className="text-warning" size={18} />,
    info: <Icons.Alert className="text-info" size={18} />
  };

  return (
    <div
      className={`toast-custom bg-white rounded-3 shadow-md d-flex align-items-center justify-content-between p-3 mb-2 border-ws-border ${borderColors[type] || borderColors.success}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex align-items-center gap-2.5">
        <div className="toast-icon-container">
          {icons[type]}
        </div>
        <div className="toast-message-text font-body fs-7 text-dark fw-medium">
          {message}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-link text-muted p-1 border-0 bg-transparent rounded-2 d-flex align-items-center justify-content-center cursor-pointer"
        onClick={onClose}
      >
        <Icons.Close size={16} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts = [], onDismiss }) => {
  if (toasts.length === 0) return null;
  
  return (
    <div className="toast-container-custom">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => onDismiss(t.id)}
        />
      ))}
    </div>
  );
};

export default Toast;

import React, { useEffect } from 'react';
import Icons from './Icons.jsx';
import Button from './Button.jsx';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
  footer
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center"
      onClick={handleBackdropClick}
    >
      <div className={`modal-content-custom rounded-3 shadow-lg bg-white p-4 w-100 ${sizeClasses[size] || sizeClasses.md}`}>
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
          <h5 className="modal-title font-heading fw-bold fs-5 text-dark m-0">{title}</h5>
          <button
            type="button"
            className="btn btn-link text-muted p-1 d-flex align-items-center justify-content-center border-0 bg-transparent rounded-2"
            onClick={onClose}
          >
            <Icons.Close size={20} />
          </button>
        </div>
        
        <div className="modal-body-custom overflow-auto" style={{ maxHeight: '70vh' }}>
          {children}
        </div>

        {footer && (
          <div className="modal-footer-custom d-flex justify-content-end gap-2 border-top pt-3 mt-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

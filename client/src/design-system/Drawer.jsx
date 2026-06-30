import React, { useEffect } from 'react';
import Icons from './Icons.jsx';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'md' // sm (400px), md (600px), lg (800px)
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

  const widthClasses = {
    sm: 'drawer-sm',
    md: 'drawer-md',
    lg: 'drawer-lg'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`drawer-backdrop ${isOpen ? 'active' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`drawer-container bg-white shadow-lg d-flex flex-column h-100 ${widthClasses[width]} ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header d-flex align-items-center justify-content-between p-4 border-bottom">
          <h5 className="font-heading fw-bold text-dark m-0">{title}</h5>
          <button
            type="button"
            className="btn btn-link text-muted p-1 border-0 bg-transparent rounded-2 d-flex align-items-center justify-content-center"
            onClick={onClose}
          >
            <Icons.Close size={20} />
          </button>
        </div>
        <div className="drawer-body flex-grow-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;

import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, accent, success, danger, outline, link, light
  size = 'md', // sm, md, lg
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClass = 'btn d-inline-flex align-items-center justify-content-center transition-all fw-medium rounded-3 border-0';
  
  const sizeClasses = {
    sm: 'py-1 px-3 fs-7',
    md: 'py-2 px-4 fs-6',
    lg: 'py-3 px-5 fs-5'
  };

  const variantClasses = {
    primary: 'btn-ws-primary text-white',
    secondary: 'btn-ws-secondary text-white',
    accent: 'btn-ws-accent text-white',
    success: 'btn-ws-success text-white',
    danger: 'btn-ws-danger text-white',
    outline: 'btn-outline border border-2 bg-transparent',
    light: 'btn-ws-light text-dark',
    link: 'btn-link text-decoration-none bg-transparent p-0 text-ws-primary'
  };

  const loadingSpinner = (
    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
  );

  return (
    <button
      type={type}
      className={`${baseClass} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && loadingSpinner}
      {!loading && icon && iconPosition === 'left' && <span className="d-flex align-items-center me-2">{icon}</span>}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="d-flex align-items-center ms-2">{icon}</span>}
    </button>
  );
};

export default Button;

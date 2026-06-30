import React from 'react';

export const Badge = ({
  children,
  variant = 'primary', // primary, secondary, success, danger, warning, info, dark, light
  className = '',
  pill = false,
  ...props
}) => {
  const badgeClasses = {
    primary: 'bg-ws-primary-light text-ws-primary',
    secondary: 'bg-ws-secondary-light text-ws-secondary',
    success: 'bg-ws-success-light text-ws-success',
    danger: 'bg-ws-danger-light text-ws-danger',
    warning: 'bg-ws-accent-light text-ws-accent-dark',
    info: 'bg-info-light text-info',
    dark: 'bg-dark text-white',
    light: 'bg-light text-dark'
  };

  const badgeClass = `
    badge 
    ${badgeClasses[variant] || 'bg-secondary text-white'} 
    ${pill ? 'rounded-pill' : 'rounded-2'} 
    fw-medium 
    py-1.5 
    px-2.5 
    fs-8 
    border-0 
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
};

export default Badge;

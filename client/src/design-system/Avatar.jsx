import React from 'react';

export const Avatar = ({
  src,
  name = '',
  size = 'md', // xs, sm, md, lg, xl
  className = '',
  ...props
}) => {
  const sizeMap = {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '56px',
    xl: '80px'
  };

  const fontSizeMap = {
    xs: '0.65rem',
    sm: '0.8rem',
    md: '0.95rem',
    lg: '1.25rem',
    xl: '1.75rem'
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'WS';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const getGradientForName = (fullName) => {
    const gradients = [
      'linear-gradient(135deg, #0EAF9B 0%, #0EA5E9 100%)', // teal/blue
      'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)', // violet/purple
      'linear-gradient(135deg, #F6B73C 0%, #D97706 100%)', // amber/orange
      'linear-gradient(135deg, #58C27D 0%, #15803D 100%)', // emerald/green
      'linear-gradient(135deg, #F56C7E 0%, #B91C1C 100%)', // rose/red
      'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'  // cyan
    ];
    if (!fullName) return gradients[0];
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const dimensions = sizeMap[size] || sizeMap.md;
  const fontSize = fontSizeMap[size] || fontSizeMap.md;

  const style = {
    width: dimensions,
    height: dimensions,
    fontSize: fontSize,
    lineHeight: dimensions,
    background: getGradientForName(name),
    color: '#ffffff',
    border: '1.5px solid rgba(255, 255, 255, 0.2)'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-circle object-fit-cover shadow-sm ${className}`}
        style={{ width: dimensions, height: dimensions, border: '1px solid rgba(0, 0, 0, 0.05)' }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
        {...props}
      />
    );
  }

  return (
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center fw-semibold font-heading shadow-sm ${className}`}
      style={style}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;

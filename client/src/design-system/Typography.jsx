import React from 'react';

export const Typography = ({
  variant = 'body1',
  children,
  className = '',
  tag,
  ...props
}) => {
  // Determine HTML Tag
  const Tag = tag || (
    variant.startsWith('h') ? variant : 
    variant === 'caption' ? 'span' : 'p'
  );

  // Determine Class mapping
  const variantClasses = {
    h1: 'font-heading fw-bold fs-2 text-dark mb-3',
    h2: 'font-heading fw-bold fs-3 text-dark mb-2',
    h3: 'font-heading fw-semibold fs-4 text-dark mb-2',
    h4: 'font-heading fw-semibold fs-5 text-dark mb-1',
    h5: 'font-heading fw-medium fs-6 text-dark mb-1',
    h6: 'font-heading fw-medium fs-7 text-dark mb-1',
    body1: 'font-body fw-normal fs-6 text-muted mb-0',
    body2: 'font-body fw-normal fs-7 text-muted mb-0',
    caption: 'font-body fw-normal fs-8 text-secondary mb-0'
  };

  const combinedClass = `${variantClasses[variant] || ''} ${className}`.trim();

  return (
    <Tag className={combinedClass} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;

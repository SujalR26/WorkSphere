import React from 'react';

export const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  noPadding = false,
  border = false,
  ...props
}) => {
  const cardClass = `
    card 
    ${hoverable ? 'card-hover cursor-pointer' : ''} 
    ${noPadding ? 'p-0' : 'p-4'} 
    ${border ? 'border-1' : 'border-0'} 
    bg-white 
    rounded-3 
    shadow-sm 
    transition-all
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={cardClass} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;

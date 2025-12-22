import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, style = {} }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`btn btn-${variant} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
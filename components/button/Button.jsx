"use client"

import React from 'react';
import './Button.css';

const Button = ({ children, onClick, className = '', type = 'button', variant = 'primary', ...rest }) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
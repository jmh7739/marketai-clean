import React from 'react';

// JSX 설정을 위한 타입 import
/** @jsx React.createElement */

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  onClick, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  return (
    <button 
      className={`btn ${variant} ${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

import { forwardRef } from 'react';

const Input = forwardRef(function Input({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`form-input ${className}`}
      {...props}
    />
  );
});

export default Input;

import React from 'react';

export const Input = React.forwardRef(({
  label,
  name,
  type = 'text',
  error,
  placeholder,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label font-heading fw-medium text-dark fs-7 mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        ref={ref}
        placeholder={placeholder}
        className={`form-control rounded-3 py-2 px-3 fs-6 ${error ? 'is-invalid border-danger' : 'border-ws-border'}`}
        {...props}
      />
      {error && (
        <div className="invalid-feedback fs-7 mt-1 fw-medium text-danger">
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

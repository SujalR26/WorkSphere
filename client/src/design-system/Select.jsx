import React from 'react';

export const Select = React.forwardRef(({
  label,
  name,
  options = [], // [{ value, label }]
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
      <select
        id={name}
        name={name}
        ref={ref}
        className={`form-select rounded-3 py-2 px-3 fs-6 ${error ? 'is-invalid border-danger' : 'border-ws-border'}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="invalid-feedback fs-7 mt-1 fw-medium text-danger">
          {error}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

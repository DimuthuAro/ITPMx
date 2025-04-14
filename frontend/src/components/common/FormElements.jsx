import React from 'react';

// Main form container with decorative elements
export const FormContainer = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 px-4 py-12 sm:px-6 lg:px-8 animate-gradient-xy">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Decorative elements */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -top-8 right-4 w-24 h-24 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="bg-white/10 backdrop-filter backdrop-blur-lg py-12 px-8 rounded-2xl shadow-2xl border border-white/20 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

// Form header with icon
export const FormHeader = ({ icon, title, subtitle }) => {
  return (
    <div className="text-center">
      <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg mb-8">
        {icon}
      </div>
      <h2 className="text-3xl font-extrabold text-white mb-2">{title}</h2>
      <p className="text-sm text-blue-200 mb-8">{subtitle}</p>
    </div>
  );
};

// Form error message
export const FormError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
      {message}
    </div>
  );
};

// Input field with icon
export const FormInput = ({ 
  label, 
  id, 
  name, 
  type = 'text', 
  icon, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-blue-200 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={`block w-full pl-10 pr-3 py-3 text-white placeholder-blue-300 bg-white/5 border ${error ? 'border-red-400' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

// Checkbox with label
export const FormCheckbox = ({ id, name, label, required = false }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        required={required}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-blue-200">
        {label}
      </label>
    </div>
  );
};

// Submit button
export const FormButton = ({ children, variant = 'primary', onClick, type = 'submit', className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30',
    success: 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-green-500/30',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-red-500/30',
    warning: 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 shadow-yellow-500/30',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${variants[variant]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg ${className}`}
    >
      {children}
    </button>
  );
};

// Form footer with link
export const FormFooter = ({ text, linkText, linkUrl }) => {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-blue-200">
        {text}{' '}
        <a href={linkUrl} className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-200">
          {linkText}
        </a>
      </p>
    </div>
  );
}; 
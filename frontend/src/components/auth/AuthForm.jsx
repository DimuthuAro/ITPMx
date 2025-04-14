import React from 'react';
import Button from '../common/Button';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const AuthForm = ({ title, onSubmit, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">IT</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="rounded-xl bg-white/10 backdrop-blur-xl p-8 space-y-6">
            {children}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
            >
              {title}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormGroup = ({ label, type = 'text', icon, error, ...props }) => {
  const icons = {
    email: <FaEnvelope className="text-gray-400" />,
    password: <FaLock className="text-gray-400" />,
    default: <FaUser className="text-gray-400" />
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icons[type] || icons.default}
        </div>
        <input
          type={type}
          className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-white bg-white/5 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent ${
            error ? 'border-red-500' : 'border-white/10'
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export { AuthForm, FormGroup }; 
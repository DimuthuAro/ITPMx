import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
      username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });
  const navigate = useNavigate();

  // Password validation helper functions
  const checkPasswordStrength = (password) => {
    return {
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  };

  const getPasswordStrengthScore = (strength) => {
    let score = 0;
    if (strength.length) score += 1;
    if (strength.hasUppercase) score += 1;
    if (strength.hasLowercase) score += 1;
    if (strength.hasNumber) score += 1;
    if (strength.hasSpecial) score += 1;
    return score;
  };

  const getPasswordFeedback = (strength) => {
    const score = getPasswordStrengthScore(strength);
    
    if (score === 0) return { message: "No password entered", color: "gray" };
    if (score <= 2) return { message: "Weak password", color: "red" };
    if (score <= 4) return { message: "Medium strength password", color: "orange" };
    return { message: "Strong password", color: "green" }; 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate fields as user types
    const errors = {...validationErrors};
    
    // Username validation (at least 2 characters)
    if (name === 'username') {
      if (value.length > 0 && value.length < 2) {
        errors.username = 'Username must be at least 2 characters';
      } else {
        errors.username = '';
      }
    }
    
    // Email validation (must contain @)
    if (name === 'email') {
      if (value.length > 0 && !value.includes('@')) {
        errors.email = 'Email must contain @ sign';
      } else {
        errors.email = '';
      }
    }
    
    // Password validation with enhanced feedback
    if (name === 'password') {
      // Check current password strength
      const currentStrength = checkPasswordStrength(value);
      setPasswordStrength(currentStrength);
      
      // Basic validation (2 char minimum during typing)
      if (value.length > 0 && value.length < 2) {
        errors.password = 'Password must be at least 2 characters';
      } else {
        errors.password = '';
      }
      
      // Also check if passwords match when either password or confirmPassword changes
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      } else {
        errors.confirmPassword = '';
      }
    }
    
    // Check if passwords match when confirmPassword changes
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        errors.confirmPassword = 'Passwords do not match';
      } else {
        errors.confirmPassword = '';
      }
    }
    
    setValidationErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // Comprehensive validation before submission
    const errors = {};
    
    // Username validation
    if (formData.username.trim().length < 2) {
      errors.username = 'Username must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.includes('@')) {
      errors.email = 'Email must contain @ sign';
    }
    
    // Password validation - more comprehensive for submission
    const strength = checkPasswordStrength(formData.password);
    const strengthScore = getPasswordStrengthScore(strength);
    
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (strengthScore < 3) {
      errors.password = 'Please use a stronger password (add uppercase, numbers, or special characters)';
    }
    
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // If there are validation errors, stop submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please correct the errors in the form');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare user data with role defaulting to 'user'
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password, // In a real app, this would be encrypted
        role: 'user'
      };

      const response = await createUser(userData);
      setSuccess(true);

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-center text-gray-200 mb-8">Register</h2>

              {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                      <p>{error}</p>
          </div>
              )}

              {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                      <p>Registration successful! Redirecting to login...</p>
                  </div>
              )}

              <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                      <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
                          Username
                      </label>
                      <input
                          id="username"
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                          className={`shadow appearance-none border ${validationErrors.username ? 'border-red-500' : 'border-gray-600'} rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
                          placeholder="johndoe"
                          required
                      />
                      {validationErrors.username && (
                        <p className="text-red-500 text-xs italic mt-1">{validationErrors.username}</p>
                      )}
                  </div>

                  <div className="mb-4">
                      <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
                          Email
                      </label>
                      <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`shadow appearance-none border ${validationErrors.email ? 'border-red-500' : 'border-gray-600'} rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
                          placeholder="your@email.com"
                          required
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-xs italic mt-1">{validationErrors.email}</p>
                      )}
                  </div>

                  <div className="mb-4">
                      <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                          Password
                      </label>
                      <input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`shadow appearance-none border ${validationErrors.password ? 'border-red-500' : 'border-gray-600'} rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
                          placeholder="********"
                          required
                      />
                      {validationErrors.password && (
                        <p className="text-red-500 text-xs italic mt-1">{validationErrors.password}</p>
                      )}
                      
                      {/* Password strength meter */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((segment) => {
                              const score = getPasswordStrengthScore(passwordStrength);
                              let bgColor = "bg-gray-300";
                              
                              if (score >= segment) {
                                if (score <= 2) bgColor = "bg-red-500";
                                else if (score <= 4) bgColor = "bg-yellow-500";
                                else bgColor = "bg-green-500";
                              }
                              
                              return (
                                <div 
                                  key={segment} 
                                  className={`h-1.5 flex-1 rounded-full ${bgColor}`}
                                />
                              );
                            })}
                          </div>
                          <p className="text-xs text-gray-400">
                            {getPasswordFeedback(passwordStrength).message}
                          </p>
                        </div>
                      )}
                      
                      {/* Password requirements checklist */}
                      <div className="mt-2 text-xs space-y-1">
                        <p className={`${passwordStrength.length ? 'text-green-500' : 'text-gray-400'}`}>
                          {passwordStrength.length ? '✓' : '○'} At least 8 characters long
                        </p>
                        <p className={`${passwordStrength.hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                          {passwordStrength.hasUppercase ? '✓' : '○'} Contains uppercase letter
                        </p>
                        <p className={`${passwordStrength.hasLowercase ? 'text-green-500' : 'text-gray-400'}`}>
                          {passwordStrength.hasLowercase ? '✓' : '○'} Contains lowercase letter
                        </p>
                        <p className={`${passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                          {passwordStrength.hasNumber ? '✓' : '○'} Contains number
                        </p>
                        <p className={`${passwordStrength.hasSpecial ? 'text-green-500' : 'text-gray-400'}`}>
                          {passwordStrength.hasSpecial ? '✓' : '○'} Contains special character
                        </p>
                      </div>
                  </div>

                  <div className="mb-6">
                      <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="confirmPassword">
                          Confirm Password
                      </label>
                      <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`shadow appearance-none border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700`}
                          placeholder="********"
                          required
                      />
                      {validationErrors.confirmPassword && (
                        <p className="text-red-500 text-xs italic mt-1">{validationErrors.confirmPassword}</p>
                      )}
                  </div>

                  <div className="flex items-center justify-between">
                      <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                          disabled={isSubmitting}
                      >
                          {isSubmitting ? 'Registering...' : 'Register'}
                      </button>
                  </div>
              </form>              <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                      Already have an account?
                      <Link to="/login" className="text-blue-500 hover:text-blue-700 ml-1">
                          Login here
                      </Link>
                  </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

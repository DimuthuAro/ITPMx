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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                          placeholder="johndoe"
                          required
                      />
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
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                          placeholder="your@email.com"
                          required
                      />
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
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                          placeholder="********"
                          required
                      />
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
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                          placeholder="********"
                          required
                      />
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

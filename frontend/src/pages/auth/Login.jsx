import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserByEmail } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simple validation
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      // Get user by email
      const response = await getUserByEmail(formData.email);
      const user = response.data || response;

      // Simple password check (no encryption)
      if (user && user.password === formData.password) {
        // Use the login function from AuthContext
        login({
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        });
        // Navigation happens in the login function
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-center text-gray-200 mb-8">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
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

          <div className="mb-6">
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

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?
            <Link to="/register" className="text-blue-500 hover:text-blue-700 ml-1">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

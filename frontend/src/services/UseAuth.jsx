import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from './apiConfig';

// Create the context
export const AuthContext = createContext(null);

// Development mode flag - set to false in production
const DEV_MODE = false; // Force development mode for testing

// Mock users for development mode
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    password: 'password123' // Adding password for mock user verification
  },
  {
    id: 2,
    name: 'Test User',
    email: 'user@example.com',
    role: 'user',
    password: 'password123' // Adding password for mock user verification
  }
];

// Create a context provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if there's a token in localStorage on app startup
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    console.log('UseAuth initialization:', { 
      hasToken: !!token, 
      hasStoredUser: !!storedUser, 
      DEV_MODE 
    });
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Retrieved stored user:', parsedUser);
        
        setCurrentUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, remember = false) => {
    try {
      setError(null);
      setLoading(true);
      
      // Input validation
      if (!email || !password) {
        console.error('Login failed: Email and password are required');
        throw new Error('Email and password are required');
      }
      
      // Development mode - mock authentication
      if (DEV_MODE) {
        console.log('Using mock authentication in development mode');
        console.log('Login attempt with:', { email, password });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find mock user
        const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        console.log('User found:', user ? 'Yes' : 'No')
        console.log('Email:', email);
        
        // Check if user exists and password is correct (mock check)
        if (!user) {
          console.error('Login failed: User not found');
          throw new Error('Invalid email or password');
        }
        
        // Compare password (case sensitive)
        if (user.password !== password) {
          console.error('Login failed: Password incorrect ' + user.password + ' !== ' + password);
          console.error('Expected:', user.password, 'Received:', password);
          throw new Error('Invalid email or password');
        }
        
        // Create a mock token
        const token = `mock-jwt-token-${user.id}-${Date.now()}`;
        
        // Create a safe user object without the password
        const safeUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        // Set current user
        console.log('Setting current user:', safeUser);
        setCurrentUser(safeUser);
        
        // Set axios default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Store user data and token if remember is true or always in dev mode for testing convenience
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(safeUser));
        
        console.log('Login successful');
        return { success: true, data: safeUser };
      }
      
      // Production mode - real authentication
      try {
        console.log('Attempting real authentication with API');
        const response = await axios.post(`${API_BASE_URL}/api/login`, {
          email,
          password
        });
        
        console.log('Login response:', response.data);
        
        if (response.data.success) {
          const { token, ...userData } = response.data.data;
          
          //BUG FIX - Set Real User Data
          console.log('Setting current user with real data:', userData);
          const realUserData = await axios.get(`${API_BASE_URL}/api/users/${userData.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Real user data:', realUserData.data);

          // Set current user state
          setCurrentUser(realUserData.data);
          
          // Set axios default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Store auth data if remember is checked or if explicitly needed
          if (remember) {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(realUserData.data));
          }
          
          return { success: true, data: realUserData.data };
        } else {
          // API returned success: false
          const errorMessage = response.data.message || 'Invalid credentials';
          console.error('Login failed:', errorMessage);
          throw new Error(errorMessage);
        }
      } catch (apiError) {
        // Handle API request errors
        const errorMessage = apiError.response?.data?.message || apiError.message || 'Failed to login. Please check your credentials.';
        console.error('API error during login:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      // Set error state and rethrow for component handling
      const message = err.message || 'An unexpected error occurred during login';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Development mode - mock registration
      if (DEV_MODE) {
        console.log('Using mock registration in development mode');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simple validation
        if (!userData.name || !userData.email || !userData.password) {
          throw new Error('Name, email and password are required');
        }
        
        // Check if email exists in mock users
        if (MOCK_USERS.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
          throw new Error('Email already exists');
        }
        
        // Create mock user
        const newUser = {
          id: MOCK_USERS.length + 1,
          name: userData.name,
          email: userData.email,
          role: 'user',
          password: userData.password // Store password for mock user
        };
        
        // Add to mock users (in a real app this would persist)
        MOCK_USERS.push(newUser);
        
        // Create a safe version without the password for return
        const safeUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        };
        
        // Create a mock token
        const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
        
        // Set current user
        setCurrentUser(safeUser);
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(safeUser));
        
        return { success: true, data: safeUser };
      }
      
      // Production mode - real registration
      const response = await axios.post(`${API_BASE_URL}/api/register`, userData);
      
      if (response.data.success) {
        const { token, ...newUser } = response.data.data;
        setCurrentUser(newUser);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true, data: newUser };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to register. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      
      // Development mode - mock profile update
      if (DEV_MODE) {
        console.log('Using mock profile update in development mode');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!currentUser) {
          throw new Error('Not authenticated');
        }
        
        // Update mock user
        const updatedUser = {
          ...currentUser,
          ...userData
        };
        
        // Update mock users array
        const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          MOCK_USERS[userIndex] = updatedUser;
        }
        
        // Update stored user if exists
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        setCurrentUser(updatedUser);
        return updatedUser;
      }
      
      // Production mode - real profile update
      const response = await axios.put(`${API_BASE_URL}/api/users/${currentUser.id}`, userData);
      
      const updatedUser = response.data;
      setCurrentUser(updatedUser);
      
      // Update stored user data if it exists
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update profile.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Password reset request
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      
      // Development mode - mock password reset request
      if (DEV_MODE) {
        console.log('Using mock password reset request in development mode');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simple validation
        if (!email) {
          throw new Error('Email is required');
        }
        
        // Always return success in dev mode (to not reveal if email exists)
        return true;
      }
      
      // Production mode - real password reset
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { email });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to request password reset.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Confirm password reset with token
  const confirmPasswordReset = async (token, newPassword) => {
    try {
      setLoading(true);
      
      // Development mode - mock password reset confirmation
      if (DEV_MODE) {
        console.log('Using mock password reset confirmation in development mode');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simple validation
        if (!token || !newPassword) {
          throw new Error('Token and new password are required');
        }
        
        // Always return success in dev mode
        return true;
      }
      
      // Production mode - real password reset confirmation
      await axios.post(`${API_BASE_URL}/api/auth/reset-password/confirm`, {
        token,
        newPassword
      });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to reset password.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    console.log('isAuthenticated check - currentUser:', currentUser);
    return !!currentUser;
  };

  const contextValue = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    requestPasswordReset,
    confirmPasswordReset,
    isAuthenticated,
    setError // Expose for components to clear errors
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Export a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider component. Make sure your component is wrapped with AuthProvider.');
  }
  return context;
};
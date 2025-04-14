import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Development mode flag - set to false in production
const DEV_MODE = true; // Force development mode for testing

// Mock users for development mode
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Test User',
    email: 'user@example.com',
    role: 'user'
  }
];

export const AuthProvider = ({ children }) => {
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
      
      // Development mode - mock authentication
      if (DEV_MODE) {
        console.log('Using mock authentication in development mode');
        console.log('Login attempt with:', { email, password: '****' });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simple validation
        if (!email || !password) {
          console.error('Login failed: Email and password are required');
          throw new Error('Email and password are required');
        }
        
        // Find mock user
        const user = MOCK_USERS.find(u => u.email === email);
        console.log('User found:', user ? 'Yes' : 'No');
        
        // Check if user exists and password is correct (mock check)
        if (!user || password !== 'password123') {
          console.error('Login failed: Invalid credentials');
          throw new Error('Invalid email or password');
        }
        
        // Create a mock token
        const token = `mock-jwt-token-${user.id}-${Date.now()}`;
        
        // Store user data if remember is true
        if (remember) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Set current user
        console.log('Setting current user:', user);
        setCurrentUser(user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('Login successful');
        return user;
      }
      
      // Production mode - real authentication
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      
      const { user, token } = response.data;
      
      // Store the token in localStorage if remember is true, otherwise in memory
      if (remember) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Set auth header for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      return user;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to login. Please check your credentials.';
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
        if (MOCK_USERS.some(u => u.email === userData.email)) {
          throw new Error('Email already exists');
        }
        
        // Create mock user
        const newUser = {
          id: MOCK_USERS.length + 1,
          name: userData.name,
          email: userData.email,
          role: 'user'
        };
        
        // Add to mock users (in a real app this would persist)
        MOCK_USERS.push(newUser);
        
        return newUser;
      }
      
      // Production mode - real registration
      const response = await axios.post('http://localhost:3000/api/auth/register', userData);
      return response.data;
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
      const response = await axios.put(`http://localhost:3000/api/users/${currentUser.id}`, userData);
      
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
      await axios.post('http://localhost:3000/api/auth/reset-password', { email });
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
      await axios.post('http://localhost:3000/api/auth/reset-password/confirm', {
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

  const value = {
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if there's a token in localStorage on app startup
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
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
      
      // Make API call to authenticate
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
      const message = err.response?.data?.message || 'Failed to login. Please check your credentials.';
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
      
      const response = await axios.post('http://localhost:3000/api/auth/register', userData);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to register. Please try again.';
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
      const response = await axios.put(`http://localhost:3000/api/users/${currentUser.id}`, userData);
      
      const updatedUser = response.data;
      setCurrentUser(updatedUser);
      
      // Update stored user data if it exists
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
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
      await axios.post('http://localhost:3000/api/auth/reset-password', { email });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to request password reset.';
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
      await axios.post('http://localhost:3000/api/auth/reset-password/confirm', {
        token,
        newPassword
      });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
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
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Check for existing user on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Login function
    const login = (userData) => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setCurrentUser(userData);

        // Navigate based on role
        if (userData.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        navigate('/');
    };

    // Update user function
    const updateUserData = (userData) => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setCurrentUser(userData);
    };

    // Check if user is authenticated
    const isAuthenticated = !!currentUser;

    // Check if user is admin
    const isAdmin = currentUser?.role === 'admin';

    const contextValue = {
        currentUser,
        isLoading,
        login,
        logout,
        updateUserData,
        isAuthenticated,
        isAdmin
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;

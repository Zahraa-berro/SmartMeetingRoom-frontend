import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app loads
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (apiResponse) => {
    
  console.log('API Response:', apiResponse); 
    const { user: userData, token } = apiResponse;
    
    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    // Update state
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  // Check if user has specific role
  const hasRole = (roleType) => {
    return user?.role?.type === roleType;
  };

  // The value that will be available to all components
  const value = {
    user,           // The user object with role data
    login,          // Function to log in
    logout,         // Function to log out
    loading,        // Loading state
    hasRole,        // Check specific role
    isAuthenticated: !!user, // Boolean for authentication status
    userRole: user?.role?.type // Easy access to role type
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
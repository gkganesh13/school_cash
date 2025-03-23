import React, { createContext, useState, useContext, useEffect } from 'react';

// Static test credentials
const TEST_USERS = {
  student: {
    email: 'student@school.com',
    password: 'password123',
    data: {
      id: '1',
      name: 'Test Student',
      email: 'student@school.com',
      role: 'student',
      grade: '10',
      section: 'A',
      studentId: 'STU001'
    }
  },
  parent: {
    email: 'parent@school.com',
    password: 'password123',
    data: {
      id: '2',
      name: 'Test Parent',
      email: 'parent@school.com',
      role: 'parent',
      children: [
        {
          id: '1',
          name: 'John Doe',
          grade: '10',
          section: 'A',
          studentId: 'STU001'
        },
        {
          id: '2',
          name: 'Jane Doe',
          grade: '8',
          section: 'B',
          studentId: 'STU002'
        }
      ]
    }
  },
  vendor: {
    email: 'vendor@school.com',
    password: 'password123',
    data: {
      id: '3',
      name: 'Test Vendor',
      email: 'vendor@school.com',
      role: 'vendor',
      vendorId: 'VEN001',
      services: ['Canteen', 'Stationery']
    }
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials for all user types
    const userType = Object.keys(TEST_USERS).find(
      type => TEST_USERS[type].email === credentials.email && 
              TEST_USERS[type].password === credentials.password
    );

    if (userType) {
      const userData = TEST_USERS[userType].data;
      const token = `test-token-${userType}-123`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password'
    };
  };

  const register = async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For testing, create a new user based on the role
    const role = userData.role || 'student';
    const baseUser = TEST_USERS[role].data;
    
    const newUser = {
      ...baseUser,
      name: userData.name,
      email: userData.email
    };

    const token = `test-token-${role}-123`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    setUser(null);
  };

  const requestPasswordReset = async (email) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const resetPassword = async (token, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register, 
        loading,
        requestPasswordReset,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

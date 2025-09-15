import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile from backend
  const loadUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const response = await api.auth.getCurrentUser();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // If user doesn't exist in backend, create them
      if (error.response?.status === 404) {
        try {
          const token = await user.getIdToken();
          await api.auth.register({
            firebase_uid: user.uid,
            email: user.email,
            display_name: user.displayName || 'User'
          }, token);
          
          // Retry loading profile
          const retryResponse = await api.auth.getCurrentUser();
          setUserProfile(retryResponse.data);
        } catch (registerError) {
          console.error('Failed to register user:', registerError);
          setError('Failed to create user profile');
        }
      }
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setLoading(true);
      
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up function
  const signUp = async (email, password, displayName) => {
    try {
      setError(null);
      const user = await authService.signUp(email, password, displayName);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setError(null);
      const user = await authService.signIn(email, password);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const user = await authService.signInWithGoogle();
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await api.auth.updateProfile(profileData);
      setUserProfile(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
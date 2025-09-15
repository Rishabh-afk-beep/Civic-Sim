// src/App.js - COMPLETE WITH ALL ROUTES
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './components/theme/ThemeProvider';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentVerification from './pages/DocumentVerification';
import PolicySimulation from './pages/PolicySimulation';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';

// Common Components
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { loading } = useAuth();
  const { theme } = useTheme();

  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/verify-document" element={
          <ProtectedRoute>
            <Layout><DocumentVerification /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/simulate-policy" element={
          <ProtectedRoute>
            <Layout><PolicySimulation /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/feedback" element={
          <ProtectedRoute>
            <Layout><Feedback /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
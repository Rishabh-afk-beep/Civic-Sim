// src/components/layout/Layout.js - FOR ENHANCED CHATBOT
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import EnhancedChatbot from '../common/EnhancedChatbot';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  // Don't show chatbot on login page (optional)
  const showChatbot = location.pathname !== '/login';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Enhanced Chatbot Widget */}
      {showChatbot && <EnhancedChatbot />}
    </div>
  );
};

export default Layout;
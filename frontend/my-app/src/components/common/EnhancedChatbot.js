// src/components/common/EnhancedChatbot.js - PREMIUM VERSION
import React, { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  HelpCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedChatbot = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Set up custom event listeners for Voiceflow
    const handleChatOpened = () => {
      setHasInteracted(true);
      setShowWelcome(false);
    };

    const handleChatClosed = () => {
      // Handle chat close if needed
    };

    window.addEventListener('voiceflowChatOpened', handleChatOpened);
    window.addEventListener('voiceflowChatClosed', handleChatClosed);

    // Load Voiceflow script
    const loadVoiceflowScript = () => {
      if (document.querySelector('script[src*="voiceflow.com"]')) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        (function(d, t) {
            var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
            v.onload = function() {
              // Initialize Voiceflow chat (TEXT ONLY - NO VOICE)
              window.voiceflow.chat.load({
                verify: { projectID: '68c65c06563ae0917ad6931a' },
                url: 'https://general-runtime.voiceflow.com',
                versionID: 'production',
                assistant: {
                  stylesheet: 'https://cdn.voiceflow.com/widget/bundle.mjs.css',
                  voice: false,
                  speech: false,
                  microphone: false,
                  textInput: true
                },
                config: {
                  tts: false,
                  stt: false,
                  autoplay: false
                }
              }).then(() => {
                // Chat is now fully loaded, set up event listeners
                try {
                  if (window.voiceflow && window.voiceflow.chat && typeof window.voiceflow.chat.on === 'function') {
                    window.voiceflow.chat.on('open', () => {
                      console.log('Voiceflow chat opened');
                      // Use a custom event to communicate with React
                      window.dispatchEvent(new CustomEvent('voiceflowChatOpened'));
                    });
                    
                    window.voiceflow.chat.on('close', () => {
                      console.log('Voiceflow chat closed');
                      window.dispatchEvent(new CustomEvent('voiceflowChatClosed'));
                    });
                  }
                } catch (error) {
                  console.log('Voiceflow event listeners not available yet:', error);
                }
              }).catch((error) => {
                console.error('Failed to load Voiceflow chat:', error);
              });
            }
            v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; 
            v.type = "text/javascript"; 
            s.parentNode.insertBefore(v, s);
        })(document, 'script');
      `;

      document.head.appendChild(script);

      setTimeout(() => {
        setIsLoaded(true);
        // Show welcome message for new users
        if (!hasInteracted) {
          setTimeout(() => setShowWelcome(true), 3000);
        }
      }, 2000);
    };

    loadVoiceflowScript();

    // Cleanup event listeners
    return () => {
      window.removeEventListener('voiceflowChatOpened', handleChatOpened);
      window.removeEventListener('voiceflowChatClosed', handleChatClosed);
    };
  }, [hasInteracted]);

  // Apply theme integration
  useEffect(() => {
    if (isLoaded) {
      const style = document.createElement('style');
      style.id = 'voiceflow-civicsim-theme';
      style.textContent = `
        .vfrc-widget {
          font-family: 'Inter', sans-serif !important;
          z-index: 9999 !important;
          bottom: 24px !important;
          right: 24px !important;
        }

        /* Hide all voice/audio related elements */
        .vfrc-chat--input [data-testid*="voice"],
        .vfrc-chat--input [data-testid*="microphone"],
        .vfrc-chat--input [data-testid*="speech"],
        .vfrc-chat--input button[aria-label*="voice"],
        .vfrc-chat--input button[aria-label*="microphone"],
        .vfrc-chat--input button[title*="voice"],
        .vfrc-chat--input button[title*="microphone"],
        [class*="voice"],
        [class*="microphone"],
        [class*="speech"] {
          display: none !important;
          visibility: hidden !important;
        }

        ${theme === 'dark' ? `
          .vfrc-widget--chat {
            --vf-color-primary: #3B82F6;
            --vf-color-accent: #8B5CF6;
            background: #1F2937 !important;
            color: #F3F4F6 !important;
            border: 1px solid #374151 !important;
          }
        ` : `
          .vfrc-widget--chat {
            --vf-color-primary: #3B82F6;
            --vf-color-accent: #8B5CF6;
            background: #FFFFFF !important;
            color: #1F2937 !important;
            border: 1px solid #E5E7EB !important;
          }
        `}

        @media (max-width: 768px) {
          .vfrc-widget {
            bottom: 20px !important;
            right: 20px !important;
          }
        }
      `;

      const existingStyle = document.getElementById('voiceflow-civicsim-theme');
      if (existingStyle) existingStyle.remove();

      document.head.appendChild(style);
    }
  }, [theme, isLoaded]);

  const openChat = () => {
    try {
      if (window.voiceflow && window.voiceflow.chat && typeof window.voiceflow.chat.open === 'function') {
        window.voiceflow.chat.open();
        setHasInteracted(true);
        setShowWelcome(false);
      } else {
        console.log('Voiceflow chat not yet initialized, retrying...');
        // Retry after a short delay
        setTimeout(() => {
          if (window.voiceflow && window.voiceflow.chat && typeof window.voiceflow.chat.open === 'function') {
            window.voiceflow.chat.open();
            setHasInteracted(true);
            setShowWelcome(false);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error opening Voiceflow chat:', error);
    }
  };

  const QuickActions = () => (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 right-6 z-40 max-w-sm"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 backdrop-blur-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    👋 Hi {currentUser?.email?.split('@')[0] || 'there'}!
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Need help with CivicSim?
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 mb-3">
              <button
                onClick={openChat}
                className="text-left p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-blue-800 dark:text-blue-300 group-hover:text-blue-900 dark:group-hover:text-blue-200">
                    How does document verification work?
                  </span>
                </div>
              </button>

              <button
                onClick={openChat}
                className="text-left p-2 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-3 w-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-800 dark:text-green-300 group-hover:text-green-900 dark:group-hover:text-green-200">
                    Explain policy simulation results
                  </span>
                </div>
              </button>
            </div>

            <button
              onClick={openChat}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200"
            >
              💬 Start Conversation
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const LoadingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-30"
    >
      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
      </div>
    </motion.div>
  );

  return (
    <>
      {!isLoaded && <LoadingIndicator />}
      {isLoaded && <QuickActions />}
    </>
  );
};

export default EnhancedChatbot;
import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonLoader = ({ className = '', lines = 3, showAvatar = false }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
        )}
        <div className="flex-1 space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${
                i === lines - 1 ? 'w-3/4' : 'w-full'
              }`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PremiumSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    red: 'border-red-500'
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full`}
        style={{
          borderTopColor: 'transparent',
          borderRightColor: 'transparent'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className={`w-full h-full ${colors[color]} border-4 rounded-full border-t-transparent border-r-transparent`} />
      </motion.div>
    </div>
  );
};

export const ProgressBar = ({ progress = 0, label = '', showPercentage = true }) => {
  return (
    <div className="w-full space-y-2">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {showPercentage && <span className="text-sm text-gray-500 dark:text-gray-400">{progress}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="h-full w-full bg-white/20 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};

export const PulsingDots = ({ count = 3, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500'
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${colors[color]}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

export const WaveLoader = ({ className = '' }) => {
  return (
    <div className={`flex items-end space-x-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full"
          animate={{
            height: [10, 30, 10],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default { SkeletonLoader, PremiumSpinner, ProgressBar, PulsingDots, WaveLoader };
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = '', 
  hover = true,
  delay = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }}
      whileHover={hover ? { 
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Card sub-components with animations
export const CardHeader = ({ children, className = '' }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    className={`p-6 pb-4 ${className}`}
  >
    {children}
  </motion.div>
);

export const CardTitle = ({ children, className = '' }) => (
  <motion.h3 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
    className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}
  >
    {children}
  </motion.h3>
);

export const CardContent = ({ children, className = '' }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className={`p-6 pt-2 ${className}`}
  >
    {children}
  </motion.div>
);

export const CardFooter = ({ children, className = '' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className={`p-6 pt-4 border-t border-gray-100 dark:border-gray-700 ${className}`}
  >
    {children}
  </motion.div>
);

export default AnimatedCard;
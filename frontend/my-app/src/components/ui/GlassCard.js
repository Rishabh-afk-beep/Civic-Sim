import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const GlassCard = ({ 
  children, 
  className = '', 
  blur = 'md',
  opacity = 'medium',
  glow = false,
  animated = true,
  ...props 
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const opacityClasses = {
    light: 'bg-white/10 dark:bg-gray-800/10 border-white/20 dark:border-gray-700/20',
    medium: 'bg-white/20 dark:bg-gray-800/20 border-white/30 dark:border-gray-700/30',
    heavy: 'bg-white/30 dark:bg-gray-800/30 border-white/40 dark:border-gray-700/40'
  };

  const CardComponent = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    whileHover: { 
      scale: 1.02, 
      boxShadow: glow ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : undefined 
    },
    transition: { type: "spring", stiffness: 300, damping: 25 }
  } : {};

  return (
    <CardComponent
      className={clsx(
        'rounded-2xl border shadow-xl',
        blurClasses[blur],
        opacityClasses[opacity],
        {
          'shadow-2xl': glow,
          'hover:shadow-3xl transition-all duration-300': !animated
        },
        className
      )}
      {...animationProps}
      {...props}
    >
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Optional glow effect */}
      {glow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm -z-10" />
      )}
    </CardComponent>
  );
};

export const GlassButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  glow = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-600/90 hover:to-purple-700/90 text-white',
    secondary: 'bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 text-gray-900 dark:text-white border border-white/30 dark:border-gray-700/30',
    ghost: 'bg-transparent hover:bg-white/10 dark:hover:bg-gray-800/10 text-gray-700 dark:text-gray-300'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={clsx(
        'relative rounded-xl backdrop-blur-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900',
        variants[variant],
        sizes[size],
        {
          'shadow-lg hover:shadow-xl': !glow,
          'shadow-2xl hover:shadow-3xl': glow
        },
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {/* Inner shine */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>

      {/* Glow effect */}
      {glow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl blur-md -z-10" />
      )}
    </motion.button>
  );
};

export default GlassCard;
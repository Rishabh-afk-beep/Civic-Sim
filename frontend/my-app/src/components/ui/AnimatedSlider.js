import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useSpring, useTransform } from 'framer-motion';

const AnimatedSlider = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  label,
  description,
  unit = '%',
  gradient = 'from-blue-500 to-purple-600',
  icon: Icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const percentage = ((value - min) / (max - min)) * 100;
  const controls = useAnimation();
  
  // Spring animations for smooth value changes
  const springValue = useSpring(value, { stiffness: 200, damping: 25 });
  const animatedPercentage = useTransform(springValue, [min, max], [0, 100]);
  
  // Enhanced color transitions based on value
  const getGradientColors = (percentage) => {
    if (percentage < 25) return 'from-emerald-400 to-teal-500';
    if (percentage < 50) return 'from-blue-400 to-cyan-500';
    if (percentage < 75) return 'from-purple-400 to-indigo-500';
    return 'from-pink-400 to-rose-500';
  };
  
  const currentGradient = getGradientColors(percentage);
  
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);
  
  return (
    <div className="space-y-4">
      {/* Label and Value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {Icon && (
            <motion.div
              animate={{ 
                rotate: isDragging ? 360 : 0,
                scale: isDragging ? 1.1 : 1 
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </motion.div>
          )}
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        </div>
        
        <motion.div
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.5 
          }}
          className={`relative px-4 py-2 rounded-full bg-gradient-to-r ${currentGradient} text-white font-bold text-sm shadow-xl overflow-hidden`}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [-100, 200] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "linear" 
            }}
          />
          <span className="relative z-10">{value}{unit}</span>
        </motion.div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      {/* Premium Slider Container */}
      <div 
        className="relative py-4"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Floating Tooltip */}
        <motion.div
          className={`absolute z-20 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-xl pointer-events-none`}
          style={{ 
            left: `calc(${percentage}% - 20px)`,
            top: '-45px'
          }}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ 
            opacity: (isDragging || showTooltip) ? 1 : 0,
            y: (isDragging || showTooltip) ? 0 : 10,
            scale: (isDragging || showTooltip) ? 1 : 0.8
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {value}{unit}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
        </motion.div>

        {/* Track Background with Glass Effect */}
        <div className="relative h-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
          {/* Animated Progress Fill */}
          <motion.div
            className={`h-full bg-gradient-to-r ${currentGradient} rounded-full relative overflow-hidden`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 20,
              duration: 0.8 
            }}
          >
            {/* Multi-layer Glow Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent rounded-full" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
              animate={{ x: [-50, 150] }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "easeInOut" 
              }}
            />
            
            {/* Floating Particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: '50%',
                }}
                animate={{
                  y: [-2, -8, -2],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5 + i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Premium Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer z-10"
        />

        {/* Premium Animated Thumb */}
        <motion.div
          className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br ${currentGradient} rounded-full shadow-2xl border-3 border-white dark:border-gray-800 cursor-pointer z-15`}
          style={{ left: `calc(${percentage}% - 16px)` }}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            scale: isDragging ? 1.3 : (hovering ? 1.1 : 1),
            boxShadow: isDragging 
              ? "0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(147, 51, 234, 0.3)"
              : "0 4px 20px rgba(0, 0, 0, 0.2)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Inner Glow */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
          
          {/* Pulsing Ring */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentGradient}`}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          
          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
        </motion.div>

        {/* Value Indicators */}
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs text-gray-400">{min}{unit}</span>
          <span className="text-xs text-gray-400">{max}{unit}</span>
        </div>
      </div>

      {/* Premium Impact Visualization */}
      <motion.div
        key={value}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mt-4 p-4 rounded-xl bg-gradient-to-br from-gray-50/80 via-blue-50/60 to-purple-50/40 dark:from-gray-800/80 dark:via-blue-900/60 dark:to-purple-900/40 border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentGradient} animate-pulse`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Impact Level
            </span>
          </div>
          <motion.div
            className="text-xs font-bold text-gray-500 dark:text-gray-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {Math.floor(value / 20) + 1}/5
          </motion.div>
        </div>
        
        <div className="flex items-end space-x-1.5">
          {[1, 2, 3, 4, 5].map((level) => {
            const isActive = level <= Math.floor(value / 20) + 1;
            const height = 8 + (level * 4);
            
            return (
              <motion.div
                key={level}
                className="relative flex-1 rounded-t-lg overflow-hidden"
                initial={{ height: 8, opacity: 0 }}
                animate={{ 
                  height: isActive ? height : 8,
                  opacity: 1
                }}
                transition={{ 
                  duration: 0.6,
                  delay: level * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <motion.div
                  className={`w-full h-full rounded-t-lg ${
                    isActive
                      ? `bg-gradient-to-t ${currentGradient}`
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  animate={isActive ? {
                    boxShadow: [
                      "0 0 0 rgba(59, 130, 246, 0)",
                      "0 0 15px rgba(59, 130, 246, 0.4)",
                      "0 0 0 rgba(59, 130, 246, 0)"
                    ]
                  } : {}}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Shimmer effect for active bars */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                      animate={{ y: [height, -height] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: level * 0.2
                      }}
                    />
                  )}
                  
                  {/* Floating particles for high impact */}
                  {isActive && level >= 4 && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-0.5 h-0.5 bg-white/80 rounded-full"
                          style={{
                            left: `${30 + i * 20}%`,
                            top: '20%',
                          }}
                          animate={{
                            y: [0, -10, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3 + level * 0.1
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Impact Description */}
        <motion.div
          className="mt-3 text-center"
          key={Math.floor(value / 20) + 1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            Math.floor(value / 20) + 1 <= 2 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : Math.floor(value / 20) + 1 <= 4
              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
            {Math.floor(value / 20) + 1 <= 2 ? 'Low Impact' : 
             Math.floor(value / 20) + 1 <= 4 ? 'Moderate Impact' : 'High Impact'}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnimatedSlider;
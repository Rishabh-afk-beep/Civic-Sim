import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements = ({ elements = [] }) => {
  const defaultElements = [
    { id: 1, icon: '✨', position: { top: '10%', left: '15%' }, delay: 0 },
    { id: 2, icon: '🚀', position: { top: '20%', right: '20%' }, delay: 1 },
    { id: 3, icon: '💫', position: { bottom: '30%', left: '10%' }, delay: 2 },
    { id: 4, icon: '⭐', position: { bottom: '20%', right: '15%' }, delay: 0.5 },
    { id: 5, icon: '🔮', position: { top: '50%', left: '5%' }, delay: 1.5 },
  ];

  const elementsToRender = elements.length > 0 ? elements : defaultElements;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {elementsToRender.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-2xl opacity-30 dark:opacity-20"
          style={element.position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            rotate: [0, 360],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  );
};

export const FloatingShapes = () => {
  const shapes = [
    { id: 1, size: 20, color: 'bg-blue-400/20', position: { top: '15%', left: '10%' } },
    { id: 2, size: 30, color: 'bg-purple-400/20', position: { top: '25%', right: '15%' } },
    { id: 3, size: 25, color: 'bg-cyan-400/20', position: { bottom: '20%', left: '20%' } },
    { id: 4, size: 15, color: 'bg-pink-400/20', position: { bottom: '30%', right: '10%' } },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full ${shape.color} blur-sm`}
          style={{
            width: shape.size,
            height: shape.size,
            ...shape.position
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 20, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
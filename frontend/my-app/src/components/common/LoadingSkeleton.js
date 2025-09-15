import React from 'react';

const LoadingSkeleton = ({ 
  className = '', 
  height = 'h-4',
  width = 'w-full',
  rounded = 'rounded',
  animated = true 
}) => {
  return (
    <div 
      className={`${animated ? 'animate-pulse' : ''} ${className}`}
      role="status" 
      aria-label="Loading"
    >
      <div className={`${height} ${width} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${rounded} ${animated ? 'animate-shimmer bg-[length:200%_100%]' : ''}`}></div>
    </div>
  );
};

// Pre-built skeleton components
export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-4">
    <LoadingSkeleton height="h-6" width="w-3/4" />
    <LoadingSkeleton height="h-4" width="w-full" />
    <LoadingSkeleton height="h-4" width="w-5/6" />
    <LoadingSkeleton height="h-10" width="w-1/3" rounded="rounded-lg" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex space-x-4">
        <LoadingSkeleton height="h-4" width="w-1/4" />
        <LoadingSkeleton height="h-4" width="w-1/6" />
        <LoadingSkeleton height="h-4" width="w-1/6" />
        <LoadingSkeleton height="h-4" width="w-1/8" />
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
    <LoadingSkeleton height="h-6" width="w-1/3" className="mb-4" />
    <LoadingSkeleton height="h-64" width="w-full" rounded="rounded-lg" />
  </div>
);

export default LoadingSkeleton;
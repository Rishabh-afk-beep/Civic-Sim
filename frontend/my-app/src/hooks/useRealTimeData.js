import { useState, useEffect, useRef } from 'react';

export const useRealTimeData = (initialData, updateInterval = 5000) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef();

  const simulateDataUpdate = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setData(prevData => {
        if (!Array.isArray(prevData)) return prevData;
        
        return prevData.map(item => ({
          ...item,
          // Simulate small random changes
          delivered_budget: Math.max(
            item.delivered_budget + (Math.random() - 0.5) * 100000000,
            item.delivered_budget * 0.7 // Ensure minimum 70% of original
          ),
          delivery_percentage: Math.min(
            Math.max(item.delivery_percentage + (Math.random() - 0.5) * 5, 60),
            95
          ),
          transparency_score: Math.min(
            Math.max((item.transparency_score || 75) + (Math.random() - 0.5) * 8, 50),
            95
          )
        }));
      });
      setIsLoading(false);
    }, 1000);
  };

  const startRealTimeUpdates = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(simulateDataUpdate, updateInterval);
  };

  const stopRealTimeUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopRealTimeUpdates();
  }, []);

  return {
    data,
    isLoading,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    manualUpdate: simulateDataUpdate
  };
};
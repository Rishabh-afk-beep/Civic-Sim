import axios from "axios";
import { useState, useCallback } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
      setError(errorMessage);
      
      if (options.showErrorToast !== false) {
        toast.error(errorMessage);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError
  };
};

// Fixed Document Verification Hook
export const useDocumentVerification = () => {
  const { loading, error, execute, clearError } = useApi();

  const verifyDocument = useCallback((formData) => {
    return execute(async () => {
      // Use the api service which has fallback logic
      const result = await api.documents.verify(formData);
      return result;
    }, { successMessage: "Document verification completed!" });
  }, [execute]);

  const getDocumentHistory = useCallback((skip = 0, limit = 20) => {
    return execute(() => api.documents.getHistory(skip, limit));
  }, [execute]);

  return {
    loading,
    error,
    verifyDocument,
    getDocumentHistory,
    clearError,
  };
};

// Rest of your hooks remain the same...
export const useDashboard = () => {
  const { loading, error, execute, clearError } = useApi();

  const getBudgetData = useCallback(() => {
    return execute(() => api.dashboard.getBudgetData());
  }, [execute]);

  const getTransparencyScores = useCallback(() => {
    return execute(() => api.dashboard.getTransparencyScores());
  }, [execute]);

  const getSectorBreakdown = useCallback((sectorName) => {
    return execute(() => api.dashboard.getSectorBreakdown(sectorName));
  }, [execute]);

  return {
    loading,
    error,
    getBudgetData,
    getTransparencyScores,
    getSectorBreakdown,
    clearError
  };
};

export const usePolicySimulation = () => {
  const { loading, error, execute, clearError } = useApi();

  const runSimulation = useCallback((simulationData) => {
    return execute(
      () => api.simulation.run(simulationData),
      { successMessage: 'Policy simulation completed!' }
    );
  }, [execute]);

  const getScenarios = useCallback(() => {
    return execute(() => api.simulation.getScenarios());
  }, [execute]);

  const getSimulationHistory = useCallback((skip = 0, limit = 20) => {
    return execute(() => api.simulation.getHistory(skip, limit));
  }, [execute]);

  return {
    loading,
    error,
    runSimulation,
    getScenarios,
    getSimulationHistory,
    clearError
  };
};

export const useFeedback = () => {
  const { loading, error, execute, clearError } = useApi();

  const submitFeedback = useCallback((feedbackData) => {
    return execute(
      () => api.feedback.submit(feedbackData),
      { successMessage: 'Thank you for your feedback!' }
    );
  }, [execute]);

  const getMyFeedback = useCallback((skip = 0, limit = 20) => {
    return execute(() => api.feedback.getMyFeedback(skip, limit));
  }, [execute]);

  return {
    loading,
    error,
    submitFeedback,
    getMyFeedback,
    clearError
  };
};
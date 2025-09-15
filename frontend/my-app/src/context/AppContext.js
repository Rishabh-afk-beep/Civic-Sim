import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Initial state
const initialState = {
  notifications: [],
  theme: 'light',
  sidebarOpen: false,
  dashboardData: null,
  simulationHistory: [],
  documentHistory: [],
  feedbackHistory: []
};

// Action types
const actionTypes = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  TOGGLE_THEME: 'TOGGLE_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  SET_SIMULATION_HISTORY: 'SET_SIMULATION_HISTORY',
  SET_DOCUMENT_HISTORY: 'SET_DOCUMENT_HISTORY',
  SET_FEEDBACK_HISTORY: 'SET_FEEDBACK_HISTORY',
  RESET_STATE: 'RESET_STATE'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };
      
    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    case actionTypes.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };
      
    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
      
    case actionTypes.SET_DASHBOARD_DATA:
      return {
        ...state,
        dashboardData: action.payload
      };
      
    case actionTypes.SET_SIMULATION_HISTORY:
      return {
        ...state,
        simulationHistory: action.payload
      };
      
    case actionTypes.SET_DOCUMENT_HISTORY:
      return {
        ...state,
        documentHistory: action.payload
      };
      
    case actionTypes.SET_FEEDBACK_HISTORY:
      return {
        ...state,
        feedbackHistory: action.payload
      };
      
    case actionTypes.RESET_STATE:
      return initialState;
      
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const addNotification = (notification) => {
    dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification });
    
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id || Date.now());
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id });
  };

  const toggleTheme = () => {
    dispatch({ type: actionTypes.TOGGLE_THEME });
  };

  const toggleSidebar = () => {
    dispatch({ type: actionTypes.TOGGLE_SIDEBAR });
  };

  const setDashboardData = (data) => {
    dispatch({ type: actionTypes.SET_DASHBOARD_DATA, payload: data });
  };

  const setSimulationHistory = (history) => {
    dispatch({ type: actionTypes.SET_SIMULATION_HISTORY, payload: history });
  };

  const setDocumentHistory = (history) => {
    dispatch({ type: actionTypes.SET_DOCUMENT_HISTORY, payload: history });
  };

  const setFeedbackHistory = (history) => {
    dispatch({ type: actionTypes.SET_FEEDBACK_HISTORY, payload: history });
  };

  const resetState = () => {
    dispatch({ type: actionTypes.RESET_STATE });
  };

  const value = {
    ...state,
    addNotification,
    removeNotification,
    toggleTheme,
    toggleSidebar,
    setDashboardData,
    setSimulationHistory,
    setDocumentHistory,
    setFeedbackHistory,
    resetState
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
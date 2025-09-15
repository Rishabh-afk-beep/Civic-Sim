// API Constants
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Application Constants
export const APP_NAME = process.env.REACT_APP_APP_NAME || 'CivicSim';
export const APP_VERSION = process.env.REACT_APP_APP_VERSION || '1.0.0';

// File Upload Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/plain', 
  'image/jpeg',
  'image/png'
];

export const SUPPORTED_DOCUMENT_TYPES = [
  { value: 'government_announcement', label: 'Government Announcement' },
  { value: 'budget_document', label: 'Budget Document' },
  { value: 'policy_statement', label: 'Policy Statement' },
  { value: 'procurement_notice', label: 'Procurement Notice' }
];

// User Roles
export const USER_ROLES = {
  CITIZEN: 'citizen',
  RESEARCHER: 'researcher', 
  JOURNALIST: 'journalist',
  ADMIN: 'admin'
};

export const ROLE_LABELS = {
  [USER_ROLES.CITIZEN]: 'Citizen',
  [USER_ROLES.RESEARCHER]: 'Researcher',
  [USER_ROLES.JOURNALIST]: 'Journalist',
  [USER_ROLES.ADMIN]: 'Administrator'
};

// Verification Verdicts
export const VERIFICATION_VERDICTS = {
  VERIFIED: 'verified',
  SUSPICIOUS: 'suspicious',
  INCONCLUSIVE: 'inconclusive'
};

// Feedback Types
export const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report', description: 'Report a technical issue or error' },
  { value: 'feature', label: 'Feature Request', description: 'Suggest a new feature or improvement' },
  { value: 'general', label: 'General Feedback', description: 'Share your thoughts or suggestions' },
  { value: 'rating', label: 'Platform Rating', description: 'Rate your overall experience' }
];

// Simulation Scenarios
export const SIMULATION_SCENARIOS = {
  EDUCATION_SUBSIDY: 'education_subsidy_increase',
  HEALTHCARE_EXPANSION: 'healthcare_infrastructure_expansion', 
  AGRICULTURAL_SUPPORT: 'agricultural_support_program',
  SOCIAL_WELFARE: 'social_welfare_enhancement',
  INFRASTRUCTURE: 'infrastructure_development'
};

// Chart Colors
export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16'  // Lime
];

// Navigation Links
export const NAV_LINKS = [
  { path: '/', label: 'Home', protected: false },
  { path: '/dashboard', label: 'Dashboard', protected: true },
  { path: '/verify-document', label: 'Verify Document', protected: true },
  { path: '/simulate-policy', label: 'Policy Simulator', protected: true },
  { path: '/feedback', label: 'Feedback', protected: true }
];

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'civicsim_user_preferences',
  RECENT_SEARCHES: 'civicsim_recent_searches',
  DASHBOARD_FILTERS: 'civicsim_dashboard_filters'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please sign in again.',
  AUTHORIZATION_ERROR: 'You do not have permission to access this resource.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 10MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload PDF, TXT, JPG, or PNG files.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  DOCUMENT_VERIFIED: 'Document verification completed successfully!',
  SIMULATION_COMPLETE: 'Policy simulation completed!',
  FEEDBACK_SUBMITTED: 'Thank you for your feedback!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SIGNED_IN: 'Welcome back!',
  SIGNED_OUT: 'You have been signed out successfully.'
};

// Disclaimer Text
export const DISCLAIMERS = {
  AI_ANALYSIS: 'This AI analysis is for educational purposes and provides probabilistic assessments. Results should not be considered as definitive proof.',
  SIMULATION: 'These simulations use simplified mathematical models for educational purposes. Real-world outcomes may vary significantly.',
  DATA_SOURCE: 'This dashboard displays sample governance data for educational purposes. Always verify information through official sources.',
  PLATFORM: 'CivicSim provides AI-assisted analysis for educational purposes. Results should be verified through official sources and expert consultation for critical decisions.'
};
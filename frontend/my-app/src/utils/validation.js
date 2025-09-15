/**
 * Email validation
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * File validation
 */
export const validateFile = (file, maxSize = 10 * 1024 * 1024, allowedTypes = []) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${formatFileSize(maxSize)}`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * URL validation
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Phone number validation (basic)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\\+]?[1-9][\\d\\s\\-\\(\\)]+$/;
  return phoneRegex.test(phone.replace(/\\s/g, ''));
};

/**
 * Required field validation
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Minimum length validation
 */
export const minLength = (value, min) => {
  return value.length >= min;
};

/**
 * Maximum length validation
 */
export const maxLength = (value, max) => {
  return value.length <= max;
};

/**
 * Numeric validation
 */
export const isNumeric = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

/**
 * Range validation
 */
export const inRange = (value, min, max) => {
  const num = parseFloat(value);
  return num >= min && num <= max;
};

/**
 * Percentage validation
 */
export const isValidPercentage = (value) => {
  return isNumeric(value) && inRange(value, 0, 100);
};

/**
 * Rating validation
 */
export const isValidRating = (value) => {
  return isNumeric(value) && inRange(value, 1, 5);
};

/**
 * Form validation helper
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];
    
    fieldRules.forEach(rule => {
      if (typeof rule === 'function') {
        const result = rule(value);
        if (result !== true) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(result);
        }
      } else if (typeof rule === 'object') {
        const { validator, message } = rule;
        if (!validator(value)) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(message);
        }
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required') => ({
    validator: isRequired,
    message
  }),
  
  email: (message = 'Please enter a valid email address') => ({
    validator: isValidEmail,
    message
  }),
  
  minLength: (min, message) => ({
    validator: (value) => minLength(value, min),
    message: message || `Must be at least ${min} characters`
  }),
  
  maxLength: (max, message) => ({
    validator: (value) => maxLength(value, max),
    message: message || `Must be no more than ${max} characters`
  }),
  
  numeric: (message = 'Must be a valid number') => ({
    validator: isNumeric,
    message
  }),
  
  percentage: (message = 'Must be between 0 and 100') => ({
    validator: isValidPercentage,
    message
  }),
  
  rating: (message = 'Must be between 1 and 5') => ({
    validator: isValidRating,
    message
  })
};

// Helper function to format file size (imported from helpers if needed)
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
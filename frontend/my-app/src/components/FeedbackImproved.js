import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Star, 
  Send,
  MessageCircle, 
  Bug, 
  Lightbulb, 
  Heart,
  CheckCircle,
  AlertCircle,
  History,
  ChevronDown,
  Calendar,
  Tag
} from 'lucide-react';
import { useApi } from '../hooks/useApi';

const FeedbackImproved = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitStatus, setSubmitStatus] = useState(null); // success, error, null
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { submitFeedback } = useApi();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      feedback_type: 'general',
      subject: '',
      message: '',
      rating: 0
    }
  });

  const feedbackType = watch('feedback_type');

  // Feedback type configurations
  const feedbackTypes = {
    bug: {
      icon: Bug,
      label: 'Report a Bug',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Found something that doesn\'t work as expected?'
    },
    feature: {
      icon: Lightbulb,
      label: 'Suggest Feature',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Have an idea to make CivicSim better?'
    },
    general: {
      icon: MessageCircle,
      label: 'General Feedback',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Share your thoughts and suggestions'
    },
    rating: {
      icon: Heart,
      label: 'Rate Experience',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      description: 'How was your experience using CivicSim?'
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const feedbackData = {
        ...data,
        rating: rating > 0 ? rating : null,
        page_url: window.location.href
      };
      
      await submitFeedback(feedbackData);
      setSubmitStatus('success');
      reset();
      setRating(0);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ interactive = true }) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex items-center justify-center sm:justify-start space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => interactive && setRating(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              whileHover={interactive ? { scale: 1.1 } : {}}
              whileTap={interactive ? { scale: 0.95 } : {}}
              className={`p-2 sm:p-1 ${interactive ? 'cursor-pointer' : 'cursor-default'} touch-manipulation`}
              disabled={!interactive}
            >
              <Star
                size={28}
                className={`sm:w-6 sm:h-6 transition-colors duration-200 ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </motion.button>
          ))}
        </div>
        {rating > 0 && (
          <span className="text-center sm:text-left text-sm text-gray-600 dark:text-gray-400">
            {rating} out of 5 stars
          </span>
        )}
      </div>
    );
  };

  const FeedbackTypeSelector = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 sm:mb-6">
        {Object.entries(feedbackTypes).map(([type, config]) => {
          const Icon = config.icon;
          const isSelected = feedbackType === type;
          
          return (
            <motion.label
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`cursor-pointer p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? `${config.bgColor} ${config.borderColor} ${config.color}`
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <input
                type="radio"
                value={type}
                {...register('feedback_type')}
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <Icon size={20} className={isSelected ? config.color : 'text-gray-400 dark:text-gray-500'} />
                <div className="flex-1">
                  <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{config.label}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{config.description}</div>
                </div>
              </div>
            </motion.label>
          );
        })}
      </div>
    );
  };

  const SuccessMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3"
    >
      <CheckCircle className="text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
      <div>
        <h3 className="font-medium text-sm sm:text-base text-green-800 dark:text-green-200">Thank you for your feedback!</h3>
        <p className="text-xs sm:text-sm text-green-600 dark:text-green-300 mt-1">We appreciate you taking the time to help us improve.</p>
      </div>
    </motion.div>
  );

  const ErrorMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3"
    >
      <AlertCircle className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
      <div>
        <h3 className="font-medium text-sm sm:text-base text-red-800 dark:text-red-200">Oops! Something went wrong</h3>
        <p className="text-xs sm:text-sm text-red-600 dark:text-red-300 mt-1">Please try again. If the problem persists, contact support.</p>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3"
        >
          We Value Your Feedback
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 dark:text-gray-300 text-base sm:text-lg px-4 sm:px-0"
        >
          Help us make CivicSim better for everyone. Your input shapes our future!
        </motion.p>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {submitStatus === 'success' && <SuccessMessage />}
        {submitStatus === 'error' && <ErrorMessage />}
      </AnimatePresence>

      {/* Feedback Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Feedback Type Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
              What type of feedback do you have?
            </label>
            <FeedbackTypeSelector />
          </div>

          {/* Rating for rating type */}
          {feedbackType === 'rating' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                How would you rate your experience?
              </label>
              <StarRating />
            </motion.div>
          )}

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              {...register('subject', { 
                required: 'Please provide a subject',
                minLength: { value: 5, message: 'Subject must be at least 5 characters' }
              })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base ${
                errors.subject ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Brief summary of your feedback..."
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Message *
            </label>
            <textarea
              id="message"
              rows={4}
              {...register('message', { 
                required: 'Please provide your feedback message',
                minLength: { value: 10, message: 'Message must be at least 10 characters' }
              })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base ${
                errors.message ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Tell us more about your feedback..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-3 sm:py-4 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base sm:text-lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Send Feedback</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Toggle History Button */}
      <motion.button
        onClick={() => setShowHistory(!showHistory)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 mb-4 text-sm sm:text-base touch-manipulation"
      >
        <History size={20} />
        <span className="flex-1 text-center sm:flex-initial">{showHistory ? 'Hide' : 'View'} My Feedback History</span>
        <ChevronDown 
          size={16} 
          className={`transform transition-transform duration-200 ${
            showHistory ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Feedback History */}
      <AnimatePresence>
        {showHistory && <FeedbackHistory />}
      </AnimatePresence>
    </div>
  );
};

// Feedback History Component
const FeedbackHistory = () => {
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getMyFeedback } = useApi();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getMyFeedback();
        setFeedbackHistory(history);
      } catch (error) {
        console.error('Failed to fetch feedback history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getMyFeedback]);

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      in_progress: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      resolved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      closed: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    };
    return colors[status] || colors.open;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6"
      >
        <div className="text-center py-6 sm:py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">Loading your feedback history...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6"
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <History size={20} className="mr-2" />
        Your Feedback History
      </h3>

      {feedbackHistory.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <MessageCircle size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">No feedback submitted yet.</p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Your feedback submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {feedbackHistory.map((feedback) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 space-y-2 sm:space-y-0">
                <h4 className="font-medium text-sm sm:text-base text-gray-800 dark:text-white pr-2">{feedback.subject}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium self-start ${getStatusColor(feedback.status)}`}>
                  {feedback.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">
                {feedback.message}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="flex items-center">
                    <Tag size={12} className="mr-1" />
                    <span className="capitalize">{feedback.feedback_type}</span>
                  </span>
                  <span className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(feedback.created_at)}
                  </span>
                </div>
                
                {feedback.rating && (
                  <div className="flex items-center">
                    <Star size={12} className="text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{feedback.rating}/5</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FeedbackImproved;
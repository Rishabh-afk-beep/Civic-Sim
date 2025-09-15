import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Zap,
  Target,
  Clock,
  Cpu
} from 'lucide-react';

const BinaryDocumentResults = ({ results, onClose }) => {
  if (!results) return null;

  const isAuthentic = results.verification_result === 1;

  const ResultIcon = isAuthentic ? CheckCircle : XCircle;
  const resultColor = isAuthentic ? 'green' : 'red';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r ${
          isAuthentic 
            ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
            : 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full bg-${resultColor}-100 dark:bg-${resultColor}-900/30`}>
                <ResultIcon className={`h-8 w-8 text-${resultColor}-600 dark:text-${resultColor}-400`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold text-${resultColor}-800 dark:text-${resultColor}-300`}>
                  {isAuthentic ? '✅ DOCUMENT AUTHENTIC' : '❌ DOCUMENT FAKE'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Binary Classification Result: {results.verification_result} 
                  {isAuthentic ? ' (Real)' : ' (Fake)'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Binary Result Display */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Binary Decision */}
            <div className={`p-4 rounded-lg border-2 ${
              isAuthentic 
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
            }`}>
              <div className="text-center">
                <div className={`text-6xl font-mono font-bold text-${resultColor}-600 dark:text-${resultColor}-400 mb-2`}>
                  {results.verification_result}
                </div>
                <p className={`text-lg font-semibold text-${resultColor}-800 dark:text-${resultColor}-300`}>
                  {isAuthentic ? 'AUTHENTIC' : 'FAKE'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Binary Classification
                </p>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {(results.confidence_score * 100).toFixed(1)}%
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Model Confidence
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Logistic Regression Score
                </p>
              </div>
            </div>
          </div>



          {/* AI Analysis Explanation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
              <Cpu className="h-5 w-5" />
              <span>� AI Analysis</span>
            </h3>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed space-y-3">
                {results.explanation ? (
                  <div className="text-sm whitespace-pre-line">
                    {results.explanation}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="font-medium">
                      🔍 <strong>Document Classification:</strong> {isAuthentic ? 'Authentic (1)' : 'Fake (0)'}
                    </p>
                    <p>
                      🎯 <strong>Confidence Level:</strong> {(results.confidence_score * 100).toFixed(1)}%
                    </p>
                    <p>
                      ⚡ <strong>AI Decision:</strong> Our advanced binary classification system analyzed this document using multiple authenticity indicators including language patterns, formatting consistency, official terminology, metadata validation, and structural elements.
                    </p>
                    <p>
                      {isAuthentic ? (
                        <span className="text-green-700 dark:text-green-300">
                          ✅ The document appears to contain authentic characteristics consistent with official government communications.
                        </span>
                      ) : (
                        <span className="text-red-700 dark:text-red-300">
                          ❌ The document contains indicators that suggest it may not be authentic or official.
                        </span>
                      )}
                    </p>
                    
                    {/* Show key indicators if available */}
                    {results.decision_factors?.authentic_indicators?.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium text-green-700 dark:text-green-300 mb-2">✅ Positive Indicators:</p>
                        <ul className="text-sm space-y-1 ml-4">
                          {results.decision_factors.authentic_indicators.map((indicator, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>{indicator}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {results.decision_factors?.suspicious_indicators?.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium text-red-700 dark:text-red-300 mb-2">⚠️ Concerning Elements:</p>
                        <ul className="text-sm space-y-1 ml-4">
                          {results.decision_factors.suspicious_indicators.map((indicator, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{indicator}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Processing Info */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Processing: {results.processing_time || '0.2s'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Cpu className="h-3 w-3" />
                  <span>{results.model_version || 'Binary Classification AI'}</span>
                </span>
              </div>
              <span>{new Date(results.timestamp).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
            >
              Close Analysis
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BinaryDocumentResults;
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Eye, TrendingUp } from 'lucide-react';

const CorruptionAlerts = ({ analysis, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 dark:text-gray-400">🕵️ Analyzing for corruption patterns...</span>
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.success) {
    return null;
  }

  const docAnalysis = analysis.analysis?.document_analysis;
  const vendorAnalysis = analysis.analysis?.vendor_analysis;
  const recommendations = analysis.analysis?.recommendations || [];

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800';
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'medium': return <Eye className="h-5 w-5" />;
      case 'low': return <Shield className="h-5 w-5" />;
      default: return <TrendingUp className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Quick Summary - User Friendly */}
      <div className={`rounded-lg border-2 p-6 ${getRiskColor(docAnalysis?.risk_level)}`}>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold mb-2">
            {docAnalysis?.risk_level?.toLowerCase() === 'high' ? '🚨 HIGH RISK' :
             docAnalysis?.risk_level?.toLowerCase() === 'medium' ? '⚠️ MEDIUM RISK' :
             '✅ LOW RISK'}
          </div>
          <div className="text-lg">
            Corruption Risk Score: <strong>{docAnalysis?.risk_score || 0}/100</strong>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-sm font-medium">
            {docAnalysis?.risk_level?.toLowerCase() === 'high' ? 
              '❌ This document shows significant corruption warning signs' :
             docAnalysis?.risk_level?.toLowerCase() === 'medium' ? 
              '⚠️ This document has some concerning patterns' :
              '✅ This document appears to follow proper procedures'}
          </p>
        </div>
      </div>

      {/* Main Risk Assessment */}
      <div className={`rounded-lg border p-6 ${getRiskColor(docAnalysis?.risk_level)}`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            {getRiskIcon(docAnalysis?.risk_level)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">
              🕵️ Corruption Risk Assessment
            </h3>
            <div className="flex items-center space-x-4 mb-3">
              <span className="text-2xl font-bold">
                {docAnalysis?.risk_score || 0}/100
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-current bg-opacity-10">
                {docAnalysis?.risk_level?.toUpperCase() || 'UNKNOWN'} RISK
              </span>
            </div>
            
            {docAnalysis?.ai_explanation && (
              <p className="text-sm mb-4 leading-relaxed">
                🤖 <strong>AI Analysis:</strong> {docAnalysis.ai_explanation}
              </p>
            )}

            {docAnalysis?.red_flags_found?.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">🚩 Red Flags Detected:</h4>
                <ul className="space-y-1">
                  {docAnalysis.red_flags_found.map((flag, index) => (
                    <li key={index} className="text-sm flex items-start space-x-2">
                      <span className="text-xs mt-1">•</span>
                      <div>
                        <span className="font-medium">{flag.description}</span>
                        {flag.explanation && (
                          <span className="ml-2 opacity-75">({flag.explanation})</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vendor Pattern Analysis */}
      {vendorAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🏢 Vendor Pattern Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Contract Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Contracts Won:</span>
                  <span className="font-medium">{vendorAnalysis.vendor_statistics?.contracts_won || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contract Share:</span>
                  <span className="font-medium">
                    {vendorAnalysis.vendor_statistics?.contract_concentration
                      ? (vendorAnalysis.vendor_statistics.contract_concentration * 100).toFixed(1) + '%'
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Value Share:</span>
                  <span className="font-medium">
                    {vendorAnalysis.vendor_statistics?.value_concentration
                      ? (vendorAnalysis.vendor_statistics.value_concentration * 100).toFixed(1) + '%'
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ministry Context</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Ministry:</span>
                  <span className="font-medium">{vendorAnalysis.ministry || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Analysis Period:</span>
                  <span className="font-medium">{vendorAnalysis.analysis_period || '2023-2024'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Contracts:</span>
                  <span className="font-medium">{vendorAnalysis.total_contracts_analyzed || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Red Flags */}
          {vendorAnalysis.red_flags && vendorAnalysis.red_flags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">⚠️ Vendor-Specific Concerns:</h4>
              <ul className="space-y-1">
                {vendorAnalysis.red_flags.map((flag, index) => (
                  <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start space-x-2">
                    <span className="text-xs mt-1">🚨</span>
                    <span>{flag.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
            💡 Recommendations
          </h3>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-blue-800 dark:text-blue-300 flex items-start space-x-2">
                <span className="text-xs mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Source Notice */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        📊 Analysis based on document content and data.gov.in procurement patterns
      </div>
    </motion.div>
  );
};

export default CorruptionAlerts;
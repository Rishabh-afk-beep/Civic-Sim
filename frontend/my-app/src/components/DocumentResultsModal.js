import React from 'react';
import Modal from './ui/Modal';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  Eye, 
  Download,
  Info,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react';

const DocumentResultsModal = ({ isOpen, onClose, results }) => {
  if (!results) return null;

  const getVerdictConfig = (verdict) => {
    switch (verdict.toLowerCase()) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: '✅ Document Verified',
          description: 'This document appears to be authentic'
        };
      case 'suspicious':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: '⚠️ Document Suspicious',
          description: 'This document may not be authentic'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: '❓ Inconclusive Analysis',
          description: 'Unable to determine authenticity with confidence'
        };
    }
  };

  const verdictConfig = getVerdictConfig(results.verdict);
  const VerdictIcon = verdictConfig.icon;

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceLevel = (score) => {
    if (score >= 90) return 'Very High';
    if (score >= 80) return 'High';
    if (score >= 70) return 'Moderate';
    if (score >= 60) return 'Low';
    return 'Very Low';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Document Verification Results"
      size="lg"
    >
      <div className="space-y-6">
        {/* Main Verdict */}
        <div className={`p-6 rounded-lg border-2 ${verdictConfig.borderColor} ${verdictConfig.bgColor}`}>
          <div className="flex items-center space-x-4">
            <VerdictIcon className={`h-12 w-12 ${verdictConfig.color}`} />
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${verdictConfig.color}`}>
                {verdictConfig.title}
              </h3>
              <p className="text-gray-700 mt-1">
                {verdictConfig.description}
              </p>

              {/* Confidence Score */}
              <div className="flex items-center space-x-3 mt-3">
                <span className="text-sm font-medium text-gray-600">
                  Confidence Level:
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(results.confidence_score)}`}>
                    {results.confidence_score}% ({getConfidenceLevel(results.confidence_score)})
                  </span>
                  {results.confidence_score >= 70 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                🤖 AI Analysis Summary
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {results.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Suspicious Elements */}
        {results.suspicious_elements && results.suspicious_elements.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-3">
                  ⚠️ Suspicious Elements Found
                </h4>
                <ul className="space-y-2">
                  {results.suspicious_elements.map((element, index) => (
                    <li key={index} className="flex items-start space-x-2 text-red-800 text-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span>{element}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Authenticity Indicators */}
        {results.authenticity_indicators && results.authenticity_indicators.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-3">
                  ✅ Positive Authenticity Indicators
                </h4>
                <ul className="space-y-2">
                  {results.authenticity_indicators.map((indicator, index) => (
                    <li key={index} className="flex items-start space-x-2 text-green-800 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {results.recommendations && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 mb-2">
                  💡 Expert Recommendations
                </h4>
                <div className="text-purple-800 text-sm leading-relaxed">
                  {typeof results.recommendations === 'string' ? (
                    <p>{results.recommendations}</p>
                  ) : (
                    <ul className="space-y-1">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Document Type:</span>
              <span className="font-medium">{results.document_type || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Analysis Time:</span>
              <span className="font-medium">{results.processing_time || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Analysis ID: {results.document_id || 'N/A'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                const reportData = {
                  verdict: results.verdict,
                  confidence: results.confidence_score,
                  analysis: results.explanation,
                  timestamp: new Date().toLocaleString()
                };

                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", `verification_report_${Date.now()}.json`);
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800">
              <p className="font-semibold mb-1">Important Disclaimer</p>
              <p>
                This AI analysis is for educational and informational purposes only. 
                Results should be verified through official sources and expert consultation 
                for critical decisions. The AI system may not detect sophisticated forgeries 
                or have limitations with certain document types.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentResultsModal;
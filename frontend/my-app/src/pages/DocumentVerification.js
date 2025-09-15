// src/pages/DocumentVerification.js - COMPLETE REPLACEMENT
import React, { useState, useRef } from 'react';
import { Search, RefreshCw } from 'lucide-react';import BinaryDocumentVerificationService from '../services/BinaryDocumentVerification';
import BinaryDocumentResults from '../components/common/BinaryDocumentResults';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import AnimatedButton from '../components/ui/AnimatedButton';
import CorruptionDetectionService from '../services/CorruptionDetectionService';
import CorruptionAlerts from '../components/common/CorruptionAlerts';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Zap,
  Info,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const DocumentVerification = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('authenticity'); // 'authenticity' or 'corruption'
  
  // Existing authenticity check states (UNCHANGED)
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Corruption analysis states (separate from authenticity)
  const [corruptionFile, setCorruptionFile] = useState(null);
  const [corruptionDocType, setCorruptionDocType] = useState('');
  const [corruptionAnalysis, setCorruptionAnalysis] = useState(null);
  const [isCorruptionAnalyzing, setIsCorruptionAnalyzing] = useState(false);
  const [corruptionDragActive, setCorruptionDragActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const corruptionFileInputRef = useRef(null);

  // Document types for AUTHENTICITY CHECK (documents citizens commonly receive)
  const authenticityDocumentTypes = [
    { value: 'government_announcement', label: '📢 Government Announcement' },
    { value: 'official_letter', label: '� Official Letter' },
    { value: 'policy_statement', label: '📋 Policy Statement' },
    { value: 'ministry_circular', label: '🔄 Ministry Circular' },
    { value: 'certificate', label: '📜 Government Certificate' },
    { value: 'notice', label: '� Public Notice' },
    { value: 'press_release', label: '📰 Press Release' }
  ];

  // Document types for CORRUPTION ANALYSIS (procurement & contracts)
  const corruptionDocumentTypes = [
    { value: 'tender', label: '🏗️ Tender Document' },
    { value: 'contract', label: '📋 Government Contract' },
    { value: 'procurement', label: '� Procurement Notice' },
    { value: 'budget_allocation', label: '💰 Budget Allocation' },
    { value: 'vendor_agreement', label: '🤝 Vendor Agreement' },
    { value: 'bid_evaluation', label: '� Bid Evaluation Report' },
    { value: 'work_order', label: '⚡ Work Order' },
    { value: 'payment_voucher', label: '💳 Payment Voucher' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, text, image, or Word document');
      return;
    }

    // Validate file size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size must be less than 15MB');
      return;
    }

    setSelectedFile(file);
    toast.success(`Selected: ${file.name}`);
  };

  // Corruption analysis file handlers
  const handleCorruptionDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setCorruptionDragActive(true);
    } else if (e.type === 'dragleave') {
      setCorruptionDragActive(false);
    }
  };

  const handleCorruptionDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCorruptionDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCorruptionFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCorruptionFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleCorruptionFileSelect(e.target.files[0]);
    }
  };

  const handleCorruptionFileSelect = (file) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, text, image, or Word document');
      return;
    }

    // Validate file size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size must be less than 15MB');
      return;
    }

    setCorruptionFile(file);
    toast.success(`Selected for corruption analysis: ${file.name}`);
  };

  const handleCorruptionAnalysis = async () => {
    if (!corruptionFile) {
      toast.error('Please select a document for corruption analysis');
      return;
    }

    if (!corruptionDocType) {
      toast.error('Please select a document type for corruption analysis');
      return;
    }

    setIsCorruptionAnalyzing(true);
    
    try {
      console.log('Starting corruption analysis for:', corruptionFile.name, 'Type:', corruptionDocType);
      
      const analysis = await CorruptionDetectionService.analyzeDocumentCorruption(
        corruptionFile,
        corruptionDocType
      );
      
      console.log('Corruption analysis result:', analysis);
      
      if (analysis && analysis.success) {
        setCorruptionAnalysis(analysis);
        toast.success('🕵️ Corruption analysis complete!');
      } else {
        throw new Error('Analysis failed or returned no results');
      }
    } catch (error) {
      console.error('Corruption analysis failed:', error);
      toast.error(`Failed to analyze document: ${error.message}`);
      setCorruptionAnalysis(null);
    } finally {
      setIsCorruptionAnalyzing(false);
    }
  };

  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read text file'));
        reader.readAsText(file);
      } else if (file.type.startsWith('image/')) {
        resolve(`[IMAGE DOCUMENT: ${file.name}] - This appears to be a document image. OCR analysis would be performed here to extract text content for authenticity verification.`);
      } else {
        resolve(`[${file.type.toUpperCase()} DOCUMENT: ${file.name}] - Document content extracted for analysis. This is a ${documentType} document submitted for binary authenticity verification.`);
      }
    });
  };

  const handleVerification = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to verify');
      return;
    }

    if (!documentType) {
      toast.error('Please select a document type');
      return;
    }

    setIsAnalyzing(true);

    try {
      toast.loading('🤖 AI performing binary classification...', { duration: 2000 });

      // Extract text from file
      const documentText = await extractTextFromFile(selectedFile);

      // Perform binary verification
      const result = await BinaryDocumentVerificationService.verifyDocumentBinary(
        documentText, 
        documentType
      );

      setVerificationResult(result);
      setShowResultModal(true);

      // Show result-specific toast
      if (result.success) {
        const isAuthentic = result.verification_result === 1;
        toast.success(
          isAuthentic 
            ? '✅ Document classified as AUTHENTIC (1)' 
            : '❌ Document classified as FAKE (0)',
          {
            icon: isAuthentic ? '✅' : '❌',
            duration: 4000,
          }
        );
      } else {
        toast.error('Binary classification failed. Document marked as FAKE (0)');
      }

    } catch (error) {
      console.error('Binary verification failed:', error);
      toast.error('Classification failed. Please try again.');

      // Set error result
      setVerificationResult({
        success: false,
        verification_result: 0,
        is_authentic: false,
        error: error.message,
        explanation: 'Classification failed due to technical error. Document defaulted to FAKE (0) for security.',
        timestamp: new Date().toISOString()
      });
      setShowResultModal(true);

    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          � Document Analysis Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive document verification and corruption pattern detection
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('authenticity')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'authenticity'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            🔍 Authenticity Check
          </button>
          <button
            onClick={() => setActiveTab('corruption')}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'corruption'
                ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            🕵️ Corruption Analysis
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'authenticity' && (
        <>
          {/* Simple Info */}
          <GlassCard className="mb-8 p-6 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
            glow={true}>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-600 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
                    🛡️ Protect Yourself from Document Fraud
                  </h3>
                  <p className="text-green-800 dark:text-green-300 text-sm">
                    Upload any government document (announcements, policies, letters, etc.) and our AI will tell you 
                    if it looks <strong>REAL</strong> or <strong>FAKE</strong>. Get clear answers, not confusing numbers.
                  </p>
                </div>
              </div>
          </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <GlassCard className="p-6" glow={true}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>📄 Upload Your Document</span>
            </h3>
          </div>
            {/* Document Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Type *
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select document type...</option>
                {authenticityDocumentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept=".pdf,.txt,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
              />

              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      📄 {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Drop document for binary analysis
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      AI will classify as 0 (Fake) or 1 (Authentic)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    📁 Supported: PDF, TXT, JPG, PNG, DOC, DOCX (max 15MB)
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Button
                onClick={handleVerification}
                loading={isAnalyzing}
                disabled={!selectedFile || !documentType || isAnalyzing}
                className="w-full"
                icon={isAnalyzing ? undefined : Zap}
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>AI Binary Classification...</span>
                  </div>
                ) : (
                  '🔍 Check Document'
                )}
              </Button>
            </div>
        </GlassCard>

        {/* Why Use This Tool */}
        <GlassCard className="p-6" glow={true}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">� Why Check Your Documents?</h3>
          </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Avoid Scams & Fraud</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fake government documents are used in scams. Always verify before taking action or sharing personal information.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Quick & Easy Check</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get an instant assessment of whether a document looks legitimate or suspicious in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Clear Simple Answer</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No confusing percentages. Just a clear answer: Real or Fake, with an explanation of why.
                  </p>
                </div>
              </div>

              {/* Simple Results */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-900/20 dark:to-red-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">� What You'll Get:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span><strong>REAL</strong> - Document looks authentic</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span><strong>FAKE</strong> - Document looks suspicious</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Plus a detailed explanation of what makes the document seem real or fake.
                </p>
              </div>
            </div>
        </GlassCard>
      </div>

      {/* Binary Results Modal */}
      {showResultModal && verificationResult && (
        <BinaryDocumentResults
          results={verificationResult}
          onClose={() => setShowResultModal(false)}
        />
      )}



          {/* Important Notice */}
          <GlassCard className="mt-8 p-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20"
              glow={true}>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  <p className="font-semibold mb-1">⚠️ Important: Always Double-Check</p>
                  <p>
                    This tool gives you a quick check to spot obvious fakes, but it's not 100% perfect. 
                    For important decisions, always verify documents through official government websites 
                    or call the relevant office directly.
                  </p>
                </div>
              </div>
          </GlassCard>
        </>
      )}

      {/* Corruption Analysis Tab */}
      {activeTab === 'corruption' && (
        <>
          {/* Corruption Info */}
          <GlassCard className="mb-8 p-6 border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
            glow={true}>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-red-600 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">
                    🕵️ Detect Corruption Patterns
                  </h3>
                  <p className="text-red-800 dark:text-red-300 text-sm">
                    Analyze tenders, contracts, and procurement documents for corruption red flags. 
                    Get risk assessment and specific warnings about suspicious patterns.
                  </p>
                </div>
              </div>
          </GlassCard>

          {/* Corruption Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="p-6" glow={true}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>📄 Upload Document for Corruption Analysis</span>
                </h3>
              </div>
              
              {/* Document Type Selection for Corruption */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Type *
                </label>
                <select
                  value={corruptionDocType}
                  onChange={(e) => setCorruptionDocType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Select document type...</option>
                  {corruptionDocumentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload Area for Corruption */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  corruptionDragActive 
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 scale-105' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleCorruptionDrag}
                onDragLeave={handleCorruptionDrag}
                onDragOver={handleCorruptionDrag}
                onDrop={handleCorruptionDrop}
              >
                <input
                  ref={corruptionFileInputRef}
                  type="file"
                  onChange={handleCorruptionFileInputChange}
                  accept=".pdf,.txt,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />

                {corruptionFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        📄 {corruptionFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(corruptionFile.size / 1024 / 1024).toFixed(2)} MB • {corruptionFile.type}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCorruptionFile(null);
                        if (corruptionFileInputRef.current) {
                          corruptionFileInputRef.current.value = '';
                        }
                      }}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Drop document for corruption analysis
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        AI will analyze for corruption patterns and red flags
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => corruptionFileInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      📁 Supported: PDF, TXT, JPG, PNG, DOC, DOCX (max 15MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleCorruptionAnalysis}
                  loading={isCorruptionAnalyzing}
                  disabled={!corruptionFile || !corruptionDocType || isCorruptionAnalyzing}
                  className="w-full bg-red-600 hover:bg-red-700"
                  icon={isCorruptionAnalyzing ? undefined : AlertTriangle}
                >
                  {isCorruptionAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Analyzing Corruption Patterns...</span>
                    </div>
                  ) : (
                    '🕵️ Analyze for Corruption'
                  )}
                </Button>
              </div>
            </GlassCard>

            {/* Corruption Analysis Info */}
            <GlassCard className="p-6" glow={true}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">🎯 What We Analyze</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Vendor Concentration</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Single vendors winning too many contracts or receiving disproportionate contract values.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Eye className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Suspicious Terms</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Language indicating bypassed processes like "urgent", "emergency", or "single source".
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Missing Documentation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Incomplete paperwork that could indicate poor governance or deliberate obfuscation.
                    </p>
                  </div>
                </div>

                {/* Risk Assessment Display */}
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">🎯 Risk Assessment Scale:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span><strong>HIGH RISK</strong> - Serious corruption indicators found</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span><strong>MEDIUM RISK</strong> - Some concerning patterns detected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span><strong>LOW RISK</strong> - Document appears to follow proper procedures</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Corruption Analysis Results */}
          <div className="mt-8">
            {/* Debug info - remove this later */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                <strong>Debug:</strong> isLoading={isCorruptionAnalyzing.toString()}, 
                hasAnalysis={!!corruptionAnalysis}, 
                analysisSuccess={corruptionAnalysis?.success?.toString() || 'undefined'}
              </div>
            )}
            
            <CorruptionAlerts 
              analysis={corruptionAnalysis}
              isLoading={isCorruptionAnalyzing}
            />
            
            {/* Show a placeholder if no analysis yet */}
            {!isCorruptionAnalyzing && !corruptionAnalysis && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p className="mb-2">🕵️ Ready to analyze corruption patterns</p>
                  <p className="text-sm">Upload a document and click "Analyze for Corruption" to start</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentVerification;
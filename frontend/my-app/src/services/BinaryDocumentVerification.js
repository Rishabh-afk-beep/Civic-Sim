import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class BinaryDocumentVerificationService {
  constructor() {
    // Binary classification threshold
    this.AUTHENTICITY_THRESHOLD = 0.5;

    // Feature weights for logistic regression (used in backend)
    this.FEATURE_WEIGHTS = {
      language_patterns: 0.25,
      formatting_consistency: 0.20,
      official_terminology: 0.25,
      metadata_analysis: 0.15,
      structure_validation: 0.15
    };
  }

  async verifyDocumentBinary(documentText, documentType = 'government_document') {
    try {
      // Call backend API for document verification
      const response = await axios.post(`${API_BASE_URL}/documents/verify-binary`, {
        text: documentText,
        document_type: documentType,
        classification_type: 'binary'
      }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      return {
        success: true,
        verification_result: data.verification_result || (data.is_authentic ? 1 : 0), // 0 or 1
        is_authentic: data.verification_result === 1 || data.is_authentic === true,
        confidence_score: data.confidence_score || data.confidence || 0.5,
        decision_factors: data.decision_factors || data.features || {},
        explanation: data.explanation || 'Binary classification completed via backend API',
        processing_time: data.processing_time || '1.2s',
        model_version: data.model_version || "Backend Binary Classification v1.0",
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Backend verification failed, using fallback:', error);
      
      // Fallback to mock classification when backend is unavailable
      return this.mockBinaryClassification(documentText, documentType);
    }
  }

  // Fallback method for when backend is unavailable
  async mockBinaryClassification(documentText, documentType) {
    // Analyze text characteristics for mock feature scoring
    const textLength = documentText.length;
    const hasNumbers = /\d/.test(documentText);
    const hasOfficialTerms = /official|government|certificate|license|permit|authority|ministry|department|policy|circular|announcement|budget/i.test(documentText);
    const hasDate = /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(documentText);
    const hasProperCapitalization = /[A-Z][a-z]+/.test(documentText);
    const hasStructuralElements = /subject|reference|dear|sincerely|regards|paragraph|section|article/i.test(documentText);
    const hasSuspiciousPatterns = /urgent|immediately|scam|fake|click here|suspicious|urgent action required/i.test(documentText);
    
    // Generate realistic feature scores (0.0 to 1.0)
    const features = {
      language_patterns: this.calculateLanguageScore(documentText, hasProperCapitalization),
      formatting_consistency: this.calculateFormattingScore(textLength, hasStructuralElements),
      official_terminology: hasOfficialTerms ? 0.7 + Math.random() * 0.25 : 0.2 + Math.random() * 0.3,
      metadata_analysis: this.calculateMetadataScore(hasDate, hasNumbers),
      structure_validation: this.calculateStructureScore(textLength, hasStructuralElements)
    };
    
    // Reduce scores if suspicious patterns detected
    if (hasSuspiciousPatterns) {
      Object.keys(features).forEach(key => {
        features[key] = Math.max(0.1, features[key] - 0.3);
      });
    }
    
    // Calculate weighted score using the same weights as the backend
    let weightedSum = 0;
    Object.keys(this.FEATURE_WEIGHTS).forEach(feature => {
      const featureScore = features[feature] || 0.5;
      const weight = this.FEATURE_WEIGHTS[feature];
      weightedSum += featureScore * weight;
    });
    
    // Apply logistic function for final probability
    const logisticInput = (weightedSum - 0.5) * 6;
    const probability = 1 / (1 + Math.exp(-logisticInput));
    
    const isAuthentic = probability >= this.AUTHENTICITY_THRESHOLD;
    
    // Generate authentic and suspicious indicators
    const authenticIndicators = [];
    const suspiciousIndicators = [];
    
    if (hasOfficialTerms) authenticIndicators.push("Contains official government terminology");
    if (hasDate) authenticIndicators.push("Includes proper date formatting");
    if (hasStructuralElements) authenticIndicators.push("Follows official document structure");
    if (textLength > 200) authenticIndicators.push("Adequate document length and detail");
    
    if (hasSuspiciousPatterns) suspiciousIndicators.push("Contains suspicious language patterns");
    if (textLength < 50) suspiciousIndicators.push("Document appears too brief for official content");
    if (!hasNumbers && documentType !== 'policy_statement') suspiciousIndicators.push("Missing expected numerical references");
    
    return {
      success: true,
      verification_result: isAuthentic ? 1 : 0,
      is_authentic: isAuthentic,
      confidence_score: probability,
      decision_factors: {
        ...features,
        suspicious_indicators: suspiciousIndicators,
        authentic_indicators: authenticIndicators
      },
      explanation: `Mock classification: ${isAuthentic ? 'Authentic' : 'Potentially fake'} (confidence: ${(probability * 100).toFixed(1)}%). Backend API unavailable - using fallback analysis.`,
      processing_time: '0.2s',
      model_version: "Enhanced Mock Binary Classification v1.0",
      timestamp: new Date().toISOString()
    };
  }

  // Helper methods for mock feature scoring
  calculateLanguageScore(text, hasProperCapitalization) {
    let score = 0.5; // baseline
    if (hasProperCapitalization) score += 0.2;
    if (text.length > 100) score += 0.1;
    if (!/\s{3,}/.test(text)) score += 0.1; // No excessive whitespace
    if (text.split(/[.!?]/).length > 2) score += 0.1; // Multiple sentences
    return Math.min(0.95, score + (Math.random() - 0.5) * 0.1);
  }

  calculateFormattingScore(textLength, hasStructuralElements) {
    let score = 0.4;
    if (hasStructuralElements) score += 0.3;
    if (textLength > 150) score += 0.2;
    return Math.min(0.9, score + (Math.random() - 0.5) * 0.15);
  }

  calculateMetadataScore(hasDate, hasNumbers) {
    let score = 0.3;
    if (hasDate) score += 0.3;
    if (hasNumbers) score += 0.2;
    return Math.min(0.85, score + (Math.random() - 0.5) * 0.2);
  }

  calculateStructureScore(textLength, hasStructuralElements) {
    let score = 0.4;
    if (hasStructuralElements) score += 0.25;
    if (textLength > 200) score += 0.15;
    if (textLength < 50) score -= 0.2;
    return Math.max(0.1, Math.min(0.9, score + (Math.random() - 0.5) * 0.1));
  }


}

export default new BinaryDocumentVerificationService();
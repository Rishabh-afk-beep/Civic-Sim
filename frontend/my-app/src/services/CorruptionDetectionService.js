class CorruptionDetectionService {
  constructor() {
    this.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache
  }

  async analyzeDocumentCorruption(file, documentType = 'contract') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);

      console.log('🕵️ Analyzing document for corruption patterns...');

      const response = await fetch(`${this.baseURL}/documents/analyze-corruption`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Corruption analysis complete:', result);

      return result;
    } catch (error) {
      console.error('❌ Corruption analysis failed:', error);
      throw error;
    }
  }

  async getMinistryCorruptionOverview(ministry = 'Agriculture') {
    const cacheKey = `ministry_corruption_${ministry}`;
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${this.baseURL}/documents/ministry-corruption-overview?ministry=${encodeURIComponent(ministry)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('❌ Ministry overview failed:', error);
      throw error;
    }
  }

  async getCorruptionRedFlags() {
    try {
      const response = await fetch(`${this.baseURL}/documents/corruption-red-flags`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Red flags fetch failed:', error);
      throw error;
    }
  }

  // Utility methods
  getRiskColor(riskLevel) {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return '#ef4444'; // red-500
      case 'medium':
        return '#f59e0b'; // amber-500
      case 'low':
        return '#10b981'; // emerald-500
      default:
        return '#6b7280'; // gray-500
    }
  }

  getRiskIcon(riskLevel) {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return '✅';
      default:
        return 'ℹ️';
    }
  }

  formatCurrency(amount) {
    if (!amount || isNaN(amount)) return '₹0';
    
    const num = parseFloat(amount);
    
    if (num >= 10000000) { // 1 crore
      return `₹${(num / 10000000).toFixed(1)} Cr`;
    } else if (num >= 100000) { // 1 lakh
      return `₹${(num / 100000).toFixed(1)} L`;
    } else if (num >= 1000) { // 1 thousand
      return `₹${(num / 1000).toFixed(1)} K`;
    } else {
      return `₹${num.toFixed(0)}`;
    }
  }

  formatPercentage(decimal, precision = 1) {
    if (!decimal || isNaN(decimal)) return '0%';
    return `${(decimal * 100).toFixed(precision)}%`;
  }

  clearCache() {
    this.cache.clear();
    console.log('🗑️ Corruption detection cache cleared');
  }
}

export default new CorruptionDetectionService();
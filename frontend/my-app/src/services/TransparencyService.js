class TransparencyService {
  constructor() {
    // Use your existing backend URL
    this.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async fetchWithCache(endpoint, cacheKey) {
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`📦 Using cached data for ${cacheKey}`);
      return cached.data;
    }

    try {
      console.log(`🌐 Fetching from ${this.baseURL}${endpoint}`);
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful responses
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`❌ API call failed for ${endpoint}:`, error);

      // Return cached data if available, even if expired
      const staleCache = this.cache.get(cacheKey);
      if (staleCache) {
        console.log(`⚠️ Using stale cached data for ${cacheKey}`);
        return { 
          ...staleCache.data, 
          _cached: true, 
          _stale: true,
          _error: error.message 
        };
      }

      throw error;
    }
  }

  // Test connection to your FastAPI backend
  async testConnection() {
    try {
      return await this.fetchWithCache('/api/transparency/test-connection', 'test_connection');
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'FastAPI backend not responding'
      };
    }
  }

  // Get budget overview from your backend
  async getBudgetOverview() {
    return await this.fetchWithCache('/api/transparency/budget-overview', 'budget_overview');
  }

  // Get ministry spending from your backend
  async getMinistrySpending(ministry = 'all') {
    const endpoint = `/api/transparency/ministry-spending?ministry=${encodeURIComponent(ministry)}`;
    return await this.fetchWithCache(endpoint, `ministry_spending_${ministry}`);
  }

  // Get transparency metrics from your backend
  async getTransparencyMetrics() {
    return await this.fetchWithCache('/api/transparency/transparency-metrics', 'transparency_metrics');
  }

  // Search datasets through your backend
  async searchDatasets(query = 'budget', limit = 10) {
    const endpoint = `/api/transparency/search-datasets?query=${encodeURIComponent(query)}&limit=${limit}`;
    return await this.fetchWithCache(endpoint, `search_${query}_${limit}`);
  }

  // Get major ministries from your backend
  async getMajorMinistries() {
    return await this.fetchWithCache('/api/transparency/ministries', 'major_ministries');
  }

  // Format currency (utility function)
  formatIndianCurrency(amount) {
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

  // Clear cache
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  // Get cache status
  getCacheStatus() {
    return {
      totalEntries: this.cache.size,
      entries: Array.from(this.cache.keys()),
      cacheTimeout: this.cacheTimeout
    };
  }
}

export default new TransparencyService();
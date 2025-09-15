class DataGovIndiaService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async fetchWithCache(url, cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseURL}${url}`);
      const data = await response.json();
      
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  }

  async getBudgetData() {
    return this.fetchWithCache('/budget-data', 'budget_data');
  }

  async getMinistrySpending(ministry = 'Finance') {
    return this.fetchWithCache(
      `/ministry-spending?ministry=${encodeURIComponent(ministry)}`, 
      `ministry_${ministry}`
    );
  }

  async getProcurementData() {
    return this.fetchWithCache('/procurement-data', 'procurement_data');
  }

  async getTransparencyScore() {
    return this.fetchWithCache('/transparency-score', 'transparency_score');
  }

  // Get list of major ministries for dropdown
  getMajorMinistries() {
    return [
      'Finance', 'Defence', 'Home Affairs', 'Railways', 
      'Health and Family Welfare', 'Education', 'Agriculture',
      'Rural Development', 'Road Transport and Highways',
      'Electronics and Information Technology', 'External Affairs'
    ];
  }

  // Format currency values
  formatCurrency(amount, currency = 'INR') {
    if (!amount || isNaN(amount)) return 'N/A';
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    return formatter.format(amount);
  }

  // Convert amount to crores/lakhs format
  formatIndianCurrency(amount) {
    if (!amount || isNaN(amount)) return 'N/A';
    
    const num = parseFloat(amount);
    
    if (num >= 10000000) { // 1 crore
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) { // 1 lakh
      return `₹${(num / 100000).toFixed(2)} L`;
    } else if (num >= 1000) { // 1 thousand
      return `₹${(num / 1000).toFixed(2)} K`;
    } else {
      return `₹${num.toFixed(2)}`;
    }
  }
}

export default new DataGovIndiaService();
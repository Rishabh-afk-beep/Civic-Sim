// src/pages/TransparencyDashboard.js - COMPLETE REPLACEMENT
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Import UI components (adjust paths based on your existing structure)
import AnimatedCard, { CardHeader, CardTitle, CardContent } from '../components/ui/AnimatedCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import TransparencyService from '../services/TransparencyService';

// Import icons (adjust based on your icon library - lucide-react or react-icons)
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  DollarSign,
  BarChart3,
  Activity,
  Database,
  Globe,
  Zap
} from 'lucide-react';

// Import our government data service
import DataGovIndiaService from '../services/DataGovIndiaService';

const TransparencyDashboard = () => {
  // State management
  const [budgetData, setBudgetData] = useState(null);
  const [transparencyMetrics, setTransparencyMetrics] = useState(null);
  const [selectedMinistry, setSelectedMinistry] = useState('all');
  const [ministrySpending, setMinistrySpending] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [errors, setErrors] = useState([]);

  // Load all data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load transparency dashboard data
  const loadDashboardData = async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      console.log('🔄 Loading transparency dashboard data...');

      // Test connection first
      const connectionTest = await DataGovIndiaService.testConnection();
      setConnectionStatus(connectionTest);

      if (!connectionTest.success) {
        toast.error('Python bridge server not responding. Using demo data.');
      }

      // Load budget overview
      try {
        const budget = await DataGovIndiaService.getBudgetOverview();
        setBudgetData(budget);
        console.log('✅ Budget data loaded:', budget);
      } catch (error) {
        console.error('❌ Failed to load budget data:', error);
        setErrors(prev => [...prev, 'Budget data loading failed']);
      }

      // Load transparency metrics  
      try {
        const metrics = await DataGovIndiaService.getTransparencyMetrics();
        setTransparencyMetrics(metrics);
        console.log('✅ Transparency metrics loaded:', metrics);
      } catch (error) {
        console.error('❌ Failed to load transparency metrics:', error);
        setErrors(prev => [...prev, 'Transparency metrics loading failed']);
      }

      // Load ministry spending
      try {
        const spending = await DataGovIndiaService.getMinistrySpending(selectedMinistry);
        setMinistrySpending(spending);
        console.log('✅ Ministry spending loaded:', spending);
      } catch (error) {
        console.error('❌ Failed to load ministry spending:', error);
        setErrors(prev => [...prev, 'Ministry spending loading failed']);
      }

      setLastUpdated(new Date());

      if (connectionTest.success) {
        toast.success('📊 Real government data loaded successfully!');
      } else {
        toast.success('📋 Demo data loaded (Python bridge offline)');
      }

    } catch (error) {
      console.error('❌ Dashboard loading failed:', error);
      toast.error('Failed to load dashboard data');
      setErrors(prev => [...prev, 'Dashboard loading failed']);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    DataGovIndiaService.clearCache();
    loadDashboardData();
  };

  // Handle ministry selection change
  const handleMinistryChange = async (ministry) => {
    setSelectedMinistry(ministry);
    try {
      const spending = await DataGovIndiaService.getMinistrySpending(ministry);
      setMinistrySpending(spending);
    } catch (error) {
      toast.error(`Failed to load ${ministry} data`);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <LoadingSkeleton height="h-8" width="w-1/2" className="mb-2" />
          <LoadingSkeleton height="h-4" width="w-3/4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} height="h-32" className="rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LoadingSkeleton height="h-96" className="rounded-xl" />
          <LoadingSkeleton height="h-96" className="rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              🏛️ Government Transparency Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {connectionStatus?.success 
                ? '📡 Real-time data from data.gov.in • 198,000+ government datasets'
                : '📋 Demo mode (Python bridge offline) • Connect to see live government data'
              }
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <AnimatedButton
              onClick={handleRefresh}
              disabled={isLoading}
              size="sm"
              variant="secondary"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </AnimatedButton>
          </div>
        </div>

        {lastUpdated && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        )}
      </motion.div>

      {/* Connection Status Alert */}
      {connectionStatus && !connectionStatus.success && (
        <AnimatedCard className="mb-8 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20" delay={0.1}>
          <CardContent>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                  ⚠️ Python Bridge Offline
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                  Government data API is not responding. Showing demo data instead.
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Start the Python bridge server: <code>cd python-bridge && python app.py</code>
                </p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Overall Transparency Score */}
        <AnimatedCard delay={0.1}>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transparency Score</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {transparencyMetrics?.success ? transparencyMetrics.metrics?.overall_score : '76.3'}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Total Datasets */}
        <AnimatedCard delay={0.2}>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Datasets</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {budgetData?.success ? budgetData.budget_overview?.total_datasets || '3' : '3'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Database className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Budget Allocation */}
        <AnimatedCard delay={0.3}>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Allocation</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {budgetData?.success && budgetData.budget_overview?.summary?.total_allocation
                    ? DataGovIndiaService.formatIndianCurrency(budgetData.budget_overview.summary.total_allocation * 10000000)
                    : '₹48.2 L Cr'
                  }
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Active Ministries */}
        <AnimatedCard delay={0.4}>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Ministries</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {budgetData?.success && budgetData.budget_overview?.summary?.total_ministries 
                    ? budgetData.budget_overview.summary.total_ministries
                    : '45'
                  }
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Budget Overview */}
        <AnimatedCard delay={0.5}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>📊 Budget Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {budgetData?.success && budgetData.budget_overview?.datasets ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  🔗 Data source: {budgetData.data_source}
                </div>

                {budgetData.budget_overview.datasets.slice(0, 3).map((dataset, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">
                      {dataset.title}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Ministry:</span>
                        <span className="ml-1 font-medium">{dataset.ministry}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Records:</span>
                        <span className="ml-1 font-medium">{dataset.total_records}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                        <span className="ml-1 font-medium">{dataset.last_updated}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Resource ID:</span>
                        <span className="ml-1 font-mono text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">
                          {dataset.resource_id}
                        </span>
                      </div>
                    </div>

                    {/* Show sample data */}
                    {dataset.data_sample && dataset.data_sample.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Sample data:</p>
                        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                          {dataset.data_sample.slice(0, 3).map((record, idx) => (
                            <div key={idx} className="text-xs bg-white dark:bg-gray-700 p-2 rounded border">
                              {typeof record === 'object' ? (
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(record).slice(0, 4).map(([key, value]) => (
                                    <div key={key}>
                                      <span className="text-gray-500 dark:text-gray-400">{key}:</span>
                                      <span className="ml-1 font-medium">
                                        {key.toLowerCase().includes('allocation') || key.toLowerCase().includes('spent') || key.toLowerCase().includes('budget')
                                          ? DataGovIndiaService.formatIndianCurrency(value)
                                          : String(value).slice(0, 20)
                                        }
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span>{String(record).slice(0, 50)}...</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {budgetData.budget_overview.summary && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">📈 Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Total Ministries:</span>
                        <span className="ml-2 font-bold">{budgetData.budget_overview.summary.total_ministries}</span>
                      </div>
                      <div>
                        <span className="text-blue-700 dark:text-blue-300">Total Allocation:</span>
                        <span className="ml-2 font-bold">
                          {DataGovIndiaService.formatIndianCurrency(budgetData.budget_overview.summary.total_allocation * 10000000)}
                        </span>
                      </div>
                    </div>
                    {budgetData.budget_overview.summary.major_sectors && (
                      <div className="mt-2">
                        <span className="text-blue-700 dark:text-blue-300 text-sm">Major Sectors:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {budgetData.budget_overview.summary.major_sectors.map(sector => (
                            <span key={sector} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                              {sector}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {budgetData === null ? 'Loading budget data...' : 'No budget data available'}
                </p>
                {!connectionStatus?.success && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Start Python bridge server to see real government data
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </AnimatedCard>

        {/* Transparency Metrics */}
        <AnimatedCard delay={0.6}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>📈 Transparency Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transparencyMetrics?.success && transparencyMetrics.metrics ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {transparencyMetrics.metrics.overall_score}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overall Transparency Score</p>
                </div>

                {/* Component Scores */}
                {transparencyMetrics.metrics.component_scores && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Component Scores:</h4>
                    {Object.entries(transparencyMetrics.metrics.component_scores).map(([component, score]) => (
                      <div key={component} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {component.replace(/_/g, ' ')}:
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="bg-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 min-w-12">
                            {score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ministry Scores */}
                {transparencyMetrics.metrics.ministry_scores && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Ministry Scores:</h4>
                    {Object.entries(transparencyMetrics.metrics.ministry_scores).slice(0, 5).map(([ministry, score]) => (
                      <div key={ministry} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {ministry.replace('Ministry of ', '')}
                        </span>
                        <span className={`text-xs font-bold ${
                          score >= 80 ? 'text-green-600 dark:text-green-400' :
                          score >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {score}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {transparencyMetrics.metrics.recommendations && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      AI Recommendations:
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {transparencyMetrics.metrics.recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="text-xs bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border-l-2 border-yellow-400">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {transparencyMetrics === null ? 'Loading transparency metrics...' : 'No metrics available'}
                </p>
              </div>
            )}
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Ministry Selection & Spending */}
      <AnimatedCard delay={0.7}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>🏛️ Ministry-wise Analysis</span>
            </CardTitle>

            <select
              value={selectedMinistry}
              onChange={(e) => handleMinistryChange(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Ministries</option>
              {DataGovIndiaService.getMajorMinistries().map(ministry => (
                <option key={ministry} value={ministry}>
                  {ministry.replace('Ministry of ', '')}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {ministrySpending ? (
            <div className="space-y-4">
              {ministrySpending.success && ministrySpending.spending_data?.length > 0 ? (
                ministrySpending.spending_data.map((spending, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {spending.title}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Ministry:</span>
                        <span className="ml-1 font-medium">{spending.ministry}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Sector:</span>
                        <span className="ml-1 font-medium">{spending.sector}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Records:</span>
                        <span className="ml-1 font-medium">{spending.total_records}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                        <span className="ml-1 font-medium">{spending.last_updated}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    No spending data available for {selectedMinistry === 'all' ? 'all ministries' : selectedMinistry}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading ministry data...</p>
            </div>
          )}
        </CardContent>
      </AnimatedCard>

      {/* Footer with Data Sources */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border"
      >
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>📊 Data Sources:</span>
            <span>data.gov.in • Ministry of Finance • Government of India</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${connectionStatus?.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{connectionStatus?.success ? 'Live Data' : 'Demo Mode'}</span>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
            <span>⚠️ Some components failed to load: {errors.join(', ')}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TransparencyDashboard;

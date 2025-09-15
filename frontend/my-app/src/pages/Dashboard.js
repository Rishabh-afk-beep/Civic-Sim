// src/pages/Dashboard.js - UPDATED WITH PREMIUM FEATURES
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRealTimeData } from '../hooks/useRealTimeData';
import AnimatedCard, { CardHeader, CardTitle, CardContent } from '../components/ui/AnimatedCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import LoadingSkeleton, { SkeletonCard, SkeletonChart } from '../components/common/LoadingSkeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  AlertTriangle,
  Info,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState(null);
  const [error, setError] = useState(null);

  // Sample data with real-time updates
  const sampleData = {
    sectors: [
      {
        sector: "Education",
        promised_budget: 3516000000,
        delivered_budget: 3012000000,
        delivery_percentage: 85.67,
        transparency_score: 78.5,
        last_updated: "2025-09-14"
      },
      {
        sector: "Healthcare", 
        promised_budget: 2543000000,
        delivered_budget: 1999000000,
        delivery_percentage: 78.61,
        transparency_score: 82.3,
        last_updated: "2025-09-14"
      },
      {
        sector: "Infrastructure",
        promised_budget: 3845000000,
        delivered_budget: 2994000000,
        delivery_percentage: 77.87,
        transparency_score: 71.2,
        last_updated: "2025-09-14"
      },
      {
        sector: "Agriculture",
        promised_budget: 1234000000,
        delivered_budget: 1050000000,
        delivery_percentage: 85.09,
        transparency_score: 76.8,
        last_updated: "2025-09-14"
      }
    ],
    total_promised_budget: 11138000000,
    total_delivered_budget: 9055000000,
    overall_delivery_percentage: 81.31,
    overall_transparency: 77.2,
    last_updated: "2025-09-14T12:24:00Z"
  };

  const { 
    data: realTimeData, 
    isLoading: dataLoading, 
    startRealTimeUpdates, 
    stopRealTimeUpdates, 
    manualUpdate 
  } = useRealTimeData(budgetData?.sectors || sampleData.sectors);

  // Function to refresh data from API
  const refreshDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:8000/dashboard/budget-data-test', {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setBudgetData({
          sectors: result.data.sectors,
          total_promised_budget: result.data.total_promised_budget,
          total_delivered_budget: result.data.total_delivered_budget,
          overall_delivery_percentage: result.data.overall_delivery_percentage,
          overall_transparency: result.data.overall_transparency,
          last_updated: result.data.last_updated,
          source_note: result.data.source_note || "Real-time government data"
        });
      } else {
        throw new Error('Failed to fetch updated budget data');
      }
      
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
      setError(`Failed to refresh data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load real data from backend API
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        // Add authorization header only if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('http://localhost:8000/dashboard/budget-data-test', {
          method: 'GET',
          headers: headers
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
          setBudgetData({
            sectors: result.data.sectors,
            total_promised_budget: result.data.total_promised_budget,
            total_delivered_budget: result.data.total_delivered_budget,
            overall_delivery_percentage: result.data.overall_delivery_percentage,
            overall_transparency: result.data.overall_transparency,
            last_updated: result.data.last_updated,
            source_note: result.data.source_note || "Real-time government data"
          });
        } else {
          throw new Error('Failed to fetch budget data');
        }
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError(`Failed to load dashboard data: ${error.message}`);
        
        // Fallback to sample data if API fails
        setBudgetData(sampleData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₹0 Cr';
    
    // Convert to crores (1 crore = 10 million = 10,000,000)
    const crores = amount / 10000000;
    
    if (crores >= 100000) {
      // Display in lakh crores for very large amounts
      const lakhCrores = crores / 100000;
      return `₹${lakhCrores.toFixed(1)}L Cr`;
    } else if (crores >= 1000) {
      // Display in thousands of crores
      const thousandCrores = crores / 1000;
      return `₹${thousandCrores.toFixed(1)}K Cr`;
    } else if (crores >= 1) {
      // Display in crores
      return `₹${crores.toFixed(1)} Cr`;
    } else {
      // For amounts less than 1 crore, show in lakhs
      const lakhs = amount / 100000;
      return `₹${lakhs.toFixed(1)} L`;
    }
  };

  const formatPercentage = (value) => {
    if (!value || isNaN(value)) return '0%';
    return `${value.toFixed(1)}%`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <LoadingSkeleton height="h-8" width="w-1/2" className="mb-2" />
          <LoadingSkeleton height="h-4" width="w-3/4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedCard className="text-center p-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Dashboard</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <AnimatedButton onClick={() => window.location.reload()}>
            Try Again
          </AnimatedButton>
        </AnimatedCard>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Governance Transparency Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {userProfile?.display_name || 'User'}! Track government budget delivery and transparency metrics.
        </p>
      </motion.div>

      {/* Real-time Controls */}
      <AnimatedCard className="mb-8" delay={0.1}>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${dataLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'} transition-colors duration-300`} />
                {dataLoading && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-yellow-500 animate-ping" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {dataLoading ? 'Updating data...' : 'Live data feed ready'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {budgetData?.source_note || 'Government API Data'} • Last updated: {budgetData?.last_updated ? new Date(budgetData.last_updated).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <AnimatedButton
                onClick={refreshDashboardData}
                disabled={loading || dataLoading}
                size="sm"
                variant="secondary"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading || dataLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </AnimatedButton>

              <AnimatedButton
                onClick={startRealTimeUpdates}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Live Updates
              </AnimatedButton>

              <AnimatedButton
                onClick={stopRealTimeUpdates}
                size="sm"
                variant="danger"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop Updates
              </AnimatedButton>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Key Metrics */}
      {budgetData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedCard delay={0.1}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Promised</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(budgetData.total_promised_budget)}
                  </p>
                </div>
                {/* Custom Indian Rupee Symbol */}
                <div className="h-8 w-8 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-2xl">
                  ₹
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Delivered</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(budgetData.total_delivered_budget)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.3}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Delivery</p>
                  <p className={`text-2xl font-bold ${getScoreColor(budgetData.overall_delivery_percentage)}`}>
                    {formatPercentage(budgetData.overall_delivery_percentage)}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getScoreBgColor(budgetData.overall_delivery_percentage)}`}>
                  {budgetData.overall_delivery_percentage >= 75 ? (
                    <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard delay={0.4}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transparency Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(budgetData.overall_transparency)}`}>
                    {formatPercentage(budgetData.overall_transparency)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Budget Comparison Chart */}
        <AnimatedCard delay={0.5}>
          <CardHeader>
            <CardTitle>Budget Promises vs Delivery by Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={realTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.3} />
                  <XAxis 
                    dataKey="sector" 
                    stroke="currentColor"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="currentColor"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000000000).toFixed(1)}B`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name) => [
                      formatCurrency(value),
                      name === 'promised_budget' ? 'Promised' : 'Delivered'
                    ]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="promised_budget" 
                    fill="#3B82F6"
                    name="Promised Budget"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="delivered_budget" 
                    fill="#10B981"
                    name="Delivered Budget"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Delivery Performance Chart */}
        <AnimatedCard delay={0.6}>
          <CardHeader>
            <CardTitle>Delivery Performance by Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={realTimeData.map((sector, index) => ({
                      name: sector.sector,
                      value: sector.delivery_percentage,
                      fill: COLORS[index % COLORS.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {realTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Delivery Rate']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Sector Details Table */}
      <AnimatedCard delay={0.7}>
        <CardHeader>
          <CardTitle>Sector Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Promised
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Delivered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Delivery Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transparency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {realTimeData.map((sector, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {sector.sector}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatCurrency(sector.promised_budget)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {formatCurrency(sector.delivered_budget)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(sector.delivery_percentage)} ${getScoreColor(sector.delivery_percentage)}`}>
                        {formatPercentage(sector.delivery_percentage)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(sector.transparency_score)} ${getScoreColor(sector.transparency_score)}`}>
                        {formatPercentage(sector.transparency_score)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Data Source Info */}
      <AnimatedCard className="mt-8" delay={0.9}>
        <CardContent>
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Data Sources & Disclaimer</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                This dashboard displays sample governance data with real-time simulation capabilities for educational purposes. 
                In a production environment, data would be sourced from official government APIs.
              </p>
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  <strong>Last Updated:</strong> {new Date(budgetData?.last_updated).toLocaleString()} | 
                  <strong> Real-time Updates:</strong> {dataLoading ? 'Processing...' : 'Available'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  );
};

export default Dashboard;
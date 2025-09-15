import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import GlassCard, { GlassButton } from '../components/ui/GlassCard';
import ParticleBackground from '../components/effects/ParticleBackground';
import FloatingElements, { FloatingShapes } from '../components/effects/FloatingElements';
import { FadeTransition, StaggeredTransition } from '../components/transitions/PageTransition';
import { 
  Shield, 
  BarChart3, 
  Settings, 
  Users, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Navigation handlers for Try Now buttons
  const handleNavigateToVerifyDocument = () => {
    if (currentUser) {
      navigate('/verify-document');
    } else {
      navigate('/login');
    }
  };

  const handleNavigateToDashboard = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleNavigateToPolicySimulation = () => {
    if (currentUser) {
      navigate('/simulate-policy');
    } else {
      navigate('/login');
    }
  };

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
      {/* Premium Background Effects */}
      <ParticleBackground density={30} />
      <FloatingShapes />
      <FloatingElements />
      
      {/* Hero Section */}
      <FadeTransition>
        <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-cyan-400/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium text-sm">AI-Powered Governance Platform</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Tools for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Civic Engagement
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive tools to promote transparency, 
              verify information, and understand policy impacts.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <GlassButton
                onClick={handleGetStarted}
                size="lg"
                glow={true}
                className="px-12 py-4 text-lg font-bold shadow-2xl"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                {currentUser ? 'Go to Dashboard' : 'Get Started'}
              </GlassButton>
              <GlassButton
                onClick={() => navigate('/verify-document')}
                variant="secondary"
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                <Shield className="w-5 h-5 mr-2" />
                Try Document Verification
              </GlassButton>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <StaggeredTransition staggerDelay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Authenticity Guard */}
            <GlassCard className="p-8 hover:scale-105 transition-all duration-300" glow={true}>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6 mx-auto">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                AI Authenticity Guard
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Upload government documents and get AI-powered authenticity analysis with confidence 
                scores and explanations.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Google Gemini AI Analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Confidence Score & Explanations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Suspicious Element Detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Professional Reports</span>
                </div>
              </div>

              <GlassButton
                onClick={handleNavigateToVerifyDocument}
                className="w-full"
                variant="primary"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Try Now
              </GlassButton>
            </GlassCard>

            {/* Governance Dashboard */}
            <GlassCard className="p-8 hover:scale-105 transition-all duration-300" glow={true}>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-6 mx-auto">
                <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Governance Dashboard
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Track budget promises vs. delivery with interactive visualizations and transparency 
                metrics.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Interactive Charts & Graphs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Sector-wise Budget Tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Transparency Scoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Real-time Data Updates</span>
                </div>
              </div>

              <GlassButton
                onClick={handleNavigateToDashboard}
                className="w-full"
                variant="primary"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Try Now
              </GlassButton>
            </GlassCard>

            {/* Policy Simulation */}
            <GlassCard className="p-8 hover:scale-105 transition-all duration-300" glow={true}>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-6 mx-auto">
                <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Policy Simulation
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                Explore policy impacts with interactive simulations and AI-generated explanations.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Interactive Parameter Controls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">AI Impact Analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Multiple Policy Scenarios</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Detailed Outcome Predictions</span>
                </div>
              </div>

              <GlassButton
                onClick={handleNavigateToPolicySimulation}
                className="w-full"
                variant="primary"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Try Now
              </GlassButton>
            </GlassCard>
          </div>
        </StaggeredTransition>
      </div>

      {/* Statistics Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Empowering Civic Engagement with AI
            </h2>
            <p className="text-blue-100 text-lg">
              Join thousands of citizens, journalists, and researchers using CivicSim to promote transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Documents Verified</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Analysis Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Policy Simulations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">AI Availability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <GlassCard className="p-12 text-center" glow={true}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to Promote Government Transparency?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the movement towards more transparent and accountable governance. 
            Start verifying documents and analyzing policies today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <GlassButton
              onClick={handleGetStarted}
              size="lg"
              glow={true}
              className="px-8 py-4 text-lg font-semibold"
            >
              {currentUser ? <BarChart3 className="w-5 h-5 mr-2" /> : <Users className="w-5 h-5 mr-2" />}
              {currentUser ? 'View Dashboard' : 'Sign Up Free'}
            </GlassButton>
            <GlassButton
              onClick={() => navigate('/verify-document')}
              variant="secondary"
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
            >
              <Shield className="w-5 h-5 mr-2" />
              Try Document Verification
            </GlassButton>
          </div>
        </GlassCard>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              <strong>Disclaimer:</strong> CivicSim provides AI-assisted analysis for educational purposes. 
              Results should be verified through official sources for critical decisions.
            </p>
            <p className="text-sm">
              
            </p>
          </div>
        </div>
      </div>
      </FadeTransition>
    </div>
  );
};

export default Home;
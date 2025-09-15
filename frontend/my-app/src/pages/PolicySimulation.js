// src/pages/PolicySimulationNew.js - USER-FRIENDLY POLICY SIMULATOR
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Users, 
  Heart, 
  GraduationCap, 
  Wheat, 
  Building,
  Star,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Info,
  Lightbulb,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const PolicySimulationNew = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // User-friendly policy scenarios
  const policyScenarios = [
    {
      id: 'education',
      title: '🎓 Better Schools for Everyone',
      subtitle: 'Help more kids get quality education',
      description: 'See how investing in education affects children, families, and the future of our country',
      icon: GraduationCap,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      impact: 'High',
      timeframe: '5-10 years',
      type: 'good',
      choices: [
        {
          id: 'focus',
          question: '🎯 What should we focus on first?',
          description: 'Different approaches help different groups of children',
          options: [
            {
              value: 'rural',
              label: '🏘️ Rural Villages',
              description: 'Help kids in small towns and villages get better schools',
              impact: 'Helps rural families the most',
              icon: '🏘️'
            },
            {
              value: 'urban',
              label: '🏙️ Big Cities',
              description: 'Improve schools in crowded city areas',
              impact: 'Helps urban families the most',
              icon: '🏙️'
            },
            {
              value: 'balanced',
              label: '⚖️ Both Equally',
              description: 'Spread improvements across all areas',
              impact: 'Helps everyone a little',
              icon: '⚖️'
            }
          ]
        },
        {
          id: 'investment',
          question: '💰 How much should we invest?',
          description: 'More money means better results, but costs more',
          options: [
            {
              value: 'small',
              label: '💵 Small Investment',
              description: 'Careful spending, steady progress',
              impact: 'Slow but safe improvements',
              icon: '💵',
              amount: '₹25,000 crores'
            },
            {
              value: 'medium',
              label: '💰 Medium Investment',
              description: 'Good balance of cost and results',
              impact: 'Noticeable improvements',
              icon: '💰',
              amount: '₹50,000 crores'
            },
            {
              value: 'large',
              label: '💎 Large Investment',
              description: 'Big changes, faster results',
              impact: 'Major improvements quickly',
              icon: '💎',
              amount: '₹1,00,000 crores'
            }
          ]
        }
      ]
    },
    {
      id: 'healthcare',
      title: '🏥 Better Healthcare for All',
      subtitle: 'Ensure everyone gets good medical care',
      description: 'Explore how building more hospitals and clinics helps families stay healthy',
      icon: Heart,
      color: 'red',
      gradient: 'from-red-500 to-pink-600',
      impact: 'Very High',
      timeframe: '3-7 years',
      type: 'good',
      choices: [
        {
          id: 'priority',
          question: '🎯 What\'s most important?',
          description: 'We can focus on different aspects of healthcare',
          options: [
            {
              value: 'hospitals',
              label: '🏥 More Hospitals',
              description: 'Build big hospitals for serious treatments',
              impact: 'Better care for major illnesses',
              icon: '🏥'
            },
            {
              value: 'clinics',
              label: '⛑️ Community Clinics',
              description: 'Small clinics in every neighborhood',
              impact: 'Easy healthcare for daily needs',
              icon: '⛑️'
            },
            {
              value: 'mobile',
              label: '🚑 Mobile Healthcare',
              description: 'Medical vans that visit remote areas',
              impact: 'Reaches people everywhere',
              icon: '🚑'
            }
          ]
        },
        {
          id: 'investment',
          question: '💰 How much should we spend?',
          description: 'Healthcare is expensive but saves lives',
          options: [
            {
              value: 'basic',
              label: '💊 Basic Care',
              description: 'Essential services for everyone',
              impact: 'Basic healthcare coverage',
              icon: '💊',
              amount: '₹40,000 crores'
            },
            {
              value: 'comprehensive',
              label: '🏥 Comprehensive Care',
              description: 'Good facilities and equipment',
              impact: 'Quality healthcare services',
              icon: '🏥',
              amount: '₹75,000 crores'
            },
            {
              value: 'premium',
              label: '⭐ World-Class Care',
              description: 'Best technology and specialists',
              impact: 'Excellent healthcare for all',
              icon: '⭐',
              amount: '₹1,50,000 crores'
            }
          ]
        }
      ]
    },
    {
      id: 'farming',
      title: '🌾 Support Our Farmers',
      subtitle: 'Help farmers grow more food',
      description: 'See how supporting farmers affects food prices, rural jobs, and food security',
      icon: Wheat,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      impact: 'High',
      timeframe: '2-5 years',
      type: 'good',
      choices: [
        {
          id: 'support_type',
          question: '🤝 How should we help farmers?',
          description: 'Different types of support help in different ways',
          options: [
            {
              value: 'subsidies',
              label: '💰 Money Support',
              description: 'Give farmers money to buy seeds and tools',
              impact: 'Immediate relief for farmers',
              icon: '💰'
            },
            {
              value: 'technology',
              label: '🚜 Modern Equipment',
              description: 'Provide tractors and modern farming tools',
              impact: 'Higher crop production',
              icon: '🚜'
            },
            {
              value: 'training',
              label: '👨‍🏫 Knowledge & Training',
              description: 'Teach farmers new techniques',
              impact: 'Long-term farming improvements',
              icon: '👨‍🏫'
            }
          ]
        },
        {
          id: 'scale',
          question: '📊 What\'s the scale of support?',
          description: 'We can help different numbers of farmers',
          options: [
            {
              value: 'local',
              label: '🏘️ Local Support',
              description: 'Help farmers in few districts',
              impact: 'Deep impact in selected areas',
              icon: '🏘️',
              farmers: '10 lakh farmers'
            },
            {
              value: 'regional',
              label: '🗺️ State-wide Support',
              description: 'Help farmers across multiple states',
              impact: 'Good coverage across regions',
              icon: '🗺️',
              farmers: '50 lakh farmers'
            },
            {
              value: 'national',
              label: '🇮🇳 National Program',
              description: 'Help farmers everywhere in India',
              impact: 'Benefits all farming communities',
              icon: '🇮🇳',
              farmers: '1 crore+ farmers'
            }
          ]
        }
      ]
    },
    // BAD POLICY SCENARIOS - Educational examples of what NOT to do
    {
      id: 'education_cuts',
      title: '❌ Cut Education Spending',
      subtitle: 'What happens when we reduce school funding',
      description: 'Explore the harmful effects of cutting education budgets and see why this damages society',
      icon: GraduationCap,
      color: 'red',
      gradient: 'from-red-600 to-red-800',
      impact: 'Very Negative',
      timeframe: '2-5 years',
      type: 'bad',
      choices: [
        {
          id: 'cut_type',
          question: '💸 What kind of cuts are proposed?',
          description: 'Different cuts harm education in different ways',
          options: [
            {
              value: 'teacher_salaries',
              label: '👨‍🏫 Cut Teacher Salaries',
              description: 'Reduce what we pay teachers to save money',
              impact: 'Teachers leave, schools struggle',
              icon: '👨‍🏫'
            },
            {
              value: 'school_facilities',
              label: '🏫 Close Schools',
              description: 'Shut down schools in remote areas',
              impact: 'Children can\'t access education',
              icon: '🏫'
            },
            {
              value: 'student_programs',
              label: '📚 Cancel Programs',
              description: 'Remove sports, arts, and extra classes',
              impact: 'Limited learning opportunities',
              icon: '📚'
            }
          ]
        },
        {
          id: 'severity',
          question: '📉 How severe are the cuts?',
          description: 'Deeper cuts cause more damage',
          options: [
            {
              value: 'mild',
              label: '📉 Small Cuts (10%)',
              description: 'Reduce education budget by 10%',
              impact: 'Some programs affected',
              icon: '📉',
              amount: '₹5,000 crores cut'
            },
            {
              value: 'moderate',
              label: '📉 Big Cuts (25%)',
              description: 'Reduce education budget by 25%',
              impact: 'Major programs cancelled',
              icon: '📉',
              amount: '₹12,500 crores cut'
            },
            {
              value: 'severe',
              label: '📉 Massive Cuts (40%)',
              description: 'Reduce education budget by 40%',
              impact: 'Education system collapses',
              icon: '📉',
              amount: '₹20,000 crores cut'
            }
          ]
        }
      ]
    },
    {
      id: 'healthcare_privatization',
      title: '❌ Make Healthcare Expensive',
      subtitle: 'What happens when only rich people can afford doctors',
      description: 'See how privatizing healthcare hurts families and creates inequality',
      icon: Heart,
      color: 'red',
      gradient: 'from-red-600 to-pink-800',
      impact: 'Very Negative',
      timeframe: '1-3 years',
      type: 'bad',
      choices: [
        {
          id: 'privatization_type',
          question: '🏥 What gets privatized?',
          description: 'Different privatization hurts people in different ways',
          options: [
            {
              value: 'hospitals',
              label: '🏥 Sell Government Hospitals',
              description: 'Let private companies run all hospitals',
              impact: 'Healthcare becomes very expensive',
              icon: '🏥'
            },
            {
              value: 'medicines',
              label: '💊 Remove Medicine Subsidies',
              description: 'Stop helping people buy affordable medicines',
              impact: 'Poor people can\'t afford treatment',
              icon: '💊'
            },
            {
              value: 'insurance',
              label: '📋 End Free Healthcare',
              description: 'Everyone must pay for their own medical bills',
              impact: 'Families go bankrupt from medical costs',
              icon: '📋'
            }
          ]
        },
        {
          id: 'speed',
          question: '⏰ How quickly should this happen?',
          description: 'Faster changes cause more immediate harm',
          options: [
            {
              value: 'gradual',
              label: '🐌 Gradual Change (5 years)',
              description: 'Slowly privatize over 5 years',
              impact: 'People have some time to adjust',
              icon: '🐌'
            },
            {
              value: 'fast',
              label: '🏃 Quick Change (2 years)',
              description: 'Privatize most services in 2 years',
              impact: 'Sudden shock to healthcare system',
              icon: '🏃'
            },
            {
              value: 'immediate',
              label: '⚡ Immediate Change (6 months)',
              description: 'Privatize everything right away',
              impact: 'Healthcare crisis for poor families',
              icon: '⚡'
            }
          ]
        }
      ]
    },
    {
      id: 'farmer_neglect',
      title: '❌ Ignore Farmers Completely',
      subtitle: 'What happens when we don\'t help farmers',
      description: 'Learn why neglecting farmers leads to food shortages and rural poverty',
      icon: Wheat,
      color: 'red',
      gradient: 'from-orange-600 to-red-700',
      impact: 'Very Negative',
      timeframe: '1-3 years',
      type: 'bad',
      choices: [
        {
          id: 'neglect_type',
          question: '🚫 What support should we remove?',
          description: 'Removing different supports hurts farmers in different ways',
          options: [
            {
              value: 'subsidies',
              label: '💸 Remove All Subsidies',
              description: 'Stop helping farmers buy seeds and fertilizers',
              impact: 'Farmers can\'t afford to grow crops',
              icon: '💸'
            },
            {
              value: 'insurance',
              label: '🌧️ Cancel Crop Insurance',
              description: 'Farmers get no help if crops fail',
              impact: 'Bad weather destroys farmer families',
              icon: '🌧️'
            },
            {
              value: 'pricing',
              label: '📉 Remove Price Guarantees',
              description: 'Farmers don\'t know what they\'ll earn',
              impact: 'Farmers lose money every season',
              icon: '📉'
            }
          ]
        },
        {
          id: 'scope',
          question: '🌍 Which farmers are affected?',
          description: 'Different groups of farmers face different challenges',
          options: [
            {
              value: 'small',
              label: '🏡 Small Farmers Only',
              description: 'Remove support from small family farms',
              impact: 'Small farmers abandon farming',
              icon: '🏡',
              affected: '5 crore small farmers'
            },
            {
              value: 'all',
              label: '🌾 All Farmers',
              description: 'Remove support from every type of farmer',
              impact: 'Nationwide farming crisis',
              icon: '🌾',
              affected: '10+ crore farmers'
            },
            {
              value: 'regions',
              label: '🗺️ Specific Regions',
              description: 'Remove support from drought-prone areas',
              impact: 'Rural areas become ghost towns',
              icon: '🗺️',
              affected: '3 crore farmers in vulnerable areas'
            }
          ]
        }
      ]
    }
  ];

  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    setCurrentStep(0);
    setUserChoices({});
    setSimulationResult(null);
  };

  const handleChoiceSelect = (choiceId, optionValue) => {
    setUserChoices(prev => ({
      ...prev,
      [choiceId]: optionValue
    }));
  };

  const nextStep = () => {
    if (currentStep < selectedPolicy.choices.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      runSimulation();
    }
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const result = generateSimulationResult();
      setSimulationResult(result);
      setIsSimulating(false);
      toast.success('Policy simulation completed! 🎉');
    }, 3000);
  };

  const generateSimulationResult = () => {
    // Generate realistic but simplified results based on user choices
    const baseResults = {
      // GOOD POLICIES - Positive outcomes
      education: {
        small: { impact: 65, beneficiaries: '2 crore students', cost: '₹25,000 crores', timeframe: '8-10 years' },
        medium: { impact: 80, beneficiaries: '5 crore students', cost: '₹50,000 crores', timeframe: '5-7 years' },
        large: { impact: 95, beneficiaries: '10 crore students', cost: '₹1,00,000 crores', timeframe: '3-5 years' }
      },
      healthcare: {
        basic: { impact: 70, beneficiaries: '15 crore people', cost: '₹40,000 crores', facilities: '2,000 new facilities' },
        comprehensive: { impact: 85, beneficiaries: '30 crore people', cost: '₹75,000 crores', facilities: '5,000 new facilities' },
        premium: { impact: 95, beneficiaries: '50 crore people', cost: '₹1,50,000 crores', facilities: '10,000+ new facilities' }
      },
      farming: {
        local: { impact: 75, beneficiaries: '10 lakh farmers', cost: '₹15,000 crores', production: '+25% crop yield' },
        regional: { impact: 80, beneficiaries: '50 lakh farmers', cost: '₹45,000 crores', production: '+30% crop yield' },
        national: { impact: 90, beneficiaries: '1+ crore farmers', cost: '₹80,000 crores', production: '+40% crop yield' }
      },
      // BAD POLICIES - Negative outcomes  
      education_cuts: {
        mild: { impact: 25, beneficiaries: '1 crore students harmed', cost: '₹5,000 crores saved', timeframe: '2-3 years', damage: 'Schools close in rural areas' },
        moderate: { impact: 10, beneficiaries: '3 crore students harmed', cost: '₹12,500 crores saved', timeframe: '1-2 years', damage: 'Teacher shortages everywhere' },
        severe: { impact: 5, beneficiaries: '6 crore students harmed', cost: '₹20,000 crores saved', timeframe: '6 months', damage: 'Education system collapses' }
      },
      healthcare_privatization: {
        gradual: { impact: 20, beneficiaries: '10 crore people lose access', cost: '₹30,000 crores government saves', timeframe: '5 years', damage: 'Healthcare becomes luxury' },
        fast: { impact: 15, beneficiaries: '25 crore people lose access', cost: '₹60,000 crores government saves', timeframe: '2 years', damage: 'Medical emergency for poor' },
        immediate: { impact: 5, beneficiaries: '40 crore people lose access', cost: '₹1,00,000 crores government saves', timeframe: '6 months', damage: 'Healthcare crisis nationwide' }
      },
      farmer_neglect: {
        small: { impact: 15, beneficiaries: '5 crore small farmers hurt', cost: '₹20,000 crores government saves', timeframe: '1-2 years', damage: 'Food prices rise sharply' },
        all: { impact: 5, beneficiaries: '10+ crore farmers hurt', cost: '₹50,000 crores government saves', timeframe: '1 year', damage: 'Food shortage crisis' },
        regions: { impact: 10, beneficiaries: '3 crore farmers hurt', cost: '₹15,000 crores government saves', timeframe: '1 year', damage: 'Rural unemployment explodes' }
      }
    };

    const policyType = selectedPolicy.id;
    const investment = userChoices.investment || userChoices.scale || userChoices.severity || userChoices.speed || userChoices.scope || 'medium';
    const focus = userChoices.focus || userChoices.priority || userChoices.support_type || userChoices.cut_type || userChoices.privatization_type || userChoices.neglect_type;
    
    // Get the base result, with fallback for missing keys
    let baseResult;
    if (baseResults[policyType] && baseResults[policyType][investment]) {
      baseResult = baseResults[policyType][investment];
    } else if (baseResults[policyType]) {
      // Use the first available option as fallback
      const firstKey = Object.keys(baseResults[policyType])[0];
      baseResult = baseResults[policyType][firstKey];
    } else {
      // Complete fallback for unexpected policy types
      baseResult = {
        impact: 50,
        beneficiaries: 'Unknown',
        cost: 'Unknown',
        timeframe: 'Unknown'
      };
    }
    
    return {
      ...baseResult,
      policyName: selectedPolicy.title,
      focus: focus,
      overallRating: baseResult.impact >= 90 ? 'Excellent' : 
                     baseResult.impact >= 75 ? 'Good' : 
                     baseResult.impact >= 50 ? 'Fair' : 
                     baseResult.impact >= 25 ? 'Poor' : 'Very Bad',
      positiveEffects: generatePositiveEffects(policyType, focus, investment),
      challenges: generateChallenges(policyType, investment),
      recommendations: generateRecommendations(policyType, focus)
    };
  };

  const generatePositiveEffects = (policyType, focus, investment) => {
    const effects = {
      // GOOD POLICIES - Positive effects
      education: {
        rural: ['📚 Better schools in villages', '👶 More children can attend school', '💼 Better job opportunities for youth'],
        urban: ['🏫 Modern classrooms in cities', '💻 Digital learning facilities', '🎓 Higher graduation rates'],
        balanced: ['📈 Overall literacy improvement', '⚖️ Equal opportunities everywhere', '🌟 Nationwide education quality']
      },
      healthcare: {
        hospitals: ['🏥 Advanced medical treatments', '👨‍⚕️ More specialist doctors', '🚑 Better emergency care'],
        clinics: ['⛑️ Easy access to basic care', '💊 Affordable medicines', '👨‍👩‍👧‍👦 Healthier families'],
        mobile: ['🚑 Healthcare reaches remote areas', '👵 Elderly care at home', '🤱 Better maternal care']
      },
      farming: {
        subsidies: ['💰 Higher farmer income', '🌾 Cheaper food for everyone', '🏠 Better rural living standards'],
        technology: ['🚜 Increased crop production', '⏰ Less manual labor needed', '📈 Higher quality crops'],
        training: ['🎓 Smarter farming methods', '🌱 Better crop management', '💡 Innovation in agriculture']
      },
      // BAD POLICIES - The only "positive" is short-term government savings
      education_cuts: {
        teacher_salaries: ['💸 Government saves money short-term'],
        school_facilities: ['💸 Reduced government spending'],
        student_programs: ['💸 Lower education budget needed']
      },
      healthcare_privatization: {
        hospitals: ['💸 Government saves healthcare costs'],
        medicines: ['💸 No medicine subsidies to pay'],
        insurance: ['💸 Government stops paying medical bills']
      },
      farmer_neglect: {
        subsidies: ['💸 Government saves agricultural spending'],
        insurance: ['💸 No crop insurance to pay for'],
        pricing: ['💸 Free market determines prices']
      }
    };
    
    if (effects[policyType] && effects[policyType][focus]) {
      return effects[policyType][focus];
    } else if (effects[policyType]) {
      const firstKey = Object.keys(effects[policyType])[0];
      return effects[policyType][firstKey];
    } else {
      // Fallback for unexpected policy types
      return ['No specific effects defined for this policy'];
    }
  };

  const generateChallenges = (policyType, investment) => {
    // For GOOD policies - normal challenges
    if (policyType === 'education' || policyType === 'healthcare' || policyType === 'farming') {
      if (investment === 'large' || investment === 'premium' || investment === 'national') {
        return ['💸 Higher government spending needed', '⏳ Takes time to see full results', '🏛️ Requires good management'];
      } else if (investment === 'small' || investment === 'basic' || investment === 'local') {
        return ['⏳ Slower progress than hoped', '📊 Limited coverage area', '⚖️ May not help everyone equally'];
      } else {
        return ['💰 Moderate budget required', '⏳ Results take some time', '📋 Needs careful planning'];
      }
    }
    
    // For BAD policies - serious harmful consequences
    return generateNegativeEffects(policyType, investment);
  };

  const generateNegativeEffects = (policyType, investment) => {
    const negativeEffects = {
      education_cuts: {
        mild: ['📉 School quality drops', '👨‍🏫 Good teachers leave for private schools', '📚 Fewer books and resources'],
        moderate: ['🏫 Schools close in poor areas', '👶 Children drop out of school', '📈 Illiteracy rates increase'],
        severe: ['💥 Education system collapses', '🚫 Entire generation loses opportunity', '🏚️ Massive school closures']
      },
      healthcare_privatization: {
        gradual: ['💰 Medical costs rise steadily', '🏥 Government hospitals deteriorate', '💊 Medicine prices increase'],
        fast: ['💸 Families go bankrupt from medical bills', '😷 Poor people avoid treatment', '🏥 Public hospitals shut down'],
        immediate: ['💀 People die because they can\'t afford treatment', '🆘 Medical emergency for 40 crore people', '💥 Healthcare system collapses']
      },
      farmer_neglect: {
        small: ['👨‍🌾 Small farmers abandon agriculture', '🌾 Food production decreases', '💰 Food prices rise for everyone'],
        all: ['🍚 Nationwide food shortage', '🏃‍♂️ Mass migration from villages to cities', '💥 Rural economy collapses'],
        regions: ['🏚️ Entire districts become ghost towns', '🌧️ Farmers helpless against bad weather', '📈 Rural unemployment explodes']
      }
    };

    if (negativeEffects[policyType] && negativeEffects[policyType][investment]) {
      return negativeEffects[policyType][investment];
    } else if (negativeEffects[policyType]) {
      const firstKey = Object.keys(negativeEffects[policyType])[0];
      return negativeEffects[policyType][firstKey];
    } else {
      // Fallback for unexpected policy types
      return ['Policy implementation may face challenges', 'Careful monitoring required', 'Results may vary'];
    }
  };

  const generateRecommendations = (policyType, focus) => {
    const recommendations = {
      // GOOD POLICIES - Implementation recommendations
      education: ['📊 Monitor school attendance regularly', '👨‍🏫 Train more qualified teachers', '📱 Use technology to track progress'],
      healthcare: ['🏥 Start with basic facilities first', '👨‍⚕️ Train local healthcare workers', '📱 Use mobile apps for health tracking'],
      farming: ['🌾 Start pilot programs in few districts', '📚 Combine with farmer education', '💰 Ensure fair distribution of benefits'],
      
      // BAD POLICIES - Warning recommendations
      education_cuts: ['⚠️ DON\'T DO THIS - It will harm children\'s future', '🔄 Instead: Find other areas to cut spending', '📚 Education is investment, not expense'],
      healthcare_privatization: ['⚠️ DON\'T DO THIS - People will die from lack of care', '🔄 Instead: Improve government healthcare efficiency', '🏥 Healthcare is a human right, not a business'],
      farmer_neglect: ['⚠️ DON\'T DO THIS - Food security will be threatened', '🔄 Instead: Make farming support more efficient', '🌾 Healthy farming = Food security for all']
    };
    
    if (recommendations[policyType]) {
      return recommendations[policyType];
    } else {
      // Fallback for unexpected policy types
      return ['Review policy implementation carefully', 'Monitor outcomes regularly', 'Adjust based on results'];
    }
  };

  const resetSimulation = () => {
    setSelectedPolicy(null);
    setCurrentStep(0);
    setUserChoices({});
    setSimulationResult(null);
    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Policy Playground
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            See how government decisions affect real people
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Easy to understand • No complicated numbers • Real impact stories
          </p>
        </motion.div>

        {!selectedPolicy && !simulationResult && (
          <PolicySelection 
            scenarios={policyScenarios}
            onSelect={handlePolicySelect}
          />
        )}

        {selectedPolicy && !simulationResult && (
          <PolicyConfiguration
            policy={selectedPolicy}
            currentStep={currentStep}
            userChoices={userChoices}
            onChoiceSelect={handleChoiceSelect}
            onNext={nextStep}
            onBack={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : setSelectedPolicy(null)}
            isSimulating={isSimulating}
          />
        )}

        {simulationResult && (
          <SimulationResults
            result={simulationResult}
            onReset={resetSimulation}
            onNewSimulation={() => setSelectedPolicy(null)}
          />
        )}
      </div>
    </div>
  );
};

// Policy Selection Component
const PolicySelection = ({ scenarios, onSelect }) => {
  const goodPolicies = scenarios.filter(s => s.type === 'good');
  const badPolicies = scenarios.filter(s => s.type === 'bad');

  return (
    <div className="space-y-12">
      {/* Good Policies Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ✅ Good Policy Ideas
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Smart investments that help people and build a better future
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {goodPolicies.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-green-200 dark:border-green-800"
              onClick={() => onSelect(scenario)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`h-32 bg-gradient-to-r ${scenario.gradient} flex items-center justify-center`}>
                <scenario.icon className="w-16 h-16 text-white" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {scenario.subtitle}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {scenario.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {scenario.impact} Impact
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Warning Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 border-2 border-red-200 dark:border-red-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-900 dark:text-red-300 mb-4">
            ⚠️ Bad Policy Examples
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-4">
            Learn from mistakes - See what happens when governments make poor decisions
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-lg inline-block">
            <strong>Educational Purpose:</strong> These simulations show why certain policies are harmful to society
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {badPolicies.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 3) * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-red-300 dark:border-red-700"
              onClick={() => onSelect(scenario)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`h-32 bg-gradient-to-r ${scenario.gradient} flex items-center justify-center relative`}>
                <scenario.icon className="w-16 h-16 text-white opacity-75" />
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  DON'T DO
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {scenario.subtitle}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {scenario.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {scenario.impact}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Policy Configuration Component  
const PolicyConfiguration = ({ 
  policy, 
  currentStep, 
  userChoices, 
  onChoiceSelect, 
  onNext, 
  onBack, 
  isSimulating 
}) => {
  const currentChoice = policy.choices[currentStep];
  const selectedOption = userChoices[currentChoice.id];
  const isLastStep = currentStep === policy.choices.length - 1;

  if (isSimulating) {
    return <SimulationLoader />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {policy.choices.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(((currentStep + 1) / policy.choices.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-2 bg-gradient-to-r ${policy.gradient} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / policy.choices.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {currentChoice.question}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {currentChoice.description}
          </p>
        </div>

        {/* Options */}
        <div className="grid gap-4 mb-8">
          {currentChoice.options.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selectedOption === option.value
                  ? `border-${policy.color}-500 bg-${policy.color}-50 dark:bg-${policy.color}-900/20`
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => onChoiceSelect(currentChoice.id, option.value)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {option.label}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {option.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <strong>Impact:</strong> {option.impact}
                  </p>
                  {option.amount && (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      💰 Budget: {option.amount}
                    </p>
                  )}
                  {option.farmers && (
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      👨‍🌾 Helps: {option.farmers}
                    </p>
                  )}
                </div>
                {selectedOption === option.value && (
                  <CheckCircle className={`w-6 h-6 text-${policy.color}-500`} />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ← Back
          </button>
          
          <motion.button
            onClick={onNext}
            disabled={!selectedOption}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
              selectedOption
                ? `bg-gradient-to-r ${policy.gradient} hover:scale-105 shadow-lg`
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            }`}
            whileHover={selectedOption ? { scale: 1.05 } : {}}
            whileTap={selectedOption ? { scale: 0.95 } : {}}
          >
            {isLastStep ? (
              <>
                <Zap className="w-5 h-5 inline mr-2" />
                Run Simulation
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Simulation Loader Component
const SimulationLoader = () => (
  <div className="max-w-2xl mx-auto text-center">
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div
        className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Zap className="w-8 h-8 text-white" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        🔮 Running Policy Simulation...
      </h3>
      
      <div className="space-y-3 text-gray-600 dark:text-gray-300">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          📊 Analyzing your choices...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          🔍 Calculating real-world impacts...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ✨ Preparing your results...
        </motion.p>
      </div>
    </motion.div>
  </div>
);

// Simulation Results Component
const SimulationResults = ({ result, onReset, onNewSimulation }) => {
  const isBadPolicy = result.impact < 50;
  const headerIcon = isBadPolicy ? AlertTriangle : Star;
  const headerColor = isBadPolicy ? 'from-red-500 to-red-700' : 'from-green-500 to-blue-600';
  const headerText = isBadPolicy ? '⚠️ Warning: Bad Policy Results!' : '🎉 Simulation Complete!';
  const headerSubtext = isBadPolicy ? 
    'This policy would cause serious harm to society' : 
    'Here\'s what would happen with your policy choices';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${headerColor} rounded-full flex items-center justify-center`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          {isBadPolicy ? (
            <AlertTriangle className="w-10 h-10 text-white" />
          ) : (
            <Star className="w-10 h-10 text-white" />
          )}
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {headerText}
        </h2>
        <p className={`${isBadPolicy ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
          {headerSubtext}
        </p>
      </div>

    {/* Main Results Card */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
      {/* Impact Score */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">{result.policyName}</h3>
        <div className="flex items-center justify-center space-x-4">
          <div>
            <div className="text-4xl font-bold">{result.impact}%</div>
            <div className="text-green-100">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{result.overallRating}</div>
            <div className="text-green-100">Overall Rating</div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Key Numbers */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.beneficiaries}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">People Helped</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.cost}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Investment</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.timeframe}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">To See Results</div>
          </div>
        </div>

        {/* Positive Effects */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
            ✨ Positive Effects
          </h4>
          <div className="space-y-2">
            {result.positiveEffects.map((effect, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{effect}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingDown className="w-6 h-6 text-orange-500 mr-2" />
            ⚠️ Things to Watch Out For
          </h4>
          <div className="space-y-2">
            {result.challenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
              >
                <Info className="w-5 h-5 text-orange-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Lightbulb className="w-6 h-6 text-blue-500 mr-2" />
            💡 Our Recommendations
          </h4>
          <div className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <Target className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={onNewSimulation}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5 inline mr-2" />
            Try Another Policy
          </motion.button>
          
          <motion.button
            onClick={onReset}
            className="px-8 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Start Over
          </motion.button>
        </div>
      </div>
    </div>

    {/* Educational Note */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`${isBadPolicy ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'} border rounded-xl p-4 text-center`}
    >
      <Info className={`w-5 h-5 ${isBadPolicy ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'} inline mr-2`} />
      <span className={`text-sm ${isBadPolicy ? 'text-red-800 dark:text-red-300' : 'text-yellow-800 dark:text-yellow-300'}`}>
        <strong>{isBadPolicy ? 'Educational Warning:' : 'Educational Tool:'}</strong> {isBadPolicy ? 
          'This simulation shows why certain policies are harmful. These are examples of what NOT to do in real governance.' :
          'This simulation uses simplified models to help understand policy impacts. Real-world results may vary based on many factors not included in this simulation.'
        }
      </span>
    </motion.div>
  </motion.div>
  );
};

export default PolicySimulationNew;
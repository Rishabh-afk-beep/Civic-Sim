export const binaryTestCases = [
  {
    test_id: 'binary_001',
    description: 'Perfect authentic government document',
    input_features: {
      language_patterns: 0.95,
      formatting_consistency: 0.90,
      official_terminology: 0.95,
      metadata_analysis: 0.88,
      structure_validation: 0.92
    },
    expected_binary_result: 1,
    expected_probability_range: [0.85, 0.98],
    test_type: 'authentic_strong'
  },
  
  {
    test_id: 'binary_002', 
    description: 'Clearly fake document with poor language',
    input_features: {
      language_patterns: 0.15,
      formatting_consistency: 0.25,
      official_terminology: 0.10,
      metadata_analysis: 0.20,
      structure_validation: 0.30
    },
    expected_binary_result: 0,
    expected_probability_range: [0.05, 0.25],
    test_type: 'fake_strong'
  },
  
  {
    test_id: 'binary_003',
    description: 'Borderline authentic document (just above threshold)',
    input_features: {
      language_patterns: 0.65,
      formatting_consistency: 0.60,
      official_terminology: 0.70,  
      metadata_analysis: 0.55,
      structure_validation: 0.62
    },
    expected_binary_result: 1,
    expected_probability_range: [0.50, 0.70],
    test_type: 'authentic_weak'
  },
  
  {
    test_id: 'binary_004',
    description: 'Borderline fake document (just below threshold)',
    input_features: {
      language_patterns: 0.45,
      formatting_consistency: 0.50,
      official_terminology: 0.40,
      metadata_analysis: 0.48,
      structure_validation: 0.52
    },
    expected_binary_result: 0,
    expected_probability_range: [0.30, 0.50],
    test_type: 'fake_weak'
  },
  
  {
    test_id: 'binary_005',
    description: 'Right at threshold test case',
    input_features: {
      language_patterns: 0.50,
      formatting_consistency: 0.50,
      official_terminology: 0.50,
      metadata_analysis: 0.50,
      structure_validation: 0.50
    },
    expected_binary_result: 1, // Exactly at 0.5 probability, should round to 1
    expected_probability_range: [0.49, 0.51],
    test_type: 'threshold_test'
  }
];

// Feature weight test cases
export const featureWeightTests = [
  {
    test_name: 'Language patterns dominance',
    description: 'High language score, low others - should still be authentic',
    features: {
      language_patterns: 0.95, // 25% weight = 0.2375 contribution
      formatting_consistency: 0.30, // 20% weight = 0.06 contribution  
      official_terminology: 0.30, // 25% weight = 0.075 contribution
      metadata_analysis: 0.30, // 15% weight = 0.045 contribution
      structure_validation: 0.30 // 15% weight = 0.045 contribution
    },
    // Total weighted sum ≈ 0.4625, should be classified as 0 (fake)
    expected_result: 0
  },
  
  {
    test_name: 'Balanced high scores',
    description: 'All features moderately high - should be authentic',
    features: {
      language_patterns: 0.75,
      formatting_consistency: 0.75,
      official_terminology: 0.75,
      metadata_analysis: 0.75,
      structure_validation: 0.75
    },
    // Total weighted sum = 0.75, should be classified as 1 (authentic)
    expected_result: 1
  }
];

// Logistic regression test cases
export const logisticRegressionTests = [
  {
    weighted_sum: 0.25,
    expected_logistic_input: -1.5, // (0.25 - 0.5) * 6
    expected_probability_range: [0.18, 0.22], // sigmoid(-1.5) ≈ 0.20
    expected_binary: 0
  },
  
  {
    weighted_sum: 0.50,
    expected_logistic_input: 0.0, // (0.50 - 0.5) * 6  
    expected_probability_range: [0.49, 0.51], // sigmoid(0) = 0.50
    expected_binary: 1 // Exactly at threshold, rounds to 1
  },
  
  {
    weighted_sum: 0.75,
    expected_logistic_input: 1.5, // (0.75 - 0.5) * 6
    expected_probability_range: [0.78, 0.82], // sigmoid(1.5) ≈ 0.82
    expected_binary: 1
  },
  
  {
    weighted_sum: 0.90,
    expected_logistic_input: 2.4, // (0.90 - 0.5) * 6
    expected_probability_range: [0.90, 0.94], // sigmoid(2.4) ≈ 0.92
    expected_binary: 1
  }
];

// Utility functions for testing
export const runBinaryTest = (testCase, actualResult) => {
  const passed = actualResult.verification_result === testCase.expected_binary_result;
  const probabilityInRange = actualResult.confidence_score >= testCase.expected_probability_range[0] &&
                            actualResult.confidence_score <= testCase.expected_probability_range[1];
  
  return {
    test_id: testCase.test_id,
    description: testCase.description,
    passed: passed && probabilityInRange,
    expected_binary: testCase.expected_binary_result,
    actual_binary: actualResult.verification_result,
    expected_probability_range: testCase.expected_probability_range,
    actual_probability: actualResult.confidence_score,
    binary_match: passed,
    probability_in_range: probabilityInRange
  };
};

export const validateLogisticRegression = (weightedSum, actualProbability, actualBinary) => {
  const expectedLogisticInput = (weightedSum - 0.5) * 6;
  const expectedProbability = 1 / (1 + Math.exp(-expectedLogisticInput));
  const expectedBinary = expectedProbability >= 0.5 ? 1 : 0;
  
  return {
    weighted_sum: weightedSum,
    expected_logistic_input: expectedLogisticInput,
    expected_probability: expectedProbability,
    expected_binary: expectedBinary,
    actual_probability: actualProbability,
    actual_binary: actualBinary,
    probability_error: Math.abs(expectedProbability - actualProbability),
    binary_match: expectedBinary === actualBinary,
    validation_passed: Math.abs(expectedProbability - actualProbability) < 0.05 && expectedBinary === actualBinary
  };
};
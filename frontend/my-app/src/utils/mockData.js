export const mockHealthFundData = {
  total_allocated: 862000000000,  // ₹86,200 Cr
  total_utilized: 586160000000,   // ₹58,616 Cr
  utilization_rate: 68,
  budget_variance: 32,
  transparency_score: 74
};

export const mockDocumentVerification = {
  authentic: 1,  // Binary: 1=authentic, 0=fake
  confidence: 0.94,
  processing_time: 3.2,
  analysis: {
    vendor_found: true,
    contract_value: "₹2.5 Crores"
  }
};

export const mockCorruptionAnalysis = {
  risk_score: 87,
  risk_level: "HIGH",
  red_flags: [
    {
      type: "vendor_concentration",
      description: "Vendor won 68% of ministry contracts",
      severity: "high"
    }
  ]
};

// Simulate API delay for realistic demo
export const simulateAPIDelay = (data, delayMs = 1500) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delayMs);
  });
};

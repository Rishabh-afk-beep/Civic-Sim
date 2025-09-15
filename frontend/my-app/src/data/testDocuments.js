export const testDocuments = {
  // AUTHENTIC DOCUMENTS (should return 1)
  authentic: [
    {
      id: 'auth_001',
      type: 'government_announcement',
      title: 'Authentic Government Budget Announcement',
      content: `
GOVERNMENT OF INDIA
MINISTRY OF FINANCE
DEPARTMENT OF EXPENDITURE

OFFICE MEMORANDUM

Subject: Union Budget 2025-26 - Revised Allocation for Education Sector

Ref: F.No. 1(15)/2025-Budget
Date: September 10, 2025

In continuation of the Budget Speech delivered by the Hon'ble Finance Minister on February 1, 2025, and subsequent parliamentary approvals, the following revised allocations are hereby notified:

1. EDUCATION SECTOR ALLOCATION:
   - Total Allocation: ₹1,12,899 crores
   - Increase from previous year: 8.2%
   - Samagra Shiksha Scheme: ₹37,800 crores
   - Higher Education: ₹42,998 crores

2. IMPLEMENTATION TIMELINE:
   - Q1 FY 2025-26: 25% release
   - Q2 FY 2025-26: 35% release  
   - Q3 FY 2025-26: 25% release
   - Q4 FY 2025-26: 15% release

3. MONITORING MECHANISM:
   All implementing agencies shall submit monthly utilization certificates to the Ministry of Education and copies to the Ministry of Finance by the 5th of each subsequent month.

This issues with the approval of the competent authority.

Sd/-
(Rajesh Kumar)
Joint Secretary to Government of India
Ministry of Finance
Phone: 011-23092453
Email: js.budget@gov.in

Copy to:
1. Secretary, Ministry of Education
2. Controller General of Accounts
3. Principal Accounts Officer (Education)
4. NIC for uploading on ministry website
      `,
      expected_result: 1,
      confidence_range: [0.8, 0.95]
    },
    
    {
      id: 'auth_002', 
      type: 'policy_statement',
      title: 'Authentic Policy Circular',
      content: `
GOVERNMENT OF INDIA
MINISTRY OF HOME AFFAIRS
**POLICY CIRCULAR**

Circular No: MHA/Policy/2025/45
Date: September 12, 2025

TO: All State Governments/UT Administrations
     All Central Armed Police Forces
     All Intelligence Agencies

SUBJECT: Implementation of Enhanced Security Protocol for Government Buildings

REF: (a) MHA letter No. IV/21011/12/2024-IS-I dated 15.03.2025
     (b) Cabinet Secretariat Note No. 123/2025 dated 20.08.2025

In pursuance of the Cabinet decision and in consultation with all stakeholders, the following enhanced security protocols are to be implemented with immediate effect:

1. ACCESS CONTROL MEASURES:
   1.1 All government buildings handling classified information shall implement biometric access control systems by December 31, 2025.
   1.2 Visitor management systems with photographic records mandatory.
   1.3 Multi-tier security clearance for different zones within buildings.

2. TECHNICAL SECURITY MEASURES:
   2.1 Installation of CCTV surveillance with 30-day recording retention.
   2.2 Metal detectors at all entry points.
   2.3 X-ray baggage scanning systems for sensitive areas.

3. COMPLIANCE TIMELINE:
   - Phase I (Oct 2025): High-security buildings (List attached as Annexure-I)
   - Phase II (Nov 2025): Medium-security buildings 
   - Phase III (Dec 2025): All remaining government buildings

4. FUNDING:
   Central assistance of ₹500 crores allocated under Security Enhancement Scheme.
   State-wise allocation details provided in Annexure-II.

This circular supersedes all previous instructions on this subject.

Sd/-
(Dr. Priya Sharma)
Joint Secretary (Internal Security)
Ministry of Home Affairs
Government of India
      `,
      expected_result: 1,
      confidence_range: [0.85, 0.92]
    }
  ],

  // FAKE DOCUMENTS (should return 0)
  fake: [
    {
      id: 'fake_001',
      type: 'government_announcement', 
      title: 'Fake Government Document - Poor Language',
      content: `
government of india
ministry of finance

hey everyone!

so we decided to give everyone free money lol 😂

here's the deal:
- everyone gets 50000 rupees 
- no questions asked
- just show up at any bank tomorrow
- bring your aadhar card or whatever

this is totally legit guys, my cousin works in the government and he told me about this scheme. its called "Instant Cash Bonanza Scheme" and modi ji personally approved it.

the money comes from some swiss bank account that we found. apparently there was unclaimed money sitting there for years so we thought why not give it to the people right?

you can thank me later 😎

deadline: tomorrow only! first come first serve basis

contact whatsapp: 9876543210 for more details

- some guy from finance ministry
      `,
      expected_result: 0,
      confidence_range: [0.05, 0.25]
    },
    
    {
      id: 'fake_002',
      type: 'budget_document',
      title: 'Fake Budget Document - Wrong Format',
      content: `
BUDGET 2025 LEAKED DRAFT!!!

CONFIDENTIAL - DO NOT SHARE

Top Secret Budget Allocations:
================================

Defense: 100 billion dollars (we're switching to dollars now)
Education: 50 billion dollars  
Healthcare: 75 billion dollars
Space Program: 200 billion dollars (we're going to Mars!)
Cricket Team: 10 billion dollars
Bollywood Subsidies: 25 billion dollars

NEW TAXES:
- Tax on breathing: ₹10 per breath
- Tax on looking at government buildings: ₹500
- Tax on complaining about taxes: ₹1000

FREEBIES:
- Free iPhone 15 for everyone
- Free Tesla cars for government employees
- Free trips to Switzerland for cabinet ministers

This budget was prepared in Microsoft Paint by a team of highly qualified economists from WhatsApp University.

For any clarifications, please contact:
Email: totallyreal@fakegovt.com
Phone: 123-FAKE-BUDGET

Approved by: Definitely Real Finance Minister
Signature: [SIGNATURE MISSING]

Date: 32nd February, 2025
      `,
      expected_result: 0,
      confidence_range: [0.02, 0.15]
    },
    
    {
      id: 'fake_003',
      type: 'official_letter', 
      title: 'Fake Official Letter - Missing Metadata',
      content: `
Important Government Notice

Subject: Urgent Action Required

Dear Citizen,

Your immediate attention is required for a very important government matter.

We have discovered that your Aadhar card has been linked to suspicious activities. To avoid legal action, you must immediately:

1. Send us your bank account details
2. Share your Aadhar number and OTP
3. Transfer ₹10,000 as processing fee

Failure to comply within 24 hours will result in:
- Bank account freezing
- Arrest warrant
- Property confiscation

This is a very serious matter. Do not ignore this notice.

Send all details to: urgentgovtaction@gmail.com

Regards,
Government Officer
      `,
      expected_result: 0,
      confidence_range: [0.01, 0.20]
    }
  ],

  // EDGE CASES (borderline documents)
  edge_cases: [
    {
      id: 'edge_001',
      type: 'government_announcement',
      title: 'Borderline Document - Mixed Quality', 
      content: `
GOVERNMENT OF INDIA
MINISTRY OF RURAL DEVELOPMENT

PRESS RELEASE

New Rural Employment Scheme Launched

Date: September 14, 2025

The Ministry of Rural Development today announced the launch of the "Digital Skills for Rural India" scheme with an allocation of ₹15,000 crores.

Key Features:
- Training for 2 million rural youth
- Digital literacy programs
- Employment guarantee in IT sector

However, some details are bit unclear and implementation timeline is not specified properly. The scheme guidelines will be released soon.

Contact: Ministry of Rural Development
New Delhi
      `,
      expected_result: 0, // Likely fake due to vague details and poor structure
      confidence_range: [0.35, 0.65] // Should be close to threshold
    }
  ]
};

export const getTestDocument = (type, category = 'authentic') => {
  return testDocuments[category]?.find(doc => doc.type === type) || testDocuments.authentic[0];
};

export const getAllTestDocuments = () => {
  return [
    ...testDocuments.authentic,
    ...testDocuments.fake,
    ...testDocuments.edge_cases
  ];
};

export const getRandomTestDocument = () => {
  const allDocs = getAllTestDocuments();
  return allDocs[Math.floor(Math.random() * allDocs.length)];
};
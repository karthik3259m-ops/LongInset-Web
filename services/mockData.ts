import { Difficulty, MasteryLevel, PriorityLabel, Question, QuestionType, TopicMastery, User, PastPaper, GovernanceLevel, CareerGroup } from '../types';

export const MOCK_USER: User = {
  id: "user_123",
  email: "demo@longinset.com",
  name: "Alex Johnson",
  examTarget: "JEE Main 2025",
  streak: 12,
  points: 450,
  quickNotes: "• Review Thermodynamics formulas\n• Practice numericals for Rotational Motion\n• Mock test on Friday!"
};

export const MOCK_TOPICS_MASTERY: TopicMastery[] = [
  {
    topicId: 't1',
    topicName: 'Thermodynamics',
    accuracy: 45,
    priorityScore: 88,
    priorityLabel: PriorityLabel.Critical,
    questionsAttempted: 42,
    masteryLevel: MasteryLevel.Beginner,
    isWeakSpot: true
  },
  {
    topicId: 't2',
    topicName: 'Electrostatics',
    accuracy: 78,
    priorityScore: 65,
    priorityLabel: PriorityLabel.High,
    questionsAttempted: 120,
    masteryLevel: MasteryLevel.Advanced,
    isWeakSpot: false
  },
  {
    topicId: 't3',
    topicName: 'Rotational Motion',
    accuracy: 30,
    priorityScore: 92,
    priorityLabel: PriorityLabel.Critical,
    questionsAttempted: 15,
    masteryLevel: MasteryLevel.Beginner,
    isWeakSpot: true
  },
  {
    topicId: 't4',
    topicName: 'Modern Physics',
    accuracy: 92,
    priorityScore: 40,
    priorityLabel: PriorityLabel.Low,
    questionsAttempted: 85,
    masteryLevel: MasteryLevel.Mastered,
    isWeakSpot: false
  },
  {
    topicId: 't5',
    topicName: 'Optics',
    accuracy: 65,
    priorityScore: 55,
    priorityLabel: PriorityLabel.Medium,
    questionsAttempted: 60,
    masteryLevel: MasteryLevel.Intermediate,
    isWeakSpot: false
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    topicId: 't1',
    text: 'A gas expands from volume V1 to V2 at constant pressure P. The work done by the gas is:',
    options: {
      A: 'P(V2 - V1)',
      B: 'P(V1 - V2)',
      C: 'P(V2 + V1)',
      D: 'Zero'
    },
    correctOption: 'A',
    explanation: 'Work done at constant pressure is given by W = PΔV = P(V2 - V1). This is a direct application of the definition of work in thermodynamics for isobaric processes.',
    difficulty: Difficulty.Easy,
    type: QuestionType.Direct,
    yearAsked: [2018, 2021],
    weightageScore: 6.5
  },
  {
    id: 'q2',
    topicId: 't1',
    text: 'In an adiabatic process, the quantity which remains constant is:',
    options: {
      A: 'Temperature',
      B: 'Pressure',
      C: 'Total Heat Content',
      D: 'Volume'
    },
    correctOption: 'C',
    explanation: 'In an adiabatic process, there is no heat exchange with the surroundings (dQ = 0). Therefore, the total heat content remains constant.',
    difficulty: Difficulty.Medium,
    type: QuestionType.Conceptual,
    yearAsked: [2015, 2019, 2023],
    weightageScore: 8.0
  },
  {
    id: 'q3',
    topicId: 't3',
    text: 'A solid sphere rolls down an inclined plane without slipping. The ratio of rotational kinetic energy to total kinetic energy is:',
    options: {
      A: '2/5',
      B: '2/7',
      C: '5/7',
      D: '1/2'
    },
    correctOption: 'B',
    explanation: 'For a solid sphere, I = (2/5)mR². Total KE = Translational KE + Rotational KE. K_rot/K_total = (1/2 Iω²) / (1/2 mv² + 1/2 Iω²). Since v=ωR for pure rolling, this simplifies to 2/7.',
    difficulty: Difficulty.Hard,
    type: QuestionType.Numerical,
    yearAsked: [2020, 2022],
    weightageScore: 9.2
  }
];

// --- DYNAMIC STUDY PLAN DATA ---
export const STUDY_STRATEGY = {
    integratedSyllabus: {
        core: [
            { subject: "Current Affairs", detail: "National & International news" },
            { subject: "General Studies", detail: "History, Polity, Geography, Economy" },
            { subject: "English", detail: "Grammar, Vocabulary, Reading" },
            { subject: "Reasoning", detail: "Logic, Coding-Decoding, Directions" }
        ],
        specialty: [
            { exam: "JEE/Engineering", focus: "Physics Numericals, Organic Chemistry Mechanisms, Calculus Application" },
            { exam: "NEET/Medical", focus: "NCERT Biology Diagrams, Chemical Bonding, Physics Formula Application" },
            { exam: "UPSC", focus: "Answer writing, Ethics, and Optional Subject" },
            { exam: "SSC/RRB", focus: "High-speed Math tricks & Advanced Science" },
            { exam: "Banking", focus: "Complex Puzzles, Banking Awareness, DI" },
            { exam: "State PSC", focus: "State History, Local Language, State Schemes" }
        ]
    },
    dailyRoutine: [
        { 
            slot: "Slot A", 
            name: "The Core", 
            duration: "7 Hours", 
            color: "indigo",
            activities: [
                { time: "Morning (3 hrs)", task: "High-intensity (Math/Quant/Reasoning)" },
                { time: "Noon (3 hrs)", task: "General Studies / NCERTs (Class 6-12)" },
                { time: "Evening (1 hr)", task: "Current Affairs + Newspaper" }
            ]
        },
        { 
            slot: "Slot B", 
            name: "The Specialty", 
            duration: "2 Hours", 
            color: "purple",
            activities: [
                { time: "Anytime", task: "Target Specific (PYQs, Optional, Ethics, or Speed Math)" }
            ]
        },
        { 
            slot: "Slot C", 
            name: "The Review", 
            duration: "1 Hour", 
            color: "green",
            activities: [
                { time: "Night", task: "Active Recall (Summarize day) + 15 min Rapid Fire Quiz" }
            ]
        }
    ],
    weeklyPlan: [
        { days: "Mon - Fri", focus: "Regular 7-2-1 Study Routine", icon: "Calendar" },
        { days: "Saturday", focus: "The Weakness Fix (Focus solely on your weakest subject)", icon: "Wrench" },
        { days: "Sunday", focus: "The Mock Test (Full length + 2hr Analysis)", icon: "Trophy" }
    ],
    proTips: [
        { type: "JEE/NEET", tip: "Accuracy > Attempts. Master the art of 'skipping' difficult questions initially." },
        { type: "UPSC/State PSC", tip: "Focus on 'Why' it happened (Conceptual)." },
        { type: "SSC/RRB/Banking", tip: "Focus on 'What' happened (Factual) and 'How fast' can you calculate." }
    ]
};

// --- GOVERNANCE DATA ---

export const GOVERNANCE_STRUCTURE: GovernanceLevel[] = [
  { level: 'Country', description: 'Central Government of India', hindiName: 'Bharat Sarkar', politicalHead: 'Prime Minister', adminHead: 'Cabinet Secretary', count: '1' },
  { level: 'State / UT', description: 'State Government', hindiName: 'Rajya Sarkar', politicalHead: 'Chief Minister', adminHead: 'Chief Secretary', count: '28 States / 8 UTs' },
  { level: 'Division', description: 'Cluster of Districts (Select States)', hindiName: 'Mandal', politicalHead: '—', adminHead: 'Divisional Commissioner', count: '—' },
  { level: 'District', description: 'Main administrative unit', hindiName: 'Zila', politicalHead: 'Zila Parishad President', adminHead: 'DM / Collector', count: '~780+' },
  { level: 'Sub-district', description: 'Subdivision for Revenue', hindiName: 'Tehsil / Taluka', politicalHead: '—', adminHead: 'SDM / Tehsildar', count: '~7,000+' },
  { level: 'Block', description: 'Developmental Unit', hindiName: 'Vikas Khand', politicalHead: 'Panchayat Samiti Chair', adminHead: 'BDO', count: '~6,600+' },
  { level: 'Gram Panchayat', description: 'Cluster of Villages', hindiName: 'Gram Panchayat', politicalHead: 'Sarpanch / Pradhan', adminHead: 'Panchayat Secretary', count: '~250,000+' },
  { level: 'Village', description: 'Smallest Administrative Unit', hindiName: 'Gaon', politicalHead: '—', adminHead: 'VDO', count: '~640,000+' }
];

export const CAREER_GROUPS: CareerGroup[] = [
  {
    id: 'upsc',
    name: 'UPSC',
    fullForm: 'Union Public Service Commission',
    goal: 'Top Civil Services & Administration',
    positions: 'IAS (Collector), IPS (SP), IFS, IRS',
    authorityLevel: 'Group A (Gazetted) - Highest Authority',
    postingLevel: 'Center & State',
    description: 'The premier central recruiting agency in India. It is responsible for appointments to and examinations for Group A & Group B posts under civil services and defense services.',
    examsList: [
      { name: 'CSE', fullName: 'Civil Services Exam', roles: 'IAS, IPS, IFS, IRS', tentativeDate: 'May 2026', difficulty: 'Hard' },
      { name: 'NDA', fullName: 'National Defence Academy', roles: 'Army, Navy, Air Force Officers', tentativeDate: 'April 2026', difficulty: 'Medium' },
      { name: 'CDS', fullName: 'Combined Defence Services', roles: 'Officers in Armed Forces', tentativeDate: 'April 2026', difficulty: 'Medium' },
      { name: 'IES', fullName: 'Indian Engineering Services', roles: 'Technical Heads in Railways/CPWD', tentativeDate: 'Feb 2026', difficulty: 'Hard' },
      { name: 'CAPF', fullName: 'Central Armed Police Forces', roles: 'Assistant Commandant', tentativeDate: 'August 2026', difficulty: 'Medium' }
    ]
  },
  {
    id: 'ssc',
    name: 'SSC',
    fullForm: 'Staff Selection Commission',
    goal: 'Central Govt Ministries & Departments',
    positions: 'Income Tax Inspector, CBI SI, Auditor',
    authorityLevel: 'Group B / C - Executive Authority',
    postingLevel: 'Central Ministries',
    description: 'An organization under Government of India to recruit staff for various posts in the various Ministries and Departments of the Government of India and in Subordinate Offices.',
    examsList: [
      { name: 'CGL', fullName: 'Combined Graduate Level', roles: 'Income Tax Inspector, CBI, MEA', tentativeDate: 'Sept 2026', difficulty: 'Medium' },
      { name: 'CHSL', fullName: 'Combined Higher Secondary Level', roles: 'Data Entry, Clerks', tentativeDate: 'July 2026', difficulty: 'Easy' },
      { name: 'MTS', fullName: 'Multi Tasking Staff', roles: 'Office Support', tentativeDate: 'Oct 2026', difficulty: 'Easy' },
      { name: 'JE', fullName: 'Junior Engineer', roles: 'CPWD, CWC, MES', tentativeDate: 'June 2026', difficulty: 'Medium' },
      { name: 'GD', fullName: 'General Duty Constable', roles: 'Paramilitary Forces', tentativeDate: 'Jan 2026', difficulty: 'Easy' }
    ]
  },
  {
    id: 'banking',
    name: 'Banking',
    fullForm: 'IBPS / SBI / RBI',
    goal: 'Public Sector Banking & Finance',
    positions: 'Probationary Officer (PO), Clerk, RBI Grade B',
    authorityLevel: 'Officer Grade - Financial Authority',
    postingLevel: 'Bank Branches (National)',
    description: 'Recruitment for Public Sector Banks (PSBs) like SBI, PNB, BoB, and regulatory bodies like RBI. Known for speed-based exams focusing on Math, Reasoning, and English.',
    examsList: [
      { name: 'IBPS PO', fullName: 'Probationary Officer', roles: 'Assistant Manager', tentativeDate: 'Oct 2026', difficulty: 'Medium' },
      { name: 'SBI PO', fullName: 'State Bank PO', roles: 'Assistant Manager', tentativeDate: 'Nov 2026', difficulty: 'Hard' },
      { name: 'RBI Grade B', fullName: 'Reserve Bank Officer', roles: 'Managerial Roles', tentativeDate: 'July 2026', difficulty: 'Hard' },
      { name: 'IBPS Clerk', fullName: 'Clerical Cadre', roles: 'Bank Clerk', tentativeDate: 'Aug 2026', difficulty: 'Easy' }
    ]
  },
  {
    id: 'rrb',
    name: 'Railways',
    fullForm: 'Railway Recruitment Board (RRB)',
    goal: 'Indian Railways Operations',
    positions: 'Station Master, Loco Pilot, JE',
    authorityLevel: 'Operational Authority',
    postingLevel: 'Railway Zones',
    description: 'Handles the massive workforce recruitment for Indian Railways, the largest employer in India. Roles range from technical to non-technical operational posts.',
    examsList: [
      { name: 'NTPC', fullName: 'Non-Technical Popular Categories', roles: 'Station Master, Ticket Collector', tentativeDate: 'TBA 2026', difficulty: 'Medium' },
      { name: 'ALP', fullName: 'Assistant Loco Pilot', roles: 'Train Driver', tentativeDate: 'TBA 2026', difficulty: 'Medium' },
      { name: 'Group D', fullName: 'Level 1 Posts', roles: 'Track Maintainer, Assistant', tentativeDate: 'TBA 2026', difficulty: 'Easy' },
      { name: 'RRB JE', fullName: 'Junior Engineer', roles: 'Workshop/Track Engineer', tentativeDate: 'TBA 2026', difficulty: 'Medium' }
    ]
  },
  {
    id: 'defense',
    name: 'Defense',
    fullForm: 'NDA / CDS / AFCAT',
    goal: 'Armed Forces (Army, Navy, Air Force)',
    positions: 'Lieutenant, Flying Officer, Captain',
    authorityLevel: 'Commissioned Officer - Military Leadership',
    postingLevel: 'Military Units',
    description: 'Direct entry into the Indian Armed Forces as Commissioned Officers. Involves written exams followed by a rigorous 5-day SSB (Services Selection Board) interview.',
    examsList: [
      { name: 'NDA', fullName: 'National Defence Academy', roles: '12th Pass Entry', tentativeDate: 'April 2026', difficulty: 'Medium' },
      { name: 'CDS', fullName: 'Combined Defence Services', roles: 'Graduate Entry', tentativeDate: 'April 2026', difficulty: 'Medium' },
      { name: 'AFCAT', fullName: 'Air Force Common Admission Test', roles: 'Flying/Technical Branch', tentativeDate: 'Feb 2026', difficulty: 'Medium' }
    ]
  },
  {
    id: 'teaching',
    name: 'Teaching',
    fullForm: 'UGC-NET / CTET',
    goal: 'Education & Academia',
    positions: 'Professor, Lecturer, School Teacher',
    authorityLevel: 'Academic Authority',
    postingLevel: 'Schools & Universities',
    description: 'Qualifying exams for becoming teachers in Central Government Schools (KVS, NVS) or Assistant Professors in Colleges/Universities.',
    examsList: [
      { name: 'UGC-NET', fullName: 'National Eligibility Test', roles: 'Asst Professor, PhD Fellowship', tentativeDate: 'June 2026', difficulty: 'Hard' },
      { name: 'CTET', fullName: 'Central Teacher Eligibility Test', roles: 'School Teacher (Class 1-8)', tentativeDate: 'July 2026', difficulty: 'Easy' }
    ]
  }
];

// --- STATE GOVERNANCE DATA ---

export const STATE_EXAM_GROUPS = [
  {
    name: "Group 1",
    label: "Elite / Gazetted",
    description: "Highest ranking officers in state, often called 'Mini-IAS'. Can be promoted to IAS/IPS.",
    positions: "Deputy Collector, DSP, Asst. Commissioner (Tax), District Registrar",
    selection: "Prelims → Mains → Interview",
    authority: "High Executive Powers (Gazetted)",
    difficulty: 'Hard'
  },
  {
    name: "Group 2",
    label: "Executive",
    description: "Middle-management positions supporting Group 1. Administrative and supervisory roles.",
    positions: "Municipal Commissioner (Gr II), Sub-Registrar, Revenue Inspector, ASO",
    selection: "2-3 Stages (Some have no interview)",
    authority: "Supervisory",
    difficulty: 'Medium'
  },
  {
    name: "Group 3",
    label: "Technical",
    description: "Specialized or technical roles managing specific units.",
    positions: "Station Fire Officer, Jr Inspector (Co-op), Store Keeper",
    selection: "1-2 Written Exams",
    authority: "Technical Operations",
    difficulty: 'Medium'
  },
  {
    name: "Group 4",
    label: "Entry Level",
    description: "Largest group. Focuses on day-to-day office operations.",
    positions: "VAO, Junior Assistant, Typist, Bill Collector",
    selection: "Single Written Exam (No Interview)",
    authority: "Support / Clerical",
    difficulty: 'Easy'
  }
];

export const LEADERSHIP_DATA = {
  states: [
    { state: "Andhra Pradesh", cm: "N. Chandrababu Naidu", gov: "S. Abdul Nazeer" },
    { state: "Arunachal Pradesh", cm: "Pema Khandu", gov: "Kaiwalya Trivikram Parnaik" },
    { state: "Assam", cm: "Himanta Biswa Sarma", gov: "Lakshman Prasad Acharya" },
    { state: "Bihar", cm: "Nitish Kumar", gov: "Arif Mohammed Khan" },
    { state: "Chhattisgarh", cm: "Vishnu Deo Sai", gov: "Ramen Deka" },
    { state: "Goa", cm: "Pramod Sawant", gov: "Ashok Gajapathi Raju" },
    { state: "Gujarat", cm: "Bhupendra Patel", gov: "Acharya Dev Vrat" },
    { state: "Haryana", cm: "Nayab Singh Saini", gov: "Ashim Kumar Ghosh" },
    { state: "Himachal Pradesh", cm: "Sukhvinder Singh Sukhu", gov: "Shiv Pratap Shukla" },
    { state: "Jharkhand", cm: "Hemant Soren", gov: "Santosh Kumar Gangwar" },
    { state: "Karnataka", cm: "Siddaramaiah", gov: "Thaawarchand Gehlot" },
    { state: "Kerala", cm: "Pinarayi Vijayan", gov: "Rajendra Vishwanath Arlekar" },
    { state: "Madhya Pradesh", cm: "Mohan Yadav", gov: "Mangubhai C. Patel" },
    { state: "Maharashtra", cm: "Devendra Fadnavis", gov: "Acharya Dev Vrat (Addl.)" },
    { state: "Manipur", cm: "President's Rule", gov: "Ajay Kumar Bhalla" },
    { state: "Meghalaya", cm: "Conrad Sangma", gov: "Chandrashekhar H. Vijayashankar" },
    { state: "Mizoram", cm: "Lalduhoma", gov: "Gen. V. K. Singh (Retd.)" },
    { state: "Nagaland", cm: "Neiphiu Rio", gov: "Ajay Kumar Bhalla (Addl.)" },
    { state: "Odisha", cm: "Mohan Charan Majhi", gov: "Hari Babu Kambhampati" },
    { state: "Punjab", cm: "Bhagwant Mann", gov: "Gulab Chand Kataria" },
    { state: "Rajasthan", cm: "Bhajan Lal Sharma", gov: "Haribhau Kisanrao Bagde" },
    { state: "Sikkim", cm: "Prem Singh Tamang", gov: "Om Prakash Mathur" },
    { state: "Tamil Nadu", cm: "M. K. Stalin", gov: "R. N. Ravi" },
    { state: "Telangana", cm: "Revanth Reddy", gov: "Jishnu Dev Varma" },
    { state: "Tripura", cm: "Manik Saha", gov: "Indra Sena Reddy Nallu" },
    { state: "Uttar Pradesh", cm: "Yogi Adityanath", gov: "Anandiben Patel" },
    { state: "Uttarakhand", cm: "Pushkar Singh Dhami", gov: "Lt. Gen. Gurmit Singh (Retd.)" },
    { state: "West Bengal", cm: "Mamata Banerjee", gov: "Dr. C. V. Ananda Bose" }
  ],
  // Standardized UT Data structure: { ut: string, head: string, admin: string }
  // For UTs without a CM, 'head' is labeled as 'N/A' or '-'
  uts: [
    { ut: "Andaman & Nicobar", head: "-", admin: "Admiral D.K. Joshi (LG)" },
    { ut: "Chandigarh", head: "-", admin: "Gulab Chand Kataria (Admin)" },
    { ut: "Dadra & Nagar Haveli and Daman & Diu", head: "-", admin: "Praful Patel (Admin)" },
    { ut: "Delhi (NCT)", head: "Rekha Gupta (CM)", admin: "V.K. Saxena (LG)" },
    { ut: "Jammu & Kashmir", head: "Omar Abdullah (CM)", admin: "Manoj Sinha (LG)" },
    { ut: "Ladakh", head: "-", admin: "Kavinder Gupta (LG)" },
    { ut: "Lakshadweep", head: "-", admin: "Praful Patel (Admin)" },
    { ut: "Puducherry", head: "N. Rangasamy (CM)", admin: "K. Kailashnathan (LG)" }
  ]
};
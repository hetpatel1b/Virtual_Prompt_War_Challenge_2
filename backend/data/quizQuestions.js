/**
 * Election Quiz Questions Bank
 *
 * 20 questions across 6 categories with 3 difficulty levels.
 * Each question includes the correct answer index, explanation, and source.
 */

const quizQuestions = [
  // ─── Voter Eligibility ────────────────────────────────
  {
    id: 'q_001',
    category: 'voter_eligibility',
    difficulty: 'easy',
    question: 'What is the minimum age to vote in India?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correctIndex: 1,
    explanation: 'The 61st Amendment Act of 1988 reduced the minimum voting age from 21 to 18 years. This applies to elections to the Lok Sabha and State Legislative Assemblies.',
    source: 'Constitution of India, Article 326; 61st Amendment Act, 1988',
  },
  {
    id: 'q_002',
    category: 'voter_eligibility',
    difficulty: 'medium',
    question: 'Can Non-Resident Indians (NRIs) vote in Indian elections?',
    options: [
      'No, only residents can vote',
      'Yes, through postal ballot only',
      'Yes, in person at their registered polling station',
      'Yes, through online voting',
    ],
    correctIndex: 2,
    explanation: 'NRIs can register as overseas electors under Section 20A of the Representation of the People Act (amended in 2010). They must vote in person at their assigned polling station in India. A proposal for postal voting for NRIs is under consideration.',
    source: 'Representation of the People (Amendment) Act, 2010',
  },
  {
    id: 'q_003',
    category: 'voter_eligibility',
    difficulty: 'medium',
    question: 'Which of the following persons CANNOT vote in Indian elections?',
    options: [
      'A person with physical disability',
      'A person in preventive detention',
      'A person serving a prison sentence',
      'An illiterate person',
    ],
    correctIndex: 2,
    explanation: 'Convicted prisoners are disqualified from voting during their period of imprisonment under Section 62(5) of the Representation of the People Act, 1951. However, persons in preventive detention can vote through postal ballot.',
    source: 'Representation of the People Act, 1951, Section 62(5)',
  },
  {
    id: 'q_004',
    category: 'voter_eligibility',
    difficulty: 'hard',
    question: 'What is the "qualifying date" for determining voter eligibility based on age?',
    options: [
      'The date of the election',
      'January 1 of the year of electoral roll revision',
      'The date of voter registration',
      'March 31 of the current year',
    ],
    correctIndex: 1,
    explanation: 'The qualifying date is January 1 of the year in which the electoral roll is being prepared or revised. A person must have attained 18 years of age on or before this date to be eligible.',
    source: 'Representation of the People Act, 1950, Section 14(b)',
  },

  // ─── Voter Registration ──────────────────────────────
  {
    id: 'q_005',
    category: 'registration',
    difficulty: 'easy',
    question: 'Which form is used for new voter registration in India?',
    options: ['Form 1', 'Form 6', 'Form 8', 'Form 10'],
    correctIndex: 1,
    explanation: 'Form 6 is used for new inclusion of name in the electoral roll. Form 8 is for corrections, Form 7 is for objections, and Form 8A is for transposition within the same constituency.',
    source: 'Registration of Electors Rules, 1960',
  },
  {
    id: 'q_006',
    category: 'registration',
    difficulty: 'easy',
    question: 'Where can you register as a voter online?',
    options: [
      'India.gov.in',
      'National Voters Service Portal (NVSP)',
      'Ministry of Home Affairs website',
      'PMO website',
    ],
    correctIndex: 1,
    explanation: 'The National Voters Service Portal (voters.eci.gov.in) is the official platform by the Election Commission of India for online voter registration, searching electoral rolls, and filing voter-related applications.',
    source: 'Election Commission of India, NVSP Portal',
  },
  {
    id: 'q_007',
    category: 'registration',
    difficulty: 'medium',
    question: 'What is the full form of EPIC?',
    options: [
      'Electronic Photo Identity Card',
      'Electors Photo Identity Card',
      'Election Participation Identity Card',
      'Electoral Process ID Certificate',
    ],
    correctIndex: 1,
    explanation: 'EPIC stands for Electors Photo Identity Card, commonly known as the Voter ID Card. It is issued by the Election Commission of India to all registered voters and serves as an identity proof at polling stations.',
    source: 'Election Commission of India',
  },

  // ─── Polling Process ──────────────────────────────────
  {
    id: 'q_008',
    category: 'polling_process',
    difficulty: 'easy',
    question: 'What technology is used for voting in Indian elections?',
    options: [
      'Paper ballots only',
      'Online voting',
      'Electronic Voting Machines (EVMs)',
      'Telephone voting',
    ],
    correctIndex: 2,
    explanation: 'India uses Electronic Voting Machines (EVMs) for elections. EVMs were first used in 1982 in Kerala and have been used nationwide since 2004. VVPAT (Voter Verifiable Paper Audit Trail) machines are attached to EVMs for transparency.',
    source: 'Election Commission of India',
  },
  {
    id: 'q_009',
    category: 'polling_process',
    difficulty: 'medium',
    question: 'What is VVPAT?',
    options: [
      'Voter Verification and Polling Authentication Technology',
      'Voter Verifiable Paper Audit Trail',
      'Virtual Voting and Paper Audit Terminal',
      'Verified Vote Paper Assessment Tool',
    ],
    correctIndex: 1,
    explanation: 'VVPAT (Voter Verifiable Paper Audit Trail) is a machine attached to an EVM that prints a slip showing the candidate name and symbol, allowing the voter to verify their vote was recorded correctly. The slip is visible for 7 seconds before dropping into a sealed box.',
    source: 'Supreme Court of India directive, 2013; Conduct of Elections Rules',
  },
  {
    id: 'q_010',
    category: 'polling_process',
    difficulty: 'medium',
    question: 'What is the "silence period" before an election?',
    options: [
      '24 hours before polling when no campaigning is allowed',
      '48 hours before polling when no campaigning is allowed',
      '72 hours before polling when no campaigning is allowed',
      '1 week before polling when no campaigning is allowed',
    ],
    correctIndex: 1,
    explanation: 'Electioneering and campaigning must cease 48 hours before the close of polling under Section 126 of the Representation of the People Act, 1951. This "silence period" allows voters to make their choices free from campaign pressure.',
    source: 'Representation of the People Act, 1951, Section 126',
  },
  {
    id: 'q_011',
    category: 'polling_process',
    difficulty: 'hard',
    question: 'How many votes can a single EVM record?',
    options: ['1000 votes', '1500 votes', '2000 votes', '3840 votes'],
    correctIndex: 3,
    explanation: 'A single EVM can record up to 3840 votes (64 candidates × 60 votes per candidate in the ballot unit). However, practically, an EVM is assigned to a polling station with about 1000-1500 voters.',
    source: 'Election Commission of India technical specifications',
  },

  // ─── Vote Counting ────────────────────────────────────
  {
    id: 'q_012',
    category: 'vote_counting',
    difficulty: 'easy',
    question: 'What happens first during counting — EVM votes or postal ballots?',
    options: [
      'EVM votes are counted first',
      'Postal ballots are counted first',
      'Both are counted simultaneously',
      'It depends on the constituency',
    ],
    correctIndex: 1,
    explanation: 'Postal ballots are counted first before the counting of EVM votes begins. This is as per the Election Commission\'s guidelines. Postal ballots include votes by service personnel, persons on election duty, and absentee voters.',
    source: 'ECI Guidelines for Counting of Votes',
  },
  {
    id: 'q_013',
    category: 'vote_counting',
    difficulty: 'medium',
    question: 'In how many randomly selected booths per assembly segment are VVPAT slips physically counted?',
    options: ['1 booth', '3 booths', '5 booths', '10 booths'],
    correctIndex: 2,
    explanation: 'The Supreme Court mandated in June 2019 that VVPAT paper slips of 5 randomly selected polling stations per assembly segment must be matched with the EVM count to ensure integrity.',
    source: 'Supreme Court order in N. Chandrababu Naidu vs Union of India, 2019',
  },
  {
    id: 'q_014',
    category: 'vote_counting',
    difficulty: 'hard',
    question: 'What does NOTA stand for, and when was it introduced?',
    options: [
      'None of the Above — 2009',
      'None of the Above — 2013',
      'Not Our Type of Administration — 2014',
      'National Option for Transparent Assessment — 2011',
    ],
    correctIndex: 1,
    explanation: 'NOTA (None of the Above) was introduced following the Supreme Court judgment in PUCL vs Union of India (2013). It allows voters to express their disapproval of all contesting candidates. However, NOTA votes do not affect the outcome — the candidate with the most votes still wins.',
    source: 'Supreme Court ruling in PUCL vs Union of India, September 2013',
  },

  // ─── Election Commission ──────────────────────────────
  {
    id: 'q_015',
    category: 'election_commission',
    difficulty: 'easy',
    question: 'Under which article of the Indian Constitution is the Election Commission established?',
    options: ['Article 280', 'Article 312', 'Article 324', 'Article 356'],
    correctIndex: 2,
    explanation: 'Article 324 of the Indian Constitution vests the superintendence, direction, and control of elections to Parliament, state legislatures, and the offices of the President and Vice President in the Election Commission of India.',
    source: 'Constitution of India, Article 324',
  },
  {
    id: 'q_016',
    category: 'election_commission',
    difficulty: 'medium',
    question: 'How can the Chief Election Commissioner be removed from office?',
    options: [
      'By the President on advice of the Prime Minister',
      'By a no-confidence motion in Parliament',
      'Through the same procedure as a Supreme Court judge (impeachment)',
      'By the Election Commission itself',
    ],
    correctIndex: 2,
    explanation: 'The Chief Election Commissioner can only be removed from office through impeachment — the same procedure as removing a Supreme Court judge (proved misbehavior or incapacity, with a two-thirds majority in both Houses of Parliament). This ensures the CEC\'s independence.',
    source: 'Constitution of India, Article 324(5)',
  },
  {
    id: 'q_017',
    category: 'election_commission',
    difficulty: 'hard',
    question: 'When is National Voters\' Day celebrated, and why?',
    options: [
      'August 15 — Independence Day',
      'January 25 — Foundation day of the Election Commission',
      'January 26 — Republic Day',
      'October 2 — Gandhi Jayanti',
    ],
    correctIndex: 1,
    explanation: 'National Voters\' Day is celebrated on January 25 every year since 2011, marking the founding day of the Election Commission of India (established on January 25, 1950). The day is dedicated to encouraging voter awareness and participation.',
    source: 'Election Commission of India',
  },

  // ─── Democracy & Rights ────────────────────────────────
  {
    id: 'q_018',
    category: 'democracy_rights',
    difficulty: 'easy',
    question: 'India is described as what type of government in its Constitution?',
    options: [
      'Sovereign Democratic Republic',
      'Sovereign Socialist Secular Democratic Republic',
      'Federal Democratic Republic',
      'Parliamentary Democratic Monarchy',
    ],
    correctIndex: 1,
    explanation: 'The Preamble of the Indian Constitution declares India as a "Sovereign Socialist Secular Democratic Republic." The words "Socialist" and "Secular" were added by the 42nd Amendment in 1976.',
    source: 'Preamble to the Constitution of India; 42nd Amendment Act, 1976',
  },
  {
    id: 'q_019',
    category: 'democracy_rights',
    difficulty: 'medium',
    question: 'What is "Universal Adult Suffrage"?',
    options: [
      'Only educated adults can vote',
      'Only taxpayers can vote',
      'Every adult citizen has the right to vote regardless of caste, creed, religion, or gender',
      'Only property owners can vote',
    ],
    correctIndex: 2,
    explanation: 'Universal Adult Suffrage means that every adult citizen has the right to vote without discrimination based on caste, creed, religion, gender, economic status, or education. India adopted this principle from its very first election in 1951-52.',
    source: 'Constitution of India, Article 326',
  },
  {
    id: 'q_020',
    category: 'democracy_rights',
    difficulty: 'hard',
    question: 'Who was the first Chief Election Commissioner of India?',
    options: [
      'Dr. B.R. Ambedkar',
      'Sukumar Sen',
      'T.N. Seshan',
      'Rajiv Kumar',
    ],
    correctIndex: 1,
    explanation: 'Sukumar Sen was the first Chief Election Commissioner of India, serving from 1950 to 1958. He is credited with successfully conducting India\'s first two general elections (1951-52 and 1957), which was a massive logistical feat for a newly independent nation.',
    source: 'Election Commission of India archives',
  },
];

/**
 * Get all quiz questions.
 * @returns {Array} All questions
 */
function getAllQuestions() {
  return quizQuestions;
}

/**
 * Get questions filtered by category and/or difficulty.
 *
 * @param {object} options - Filter options
 * @param {string} [options.category] - Category to filter by
 * @param {string} [options.difficulty] - Difficulty to filter by
 * @param {number} [options.count=10] - Number of questions to return
 * @returns {Array} Filtered and randomized questions
 */
function getFilteredQuestions({ category, difficulty, count = 10 } = {}) {
  let filtered = [...quizQuestions];

  if (category) {
    filtered = filtered.filter((q) => q.category === category);
  }

  if (difficulty) {
    filtered = filtered.filter((q) => q.difficulty === difficulty);
  }

  // Shuffle using Fisher-Yates algorithm
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  return filtered.slice(0, Math.min(count, filtered.length));
}

/**
 * Get a single question by ID.
 *
 * @param {string} questionId - The question ID
 * @returns {object|null} The question or null
 */
function getQuestionById(questionId) {
  return quizQuestions.find((q) => q.id === questionId) || null;
}

/**
 * Get available categories with their question counts.
 *
 * @returns {Array<{category: string, count: number}>}
 */
function getCategories() {
  const categoryMap = {};
  quizQuestions.forEach((q) => {
    categoryMap[q.category] = (categoryMap[q.category] || 0) + 1;
  });
  return Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
  }));
}

module.exports = {
  getAllQuestions,
  getFilteredQuestions,
  getQuestionById,
  getCategories,
};

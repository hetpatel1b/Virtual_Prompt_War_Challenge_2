/**
 * Demo Service — Pre-built Responses
 *
 * Provides curated election education responses when no Gemini API key
 * is configured. Uses keyword matching to select the most relevant
 * pre-built response.
 */

const logger = require('../config/logger');

/**
 * Pre-built responses covering common election education topics.
 */
const DEMO_RESPONSES = {
  voting_eligibility: {
    summary: 'In India, every citizen who has attained the age of 18 years on the qualifying date is eligible to vote, provided they are registered in the electoral roll.',
    steps: [
      'You must be a citizen of India.',
      'You must have attained the age of 18 years on the qualifying date (January 1 of the year of revision).',
      'You must be a resident of the constituency where you wish to vote.',
      'You must not be disqualified under any law (e.g., unsound mind, corrupt practices).',
      'You must be registered in the electoral roll of your constituency.',
    ],
    bullets: [
      'Minimum voting age in India is 18 years (61st Amendment, 1988)',
      'NRIs can also vote if registered under Section 20A of the RP Act',
      'No educational qualification is required to vote',
      'Persons in preventive detention can vote through postal ballot',
      'Convicted prisoners cannot vote during the period of imprisonment',
    ],
    examples: [
      'A college student turning 18 before January 1 of the revision year can register and vote in elections held that year.',
      'An Indian citizen working abroad can register as an overseas elector and vote at their assigned polling station when visiting India.',
    ],
    relatedTopics: ['Voter Registration Process', 'Electoral Roll', 'Voter ID Card (EPIC)', 'Types of Elections in India'],
  },

  voter_registration: {
    summary: 'Voter registration in India is done through the Election Commission using Form 6. You can register online through the NVSP portal or offline at your local Electoral Registration Officer.',
    steps: [
      'Check if you are already registered on the NVSP portal (voters.eci.gov.in).',
      'If not registered, fill Form 6 (Application for Inclusion of Name in Electoral Roll).',
      'Submit online through NVSP or the Voter Helpline App, or submit offline at your local ERO office.',
      'Attach required documents: age proof, address proof, and passport-size photograph.',
      'A Booth Level Officer (BLO) may visit your address for verification.',
      'Once verified, your name will be included in the electoral roll and you will receive your Voter ID card (EPIC).',
    ],
    bullets: [
      'Registration can be done online at voters.eci.gov.in',
      'Form 6 is for new registration; Form 8 is for corrections',
      'The Voter Helpline App makes registration easy on mobile',
      'You can check your registration status by SMS: EPIC <Voter ID> to 1950',
      'Registration is free of cost',
    ],
    examples: [
      'A newly turned 18-year-old fills Form 6 online, uploads their Aadhaar card as age proof, and receives their EPIC within 30 days.',
    ],
    relatedTopics: ['Voter ID Card', 'NVSP Portal', 'Booth Level Officer', 'Electoral Roll Revision'],
  },

  election_process: {
    summary: 'The election process in India follows a systematic procedure managed by the Election Commission of India, from announcement of dates to declaration of results.',
    steps: [
      'Election Commission announces election dates and schedule.',
      'Model Code of Conduct comes into effect immediately.',
      'Candidates file their nominations with the Returning Officer.',
      'Scrutiny of nominations takes place and invalid nominations are rejected.',
      'Campaign period begins — candidates and parties campaign for votes.',
      'Campaigning ends 48 hours before polling (silence period).',
      'Voting takes place on the designated polling day using EVMs.',
      'Votes are counted on the designated counting day.',
      'Results are declared and winning candidates are announced.',
    ],
    bullets: [
      'India uses Electronic Voting Machines (EVMs) with VVPAT for transparency',
      'The Model Code of Conduct regulates party and candidate behavior',
      'Counting is done under strict supervision of election observers',
      'Results are available in real-time on the ECI website',
      'The entire process is overseen by the Election Commission of India',
    ],
    examples: [
      'In the 2024 Lok Sabha elections, over 640 million voters participated across 7 phases of polling.',
      'The Election Commission deployed over 5.5 million EVMs with VVPAT units for vote verification.',
    ],
    relatedTopics: ['Electronic Voting Machine', 'Model Code of Conduct', 'Election Commission', 'VVPAT'],
  },

  evm: {
    summary: 'Electronic Voting Machines (EVMs) are portable electronic devices used for recording votes in Indian elections. They are designed to be tamper-proof and make the voting process faster and more accurate.',
    steps: [
      'The EVM consists of two units: the Control Unit (with the presiding officer) and the Ballot Unit (in the voting compartment).',
      'The voter enters the voting compartment and finds the Ballot Unit with candidate names and party symbols.',
      'The voter presses the blue button next to their chosen candidate.',
      'A beep sound confirms the vote has been recorded.',
      'The VVPAT machine attached to the EVM displays a paper slip with the candidate name and symbol for 7 seconds.',
      'The paper slip drops into a sealed VVPAT box for potential verification.',
    ],
    bullets: [
      'EVMs were first used in 1982 in the Kerala assembly election (Paravur constituency)',
      'Each EVM can record up to 2000 votes',
      'EVMs run on battery power, so elections can happen even without electricity',
      'VVPAT was mandated by the Supreme Court in 2013',
      'EVMs are manufactured only by BEL and ECIL (government companies)',
    ],
    examples: [
      'In the 2019 general elections, approximately 1.74 million EVMs with VVPAT were used across the country.',
    ],
    relatedTopics: ['VVPAT', 'Vote Counting', 'Election Commission', 'Polling Booth Procedures'],
  },

  democracy: {
    summary: 'Democracy is a system of government where power is vested in the people, who exercise it directly or through elected representatives. India is the largest democracy in the world.',
    steps: [],
    bullets: [
      'Democracy comes from Greek words "demos" (people) and "kratos" (rule)',
      'India adopted democratic governance with its Constitution on January 26, 1950',
      'Key features: universal adult franchise, fundamental rights, separation of powers',
      'India follows a parliamentary form of democracy',
      'Elections are the cornerstone of democratic governance',
      'The Preamble declares India a sovereign, socialist, secular, democratic republic',
    ],
    examples: [
      'India conducts the world\'s largest democratic exercise during general elections, with over 900 million eligible voters.',
      'The Panchayati Raj system extends democracy to the grassroots level in rural India.',
    ],
    relatedTopics: ['Types of Democracy', 'Indian Constitution', 'Fundamental Rights', 'Parliamentary System'],
  },

  election_commission: {
    summary: 'The Election Commission of India (ECI) is an autonomous constitutional body responsible for administering elections in India. It was established on January 25, 1950.',
    steps: [
      'The ECI is established under Article 324 of the Indian Constitution.',
      'It consists of the Chief Election Commissioner (CEC) and two Election Commissioners.',
      'The President of India appoints the CEC and Election Commissioners.',
      'The ECI prepares and maintains electoral rolls.',
      'It schedules and supervises elections to Parliament and state legislatures.',
      'It enforces the Model Code of Conduct during elections.',
      'It grants recognition to political parties and allots election symbols.',
    ],
    bullets: [
      'The ECI is a constitutional body under Article 324',
      'It functions independently of the executive branch',
      'The CEC can only be removed through impeachment (same as a Supreme Court judge)',
      'January 25 is celebrated as National Voters\' Day',
      'The ECI also oversees elections to the offices of the President and Vice President',
    ],
    examples: [
      'Sukumar Sen was the first Chief Election Commissioner who successfully conducted India\'s first general elections in 1951-52.',
      'T.N. Seshan is credited with reforming the electoral process and strictly enforcing the Model Code of Conduct in the 1990s.',
    ],
    relatedTopics: ['Model Code of Conduct', 'Electoral Reforms', 'Chief Election Commissioner', 'Political Parties'],
  },

  vote_counting: {
    summary: 'Vote counting in India is conducted under strict supervision. EVM votes are counted electronically on the designated counting day, and results are declared constituency by constituency.',
    steps: [
      'On counting day, EVMs are brought from secure strong rooms under heavy security.',
      'Counting agents from each candidate verify the seals on the EVMs.',
      'The Returning Officer opens the strong room in the presence of candidates\' agents.',
      'EVMs are placed on counting tables and results are displayed round by round.',
      'VVPAT slips of randomly selected 5 booths per assembly segment are physically verified.',
      'After all rounds, the Returning Officer tallies the totals.',
      'The candidate with the highest votes is declared the winner.',
      'Results are communicated to the Election Commission and declared publicly.',
    ],
    bullets: [
      'Counting typically begins at 8 AM on the counting day',
      'VVPAT verification of 5 random booths per assembly segment was mandated by the Supreme Court',
      'Postal ballots are counted first before EVM counting begins',
      'Results are available in real-time on the ECI results website',
      'Recounting can be demanded by a candidate under specific circumstances',
    ],
    examples: [
      'In a typical Lok Sabha constituency, counting involves 1500-2000 EVMs processed across multiple rounds through the day.',
    ],
    relatedTopics: ['EVM', 'VVPAT Verification', 'Returning Officer', 'Election Results'],
  },

  why_voting_matters: {
    summary: 'Voting is the most fundamental right in a democracy. It gives citizens the power to choose their representatives, influence policies, and hold the government accountable.',
    steps: [],
    bullets: [
      'Voting is a fundamental right guaranteed under Article 326 of the Indian Constitution',
      'Every vote counts — many elections have been decided by very narrow margins',
      'Voting ensures representation of all sections of society',
      'Higher voter turnout strengthens democratic legitimacy',
      'Non-voting allows a minority to make decisions for the majority',
      'Voting is a civic duty that shapes the future of the nation',
    ],
    examples: [
      'In several Indian constituencies, elections have been won by margins as small as 1-2 votes, proving that every vote matters.',
      'NOTA (None of the Above) option, introduced in 2013, allows voters to express dissatisfaction without abstaining.',
    ],
    relatedTopics: ['Voter Turnout', 'NOTA', 'Right to Vote', 'Civic Responsibility'],
  },

  types_of_elections: {
    summary: 'India conducts multiple types of elections at different levels of governance — from local Panchayat elections to the national Lok Sabha elections.',
    steps: [],
    bullets: [
      'Lok Sabha Elections (General Elections) — elects members of the lower house of Parliament',
      'Rajya Sabha Elections — indirect election by state legislators for the upper house',
      'State Assembly Elections (Vidhan Sabha) — elects members of state legislatures',
      'Local Body Elections — Panchayat, Municipality, and Corporation elections',
      'By-Elections — held when a seat falls vacant mid-term',
      'Presidential and Vice-Presidential Elections — indirect elections by an electoral college',
    ],
    examples: [
      'Lok Sabha elections are held every 5 years; the most recent was in 2024.',
      'Panchayat elections ensure democratic governance at the village level, covering over 250,000 Panchayats.',
    ],
    relatedTopics: ['Lok Sabha', 'Rajya Sabha', 'Panchayati Raj', 'Electoral College'],
  },

  fair_elections: {
    summary: 'Fair elections are the cornerstone of democracy. The Election Commission of India employs numerous measures to ensure free, fair, and transparent elections.',
    steps: [
      'The Model Code of Conduct restricts government announcements and party behavior during elections.',
      'Independent Election Observers are deployed in every constituency.',
      'EVMs with VVPAT provide tamper-proof and verifiable voting.',
      'Expenditure observers monitor campaign spending limits.',
      'C-VIGIL app allows citizens to report election violations in real-time.',
      'Media monitoring committees track political advertisements.',
      'Strict security arrangements with Central Armed Police Forces at polling stations.',
    ],
    bullets: [
      'VVPAT provides a paper trail for vote verification',
      'Expenditure monitoring ensures a level playing field',
      'C-VIGIL app empowers citizens to report violations',
      'Multiple levels of observers ensure transparency',
      'The judiciary can hear election petitions and order re-elections if malpractice is proven',
    ],
    examples: [
      'The C-VIGIL app, launched by ECI, allows citizens to report Model Code violations by uploading photos/videos, with a resolution guaranteed within 100 minutes.',
    ],
    relatedTopics: ['Model Code of Conduct', 'Election Observers', 'C-VIGIL App', 'Electoral Reforms'],
  },
};

/**
 * Pre-built scenario simulations.
 */
const DEMO_SCENARIOS = {
  no_majority: {
    scenario: 'No single party or pre-election alliance secures a majority of seats in the Lok Sabha.',
    analysis: 'This results in a "hung parliament" where coalition-building becomes necessary to form the government.',
    steps: [
      { step: 1, title: 'Election Results Declared', description: 'The Election Commission declares results showing no party has crossed the halfway mark (272 seats in the 545-member Lok Sabha).' },
      { step: 2, title: 'Governor/President Invites', description: 'The President invites the leader of the single largest party or the pre-election alliance to form the government.' },
      { step: 3, title: 'Coalition Negotiations', description: 'Parties negotiate alliances and support. Post-election coalitions are formed through letters of support.' },
      { step: 4, title: 'Stake Claim', description: 'The leader who can demonstrate majority support (272+ seats) presents letters of support to the President.' },
      { step: 5, title: 'Floor Test', description: 'The appointed PM must prove majority on the floor of the Lok Sabha within a specified timeframe.' },
      { step: 6, title: 'Government Formation or Fresh Elections', description: 'If the floor test is passed, the government is formed. If no one can prove majority, fresh elections may be called.' },
    ],
    outcome: 'Either a coalition government is formed, or if no one proves majority, the President may dissolve the Lok Sabha and call fresh elections.',
    constitutionalBasis: 'Article 75(1) — PM appointed by President. Article 75(3) — Council of Ministers collectively responsible to Lok Sabha. Sarkaria Commission recommendations on hung parliaments.',
    historicalPrecedent: 'In 1996, the BJP under Vajpayee formed the government as the largest party but resigned after 13 days when unable to prove majority. Subsequently, the United Front coalition formed the government.',
  },

  candidate_death: {
    scenario: 'A candidate dies after the publication of the list of contesting candidates but before the poll.',
    analysis: 'Section 52 of the Representation of the People Act, 1951 provides for this contingency.',
    steps: [
      { step: 1, title: 'Death Reported', description: 'The death of the contesting candidate is officially reported to the Returning Officer.' },
      { step: 2, title: 'Election Countermanded', description: 'The Returning Officer reports to the Election Commission, which countermands (cancels) the poll in that constituency.' },
      { step: 3, title: 'Fresh Notification', description: 'The Election Commission issues a fresh notification for election in that constituency.' },
      { step: 4, title: 'New Nominations', description: 'Fresh nominations are called. The deceased candidate\'s party can nominate a new candidate.' },
      { step: 5, title: 'Re-election', description: 'The election process restarts from the nomination stage for that constituency only.' },
    ],
    outcome: 'The election in that particular constituency is countermanded and held afresh. Elections in other constituencies proceed as scheduled.',
    constitutionalBasis: 'Section 52 of the Representation of the People Act, 1951. Note: This only applies if the deceased was a "contesting candidate" — not withdrawn.',
    historicalPrecedent: 'This provision has been invoked multiple times in state and national elections when candidates have passed away during the election process.',
  },

  evm_malfunction: {
    scenario: 'Electronic Voting Machines (EVMs) malfunction at a polling station during voting.',
    analysis: 'The Election Commission has strict protocols for handling EVM malfunctions to ensure no voter is disenfranchised.',
    steps: [
      { step: 1, title: 'Malfunction Identified', description: 'The presiding officer identifies the EVM malfunction — the machine may fail to record votes, show errors, or stop working.' },
      { step: 2, title: 'Replacement EVM', description: 'A reserve EVM (kept at the constituency level) is brought to the polling station. Every constituency maintains reserve machines.' },
      { step: 3, title: 'Documentation', description: 'The presiding officer documents the malfunction, noting the time, nature of issue, and votes already recorded.' },
      { step: 4, title: 'Voting Resumes', description: 'Voting continues with the replacement EVM. All votes already recorded on the malfunctioned EVM remain valid.' },
      { step: 5, title: 'Extended Hours', description: 'If the malfunction caused significant delay, the Election Commission may extend voting hours at that station.' },
      { step: 6, title: 'Counting Both EVMs', description: 'During counting, votes from both the original (malfunctioned) and replacement EVMs are counted together for that polling station.' },
    ],
    outcome: 'Voting continues with a replacement EVM. All votes from both machines are counted. If the malfunction affected a significant number of voters, a re-poll may be ordered for that station.',
    constitutionalBasis: 'Section 58A of the Representation of the People Act, 1951 and Rules 49MA-49MC of the Conduct of Elections Rules, 1961.',
    historicalPrecedent: 'EVM replacements are routine in every election. In rare cases, re-polls have been ordered when malfunctions prevented a significant number of voters from casting their votes.',
  },

  hung_parliament: {
    scenario: 'After a general election, no single party or pre-election coalition has enough seats to form a majority government, resulting in a hung parliament.',
    analysis: 'A hung parliament creates a complex political situation where multiple parties must negotiate to form a stable government.',
    steps: [
      { step: 1, title: 'Results Analysis', description: 'The Election Commission certifies results showing fragmented mandate with no clear majority (272 seats needed in 545-member Lok Sabha).' },
      { step: 2, title: 'Presidential Discretion', description: 'The President uses discretion to invite the leader most likely to command majority. Conventions and Sarkaria Commission guidelines apply.' },
      { step: 3, title: 'Government Formation Attempts', description: 'The invited leader attempts to gather support from other parties through coalition agreements or outside support.' },
      { step: 4, title: 'Trust Vote', description: 'The PM-designate must prove majority through a floor test in the Lok Sabha within the timeframe set by the President.' },
      { step: 5, title: 'Alternative Combinations', description: 'If the first attempt fails, the President may invite other leaders or combinations to try forming the government.' },
      { step: 6, title: 'Last Resort', description: 'If no stable government can be formed, the President may dissolve the Lok Sabha under Article 85(2) and call fresh elections.' },
    ],
    outcome: 'Most likely, a coalition government or minority government with outside support is formed. In rare cases, fresh elections may be called.',
    constitutionalBasis: 'Articles 74, 75, and 85 of the Indian Constitution. Sarkaria Commission (1983) and Punchhi Commission (2010) recommendations on handling hung assemblies.',
    historicalPrecedent: 'India has experienced several hung parliaments — 1989 (V.P. Singh), 1996 (Vajpayee/United Front), 1998, and 2004 saw coalition formations after no single party got majority.',
  },
};

/**
 * Keywords → topic mapping for matching user questions.
 */
const KEYWORD_MAP = [
  { keywords: ['eligible', 'eligibility', 'who can vote', 'age', 'qualify', 'requirement'], topic: 'voting_eligibility' },
  { keywords: ['register', 'registration', 'enroll', 'enrol', 'form 6', 'nvsp', 'voter id', 'epic'], topic: 'voter_registration' },
  { keywords: ['process', 'how election', 'election work', 'conduct', 'procedure', 'stages'], topic: 'election_process' },
  { keywords: ['evm', 'electronic voting', 'voting machine', 'vvpat'], topic: 'evm' },
  { keywords: ['democracy', 'democratic', 'republic'], topic: 'democracy' },
  { keywords: ['commission', 'eci', 'election body', 'chief election'], topic: 'election_commission' },
  { keywords: ['counting', 'count votes', 'tallying', 'results'], topic: 'vote_counting' },
  { keywords: ['why vote', 'importance', 'why voting', 'matters', 'civic duty', 'responsibility'], topic: 'why_voting_matters' },
  { keywords: ['types', 'kind of election', 'lok sabha', 'rajya sabha', 'panchayat', 'assembly'], topic: 'types_of_elections' },
  { keywords: ['fair', 'transparent', 'free and fair', 'rigging', 'malpractice'], topic: 'fair_elections' },
];

/**
 * Keywords → scenario mapping.
 */
const SCENARIO_KEYWORD_MAP = [
  { keywords: ['no majority', 'nobody wins', 'no clear winner', 'no candidate gets majority'], topic: 'no_majority' },
  { keywords: ['candidate dies', 'death', 'passes away', 'candidate death'], topic: 'candidate_death' },
  { keywords: ['malfunction', 'evm', 'machine', 'break', 'fail', 'technical'], topic: 'evm_malfunction' },
  { keywords: ['hung', 'parliament', 'no government', 'coalition'], topic: 'hung_parliament' },
];

/**
 * Match a user prompt to the best pre-built response.
 *
 * @param {string} prompt - User's question
 * @returns {object} Best matching response
 */
function getResponse(prompt) {
  const lower = prompt.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const { keywords, topic } of KEYWORD_MAP) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  if (bestMatch && DEMO_RESPONSES[bestMatch]) {
    logger.debug('Demo response matched', { topic: bestMatch, score: bestScore });
    return { ...DEMO_RESPONSES[bestMatch], _source: 'demo' };
  }

  // Default fallback response
  return {
    summary: 'Elections are the process by which citizens choose their representatives in a democracy. In India, elections are conducted by the Election Commission of India to ensure a free and fair process.',
    steps: [
      'Voter Registration — Citizens register themselves in the electoral roll.',
      'Candidate Nomination — Candidates file their nominations.',
      'Election Campaign — Parties and candidates campaign for votes.',
      'Polling Day — Registered voters cast their votes at polling stations.',
      'Vote Counting — Votes are counted and results are declared.',
    ],
    bullets: [
      'India is the world\'s largest democracy with over 900 million eligible voters',
      'The Election Commission of India is an autonomous constitutional body',
      'EVMs with VVPAT ensure transparent and tamper-proof voting',
      'Every Indian citizen aged 18+ has the right to vote',
    ],
    examples: [],
    relatedTopics: ['Voter Registration', 'Election Commission', 'Types of Elections', 'Voting Process'],
    _source: 'demo_default',
  };
}

/**
 * Match a scenario prompt to a pre-built scenario simulation.
 *
 * @param {string} scenario - User's scenario question
 * @returns {object} Scenario simulation response
 */
function getScenarioResponse(scenario) {
  const lower = scenario.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const { keywords, topic } of SCENARIO_KEYWORD_MAP) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  if (bestMatch && DEMO_SCENARIOS[bestMatch]) {
    logger.debug('Demo scenario matched', { topic: bestMatch, score: bestScore });
    return { ...DEMO_SCENARIOS[bestMatch], _source: 'demo' };
  }

  // Default scenario fallback
  return {
    scenario: scenario,
    analysis: 'This is an interesting election scenario. Let me walk you through the likely constitutional and procedural steps.',
    steps: [
      { step: 1, title: 'Identify the Issue', description: 'The Election Commission or relevant authority identifies the situation and assesses its impact on the electoral process.' },
      { step: 2, title: 'Constitutional Provisions', description: 'Relevant articles of the Indian Constitution and provisions of the Representation of the People Act are consulted.' },
      { step: 3, title: 'Advisory & Decision', description: 'The Election Commission, in consultation with legal experts, makes a decision on how to proceed.' },
      { step: 4, title: 'Implementation', description: 'The decision is implemented with full transparency, and all stakeholders (candidates, parties, voters) are informed.' },
      { step: 5, title: 'Legal Recourse', description: 'Aggrieved parties may approach the High Court or Supreme Court through election petitions.' },
    ],
    outcome: 'The matter would be resolved through established constitutional and legal mechanisms, ensuring the integrity of the democratic process.',
    constitutionalBasis: 'Articles 324-329 of the Indian Constitution and the Representation of the People Act, 1951.',
    historicalPrecedent: 'India\'s robust constitutional framework has provisions for handling various electoral contingencies.',
    _source: 'demo_default',
  };
}

module.exports = {
  getResponse,
  getScenarioResponse,
  DEMO_RESPONSES,
  DEMO_SCENARIOS,
};

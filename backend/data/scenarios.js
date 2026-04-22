/**
 * Pre-built Scenario Prompts for the Scenario Simulator
 *
 * These are example scenarios that users can click to auto-fill
 * the scenario simulator input.
 */

const scenarios = [
  {
    id: 'scenario_001',
    title: 'No Clear Majority',
    description: 'What happens when no party wins enough seats?',
    prompt: 'What happens if no candidate or party gets a majority of seats in the Lok Sabha elections?',
    category: 'government_formation',
    difficulty: 'medium',
  },
  {
    id: 'scenario_002',
    title: 'Candidate Passes Away',
    description: 'What if a candidate dies before polling?',
    prompt: 'What happens if a candidate dies after nominations are filed but before the voting day?',
    category: 'election_process',
    difficulty: 'medium',
  },
  {
    id: 'scenario_003',
    title: 'EVM Malfunction',
    description: 'What if voting machines stop working?',
    prompt: 'What happens if EVMs malfunction at a polling station during voting?',
    category: 'polling',
    difficulty: 'easy',
  },
  {
    id: 'scenario_004',
    title: 'Hung Parliament',
    description: 'How is government formed without majority?',
    prompt: 'What happens when there is a hung parliament and no party can form government on its own?',
    category: 'government_formation',
    difficulty: 'hard',
  },
  {
    id: 'scenario_005',
    title: 'Election Tie',
    description: 'What if two candidates get equal votes?',
    prompt: 'What happens if two candidates receive the exact same number of votes in a constituency?',
    category: 'vote_counting',
    difficulty: 'medium',
  },
  {
    id: 'scenario_006',
    title: 'Booth Capturing',
    description: 'What if a polling booth is captured?',
    prompt: 'What happens if there is booth capturing or electoral fraud at a polling station?',
    category: 'election_integrity',
    difficulty: 'medium',
  },
  {
    id: 'scenario_007',
    title: 'By-Election Trigger',
    description: 'When are by-elections conducted?',
    prompt: 'What happens if an elected MP or MLA dies or resigns during their term?',
    category: 'election_process',
    difficulty: 'easy',
  },
  {
    id: 'scenario_008',
    title: 'No-Confidence Motion',
    description: 'What if the government loses trust?',
    prompt: 'What happens if a no-confidence motion is passed against the ruling government?',
    category: 'government_formation',
    difficulty: 'hard',
  },
];

/**
 * Get all pre-built scenarios.
 * @returns {Array} All scenarios
 */
function getAllScenarios() {
  return scenarios;
}

/**
 * Get a scenario by ID.
 * @param {string} id - Scenario ID
 * @returns {object|null}
 */
function getScenarioById(id) {
  return scenarios.find((s) => s.id === id) || null;
}

module.exports = { getAllScenarios, getScenarioById };

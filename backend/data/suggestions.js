/**
 * Suggested Questions for the AI Chat Assistant
 *
 * Curated questions organized by category to help users
 * discover what they can ask the election education assistant.
 */

const suggestions = [
  {
    category: 'Getting Started',
    icon: '🗳️',
    questions: [
      'How do elections work in India?',
      'What is democracy and why is it important?',
      'Who can vote in Indian elections?',
      'What is the Election Commission of India?',
    ],
  },
  {
    category: 'Voter Registration',
    icon: '📝',
    questions: [
      'How do I register as a voter?',
      'What documents do I need for voter registration?',
      'How can I check if I am already registered?',
      'What is the NVSP portal?',
    ],
  },
  {
    category: 'Voting Process',
    icon: '🏛️',
    questions: [
      'What happens on voting day?',
      'How do Electronic Voting Machines (EVMs) work?',
      'What is VVPAT and why is it important?',
      'What is the silence period before elections?',
    ],
  },
  {
    category: 'Vote Counting & Results',
    icon: '📊',
    questions: [
      'How are votes counted in India?',
      'What is NOTA and how does it work?',
      'What happens if there is a tie between candidates?',
      'How long does vote counting take?',
    ],
  },
  {
    category: 'Election Knowledge',
    icon: '📚',
    questions: [
      'What are the different types of elections in India?',
      'What is the Model Code of Conduct?',
      'Why is voting important for democracy?',
      'What are the qualifications to become a candidate?',
    ],
  },
  {
    category: 'Advanced Topics',
    icon: '🎓',
    questions: [
      'What happens in a hung parliament?',
      'How does the anti-defection law work?',
      'What is the role of election observers?',
      'How are election symbols allotted to parties?',
    ],
  },
];

/**
 * Get all suggestion categories with questions.
 * @returns {Array} All suggestions
 */
function getAllSuggestions() {
  return suggestions;
}

/**
 * Get a flat list of all suggested questions.
 * @returns {Array<string>} All questions
 */
function getFlatQuestions() {
  return suggestions.flatMap((cat) => cat.questions);
}

module.exports = { getAllSuggestions, getFlatQuestions };

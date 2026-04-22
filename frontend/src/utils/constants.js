/* ── Route Paths ─────────────────────────────────────── */
export const ROUTES = {
  DASHBOARD: '/',
  ASSISTANT: '/assistant',
  TIMELINE: '/timeline',
  GUIDE: '/guide',
  KNOWLEDGE: '/knowledge',
  QUIZ: '/quiz',
  SIMULATOR: '/simulator',
};

/* ── API Endpoints ───────────────────────────────────── */
export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export const ENDPOINTS = {
  CHAT: `${API_BASE}/chat`,
  CHAT_SCENARIO: `${API_BASE}/chat/scenario`,
  CHAT_SUGGESTIONS: `${API_BASE}/chat/suggestions`,
  QUIZ_QUESTIONS: `${API_BASE}/quiz/questions`,
  QUIZ_SUBMIT: `${API_BASE}/quiz/submit`,
  QUIZ_LEADERBOARD: `${API_BASE}/quiz/leaderboard`,
  QUIZ_HISTORY: `${API_BASE}/quiz/history`,
  USER_PROFILE: `${API_BASE}/user/profile`,
  USER_PROGRESS: `${API_BASE}/user/progress`,
  HEALTH: `${API_BASE}/health`,
};

/* ── Navigation Items ────────────────────────────────── */
export const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: ROUTES.ASSISTANT, label: 'AI Assistant', icon: 'MessageSquare' },
  { path: ROUTES.TIMELINE, label: 'Election Timeline', icon: 'Clock' },
  { path: ROUTES.GUIDE, label: 'Voting Guide', icon: 'BookOpen' },
  { path: ROUTES.KNOWLEDGE, label: 'Knowledge Base', icon: 'Lightbulb' },
  { path: ROUTES.QUIZ, label: 'Quiz Challenge', icon: 'Trophy' },
  { path: ROUTES.SIMULATOR, label: 'Scenario Lab', icon: 'Zap' },
];

/* ── Election Facts ──────────────────────────────────── */
export const ELECTION_FACTS = [
  'India is the world\'s largest democracy with over 900 million eligible voters.',
  'The first general election in India was held in 1951-52, spanning 4 months.',
  'EVMs were first used in 1982 in the Kerala assembly election.',
  'The 61st Amendment (1988) reduced voting age from 21 to 18 years.',
  'January 25 is celebrated as National Voters\' Day since 2011.',
  'NOTA (None of the Above) was introduced in 2013 after a Supreme Court ruling.',
  'India uses over 1.7 million EVMs with VVPAT in general elections.',
  'The Election Commission of India was established on January 25, 1950.',
];

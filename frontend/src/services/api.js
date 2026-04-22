import axios from 'axios';
import { getIdToken } from './firebase';
import { ENDPOINTS } from '../utils/constants';

const client = axios.create({ timeout: 30000, headers: { 'Content-Type': 'application/json' } });

/* Attach auth token to every request when available */
client.interceptors.request.use(async (cfg) => {
  try {
    const token = await getIdToken();
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch { /* continue without token */ }
  return cfg;
});

/* Normalize error responses */
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(msg));
  },
);

/* ── Chat ────────────────────────────────────────────── */
export const sendChatMessage = (message) =>
  client.post(ENDPOINTS.CHAT, { message }).then((r) => r.data.data);

export const simulateScenario = (scenario) =>
  client.post(ENDPOINTS.CHAT_SCENARIO, { scenario }).then((r) => r.data.data);

export const getSuggestions = () =>
  client.get(ENDPOINTS.CHAT_SUGGESTIONS).then((r) => r.data.data);

/* ── Quiz ────────────────────────────────────────────── */
export const getQuizQuestions = (params) =>
  client.get(ENDPOINTS.QUIZ_QUESTIONS, { params }).then((r) => r.data.data);

export const submitQuizAnswers = (answers) =>
  client.post(ENDPOINTS.QUIZ_SUBMIT, { answers }).then((r) => r.data.data);

export const getLeaderboard = () =>
  client.get(ENDPOINTS.QUIZ_LEADERBOARD).then((r) => r.data.data);

/* ── User ────────────────────────────────────────────── */
export const getUserProfile = () =>
  client.get(ENDPOINTS.USER_PROFILE).then((r) => r.data.data);

export const updateUserProgress = (progress) =>
  client.put(ENDPOINTS.USER_PROGRESS, progress).then((r) => r.data.data);

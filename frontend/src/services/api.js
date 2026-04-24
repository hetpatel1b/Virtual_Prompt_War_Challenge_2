import axios from 'axios';
import { getIdToken } from './firebase';
import { ENDPOINTS } from '../utils/constants';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

/* Attach auth token to every request when available */
client.interceptors.request.use(async (cfg) => {
  try {
    const token = await getIdToken();
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch { /* continue without token */ }
  return cfg;
});

/* Normalize error responses — NO retry, NO hidden loops */
client.interceptors.response.use(
  (res) => {
    // Safety: if the response is HTML (e.g. Firebase Hosting 404), reject it
    const contentType = res.headers?.['content-type'] || '';
    if (contentType.includes('text/html') && !contentType.includes('json')) {
      return Promise.reject(new Error('API returned HTML instead of JSON. Check API_URL configuration.'));
    }
    return res;
  },
  (err) => {
    if (!err.response) {
      // Network error or CORS block
      return Promise.reject(new Error('Network error — unable to reach the server. Please check your connection.'));
    }

    // Surface rate-limit errors clearly
    if (err.response.status === 429) {
      return Promise.reject(new Error('Too many users. Please wait a moment before trying again.'));
    }
    
    if (err.response.status === 503) {
      return Promise.reject(new Error('AI busy. Please try again later.'));
    }

    const msg = err.response?.data?.error?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(msg));
  },
);

/* ── Chat ────────────────────────────────────────────── */
export const sendChatMessage = (message, signal) =>
  client.post(ENDPOINTS.CHAT, { message }, { signal }).then((r) => r.data?.data?.reply);

export const simulateScenario = (scenario) =>
  client.post(ENDPOINTS.CHAT_SCENARIO, { scenario }).then((r) => r.data?.data?.reply);

export const getSuggestions = () =>
  client.get(ENDPOINTS.CHAT_SUGGESTIONS).then((r) => r.data?.data ?? { suggestions: [], scenarios: [] });

/* ── Quiz ────────────────────────────────────────────── */
export const getQuizQuestions = (params) =>
  client.get(ENDPOINTS.QUIZ_QUESTIONS, { params }).then((r) => r.data?.data ?? {});

export const submitQuizAnswers = (answers) =>
  client.post(ENDPOINTS.QUIZ_SUBMIT, { answers }).then((r) => r.data?.data ?? {});

export const getLeaderboard = () =>
  client.get(ENDPOINTS.QUIZ_LEADERBOARD).then((r) => r.data?.data ?? {});

/* ── User ────────────────────────────────────────────── */
export const getUserProfile = () =>
  client.get(ENDPOINTS.USER_PROFILE).then((r) => r.data?.data ?? {});

export const updateUserProgress = (progress) =>
  client.put(ENDPOINTS.USER_PROGRESS, progress).then((r) => r.data?.data ?? {});

/* ── Health / Integration Status ─────────────────────── */
export const getHealthStatus = () =>
  client.get(ENDPOINTS.HEALTH).then((r) => r.data?.data ?? {});

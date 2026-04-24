// frontend/src/hooks/useChat.js

import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const idRef = useRef(0);
  const isRequestActiveRef = useRef(false);
  const abortRef = useRef(null);

  const send = useCallback(async (text) => {
    // Hard lock — only ONE request at a time, period.
    if (isRequestActiveRef.current) return;
    isRequestActiveRef.current = true;

    // Abort any previously lingering request (e.g. StrictMode remount)
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const userMsg = { id: ++idRef.current, role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendChatMessage(text, controller.signal);

      // If aborted, silently stop
      if (controller.signal.aborted) return;

      const response = responseText ?? 'No response received. Please try again.';
      const aiMsg = {
        id: ++idRef.current,
        role: 'ai',
        content: response,
        cached: false,
        fallback: false,
        source: '',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Ignore abort errors
      if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;

      setError(err.message);

      const errMsg = {
        id: ++idRef.current,
        role: 'ai',
        content: {
          summary: err.message || 'Something went wrong. Please try again.',
          steps: [],
          bullets: [],
          examples: [],
          relatedTopics: [],
        },
        isError: true,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      isRequestActiveRef.current = false;
      abortRef.current = null;
    }
  }, []); // No dependencies — refs handle all state

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, send, clearChat };
}

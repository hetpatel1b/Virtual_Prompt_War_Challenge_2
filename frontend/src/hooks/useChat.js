import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const idRef = useRef(0);

  const send = useCallback(async (text) => {
    const userMsg = { id: ++idRef.current, role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendChatMessage(text);
      // Safe access — NEVER destructure directly
      const response = data?.response ?? {
        summary: 'No response received. Please try again.',
        steps: [],
        bullets: [],
        examples: [],
        relatedTopics: [],
      };
      const cached = data?.cached ?? false;
      const fallback = data?.fallback ?? false;
      const aiMsg = {
        id: ++idRef.current,
        role: 'ai',
        content: response,
        cached,
        fallback,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
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
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, send, clearChat };
}


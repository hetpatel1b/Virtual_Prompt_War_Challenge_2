// frontend/src/hooks/useChat.js

import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const idRef = useRef(0);
  const isRequestActiveRef = useRef(false);

  const send = useCallback(async (text) => {
    if (isLoading || isRequestActiveRef.current) return;

    isRequestActiveRef.current = true;

    const userMsg = { id: ++idRef.current, role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    const queueMsgId = ++idRef.current;
    const queueTimer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: queueMsgId,
          role: 'ai',
          content: '⏳ Processing your request, please wait...',
          timestamp: Date.now(),
          isTemporary: true
        }
      ]);
    }, 2500);

    try {
      const responseText = await sendChatMessage(text);
      clearTimeout(queueTimer);

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

      setMessages((prev) => [...prev.filter(m => m.id !== queueMsgId), aiMsg]);
    } catch (err) {
      clearTimeout(queueTimer);
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

      setMessages((prev) => [...prev.filter(m => m.id !== queueMsgId), errMsg]);
    } finally {
      setIsLoading(false);
      isRequestActiveRef.current = false;
    }
  }, [isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, send, clearChat };
}

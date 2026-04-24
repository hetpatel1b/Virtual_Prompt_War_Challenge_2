import { useState, useCallback } from 'react';
import { getQuizQuestions, submitQuizAnswers } from '../services/api';

const PHASES = { START: 'start', ACTIVE: 'active', RESULTS: 'results' };

export function useQuiz() {
  const [phase, setPhase] = useState(PHASES.START);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startQuiz = useCallback(async (opts = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizQuestions(opts);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers([]);
      setResults(null);
      setPhase(PHASES.ACTIVE);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // FIX START — Store correctOption so feedback always has the correct answer index
  const selectAnswer = useCallback((selectedOption) => {
    if (phase !== PHASES.ACTIVE) return;

    const q = questions[currentIndex];

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        questionId: q.id,
        selectedOption,
        correctOption: q.correctOption,  // 0-based index from API
      };
      return updated;
    });

  }, [phase, questions, currentIndex]);
  // FIX END
  const nextQuestion = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < questions.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [questions.length]);

  // FIX START — Send only the fields the backend expects
  const submitQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Strip correctOption — backend only needs questionId + selectedOption
      const payload = answers.map(({ questionId, selectedOption }) => ({
        questionId,
        selectedOption,
      }));
      const data = await submitQuizAnswers(payload);
      setResults(data);
      setPhase(PHASES.RESULTS);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  // FIX END
  }, [answers]);

  const retryQuiz = useCallback(() => {
    setPhase(PHASES.START);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setResults(null);
  }, []);

  return {
    phase, questions, currentIndex, answers, results, isLoading, error,
    currentQuestion: questions[currentIndex] || null,
    progress: questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0,
    hasAnswered: answers[currentIndex] !== undefined,
    isLastQuestion: currentIndex === questions.length - 1,
    startQuiz, selectAnswer, nextQuestion, submitQuiz, retryQuiz,
    PHASES,
  };
}

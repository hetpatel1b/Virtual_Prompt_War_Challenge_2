import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

/* Mock the API */
vi.mock('../../services/api', () => ({
  getQuizQuestions: vi.fn().mockResolvedValue({
    questions: [
      { id: 'q_001', category: 'test', difficulty: 'easy', question: 'Test?', options: ['A', 'B', 'C', 'D'] },
      { id: 'q_002', category: 'test', difficulty: 'easy', question: 'Test2?', options: ['A', 'B', 'C', 'D'] },
    ],
  }),
  submitQuizAnswers: vi.fn().mockResolvedValue({
    score: 1, total: 2, percentage: 50, feedback: { emoji: '👍', title: 'Good', message: 'Good job' }, breakdown: [], recommendations: [],
  }),
}));

import { useQuiz } from '../../hooks/useQuiz';

describe('useQuiz', () => {
  it('starts in START phase', () => {
    const { result } = renderHook(() => useQuiz());
    expect(result.current.phase).toBe('start');
    expect(result.current.questions).toHaveLength(0);
  });

  it('transitions to ACTIVE after startQuiz', async () => {
    const { result } = renderHook(() => useQuiz());
    await act(async () => { await result.current.startQuiz(); });
    expect(result.current.phase).toBe('active');
    expect(result.current.questions).toHaveLength(2);
    expect(result.current.currentIndex).toBe(0);
  });

  it('tracks selected answers', async () => {
    const { result } = renderHook(() => useQuiz());
    await act(async () => { await result.current.startQuiz(); });
    act(() => { result.current.selectAnswer(1); });
    expect(result.current.answers).toHaveLength(1);
    expect(result.current.answers[0].selectedOption).toBe(1);
  });

  it('advances to next question', async () => {
    const { result } = renderHook(() => useQuiz());
    await act(async () => { await result.current.startQuiz(); });
    act(() => { result.current.selectAnswer(0); });
    act(() => { result.current.nextQuestion(); });
    expect(result.current.currentIndex).toBe(1);
  });

  it('resets on retryQuiz', async () => {
    const { result } = renderHook(() => useQuiz());
    await act(async () => { await result.current.startQuiz(); });
    act(() => { result.current.retryQuiz(); });
    expect(result.current.phase).toBe('start');
    expect(result.current.questions).toHaveLength(0);
  });

  it('computes progress correctly', async () => {
    const { result } = renderHook(() => useQuiz());
    await act(async () => { await result.current.startQuiz(); });
    expect(result.current.progress).toBe(50); // 1 of 2
  });
});

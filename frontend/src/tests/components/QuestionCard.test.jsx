import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import QuestionCard from '../../components/Quiz/QuestionCard';

const mockQuestion = {
  id: 'q_001',
  category: 'voter_eligibility',
  difficulty: 'easy',
  question: 'What is the minimum age to vote in India?',
  options: ['16 years', '18 years', '21 years', '25 years'],
};

describe('QuestionCard', () => {
  it('renders question text', () => {
    render(<QuestionCard question={mockQuestion} selectedOption={null} onSelect={vi.fn()} feedback={null} />);
    expect(screen.getByText(/minimum age to vote/i)).toBeInTheDocument();
  });

  it('renders all 4 options', () => {
    render(<QuestionCard question={mockQuestion} selectedOption={null} onSelect={vi.fn()} feedback={null} />);
    expect(screen.getByText('16 years')).toBeInTheDocument();
    expect(screen.getByText('18 years')).toBeInTheDocument();
    expect(screen.getByText('21 years')).toBeInTheDocument();
    expect(screen.getByText('25 years')).toBeInTheDocument();
  });

  it('calls onSelect when option clicked', async () => {
    const fn = vi.fn();
    render(<QuestionCard question={mockQuestion} selectedOption={null} onSelect={fn} feedback={null} />);
    await userEvent.click(screen.getByText('18 years'));
    expect(fn).toHaveBeenCalledWith(1);
  });

  it('shows category and difficulty badges', () => {
    render(<QuestionCard question={mockQuestion} selectedOption={null} onSelect={vi.fn()} feedback={null} />);
    expect(screen.getByText('voter eligibility')).toBeInTheDocument();
    expect(screen.getByText('easy')).toBeInTheDocument();
  });

  it('shows feedback after answering', () => {
    const feedback = { isCorrect: true, correctOption: 1, explanation: 'The 61st Amendment Act...' };
    render(<QuestionCard question={mockQuestion} selectedOption={1} onSelect={vi.fn()} feedback={feedback} />);
    expect(screen.getByText(/correct/i)).toBeInTheDocument();
    expect(screen.getByText(/61st Amendment/i)).toBeInTheDocument();
  });
});

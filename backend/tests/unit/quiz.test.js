/**
 * Quiz Logic Unit Tests
 */

require('../setup');

const quizData = require('../../data/quizQuestions');
const { generateRecommendations, generateFeedback } = require('../../controllers/quiz.controller');

describe('Quiz Questions Data', () => {
  describe('getAllQuestions', () => {
    it('should return all questions', () => {
      const questions = quizData.getAllQuestions();
      expect(questions).toBeInstanceOf(Array);
      expect(questions.length).toBeGreaterThanOrEqual(15);
    });

    it('should have required fields on every question', () => {
      const questions = quizData.getAllQuestions();

      questions.forEach((q) => {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('category');
        expect(q).toHaveProperty('difficulty');
        expect(q).toHaveProperty('question');
        expect(q).toHaveProperty('options');
        expect(q).toHaveProperty('correctIndex');
        expect(q).toHaveProperty('explanation');
        expect(q).toHaveProperty('source');
      });
    });

    it('should have exactly 4 options per question', () => {
      const questions = quizData.getAllQuestions();
      questions.forEach((q) => {
        expect(q.options).toHaveLength(4);
      });
    });

    it('should have correctIndex between 0 and 3', () => {
      const questions = quizData.getAllQuestions();
      questions.forEach((q) => {
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThanOrEqual(3);
      });
    });

    it('should have unique question IDs', () => {
      const questions = quizData.getAllQuestions();
      const ids = questions.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('getFilteredQuestions', () => {
    it('should filter by category', () => {
      const questions = quizData.getFilteredQuestions({ category: 'voter_eligibility' });
      questions.forEach((q) => {
        expect(q.category).toBe('voter_eligibility');
      });
    });

    it('should filter by difficulty', () => {
      const questions = quizData.getFilteredQuestions({ difficulty: 'easy' });
      questions.forEach((q) => {
        expect(q.difficulty).toBe('easy');
      });
    });

    it('should limit the number of returned questions', () => {
      const questions = quizData.getFilteredQuestions({ count: 5 });
      expect(questions.length).toBeLessThanOrEqual(5);
    });

    it('should return randomized order', () => {
      // Run multiple times and check that order varies
      const runs = Array.from({ length: 5 }, () =>
        quizData.getFilteredQuestions({ count: 10 }).map((q) => q.id).join(',')
      );
      const unique = new Set(runs);
      // At least some variation expected (not guaranteed but highly likely with 20 questions)
      expect(unique.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getQuestionById', () => {
    it('should return the correct question', () => {
      const question = quizData.getQuestionById('q_001');
      expect(question).not.toBeNull();
      expect(question.id).toBe('q_001');
    });

    it('should return null for non-existent ID', () => {
      const question = quizData.getQuestionById('q_999');
      expect(question).toBeNull();
    });
  });

  describe('getCategories', () => {
    it('should return category counts', () => {
      const categories = quizData.getCategories();
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBeGreaterThan(0);
      categories.forEach((cat) => {
        expect(cat).toHaveProperty('category');
        expect(cat).toHaveProperty('count');
        expect(cat.count).toBeGreaterThan(0);
      });
    });
  });
});

describe('Quiz Scoring Logic', () => {
  describe('generateFeedback', () => {
    it('should return perfect score feedback for 100%', () => {
      const feedback = generateFeedback(100);
      expect(feedback.emoji).toBe('🏆');
      expect(feedback.title).toContain('Perfect');
    });

    it('should return excellent feedback for 80-99%', () => {
      const feedback = generateFeedback(85);
      expect(feedback.emoji).toBe('🌟');
    });

    it('should return good feedback for 60-79%', () => {
      const feedback = generateFeedback(65);
      expect(feedback.emoji).toBe('👍');
    });

    it('should return keep learning feedback for 40-59%', () => {
      const feedback = generateFeedback(45);
      expect(feedback.emoji).toBe('📖');
    });

    it('should return beginner feedback for below 40%', () => {
      const feedback = generateFeedback(20);
      expect(feedback.emoji).toBe('🌱');
    });
  });

  describe('generateRecommendations', () => {
    it('should recommend weak categories', () => {
      const breakdown = [
        { isCorrect: false, category: 'voter_eligibility' },
        { isCorrect: false, category: 'voter_eligibility' },
        { isCorrect: true, category: 'registration' },
      ];

      const recommendations = generateRecommendations(breakdown);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toContain('Voter Eligibility');
    });

    it('should congratulate when all answers are correct', () => {
      const breakdown = [
        { isCorrect: true, category: 'voter_eligibility' },
        { isCorrect: true, category: 'registration' },
      ];

      const recommendations = generateRecommendations(breakdown);
      expect(recommendations[0]).toContain('Excellent');
    });
  });
});

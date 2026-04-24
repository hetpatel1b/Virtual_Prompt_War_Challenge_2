import { useAuth } from '../contexts/AuthContext';
import { useQuiz } from '../hooks/useQuiz';
import QuestionCard from '../components/Quiz/QuestionCard';
import ResultsSummary from '../components/Quiz/ResultsSummary';
import Leaderboard from '../components/Quiz/Leaderboard';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Play, ArrowRight, Trophy, Sparkles, Zap, Target } from 'lucide-react';

export default function Quiz() {
  const { isAuthenticated, signIn } = useAuth();
  const quiz = useQuiz();

  /* ── START SCREEN ─────────────────────────────────── */
  if (quiz.phase === quiz.PHASES.START) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 relative">
        <div className="relative z-10 text-center space-y-4 pt-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto shadow-2xl">
            <Trophy size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-heading font-extrabold">
            Election Quiz Challenge
          </h2>
          <p className="text-sm text-gray-500">
            Test your knowledge of India's election system 🚀
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Easy', icon: Sparkles },
            { label: 'Medium', icon: Target },
            { label: 'Hard', icon: Zap },
          ].map((d) => (
            <Card key={d.label} className="text-center py-5">
              <d.icon size={20} className="mx-auto mb-2" />
              <p className="font-bold">{d.label}</p>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <Button
            onClick={() => quiz.startQuiz({ count: 10 })}
            loading={quiz.isLoading}
            icon={Play}
          >
            Start Quiz
          </Button>

          {!isAuthenticated && (
            <Button variant="secondary" onClick={() => signIn('google')}>
              Sign In
            </Button>
          )}
        </div>

        {quiz.error && (
          <p className="text-center text-red-500 text-sm">{quiz.error}</p>
        )}

        <Leaderboard />
      </div>
    );
  }

  /* ── ACTIVE QUIZ ─────────────────────────────────── */
  if (quiz.phase === quiz.PHASES.ACTIVE) {
    const q = quiz.currentQuestion;
    if (!q) return <LoadingSpinner text="Loading..." />;

    const currentAnswer = quiz.answers[quiz.currentIndex];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex justify-between text-sm">
          <p>
            Question {quiz.currentIndex + 1} / {quiz.questions.length}
          </p>
          <p>{Math.round(quiz.progress)}%</p>
        </div>

        <ProgressBar
          value={quiz.currentIndex + 1}
          max={quiz.questions.length}
        />

        {/* Question */}
        <QuestionCard
          question={q}
          selectedOption={currentAnswer?.selectedOption ?? null}
          onSelect={(opt) => quiz.selectAnswer(opt)}
          feedback={
            currentAnswer
              ? {
                correctOption: q.correctOption,
                isCorrect:
                  currentAnswer.selectedOption === q.correctOption,
                explanation: q.explanation || "No explanation available"
              }
              : null
          }
        />

        {/* Buttons */}
        {currentAnswer && (
          <div className="flex justify-end">
            {quiz.isLastQuestion ? (
              <Button
                onClick={async () => {
                  if (!isAuthenticated) {
                    alert("Please login first");
                    signIn('google');
                    return;
                  }

                  await quiz.submitQuiz(); // ✅ FIXED
                }}
                loading={quiz.isLoading}
                icon={ArrowRight}
              >
                Submit & See Results
              </Button>
            ) : (
              <Button onClick={quiz.nextQuestion}>
                Next Question
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  /* ── RESULTS ─────────────────────────────────────── */
  if (quiz.phase === quiz.PHASES.RESULTS) {
    return (
      <div className="max-w-2xl mx-auto">
        <ResultsSummary
          results={quiz.results}
          onRetry={quiz.retryQuiz}
        />
      </div>
    );
  }

  return <LoadingSpinner />;
}
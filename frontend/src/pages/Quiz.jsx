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

  /* ── Start screen ──────────────────────────────────── */
  if (quiz.phase === quiz.PHASES.START) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 relative">
        <div className="blob w-72 h-72 bg-amber-500 -top-20 -right-40" />

        <div className="relative z-10 text-center space-y-4 pt-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/25">
            <Trophy size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-[var(--color-text)]">Election Quiz Challenge</h2>
          <p className="text-[var(--color-text-muted)] max-w-md mx-auto">Test your knowledge of India's election process across 6 categories and 3 difficulty levels.</p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { label: 'Easy', desc: 'Fundamentals', icon: Sparkles, gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/15' },
            { label: 'Medium', desc: 'Intermediate', icon: Target, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/15' },
            { label: 'Hard', desc: 'Expert Level', icon: Zap, gradient: 'from-red-500 to-rose-500', shadow: 'shadow-red-500/15' },
          ].map((d) => (
            <Card key={d.label} variant="glass" className="text-center py-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${d.gradient} flex items-center justify-center mx-auto mb-2.5 shadow-lg ${d.shadow}`}>
                <d.icon size={18} className="text-white" />
              </div>
              <p className="font-heading font-bold text-sm text-[var(--color-text)]">{d.label}</p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{d.desc}</p>
            </Card>
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-3">
          {!isAuthenticated && (
            <p className="text-xs text-[var(--color-text-muted)]">Sign in to save your score to the leaderboard</p>
          )}
          <div className="flex gap-3">
            <Button onClick={() => quiz.startQuiz({ count: 10 })} loading={quiz.isLoading} icon={Play} variant="glow" size="lg">
              Start Quiz
            </Button>
            {!isAuthenticated && (
              <Button variant="secondary" size="lg" onClick={() => signIn('google')}>Sign In First</Button>
            )}
          </div>
        </div>

        {quiz.error && <p className="relative z-10 text-center text-sm text-red-500">{quiz.error}</p>}

        <div className="relative z-10">
          <Leaderboard />
        </div>
      </div>
    );
  }

  /* ── Active quiz ───────────────────────────────────── */
  if (quiz.phase === quiz.PHASES.ACTIVE) {
    const q = quiz.currentQuestion;
    if (!q) return <LoadingSpinner text="Loading question…" />;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--color-text-muted)] tabular-nums">
            Question {quiz.currentIndex + 1} <span className="text-[var(--color-text-muted)]/50">/ {quiz.questions.length}</span>
          </p>
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 tabular-nums">
            {Math.round(quiz.progress)}% complete
          </span>
        </div>
        <ProgressBar value={quiz.currentIndex + 1} max={quiz.questions.length} showLabel={false} size="sm" />

        <QuestionCard
          question={q}
          selectedOption={quiz.answers[quiz.currentIndex]?.selectedOption ?? null}
          onSelect={(opt) => quiz.selectAnswer(opt)}
          feedback={null}
        />
        {/* 🔍 DEBUG - show answers */}
        <pre style={{ fontSize: "10px", opacity: 0.5 }}>
          {JSON.stringify(quiz.answers, null, 2)}
        </pre>

        {quiz.answers[quiz.currentIndex] && (
          <div className="flex justify-end animate-fade-up" style={{ animationDuration: '0.3s' }}>
            {quiz.isLastQuestion ? (
              <Button
                onClick={() => {
                  console.log("Submitting answers:", quiz.answers); // debug
                  quiz.submitQuiz();
                }}
                loading={quiz.isLoading}
                icon={ArrowRight}
                variant="glow"
              >
                {isAuthenticated ? 'Submit & See Results' : 'See Results'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  console.log("Next question, answers:", quiz.answers); // debug
                  quiz.nextQuestion();
                }}
                icon={ArrowRight}
              >
                Next Question
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  /* ── Results ───────────────────────────────────────── */
  if (quiz.phase === quiz.PHASES.RESULTS) {
    return (
      <div className="max-w-2xl mx-auto relative">
        <div className="blob w-72 h-72 bg-primary-500 -top-20 -right-40" />
        <div className="blob w-48 h-48 bg-emerald-500 bottom-0 -left-20" style={{ animationDelay: '3s' }} />
        <div className="relative z-10">
          <ResultsSummary results={quiz.results} onRetry={quiz.retryQuiz} />
        </div>
      </div>
    );
  }

  return <LoadingSpinner />;
}

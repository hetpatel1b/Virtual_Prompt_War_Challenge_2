import { memo } from 'react';
import Button from '../common/Button';
import { RotateCcw, Eye, TrendingUp } from 'lucide-react';

function ResultsSummary({ results, onRetry, onReview }) {
  if (!results) return null;
  const { score, total, percentage, feedback, recommendations } = results;

  const ringColor = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#6366f1' : percentage >= 40 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-8 text-center animate-fade-up">
      {/* Score ring */}
      <div className="relative w-44 h-44 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border)" strokeWidth="6" opacity="0.5" />
          <circle
            cx="50" cy="50" r="42" fill="none" stroke={ringColor}
            strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-ring"
            style={{ filter: `drop-shadow(0 0 8px ${ringColor}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-heading font-extrabold text-[var(--color-text)] counter">{percentage}%</span>
          <span className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">{score}/{total} correct</span>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="animate-pop">
          <p className="text-5xl mb-2">{feedback.emoji}</p>
          <h3 className="text-2xl font-heading font-extrabold text-[var(--color-text)]">{feedback.title}</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-md mx-auto">{feedback.message}</p>
        </div>
      )}

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div className="text-left max-w-md mx-auto p-5 rounded-2xl glass-card">
          <p className="font-heading font-bold text-sm mb-3 text-[var(--color-text)] flex items-center gap-2">
            <TrendingUp size={15} className="text-primary-500" /> Study Recommendations
          </p>
          <ul className="space-y-2">
            {recommendations.map((r, i) => (
              <li key={i} className="flex gap-2.5 items-start text-sm text-[var(--color-text-muted)]">
                <span className="w-5 h-5 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3 pt-2">
        <Button onClick={onRetry} icon={RotateCcw} variant="glow">Try Again</Button>
        {onReview && <Button variant="secondary" onClick={onReview} icon={Eye}>Review Answers</Button>}
      </div>
    </div>
  );
}

export default memo(ResultsSummary);

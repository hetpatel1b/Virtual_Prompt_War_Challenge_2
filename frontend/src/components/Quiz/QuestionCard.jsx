import { memo } from 'react';
import Badge from '../common/Badge';
import { CheckCircle, XCircle } from 'lucide-react';

function QuestionCard({ question, selectedOption, onSelect, feedback }) {
  const hasAnswered = selectedOption !== undefined && selectedOption !== null;
  const isCorrect = feedback?.isCorrect;

  return (
    <div className="space-y-5 animate-fade-up" style={{ animationDuration: '0.4s' }}>
      <div>
        <h3 className="text-xl font-heading font-bold text-[var(--color-text)] leading-snug mb-3">{question.question}</h3>
        <div className="flex gap-2">
          <Badge color="primary" dot>{question.category?.replace('_', ' ')}</Badge>
          <Badge color={question.difficulty === 'easy' ? 'success' : question.difficulty === 'hard' ? 'error' : 'warning'} dot>{question.difficulty}</Badge>
        </div>
      </div>

      <div className="space-y-2.5" role="radiogroup" aria-label="Answer options">
        {question.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let classes = 'border-[var(--color-border)] hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 hover:shadow-md hover:shadow-primary-600/5';

          if (hasAnswered) {
            if (feedback && i === feedback.correctOption) {
              classes = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/10';
            } else if (i === selectedOption && !isCorrect) {
              classes = 'border-red-400 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-500/20';
            } else {
              classes = 'border-[var(--color-border)] opacity-40';
            }
          } else if (i === selectedOption) {
            classes = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/20 shadow-lg shadow-primary-600/10';
          }

          return (
            <button
              key={i}
              onClick={() => !hasAnswered && onSelect(i)}
              disabled={hasAnswered}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-300 ${classes}`}
              role="radio"
              aria-checked={i === selectedOption}
            >
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all
                ${i === selectedOption && !hasAnswered
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                  : hasAnswered && feedback && i === feedback.correctOption
                    ? 'bg-emerald-500 text-white'
                    : hasAnswered && i === selectedOption && !isCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text-muted)]'}`}>
                {hasAnswered && feedback && i === feedback.correctOption
                  ? <CheckCircle size={16} />
                  : hasAnswered && i === selectedOption && !isCorrect
                    ? <XCircle size={16} />
                    : letter}
              </span>
              <span className="text-sm font-medium text-[var(--color-text)] flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {hasAnswered && feedback && (
        <div className={`p-4 rounded-2xl border animate-pop
          ${isCorrect
            ? 'border-emerald-300/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/15 dark:to-teal-900/15 dark:border-emerald-700/30'
            : 'border-red-300/50 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/15 dark:to-rose-900/15 dark:border-red-700/30'}`}>
          <p className="font-semibold text-sm mb-1 flex items-center gap-1.5">
            {isCorrect
              ? <><CheckCircle size={15} className="text-emerald-500" /> Correct!</>
              : <><XCircle size={15} className="text-red-500" /> Incorrect</>}
          </p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{feedback.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default memo(QuestionCard);

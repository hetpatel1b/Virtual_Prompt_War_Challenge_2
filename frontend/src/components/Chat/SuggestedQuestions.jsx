import { memo } from 'react';
import { ArrowRight } from 'lucide-react';

function SuggestedQuestions({ suggestions = [], onSelect }) {
  if (!suggestions.length) return null;

  return (
    <div className="px-4 py-3 space-y-4 max-w-2xl mx-auto">
      {suggestions.map((cat) => (
        <div key={cat.category}>
          <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
            <span className="text-base">{cat.icon}</span> {cat.category}
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {cat.questions.map((q) => (
              <button
                key={q}
                onClick={() => onSelect(q)}
                className="flex items-center gap-2 px-3.5 py-2.5 text-[13px] text-left rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 group"
              >
                <span className="flex-1 line-clamp-1">{q}</span>
                <ArrowRight size={12} className="text-[var(--color-text-muted)] group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(SuggestedQuestions);

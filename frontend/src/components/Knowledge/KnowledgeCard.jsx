import { memo, useState } from 'react';
import { ChevronDown, BookOpen, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';

function KnowledgeCard({ card }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300
      ${expanded
        ? 'border-primary-300/50 dark:border-primary-700/30 shadow-lg shadow-primary-600/5 bg-[var(--color-surface)]'
        : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 hover:-translate-y-0.5'}`}>
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left p-5"
      aria-expanded={expanded}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex gap-2 mb-2.5">
            <Badge color="primary" dot>{card.category}</Badge>
            <Badge color={card.difficulty === 'easy' ? 'success' : card.difficulty === 'hard' ? 'error' : 'warning'} dot>{card.difficulty}</Badge>
          </div>
          <h3 className="font-heading font-bold text-[var(--color-text)] text-[15px] leading-snug">{card.title}</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">{card.summary}</p>
        </div>
        <ChevronDown size={16} className={`text-[var(--color-text-muted)] shrink-0 mt-1 transition-transform duration-300 ${expanded ? 'rotate-180 text-primary-500' : ''}`} />
      </div>
    </button>

    {expanded && (
      <div className="px-5 pb-5 space-y-4 border-t border-[var(--color-border)] pt-4 animate-fade-up" style={{ animationDuration: '0.3s' }}>
        <p className="text-sm text-[var(--color-text)] leading-relaxed">{card.content}</p>

        {card.keyTakeaways?.length > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-900/15 dark:to-violet-900/15 border border-primary-200/30 dark:border-primary-700/20">
            <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-primary-600 dark:text-primary-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles size={10} /> Key Takeaways
            </p>
            <ul className="space-y-1.5">
              {card.keyTakeaways.map((t, i) => (
                <li key={i} className="flex gap-2 items-start text-sm text-primary-900 dark:text-primary-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}
    </div>
  );
}

export default memo(KnowledgeCard);

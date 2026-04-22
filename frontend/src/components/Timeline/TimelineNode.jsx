import { memo } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { ChevronDown, Sparkles } from 'lucide-react';

function TimelineNode({ step, index, isActive, onToggle }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`relative pl-14 pb-10 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Connector */}
      <div className="absolute left-[1.35rem] top-12 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-primary-300/30 to-transparent" />

      {/* Node circle */}
      <div className={`absolute left-0 top-0 w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
        ${isActive
          ? 'bg-gradient-to-br from-primary-600 to-violet-500 border-transparent text-white scale-110 shadow-xl shadow-primary-600/30 rotate-3'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-primary-400'}`}>
        {index + 1}
      </div>

      {/* Card */}
      <button
        onClick={() => onToggle(index)}
        className={`w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden
          ${isActive
            ? 'border-primary-300/50 dark:border-primary-700/50 shadow-lg shadow-primary-600/5 bg-[var(--color-surface)]'
            : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800'}`}
        aria-expanded={isActive}
      >
        <div className="flex items-center justify-between p-5">
          <div>
            <h3 className="font-heading font-bold text-[var(--color-text)] text-[15px]">{step.title}</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 font-medium">{step.period}</p>
          </div>
          <ChevronDown size={16} className={`text-[var(--color-text-muted)] transition-transform duration-300 ${isActive ? 'rotate-180 text-primary-500' : ''}`} />
        </div>

        {isActive && (
          <div className="px-5 pb-5 space-y-3 border-t border-[var(--color-border)] pt-4 animate-fade-up" style={{ animationDuration: '0.3s' }}>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">{step.description}</p>

            {step.activities?.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-2">
                {step.activities.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] p-2.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            )}

            {step.funFact && (
              <div className="flex gap-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/15 dark:to-orange-900/15 border border-amber-200/50 dark:border-amber-700/20">
                <Sparkles size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">{step.funFact}</p>
              </div>
            )}
          </div>
        )}
      </button>
    </div>
  );
}

export default memo(TimelineNode);

import { memo, useState } from 'react';
import { Bot, User, Copy, Check, Sparkles } from 'lucide-react';

function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof message.content === 'string' ? message.content : message.content?.summary || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    if (isUser) return <p className="text-sm leading-relaxed">{message.content}</p>;

    const c = message.content;
    if (!c) return <p className="text-sm text-[var(--color-text-muted)]">No response received.</p>;

    // Handle plain string content (edge case)
    if (typeof c === 'string') {
      return <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{c}</p>;
    }

    // Handle rawText fallback from backend
    if (c.rawText && !c.summary) {
      return <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{c.rawText}</p>;
    }

    return (
      <div className="space-y-3 text-sm leading-relaxed">
        {message.fallback && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold mb-1">
            ⚠️ Fallback response
          </div>
        )}

        {c.summary && <p className="font-medium text-[var(--color-text)]">{c.summary}</p>}

        {c.steps?.length > 0 && (
          <div className="space-y-2">
            <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-primary-600 dark:text-primary-400 flex items-center gap-1"><Sparkles size={10} />Steps</p>
            <div className="space-y-1.5">
              {c.steps.map((s, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-md bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-[var(--color-text-muted)]">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {c.bullets?.length > 0 && (
          <ul className="space-y-1.5">
            {c.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 items-start text-[var(--color-text-muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {c.examples?.length > 0 && (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-primary-200/30 dark:border-primary-700/20">
            <p className="font-semibold text-[10px] uppercase tracking-[0.15em] text-primary-600 dark:text-primary-400 mb-2">💡 Examples</p>
            {c.examples.map((e, i) => <p key={i} className="text-sm text-primary-800 dark:text-primary-200">{e}</p>)}
          </div>
        )}

        {c.relatedTopics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {c.relatedTopics.map((t, i) => (
              <span key={i} className="px-2.5 py-1 text-[11px] rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border border-[var(--color-border)] font-medium hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition cursor-default">{t}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex gap-3 animate-fade-up ${isUser ? 'flex-row-reverse' : ''} group`}>
      <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${isUser
        ? 'bg-gradient-to-br from-primary-600 to-primary-500 shadow-primary-600/20'
        : 'bg-gradient-to-br from-emerald-600 to-teal-500 shadow-emerald-600/20'}`}>
        {isUser ? <User size={15} className="text-white" /> : <Bot size={15} className="text-white" />}
      </div>

      <div className={`max-w-[80%] rounded-2xl px-5 py-4 relative
        ${isUser
          ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-tr-md shadow-lg shadow-primary-600/20'
          : 'glass-card rounded-tl-md'}
        ${message.isError ? 'ring-1 ring-red-500/30' : ''}`}>
        {renderContent()}

        {!isUser && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[var(--color-surface-alt)] opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Copy response"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-[var(--color-text-muted)]" />}
          </button>
        )}

        {message.cached && !isUser && (
          <span className="absolute bottom-2 right-3 text-[9px] text-[var(--color-text-muted)] font-medium opacity-50">⚡ cached</span>
        )}

        {!isUser && message.source && (
          <span className={`absolute bottom-2 ${message.cached ? 'right-16' : 'right-3'} text-[9px] font-medium opacity-60 flex items-center gap-0.5 ${message.source === 'gemini' ? 'text-emerald-500' : 'text-[var(--color-text-muted)]'}`}>
            {message.source === 'gemini' ? '✦ Gemini' : message.source === 'demo' ? '📦 Demo' : message.source === 'cache' ? '' : '↻ Fallback'}
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(ChatBubble);

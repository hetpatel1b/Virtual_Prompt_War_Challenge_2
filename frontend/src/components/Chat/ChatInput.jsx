import { useState, useRef, useCallback } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const ref = useRef(null);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    const msg = text.trim();
    if (!msg || isLoading) return;
    onSend(msg);
    setText('');
    ref.current?.focus();
  }, [text, isLoading, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-violet-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300" />
          <div className="relative bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] group-focus-within:border-transparent transition">
            <textarea
              ref={ref}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 2000))}
              onKeyDown={handleKeyDown}
              placeholder="Ask about elections, voting, or civic participation..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3 pr-16 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              aria-label="Type your question"
              disabled={isLoading}
              style={{ maxHeight: '120px' }}
            />
            <div className="absolute bottom-2 right-3 flex items-center gap-2">
              <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums font-medium">{text.length}/2000</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="p-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 active:scale-95 min-h-[48px] min-w-[48px] flex items-center justify-center"
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </form>
  );
}

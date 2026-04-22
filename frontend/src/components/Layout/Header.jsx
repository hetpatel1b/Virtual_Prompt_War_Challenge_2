import { useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { NAV_ITEMS } from '../../utils/constants';
import { Menu, Sun, Moon, Sparkles } from 'lucide-react';

export default function Header({ onMenuToggle }) {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const current = NAV_ITEMS.find((n) => n.path === pathname);
  const title = current?.label || 'ElectionGuide AI';

  return (
    <header className="sticky top-0 z-30 glass border-b border-[var(--color-border)]" role="banner">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl hover:bg-[var(--color-surface-alt)] transition" aria-label="Toggle menu">
            <Menu size={20} className="text-[var(--color-text)]" />
          </button>
          <div>
            <h1 className="text-lg font-heading font-bold text-[var(--color-text)] leading-tight">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-medium">
            <Sparkles size={12} /> AI-Powered
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-[var(--color-surface-alt)] transition-all duration-300 group"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark
              ? <Sun size={18} className="text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
              : <Moon size={18} className="text-slate-500 group-hover:-rotate-12 transition-transform duration-500" />}
          </button>
        </div>
      </div>
    </header>
  );
}

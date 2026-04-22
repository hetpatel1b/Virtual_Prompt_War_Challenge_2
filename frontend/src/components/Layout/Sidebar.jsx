import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, MessageSquare, Clock, BookOpen, Lightbulb, Trophy, Zap, LogIn, LogOut, X, Sparkles } from 'lucide-react';

const ICON_MAP = { LayoutDashboard, MessageSquare, Clock, BookOpen, Lightbulb, Trophy, Zap };

export default function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const { isAuthenticated, user, signIn, signOut } = useAuth();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-[var(--color-sidebar)] text-white flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-lg font-bold shadow-lg shadow-primary-600/30">
              🗳️
            </div>
            <div>
              <span className="font-heading font-bold text-[15px] tracking-tight block leading-tight">ElectionGuide</span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Sparkles size={9} /> AI-Powered</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] px-3 mb-2">Modules</p>
          {NAV_ITEMS.map(({ path, label, icon }) => {
            const Icon = ICON_MAP[icon];
            const active = pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-primary-600/90 to-primary-500/80 text-white shadow-lg shadow-primary-600/20'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                aria-current={active ? 'page' : undefined}
              >
                {Icon && <Icon size={17} strokeWidth={active ? 2.2 : 1.7} className={active ? 'drop-shadow' : ''} />}
                {label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg shadow-white/50" />}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div className="relative p-4 border-t border-white/[0.06]">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-sm font-bold shrink-0 shadow">
                {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{user?.displayName || 'Guest User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'Anonymous'}</p>
              </div>
              <button onClick={signOut} className="p-2 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white" aria-label="Sign out">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button onClick={() => signIn('google')} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-white/[0.05] hover:text-white transition">
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

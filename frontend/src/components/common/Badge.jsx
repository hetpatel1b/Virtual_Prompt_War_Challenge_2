import { memo } from 'react';

const colors = {
  primary: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/20',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20',
  error: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
  info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/20',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20',
};

function Badge({ children, color = 'primary', dot = false, size = 'sm', className = '' }) {
  const s = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${colors[color]} ${s} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {children}
    </span>
  );
}

export default memo(Badge);

export default function ProgressBar({ value = 0, max = 100, showLabel = true, size = 'md', colorScheme = 'primary', className = '' }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const h = size === 'lg' ? 'h-4' : size === 'sm' ? 'h-1.5' : 'h-2.5';

  const gradients = {
    primary: 'from-primary-500 via-primary-400 to-violet-500',
    success: 'from-emerald-500 via-emerald-400 to-teal-500',
    warning: 'from-amber-500 via-orange-400 to-red-400',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${h} bg-[var(--color-surface-alt)] rounded-full overflow-hidden ring-1 ring-[var(--color-border)]`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full bg-gradient-to-r ${gradients[colorScheme] || gradients.primary} rounded-full transition-all duration-700 ease-out relative`}
          style={{ width: `${pct}%` }}
        >
          {size === 'lg' && pct > 15 && (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">{pct}%</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-full" />
        </div>
      </div>
      {showLabel && size !== 'lg' && (
        <p className="text-xs text-[var(--color-text-muted)] mt-1.5 text-right font-medium tabular-nums">{pct}%</p>
      )}
    </div>
  );
}

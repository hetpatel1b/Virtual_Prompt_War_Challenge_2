import { memo } from 'react';

const variants = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40',
  secondary: 'bg-[var(--color-surface-alt)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-primary-300 dark:hover:border-primary-700',
  ghost: 'hover:bg-[var(--color-surface-alt)] text-[var(--color-text)]',
  danger: 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white shadow-lg shadow-red-600/25',
  glow: 'bg-gradient-to-r from-primary-600 to-violet-500 text-white shadow-lg shadow-primary-600/30 hover:shadow-primary-500/50 glow',
};
const sizes = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

function Button({ children, variant = 'primary', size = 'md', loading = false, disabled = false, icon: Icon, className = '', ...rest }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-300 ease-out
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.97] min-h-[44px]
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" aria-hidden="true" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}

export default memo(Button);

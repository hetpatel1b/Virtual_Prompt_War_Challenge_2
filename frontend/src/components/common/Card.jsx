import { memo } from 'react';

function Card({ children, variant = 'solid', hoverable = false, glow = false, onClick, className = '', ...rest }) {
  const base = 'rounded-2xl transition-all duration-300 ease-out';

  const v = {
    solid: 'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm',
    glass: 'glass-card',
    outline: 'border border-[var(--color-border)] bg-transparent hover:border-primary-300 dark:hover:border-primary-700',
    gradient: 'bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-alt)] border border-[var(--color-border)] shadow-sm',
  }[variant] || v.solid;

  const hover = hoverable
    ? 'hover:shadow-xl hover:shadow-primary-600/5 hover:-translate-y-1 cursor-pointer group'
    : '';

  const glowClass = glow ? 'gradient-border' : '';

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag onClick={onClick} className={`${base} ${v} ${hover} ${glowClass} p-5 ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export default memo(Card);

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const s = size === 'lg' ? 'w-10 h-10 border-4' : size === 'sm' ? 'w-5 h-5 border-2' : 'w-7 h-7 border-3';
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={text || 'Loading'}>
      <div className={`${s} border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
      {text && <p className="text-sm text-[var(--color-text-muted)]">{text}</p>}
    </div>
  );
}

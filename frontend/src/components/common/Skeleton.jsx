export default function Skeleton({ width, height = '1rem', variant = 'text', className = '' }) {
  const shape = variant === 'circle' ? 'rounded-full' : variant === 'rect' ? 'rounded-xl' : 'rounded-md';
  return (
    <div className={`skeleton ${shape} ${className}`} style={{ width: width || '100%', height }} aria-hidden="true" />
  );
}

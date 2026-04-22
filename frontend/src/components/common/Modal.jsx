import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { trapFocus } from '../../utils/accessibility';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const cleanup = trapFocus(ref.current);
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { cleanup(); document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" className="relative w-full max-w-lg bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-xl font-heading font-bold">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-alt)] transition" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

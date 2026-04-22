import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertTriangle };
const styles = {
  success: 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  error: 'border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  info: 'border-sky-500 bg-sky-50 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200',
  warning: 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
};

export default function Toast({ message, type = 'info', duration = 4000, onClose }) {
  const [visible, setVisible] = useState(true);
  const Icon = icons[type];

  const dismiss = useCallback(() => { setVisible(false); setTimeout(() => onClose?.(), 300); }, [onClose]);

  useEffect(() => {
    if (duration <= 0) return;
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [duration, dismiss]);

  return createPortal(
    <div className={`fixed top-4 right-4 z-[110] max-w-sm transition-all duration-300 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`} role="alert">
      <div className={`flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg ${styles[type]}`}>
        <Icon size={18} className="mt-0.5 shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={dismiss} className="p-0.5 rounded hover:opacity-70 transition" aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>,
    document.body,
  );
}

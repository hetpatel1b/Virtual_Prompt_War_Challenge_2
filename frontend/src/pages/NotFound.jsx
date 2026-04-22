import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center relative">
      <div className="blob w-64 h-64 bg-primary-500 top-10 left-1/4" />
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-600/30">
          <Search size={32} className="text-white" />
        </div>
        <h2 className="text-4xl font-heading font-extrabold text-[var(--color-text)] mb-3">404</h2>
        <p className="text-lg text-[var(--color-text-muted)] mb-6 max-w-md">
          This page doesn't exist. Let's get you back to learning about elections!
        </p>
        <Link to="/">
          <Button icon={Home} variant="glow" size="lg">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

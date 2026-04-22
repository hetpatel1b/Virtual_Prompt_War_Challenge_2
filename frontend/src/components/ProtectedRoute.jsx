import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, signIn } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" role="status">
          <span className="sr-only">Loading authentication…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-heading font-bold mb-2">Sign In Required</h2>
        <p className="text-[var(--color-text-muted)] mb-6 max-w-md">
          You need to sign in to access this feature. Sign in with Google or continue as a guest.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => signIn('google')}>Sign in with Google</Button>
          <Button variant="secondary" onClick={() => signIn('anonymous')}>Continue as Guest</Button>
        </div>
      </div>
    );
  }

  return children;
}

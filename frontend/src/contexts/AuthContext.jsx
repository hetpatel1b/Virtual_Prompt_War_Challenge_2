import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { auth, isDemoMode, signInWithGoogle, signInAnonymously, signOut as firebaseSignOut } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!isDemoMode);

  useEffect(() => {
    if (isDemoMode || !auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  const signIn = useCallback(async (method = 'google') => {
    try {
      return method === 'anonymous' ? await signInAnonymously() : await signInWithGoogle();
    } catch (err) {
      console.error('Auth error', err);
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut, isAuthenticated: !!user }),
    [user, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

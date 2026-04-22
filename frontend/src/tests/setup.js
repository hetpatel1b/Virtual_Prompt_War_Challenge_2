import '@testing-library/jest-dom';

/* Mock firebase */
vi.mock('../services/firebase', () => ({
  auth: null,
  isDemoMode: true,
  signInWithGoogle: vi.fn(),
  signInAnonymously: vi.fn(),
  signOut: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue(null),
}));

/* Mock IntersectionObserver */
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver;

/* Mock matchMedia */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

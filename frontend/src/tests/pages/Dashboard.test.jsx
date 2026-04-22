import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null, loading: false, signIn: vi.fn(), signOut: vi.fn(), isAuthenticated: false }),
}));

vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn(), isDark: false }),
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useThemeContext: () => ({ theme: 'light', toggleTheme: vi.fn(), isDark: false }),
  ThemeProvider: ({ children }) => children,
}));

import Dashboard from '../../pages/Dashboard';

describe('Dashboard', () => {
  const renderDashboard = () =>
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

  it('renders the hero heading', () => {
    renderDashboard();
    expect(screen.getByText(/interactive guide to/i)).toBeInTheDocument();
  });

  it('renders all 6 feature cards', () => {
    renderDashboard();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Election Timeline')).toBeInTheDocument();
    expect(screen.getByText('Voting Guide')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Base')).toBeInTheDocument();
    expect(screen.getByText('Quiz Challenge')).toBeInTheDocument();
    expect(screen.getByText('Scenario Lab')).toBeInTheDocument();
  });

  it('renders the Start Learning CTA', () => {
    renderDashboard();
    expect(screen.getByText(/start with ai assistant/i)).toBeInTheDocument();
  });

  it('renders stats row', () => {
    renderDashboard();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('20+')).toBeInTheDocument();
  });

  it('renders Did You Know section', () => {
    renderDashboard();
    expect(screen.getByText(/did you know/i)).toBeInTheDocument();
  });
});

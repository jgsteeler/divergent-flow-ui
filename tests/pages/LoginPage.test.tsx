import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../src/pages/LoginPage';
import { useAuth } from '../../src/context/useAuth';

// Mock useAuth hook
vi.mock('../../src/context/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('LoginPage', () => {
  const mockLogin = vi.fn();
  const mockTheme = {
    primary: '#1976d2',
    secondary: '#666',
    accent: '#ff4081',
    background: '#fff',
    text: '#000',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login page with button', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<LoginPage theme={mockTheme} />);

    expect(screen.getByRole('heading', { name: /divergent flow/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /login \/ sign up/i })).toBeDefined();
  });

  it('should call login when button is clicked', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
    });

    const user = userEvent.setup();
    render(<LoginPage theme={mockTheme} />);

    const loginButton = screen.getByRole('button', { name: /login \/ sign up/i });
    await user.click(loginButton);

    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when isLoading is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<LoginPage theme={mockTheme} />);

    expect(screen.getByText(/loading authentication/i)).toBeDefined();
  });

  it('should not show login button when loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<LoginPage theme={mockTheme} />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should render welcome message', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<LoginPage theme={mockTheme} />);

    expect(screen.getByText(/sign in to access your captures/i)).toBeDefined();
  });
});

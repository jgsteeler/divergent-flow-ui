import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../src/pages/LoginPage';
import { useAuth0 } from '@auth0/auth0-react';

// Mock Auth0 React SDK
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

const mockLoginWithRedirect = vi.fn();
const mockTheme = {
  primary: '#1976d2',
  secondary: '#666',
  accent: '#ff4081',
  background: '#fff',
  text: '#000',
};

// Define a mock type for useAuth0
interface MockAuth0 {
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithRedirect: () => void;
}

describe('LoginPage (Auth0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login page with button', () => {
    (useAuth0 as Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    } as MockAuth0);

    render(<LoginPage theme={mockTheme} />);

    expect(screen.getByRole('heading', { name: /divergent flow/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /login \/ sign up/i })).toBeDefined();
  });

  it('should call loginWithRedirect when button is clicked', async () => {
    (useAuth0 as Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    } as MockAuth0);

    const user = userEvent.setup();
    render(<LoginPage theme={mockTheme} />);

    const loginButton = screen.getByRole('button', { name: /login \/ sign up/i });
    await user.click(loginButton);

    expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when isLoading is true', () => {
    (useAuth0 as Mock).mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    } as MockAuth0);

    render(<LoginPage theme={mockTheme} />);

    expect(screen.getByText(/loading authentication/i)).toBeDefined();
  });

  it('should not show login button when loading', () => {
    (useAuth0 as Mock).mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
    } as MockAuth0);

    render(<LoginPage theme={mockTheme} />);

    expect(screen.queryByRole('button')).toBeNull();
  });
});

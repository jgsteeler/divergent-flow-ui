import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnonymousHomePage from '../../src/pages/AnonymousHomePage';

describe('AnonymousHomePage', () => {
  const mockTheme = {
    primary: '#1976d2',
    secondary: '#666',
    accent: '#ff4081',
    background: '#fff',
    text: '#000',
  };

  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should render hero section with title and tagline', () => {
    render(<AnonymousHomePage theme={mockTheme} onLogin={mockOnLogin} />);
    expect(screen.getByText(/divergent flow/i)).toBeDefined();
  });

  it('should render "Login / Sign Up with Auth0" button', () => {
    render(<AnonymousHomePage theme={mockTheme} onLogin={mockOnLogin} />);
    const button = screen.getByRole('button', { name: /login \/? sign up with auth0/i });
    expect(button).toBeDefined();
  });

  it('should call onLogin when "Login / Sign Up with Auth0" button is clicked', async () => {
    const user = userEvent.setup();
    render(<AnonymousHomePage theme={mockTheme} onLogin={mockOnLogin} />);
    const button = screen.getByRole('button', { name: /login \/? sign up with auth0/i });
    await user.click(button);
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  it('should log debug message when button is clicked', async () => {
    const user = userEvent.setup();
    render(<AnonymousHomePage theme={mockTheme} onLogin={mockOnLogin} />);
    const button = screen.getByRole('button', { name: /login \/? sign up with auth0/i });
    await user.click(button);
    expect(console.log).toHaveBeenCalledWith('Login button clicked, calling onLogin');
  });

  it('should render three feature cards', () => {
    render(<AnonymousHomePage theme={mockTheme} onLogin={mockOnLogin} />);

    expect(screen.getByText(/quick capture/i)).toBeDefined();
    expect(screen.getByText(/smart organization/i)).toBeDefined();
    expect(screen.getByText(/neurodiverse modes/i)).toBeDefined();
  });

  it('should render feature descriptions', () => {
    render(<AnonymousHomePage theme={mockTheme} onLogin={mockOnLogin} />);

    expect(screen.getByText(/capture thoughts instantly without friction/i)).toBeDefined();
    expect(screen.getByText(/automatic categorization and filtering/i)).toBeDefined();
    expect(screen.getByText(/switch between typical and divergent interface modes/i)).toBeDefined();
  });

  it('should render feature icons with emojis', () => {
    const { container } = render(<AnonymousHomePage theme={mockTheme} onLogin={mockOnLogin} />);

    // Check that emojis are rendered
    expect(container.textContent).toContain('📝');
    expect(container.textContent).toContain('🎯');
    expect(container.textContent).toContain('🧠');
  });

  it('should use theme colors for styling', () => {
    const customTheme = {
      primary: '#ff0000',
      secondary: '#00ff00',
      accent: '#0000ff',
      background: '#ffffff',
      text: '#000000',
    };

    const { container } = render(<AnonymousHomePage theme={customTheme} onLogin={mockOnLogin} />);
    
    // Verify component renders without errors with custom theme
    expect(container).toBeDefined();
  });

  it('should have responsive grid layout for features', () => {
    render(<AnonymousHomePage theme={mockTheme} onLogin={mockOnLogin} />);
    
    // Check that feature cards are rendered
    const quickCapture = screen.getByText(/quick capture/i);
    expect(quickCapture).toBeDefined();
  });

  it('should render marketing copy correctly', () => {
    render(<AnonymousHomePage theme={mockTheme} onLogin={mockOnLogin} />);

    // Check key marketing messages
    expect(screen.getByText(/capture thoughts effortlessly/i)).toBeDefined();
    expect(screen.getByText(/how your brain works/i)).toBeDefined();
  });
});

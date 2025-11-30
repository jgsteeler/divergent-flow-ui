import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SingleCaptureForm from '../../src/components/SingleCaptureForm';
import * as captureService from '../../src/api/services/captureService';
import * as userService from '../../src/api/services/userService';
import { lightTheme } from '../../src/theme';
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { sub: 'user-123' },
    getAccessTokenSilently: vi.fn().mockResolvedValue('token'),
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock the services
vi.mock('../../src/api/services/captureService');
vi.mock('../../src/api/services/userService');

describe('SingleCaptureForm', () => {
  const mockOnCaptureCreated = vi.fn();
  const mockTheme = lightTheme;

  beforeEach(() => {
    vi.clearAllMocks();
    userService.userService.getUserIdByEmail = vi.fn().mockResolvedValue('user-123');
    // Mock sessionStorage with df_user_id
    sessionStorage.setItem('df_user_id', 'user-123');
    // Auth0 context is mocked globally above
  });

  it('should render the form with title and textarea', () => {
    render(
      <SingleCaptureForm theme={mockTheme} />
    );

    expect(screen.getByText('Single Capture')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your capture here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Capture' })).toBeInTheDocument();
  });

  it('should disable submit button when textarea is empty', () => {
    render(
        <SingleCaptureForm theme={mockTheme} />
    );

    const submitButton = screen.getByRole('button', { name: 'Capture' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when textarea has text', async () => {
    const user = userEvent.setup();
    render(
        <SingleCaptureForm theme={mockTheme} />
    );

    const textarea = screen.getByPlaceholderText('Type your capture here...');
    const submitButton = screen.getByRole('button', { name: 'Capture' });

    await user.type(textarea, 'Test capture');

    expect(submitButton).not.toBeDisabled();
  });

  it('should show error when submitting empty text', async () => {
    const user = userEvent.setup();
    render(
        <SingleCaptureForm theme={mockTheme} />
    );

    const textarea = screen.getByPlaceholderText('Type your capture here...');

    // Type and then clear - this will trigger validation on submit
    await user.type(textarea, 'Text');
    await user.clear(textarea);
    
    // Manually trigger form submit since button is disabled when empty
    const form = textarea.closest('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }

    await waitFor(() => {
      expect(screen.getByText('Please enter something to capture')).toBeInTheDocument();
    });
  });

  it('should submit capture successfully', async () => {
    const user = userEvent.setup();
    captureService.captureService.createCapture = vi.fn().mockResolvedValue({
      id: 'capture-123',
      userId: 'user-123',
      rawText: 'Test capture',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      migrated: false,
    });

    render(
        <SingleCaptureForm theme={mockTheme} onCaptureCreated={mockOnCaptureCreated} />
    );

    const textarea = screen.getByPlaceholderText('Type your capture here...');
    const submitButton = screen.getByRole('button', { name: 'Capture' });

    await user.type(textarea, 'Test capture');
    await user.click(submitButton);

    await waitFor(() => {
      expect(captureService.captureService.createCapture).toHaveBeenCalledWith({
        userId: 'user-123',
        rawText: 'Test capture',
        }, 'token');
    });

    await waitFor(() => {
      expect(screen.getByText('✓ Captured!')).toBeInTheDocument();
    });

    expect(mockOnCaptureCreated).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('');
  });

  it('should show error message on failed submission', async () => {
    const user = userEvent.setup();
    captureService.captureService.createCapture = vi.fn().mockRejectedValue(
      new Error('Network error')
    );

    render(
        <SingleCaptureForm theme={mockTheme} />
    );

    const textarea = screen.getByPlaceholderText('Type your capture here...');
    const submitButton = screen.getByRole('button', { name: 'Capture' });

    await user.type(textarea, 'Test capture');
    await user.click(submitButton);

    // Update waitFor matcher to handle flexible text matching
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Network error'))).toBeInTheDocument();
    });

    expect(textarea).toHaveValue('Test capture'); // Text should remain
  });

  it('should disable form while submitting', async () => {
    const user = userEvent.setup();
    let resolveCapture: ((response?: { id: string; userId: string; rawText: string; createdAt: string; updatedAt: string; migrated: boolean }) => void) | undefined;
    captureService.captureService.createCapture = vi.fn(() =>
      new Promise<{ id: string; userId: string; rawText: string; createdAt: string; updatedAt: string; migrated: boolean }>(resolve => { resolveCapture = resolve; })
    );

    render(
        <SingleCaptureForm theme={mockTheme} />
    );

    const textarea = screen.getByPlaceholderText('Type your capture here...');
    const submitButton = screen.getByRole('button', { name: 'Capture' });

    await user.type(textarea, 'Test capture');
    await user.click(submitButton);

    // Update waitFor matcher to handle flexible role matching
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Capturing.../i })).toBeInTheDocument();
    });

    // Resolve the promise
    if (resolveCapture) {
      resolveCapture({
        id: 'capture-123',
        userId: 'user-123',
        rawText: 'Test capture',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        migrated: false,
      });
    }

    // Wait for success state and check textarea is cleared
    await waitFor(() => {
      expect(screen.getByText('✓ Captured!')).toBeInTheDocument();
    });
    
    // Button should be disabled again because textarea is now empty
    expect(screen.getByRole('button', { name: 'Capture' })).toBeDisabled();
  });

  it('should trim whitespace from capture text', async () => {
    const user = userEvent.setup();
    captureService.captureService.createCapture = vi.fn().mockResolvedValue({
      id: 'capture-123',
      userId: 'user-123',
      rawText: 'Test capture',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      migrated: false,
    });

    render(
        <SingleCaptureForm theme={mockTheme} />
    );

    const textarea = screen.getByPlaceholderText('Type your capture here...');
    const submitButton = screen.getByRole('button', { name: 'Capture' });

    await user.type(textarea, '  Test capture  ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(captureService.captureService.createCapture).toHaveBeenCalledWith({
        userId: 'user-123',
        rawText: 'Test capture',
      }, 'token');
    });
  });
});

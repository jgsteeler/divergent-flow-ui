import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BulkCaptureForm from '../../src/components/BulkCaptureForm';
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

vi.mock('../../src/api/services/captureService');
vi.mock('../../src/api/services/userService');

const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

const mockOnCapturesCreated = vi.fn();
const mockTheme = lightTheme;

describe('BulkCaptureForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue('user-123');
    userService.userService.getUserIdByEmail = vi.fn().mockResolvedValue('user-123');
    mockOnCapturesCreated.mockClear();
  });

  it('should show item count in description', async () => {
    const user = userEvent.setup();
    render(<BulkCaptureForm theme={mockTheme} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    await user.type(textarea, 'First item\nSecond item\nThird item');
    expect(screen.getByText(/\(3 items\)/)).toBeInTheDocument();
  });

  it('should show singular "item" for one capture', async () => {
    const user = userEvent.setup();
    render(<BulkCaptureForm theme={mockTheme} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    await user.type(textarea, 'Single item');
    expect(screen.getByText(/\(1 item\)/)).toBeInTheDocument();
  });

  it('should disable submit button when textarea is empty', () => {
    render(<BulkCaptureForm theme={mockTheme} />);
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton.textContent).toContain('Capture 0 Items');
  });

  it('should filter out empty lines in count', async () => {
    const user = userEvent.setup();
    render(<BulkCaptureForm theme={mockTheme} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    await user.type(textarea, 'First item\n\n\nSecond item\n\n');
    expect(screen.getByText(/\(2 items\)/)).toBeInTheDocument();
  });

  it('should show error for empty submission', async () => {
    const user = userEvent.setup();
    render(<BulkCaptureForm theme={mockTheme} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    await user.type(textarea, '   \n\n   ');
    const form = textarea.closest('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
    await waitFor(() => {
      expect(screen.getByText('Please enter at least one capture')).toBeInTheDocument();
    });
  });

  it('should submit multiple captures successfully', async () => {
    const user = userEvent.setup();
    (captureService.captureService.createCapture as any) = vi.fn().mockResolvedValue({
      id: 'capture-123',
      userId: 'user-123',
      rawText: 'Test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      migrated: false,
    });
    render(<BulkCaptureForm theme={mockTheme} onCapturesCreated={mockOnCapturesCreated} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    const submitButton = screen.getByRole('button');
    await user.type(textarea, 'First capture\nSecond capture\nThird capture');
    await user.click(submitButton);
    await waitFor(() => {
      expect(captureService.captureService.createCapture).toHaveBeenCalledTimes(3);
    });
    expect(captureService.captureService.createCapture).toHaveBeenCalledWith({
      userId: 'user-123',
      rawText: 'First capture',
    }, 'token');
    expect(captureService.captureService.createCapture).toHaveBeenCalledWith({
      userId: 'user-123',
      rawText: 'Second capture',
    }, 'token');
    expect(captureService.captureService.createCapture).toHaveBeenCalledWith({
      userId: 'user-123',
      rawText: 'Third capture',
    }, 'token');
    await waitFor(() => {
      expect(screen.getByText('✓ 3 captured!')).toBeInTheDocument();
    });
    expect(mockOnCapturesCreated).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('');
  });

  it('should trim whitespace from each line', async () => {
    const user = userEvent.setup();
    (captureService.captureService.createCapture as any) = vi.fn().mockResolvedValue({
      id: 'capture-123',
      userId: 'user-123',
      rawText: 'Test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      migrated: false,
    });
    render(<BulkCaptureForm theme={mockTheme} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    const submitButton = screen.getByRole('button');
    await user.type(textarea, '  First capture  \n  Second capture  ');
    await user.click(submitButton);
    await waitFor(() => {
      expect(captureService.captureService.createCapture).toHaveBeenCalledWith({
        userId: 'user-123',
        rawText: 'First capture',
      }, 'token');
      expect(captureService.captureService.createCapture).toHaveBeenCalledWith({
        userId: 'user-123',
        rawText: 'Second capture',
      }, 'token');
    });
  });

  it('should show error message on failed submission', async () => {
    const user = userEvent.setup();
    (captureService.captureService.createCapture as any) = vi.fn().mockRejectedValue(
      new Error('Network error')
    );
    render(<BulkCaptureForm theme={mockTheme} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    const submitButton = screen.getByRole('button');
    await user.type(textarea, 'First capture\nSecond capture');
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
    expect(textarea).toHaveValue('First capture\nSecond capture');
  });

  it('should disable form while submitting', async () => {
    const user = userEvent.setup();
    let resolveCapture: any;
    (captureService.captureService.createCapture as any) = vi.fn(() => 
      new Promise(resolve => { resolveCapture = resolve; })
    );
    render(<BulkCaptureForm theme={mockTheme} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    const submitButton = screen.getByRole('button');
    await user.type(textarea, 'Test capture');
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Capturing...' })).toBeDisabled();
      expect(textarea).toBeDisabled();
    });
    resolveCapture({
      id: 'capture-123',
      userId: 'user-123',
      rawText: 'Test capture',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      migrated: false,
    });
    await waitFor(() => {
      expect(screen.getByText('✓ 1 captured!')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Capture 0 Items' })).toBeDisabled();
  });

  it('should update button text based on item count', async () => {
    const user = userEvent.setup();
    render(<BulkCaptureForm theme={mockTheme} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    await user.type(textarea, 'Single item');
    expect(screen.getByRole('button', { name: 'Capture 1 Item' })).toBeInTheDocument();
    await user.type(textarea, '\nSecond item');
    expect(screen.getByRole('button', { name: 'Capture 2 Items' })).toBeInTheDocument();
  });

  it('should handle mixed empty and non-empty lines', async () => {
    const user = userEvent.setup();
    (captureService.captureService.createCapture as any) = vi.fn().mockResolvedValue({
      id: 'capture-123',
      userId: 'user-123',
      rawText: 'Test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      migrated: false,
    });
    render(<BulkCaptureForm theme={mockTheme} />);
    const textarea = screen.getByPlaceholderText('Enter multiple captures, one per line...');
    const submitButton = screen.getByRole('button');
    await user.type(textarea, 'First\n\n\nSecond\n   \nThird');
    await user.click(submitButton);
    await waitFor(() => {
      expect(captureService.captureService.createCapture).toHaveBeenCalledTimes(3);
    });
    await waitFor(() => {
      expect(screen.getByText('✓ 3 captured!')).toBeInTheDocument();
    });
  });
});

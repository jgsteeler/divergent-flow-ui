import { useState } from 'react';
import type { FormEvent } from 'react';
import { captureService } from '../api/services/captureService';
import { useAuth } from '../context/useAuth';
import type { UserProfile } from 'oidc-client-ts';
import type { Theme } from '../theme';

interface BulkCaptureFormProps {
  theme: Theme;
  onCapturesCreated?: () => void;
}

export default function BulkCaptureForm({ theme, onCapturesCreated }: BulkCaptureFormProps) {
  const [captureText, setCaptureText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!captureText.trim()) {
      setFeedback({ type: 'error', message: 'Please enter at least one capture' });
      return;
    }

    // Split by lines and filter out empty lines
    const lines = captureText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      setFeedback({ type: 'error', message: 'No valid captures found' });
      return;
    }

    if (!user || !user.access_token) {
      setFeedback({ type: 'error', message: 'You must be logged in to capture' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const userId = (user.profile as UserProfile)?.sub as string;
      const token = user.access_token;
      
      // Create all captures in parallel
      await Promise.all(
        lines.map(line => 
          captureService.createCapture({
            userId,
            rawText: line,
          }, token)
        )
      );
      
      setFeedback({ 
        type: 'success', 
        message: `✓ Successfully captured ${lines.length} item${lines.length > 1 ? 's' : ''}!` 
      });
      setCaptureText('');
      
      // Notify parent component
      if (onCapturesCreated) {
        onCapturesCreated();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      console.error('Bulk capture error:', error);
      setFeedback({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to capture items' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Count non-empty lines
  const lineCount = captureText
    .split('\n')
    .filter(line => line.trim().length > 0).length;

  return (
    <div
      style={{
        background: theme.background,
        border: `1px solid ${theme.secondary}`,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ color: theme.primary, marginTop: 0, marginBottom: '8px' }}>
        Bulk Capture
      </h3>
      <p style={{ color: theme.secondary, fontSize: '14px', margin: '0 0 16px 0' }}>
        Enter one capture per line. {lineCount > 0 && `(${lineCount} item${lineCount > 1 ? 's' : ''})`}
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={captureText}
          onChange={(e) => setCaptureText(e.target.value)}
          placeholder="Enter multiple captures, one per line..."
          disabled={isSubmitting}
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: `1px solid ${theme.secondary}`,
            background: theme.background,
            color: theme.text,
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box',
            marginBottom: '12px',
            lineHeight: '1.5',
          }}
        />

        <button
          type="submit"
          disabled={isSubmitting || lineCount === 0}
          style={{
            background: isSubmitting || lineCount === 0 ? theme.secondary : theme.accent,
            color: theme.background,
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isSubmitting || lineCount === 0 ? 'not-allowed' : 'pointer',
            opacity: isSubmitting || lineCount === 0 ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          {isSubmitting ? 'Capturing...' : `Capture ${lineCount} Item${lineCount !== 1 ? 's' : ''}`}
        </button>
      </form>

      {feedback && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            borderRadius: '8px',
            background: feedback.type === 'success' ? theme.primary : '#dc3545',
            color: theme.background,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}

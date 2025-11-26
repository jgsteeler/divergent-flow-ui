import { useState } from 'react';
import type { FormEvent } from 'react';
import { captureService } from '../api/services/captureService';
import { useAuth } from '../context/useAuth';
import type { Theme } from '../theme';

interface SingleCaptureFormProps {
  theme: Theme;
  onCaptureCreated?: () => void;
}

export default function SingleCaptureForm({ theme, onCaptureCreated }: SingleCaptureFormProps) {
  const [captureText, setCaptureText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { user } = useAuth();
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!captureText.trim()) {
      setFeedback({ type: 'error', message: 'Please enter something to capture' });
      return;
    }

    if (!user || !user.access_token) {
      setFeedback({ type: 'error', message: 'You must be logged in to capture' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Get the Divergent Flow user ID (stored during login)
      const userId = sessionStorage.getItem('df_user_id');
      if (!userId) {
        throw new Error('User not provisioned. Please try logging out and back in.');
      }
      
      const token = user.access_token;
      await captureService.createCapture({
        userId,
        rawText: captureText.trim(),
      }, token);
      
      setFeedback({ type: 'success', message: '✓ Captured successfully!' });
      setCaptureText('');
      
      // Notify parent component
      if (onCaptureCreated) {
        onCaptureCreated();
      }
      
      // Clear success message after 2 seconds
      setTimeout(() => setFeedback(null), 2000);
    } catch (error) {
      console.error('Capture error:', error);
      setFeedback({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to capture' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <h3 style={{ color: theme.primary, marginTop: 0, marginBottom: '16px' }}>
        Single Capture
      </h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={captureText}
          onChange={(e) => setCaptureText(e.target.value)}
          placeholder="Type your capture here..."
          disabled={isSubmitting}
          style={{
            width: '100%',
            minHeight: '120px',
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
          }}
        />

        <button
          type="submit"
          disabled={isSubmitting || !captureText.trim()}
          style={{
            background: isSubmitting || !captureText.trim() ? theme.secondary : theme.accent,
            color: theme.background,
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isSubmitting || !captureText.trim() ? 'not-allowed' : 'pointer',
            opacity: isSubmitting || !captureText.trim() ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          {isSubmitting ? 'Capturing...' : 'Capture'}
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

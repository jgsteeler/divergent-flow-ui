import { useState } from 'react';
import type { FormEvent } from 'react';
import { captureService } from '../api/services/captureService';
import { useAuth } from '../context/useAuth';
import type { UserProfile } from 'oidc-client-ts';
import type { Theme } from '../theme';
import type { UiMode, NeuroMode } from '../utils/preferences';
import HamburgerMenu from './HamburgerMenu';

interface DivergentDashboardProps {
  theme: Theme;
  uiVersion: string;
  mode: UiMode;
  neuroMode: NeuroMode;
  onModeToggle: () => void;
  onNeuroModeToggle: () => void;
}

export default function DivergentDashboard({
  theme,
  uiVersion,
  mode,
  neuroMode,
  onModeToggle,
  onNeuroModeToggle,
}: DivergentDashboardProps) {
  const [captureText, setCaptureText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
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
      const userId = (user.profile as UserProfile)?.sub as string;
      const token = user.access_token;
      await captureService.createCapture({
        userId,
        rawText: captureText.trim(),
      }, token);
      
      setFeedback({ type: 'success', message: '✓ Captured!' });
      setCaptureText('');
      
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
        minHeight: '100vh',
        width: '100vw',
        background: theme.background,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <HamburgerMenu
        theme={theme}
        uiVersion={uiVersion}
        mode={mode}
        neuroMode={neuroMode}
        onModeToggle={onModeToggle}
        onNeuroModeToggle={onNeuroModeToggle}
      />

      <div style={{ maxWidth: '600px', width: '100%' }}>
        {/* Title */}
        <h1
          style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            marginBottom: '3rem',
            color: theme.primary,
            fontWeight: 600,
          }}
        >
          Capture
        </h1>

        {/* Capture Form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="capture-input"
            style={{
              display: 'block',
              fontSize: '1.25rem',
              marginBottom: '1rem',
              color: theme.text,
              fontWeight: 500,
            }}
          >
            What's on your mind?
          </label>

          <textarea
            id="capture-input"
            value={captureText}
            onChange={(e) => setCaptureText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                handleSubmit(e);
              }
            }}
            disabled={isSubmitting}
            placeholder="Type anything... (Cmd+Enter to submit)"
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '20px',
              fontSize: '1.125rem',
              borderRadius: '12px',
              border: `2px solid ${theme.primary}`,
              background: theme.background,
              color: theme.text,
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              marginBottom: '1.5rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            autoFocus
          />

          <button
            type="submit"
            disabled={isSubmitting || !captureText.trim()}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '1.25rem',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              background: isSubmitting || !captureText.trim() ? theme.secondary : theme.accent,
              color: theme.background,
              cursor: isSubmitting || !captureText.trim() ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || !captureText.trim() ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {isSubmitting ? 'Capturing...' : 'Capture'}
          </button>
        </form>

        {/* Feedback Message */}
        {feedback && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '16px',
              borderRadius: '8px',
              background: feedback.type === 'success' ? theme.primary : '#dc3545',
              color: theme.background,
              textAlign: 'center',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
}

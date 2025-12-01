import { useState } from 'react';
import type { FormEvent } from 'react';
import { captureService } from '../api/services/captureService';
import { useAuth0 } from '@auth0/auth0-react';
import type { Theme } from '../theme';
import type { NeuroMode } from '../utils/preferences';
import HamburgerMenu from './HamburgerMenu';
import './DashboardResponsive.css';

interface DivergentDashboardProps {
  theme: Theme;
  uiVersion: string;
  neuroMode: NeuroMode;
  onNeuroModeToggle: () => void;
}

export default function DivergentDashboard({
  theme,
  uiVersion,
  neuroMode,
  onNeuroModeToggle,
}: DivergentDashboardProps) {
  const [captureText, setCaptureText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!captureText.trim()) {
      setFeedback({ type: 'error', message: 'Please enter something to capture' });
      return;
    }

    if (!isAuthenticated || !user) {
      setFeedback({ type: 'error', message: 'You must be logged in to capture' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const userId = user.sub;
      if (!userId) {
        setFeedback({ type: 'error', message: 'User ID missing. Please log in again.' });
        setIsSubmitting(false);
        return;
      }
      const token = await getAccessTokenSilently();
      await captureService.createCapture({
        userId,
        rawText: captureText.trim(),
      }, token);
      
      setFeedback({ type: 'success', message: '\u2713 Captured!' });
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
    <div className="dashboard-container">
      <h1 className="dashboard-title">Capture</h1>
      <form className="dashboard-form" onSubmit={handleSubmit}>
        <label htmlFor="capture-input" style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
          What's on your mind?
        </label>
        <textarea
          id="capture-input"
          className="dashboard-textarea"
          value={captureText}
          onChange={e => setCaptureText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) { handleSubmit(e); } }}
          disabled={isSubmitting}
          placeholder="Type anything... (Cmd+Enter to submit)"
          style={{ width: '100%', minHeight: '150px', padding: '20px', fontSize: '1.125rem', borderRadius: '12px', border: `2px solid ${theme.primary}`, background: theme.background, color: theme.text, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1.5rem', outline: 'none', transition: 'border-color 0.2s' }}
          autoFocus
        />
        <button
          type="submit"
          className="dashboard-submit-btn"
          disabled={isSubmitting || !captureText.trim()}
          style={{ width: '100%', padding: '18px', fontSize: '1.25rem', fontWeight: 600, borderRadius: '12px', border: 'none', background: isSubmitting || !captureText.trim() ? theme.secondary : theme.accent, color: theme.background, cursor: isSubmitting || !captureText.trim() ? 'not-allowed' : 'pointer', opacity: isSubmitting || !captureText.trim() ? 0.6 : 1, transition: 'all 0.2s' }}
        >
          {isSubmitting ? 'Capturing...' : 'Capture'}
        </button>
        {feedback && (
          <div className="dashboard-feedback" style={{ background: feedback.type === 'success' ? theme.primary : '#dc3545' }}>
            {feedback.message}
          </div>
        )}
      </form>
      {neuroMode === 'divergent' && (
        <HamburgerMenu
          theme={theme}
          uiVersion={uiVersion}
          neuroMode={neuroMode}
          onNeuroModeToggle={onNeuroModeToggle}
        />
      )}
    </div>
  );
}

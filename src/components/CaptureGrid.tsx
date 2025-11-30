import { useState, useEffect, useCallback } from 'react';
import { captureService } from '../api/services/captureService';
import { useAuth0 } from '@auth0/auth0-react';
import type { Theme } from '../theme';
import type { Capture } from '../api/schemas/captureSchema';

interface CaptureGridProps {
  theme: Theme;
  refreshTrigger?: number;
}

export default function CaptureGrid({ theme, refreshTrigger }: CaptureGridProps) {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const loadCaptures = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setError('You must be logged in to view captures');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userId = user.sub;
      if (!userId) {
        setError('User ID is missing. Please log in again.');
        setLoading(false);
        return;
      }
      const token = await getAccessTokenSilently();
      const allCaptures = await captureService.listCapturesByUser(userId, token, false);
      setCaptures(allCaptures);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load captures');
      setLoading(false);
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    loadCaptures();
  }, [refreshTrigger, loadCaptures]);

  const handleEditStart = (capture: Capture) => {
    setEditingId(capture.id);
    setEditText(capture.rawText);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleEditSave = async (capture: Capture) => {
    if (!user || !user.access_token) {
      alert('You must be logged in to update captures');
      return;
    }

    if (!editText.trim()) {
      alert('Capture text cannot be empty');
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      await captureService.updateCapture({
        id: capture.id,
        userId: capture.userId,
        rawText: editText.trim(),
      }, token);
      
      // Update local state
      setCaptures(captures.map(c => 
        c.id === capture.id ? { ...c, rawText: editText.trim() } : c
      ));
      
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to update capture:', err);
      alert(err instanceof Error ? err.message : 'Failed to update capture');
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !user.access_token) {
      alert('You must be logged in to delete captures');
      return;
    }

    if (!confirm('Are you sure you want to delete this capture?')) {
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      await captureService.deleteCapture(id, token);
      setCaptures(captures.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete capture:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete capture');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: theme.background,
          border: `1px solid ${theme.secondary}`,
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ color: theme.secondary }}>Loading captures...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: theme.background,
          border: `1px solid #dc3545`,
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ color: '#dc3545', fontWeight: 600 }}>Error: {error}</div>
        <button
          onClick={loadCaptures}
          style={{
            marginTop: '12px',
            background: theme.accent,
            color: theme.background,
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (captures.length === 0) {
    return (
      <div
        style={{
          background: theme.background,
          border: `1px solid ${theme.secondary}`,
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <div style={{ color: theme.secondary }}>No unmigrated captures yet</div>
      </div>
    );
  }

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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h3 style={{ color: theme.primary, margin: 0 }}>
          Unmigrated Captures ({captures.length})
        </h3>
        <button
          onClick={loadCaptures}
          style={{
            background: theme.secondary,
            color: theme.background,
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {captures.map(capture => (
          <div
            key={capture.id}
            style={{
              background: theme.background,
              border: `1px solid ${theme.secondary}`,
              borderRadius: '8px',
              padding: '16px',
              transition: 'border-color 0.2s',
            }}
          >
            {editingId === capture.id ? (
              // Edit mode
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.primary}`,
                    background: theme.background,
                    color: theme.text,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    marginBottom: '8px',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditSave(capture)}
                    style={{
                      background: theme.accent,
                      color: theme.background,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    style={{
                      background: theme.secondary,
                      color: theme.background,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div>
                <div
                  style={{
                    color: theme.text,
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {capture.rawText}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: '12px', color: theme.secondary }}>
                    {new Date(capture.createdAt).toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditStart(capture)}
                      style={{
                        background: 'transparent',
                        color: theme.primary,
                        border: `1px solid ${theme.primary}`,
                        borderRadius: '6px',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(capture.id)}
                      style={{
                        background: 'transparent',
                        color: '#dc3545',
                        border: '1px solid #dc3545',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

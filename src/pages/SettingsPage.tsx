import type { Theme } from '../theme';
import type { UiMode, NeuroMode } from '../utils/preferences';

interface SettingsPageProps {
  theme: Theme;
  mode: UiMode;
  neuroMode: NeuroMode;
  onModeToggle: () => void;
  onNeuroModeToggle: () => void;
}

export default function SettingsPage({
  theme,
  neuroMode,
  onNeuroModeToggle,
}: SettingsPageProps) {
  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ color: theme.primary, marginBottom: '32px' }}>Settings</h1>

      {/* Only neuro mode toggle remains; appearance section removed */}

      {/* Interface Section */}
      <section
        style={{
          background: theme.background,
          border: `1px solid ${theme.secondary}`,
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h2
          style={{
            color: theme.primary,
            fontSize: '20px',
            marginTop: 0,
            marginBottom: '20px',
          }}
        >
          Interface
        </h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
              Neuro Mode
            </div>
            <div style={{ fontSize: '14px', color: theme.secondary }}>
              Choose between divergent (minimal) or typical (full-featured) interface
            </div>
          </div>
          <button
            onClick={onNeuroModeToggle}
            style={{
              background: theme.secondary,
              color: theme.background,
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {neuroMode === 'divergent' ? 'Switch to Typical Mode' : 'Switch to Divergent Mode'}
          </button>
        </div>
      </section>

      {/* Info Box */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          background: theme.primary,
          color: theme.background,
          borderRadius: '8px',
          fontSize: '14px',
        }}
      >
        <strong>💡 Tip:</strong> Your preferences are automatically saved and will persist across sessions.
      </div>
    </div>
  );
}

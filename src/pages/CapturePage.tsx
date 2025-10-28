import type { Theme } from '../theme';

interface CapturePageProps {
  theme: Theme;
}

export default function CapturePage({ theme }: CapturePageProps) {
  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ color: theme.primary, marginBottom: '32px' }}>Capture Management</h1>

      {/* Placeholder content */}
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
        <h2 style={{ color: theme.primary, marginBottom: '16px' }}>
          Capture CRUD Interface
        </h2>
        <p style={{ color: theme.secondary, fontSize: '16px', marginBottom: '24px' }}>
          This page will allow you to view, edit, and manage your captured items.
        </p>
        <div
          style={{
            display: 'inline-block',
            background: theme.primary,
            color: theme.background,
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          Coming Soon
        </div>
      </div>
    </div>
  );
}

import type { Theme } from '../theme';

interface AnonymousHomePageProps {
  theme: Theme;
  onLogin: () => void;
}

export default function AnonymousHomePage({ theme, onLogin }: AnonymousHomePageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)',
        padding: 'max(2vw, 16px)',
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          background: theme.primary,
          color: theme.background,
          borderRadius: 20,
          padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 6vw, 4rem)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          maxWidth: '800px',
          minWidth: 'min(320px, 100vw)',
          width: '100%',
          textAlign: 'center',
          margin: '0 auto 3rem',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 48, letterSpacing: 1 }}>Divergent Flow</h1>
        <h2 style={{ margin: '0.5rem 0 1.5rem', fontWeight: 400, color: theme.accent, fontSize: 24 }}>
          Empowering Neurodivergent Minds to Flow
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, margin: '1.5rem 0' }}>
          A productivity system designed specifically for neurodivergent minds.
          Capture thoughts effortlessly, organize naturally, and achieve your goals your way.
        </p>

        <button
          onClick={() => {
            console.log('Login button clicked, calling onLogin');
            onLogin();
          }}
          style={{
            marginTop: '1.5rem',
            padding: '16px 48px',
            background: theme.accent,
            color: theme.background,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '22px',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          Login / Sign Up with Auth0
        </button>
      </div>

      {/* Features Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto 3rem',
        }}
      >
        <FeatureCard
          theme={theme}
          icon="📝"
          title="Quick Capture"
          description="Capture thoughts instantly without friction. Single or bulk entry modes designed for how your brain works."
        />
        <FeatureCard
          theme={theme}
          icon="🎯"
          title="Smart Organization"
          description="Automatic categorization and filtering. Find what you need when you need it."
        />
        <FeatureCard
          theme={theme}
          icon="🧠"
          title="Neurodiverse Modes"
          description="Switch between Typical and Divergent interface modes. Designed for ADHD, autism, and other neurodivergent minds."
        />
      </div>

      <footer
        style={{
          marginTop: 40,
          fontSize: 13,
          color: theme.secondary,
          opacity: 0.8,
          width: '100%',
          textAlign: 'center',
        }}
      >
        &copy; {new Date().getFullYear()} GSC Prod, a division of Gibson Service Company, LLC
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  theme: Theme;
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ theme, icon, title, description }: FeatureCardProps) {
  return (
    <div
      style={{
        background: theme.background,
        border: `2px solid ${theme.secondary}`,
        borderRadius: 12,
        padding: '24px',
        textAlign: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: 48, marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 12px', color: theme.primary, fontSize: 20 }}>{title}</h3>
      <p style={{ margin: 0, color: theme.text, fontSize: 15, lineHeight: 1.5, opacity: 0.9 }}>
        {description}
      </p>
    </div>
  );
}

import type { Theme } from '../theme';
import './AnonymousHomePage.css';

interface AnonymousHomePageProps {
  theme: Theme;
  onLogin: () => void;
}

export default function AnonymousHomePage({ theme, onLogin }: AnonymousHomePageProps) {
  const handleLoginClick = () => {
    console.log('Login button clicked, calling onLogin');
    onLogin();
  };

  return (
    <div className="anonymous-home-container">
      {/* Hero Section */}
      <div className="anonymous-hero">
        <h1 style={{ margin: 0, fontSize: 48, letterSpacing: 1 }}>Divergent Flow</h1>
        <h2 style={{ margin: '0.5rem 0 1.5rem', fontWeight: 400, color: theme.accent, fontSize: 24 }}>
          Empowering Neurodivergent Minds to Flow
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, margin: '1.5rem 0' }}>
          A productivity system designed specifically for neurodivergent minds.
          Capture thoughts effortlessly, organize naturally, and achieve your goals your way.
        </p>
        <button
          className="anonymous-login-btn"
          onClick={handleLoginClick}
        >
          Log In
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

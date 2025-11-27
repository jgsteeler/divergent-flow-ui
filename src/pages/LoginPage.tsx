import { useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import type { Theme } from '../theme';

interface LoginPageProps {
  theme: Theme;
}

export default function LoginPage({ theme }: LoginPageProps) {
  const { user, login, isLoading } = useAuth();

  // If already logged in, this page shouldn't be shown
  // (handled by parent component routing logic)
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirect should happen');
    }
  }, [user]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: theme.background,
          color: theme.text,
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
        <div>Loading authentication...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: theme.background,
        color: theme.text,
        padding: '24px',
      }}
    >
      <div
        style={{
          background: theme.primary,
          color: theme.background,
          borderRadius: 20,
          padding: '3rem 4rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: '0 0 1rem', fontSize: 36 }}>Welcome to Divergent Flow</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, margin: '1.5rem 0', opacity: 0.9 }}>
          Sign in to access your captures and productivity tools designed for neurodivergent minds.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={login}
            style={{
              padding: '16px 48px',
              background: theme.accent,
              color: theme.background,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 600,
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
            Login / Sign Up
          </button>
        </div>

        <p style={{ fontSize: 14, marginTop: '2rem', opacity: 0.8 }}>
          By signing in, you'll be redirected to our secure authentication provider.
          New users will have the option to create a free account.
        </p>
      </div>
    </div>
  );
}

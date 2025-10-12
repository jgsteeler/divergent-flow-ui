import { getConfig } from './config';

export default function NonProdBanner() {
  const { ENVIRONMENT, VERSION } = getConfig();
  if (!ENVIRONMENT || ['production', 'localprod'].includes(ENVIRONMENT.toLowerCase())) {
    return null;
  }
  return (
    <div
      style={{
        width: '100%',
        background: '#ffe066',
        color: '#222',
        fontWeight: 700,
        fontSize: 16,
        padding: '8px 0',
        textAlign: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        letterSpacing: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {ENVIRONMENT.toUpperCase()} ENVIRONMENT &mdash; UI Version: {VERSION}
    </div>
  );
}
import LandingPage from './LandingPage';
import { ModeProvider } from './context/ModeContext.tsx';

export default function App() {
  return (
    <ModeProvider>
      <LandingPage />
    </ModeProvider>
  );
}

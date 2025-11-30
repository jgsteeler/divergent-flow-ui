import LandingPage from './LandingPage';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <LandingPage />
    </ThemeProvider>
  );
}

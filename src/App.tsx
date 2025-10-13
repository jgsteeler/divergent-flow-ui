
import LandingPage from './LandingPage';
import NonProdBanner from './NonProdBanner';
import { getConfig } from './config';

export default function App() {
  const { ENVIRONMENT } = getConfig();
  const showBanner = ENVIRONMENT && !['production', 'localprod'].includes(ENVIRONMENT.toLowerCase());
  return (
    <>
      {showBanner && <NonProdBanner />}
      <div>
        <LandingPage />
      </div>
    </>
  );
}

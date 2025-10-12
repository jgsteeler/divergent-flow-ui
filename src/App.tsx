import LandingPage from './LandingPage';
import NonProdBanner from './NonProdBanner';

export default function App() {
  return (
    <>
      <NonProdBanner />
      <div style={{ paddingTop: 40 }}>
        <LandingPage />
      </div>
    </>
  );
}

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Country Profiles - SignalAtlas',
  description: 'Geopolitical profiles and analysis by country.',
};

export default function CountriesPage() {
  return (
    <>
      <Nav />
      <main className="main" style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: 'var(--ink)' }}>Countries</h1>
        <p style={{ color: 'var(--ink3)', marginBottom: 40 }}>Browse research and intelligence by nation state.</p>
        
        <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink2)', marginBottom: 12 }}>
            Country Directory Coming Soon
          </div>
          <p style={{ color: 'var(--ink3)' }}>
            We are indexing historical data to provide comprehensive national power profiles.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Global Conflicts - SignalAtlas',
  description: 'Monitor ongoing global conflicts and flashpoints.',
};

export default function ConflictsPage() {
  return (
    <>
      <Nav />
      <main className="main" style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: 'var(--ink)' }}>Global Conflicts</h1>
        <p style={{ color: 'var(--ink3)', marginBottom: 40 }}>Tracking active geopolitical flashpoints and proxy wars.</p>
        
        <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink2)', marginBottom: 12 }}>
            Interactive Conflict Map Coming Soon
          </div>
          <p style={{ color: 'var(--ink3)' }}>
            We are currently aggregating high-confidence data for the conflict monitor.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

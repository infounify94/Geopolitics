import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Research Topics - SignalAtlas',
  description: 'Browse geopolitical research by topic.',
};

export default function TopicsPage() {
  return (
    <>
      <Nav />
      <main className="main" style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: 'var(--ink)' }}>Topics</h1>
        <p style={{ color: 'var(--ink3)', marginBottom: 40 }}>Explore intelligence by overarching themes and patterns.</p>
        
        <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink2)', marginBottom: 12 }}>
            Topic Explorer Coming Soon
          </div>
          <p style={{ color: 'var(--ink3)' }}>
            We are finalizing our taxonomy of economic warfare, power networks, and strategic trends.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Us - SignalAtlas',
  description: 'Learn about SignalAtlas.',
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="main" style={{ padding: '80px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, color: 'var(--ink)' }}>About SignalAtlas</h1>
        <div className="card card-pad" style={{ lineHeight: 1.8, color: 'var(--ink3)' }}>
          <p style={{ marginBottom: 16 }}>
            SignalAtlas is an advanced geopolitical intelligence platform that tracks and analyzes global events, power networks, economic warfare, and shifting alliances. We leverage cutting-edge pattern recognition to identify the signals hidden in the noise of global news.
          </p>
          <p style={{ marginBottom: 16 }}>
            Our mission is to provide deep, analytical insights that go beyond standard reporting, giving you the context needed to understand the true drivers of international relations.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

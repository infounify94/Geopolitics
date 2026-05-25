import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service - SignalAtlas',
  description: 'Terms of service for SignalAtlas.',
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="main" style={{ padding: '80px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, color: 'var(--ink)' }}>Terms of Service</h1>
        <div className="card card-pad" style={{ lineHeight: 1.8, color: 'var(--ink3)' }}>
          <p style={{ marginBottom: 16 }}>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>1. Acceptance of Terms</h2>
          <p>By accessing and using SignalAtlas, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
          
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>2. Use of Content</h2>
          <p>All content provided on this website is for informational purposes only. The owners make no representations as to the accuracy or completeness of any information on this site or found by following any link on this site.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>3. Copyright</h2>
          <p>The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights, trademarks, and other proprietary rights. The copying, redistribution, use, or publication by you of any such matters or any part of the Site is strictly prohibited without explicit permission.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy - SignalAtlas',
  description: 'Privacy policy for SignalAtlas.',
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="main" style={{ padding: '80px 20px', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, color: 'var(--ink)' }}>Privacy Policy</h1>
        <div className="card card-pad" style={{ lineHeight: 1.8, color: 'var(--ink3)' }}>
          <p style={{ marginBottom: 16 }}>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>1. Information We Collect</h2>
          <p>We may collect personal information such as your name and email address when you voluntarily submit it through our contact forms or newsletter subscription. We also automatically collect standard analytics data such as IP addresses, browser types, and usage patterns through cookies and similar technologies.</p>
          
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>2. Use of Information</h2>
          <p>The information we collect is used to improve our website, respond to your inquiries, send periodic emails (if subscribed), and analyze traffic patterns to optimize content delivery.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>3. Third-Party Services & Cookies</h2>
          <p>We use third-party services, including Google AdSense, which use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</p>
          
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us via our Contact page.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

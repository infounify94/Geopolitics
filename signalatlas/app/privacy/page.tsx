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
          
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>1. Introduction</h2>
          <p>Welcome to SignalAtlas ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>
          
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>2. Data We Collect</h2>
          <p>We may collect, use, store, and transfer different kinds of personal data about you, including:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li><strong>Identity Data:</strong> includes first name, last name, username, or similar identifier when you contact us.</li>
            <li><strong>Contact Data:</strong> includes email address if you subscribe to our newsletter.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website.</li>
          </ul>
          
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>3. Third-Party Services & Google AdSense</h2>
          <p>We use third-party services, including Google AdSense, to display advertisements on our website. These third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.</p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--blue)'}}>Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" style={{color: 'var(--blue)'}}>www.aboutads.info</a>.</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>4. Cookie Policy & Consent</h2>
          <p>Cookies are small text files that are placed on your computer by websites that you visit. We use necessary cookies to make our site work, and optional analytics and advertising cookies to help us improve it and fund our research.</p>
          <p><strong>EEA/UK Users (GDPR compliance):</strong> If you are located in the European Economic Area or the UK, we will request your consent before placing non-essential cookies (such as those used by Google AdSense and analytics providers) on your device. You have the right to withdraw your consent at any time.</p>
          <p><strong>California Users (CCPA compliance):</strong> Under the California Consumer Privacy Act, you have the right to opt-out of the sale of your personal information. SignalAtlas does not "sell" personal information in the traditional sense, but allowing advertising cookies may be considered a sale under CCPA. You can manage your cookie preferences through your browser settings or via our cookie banner.</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>5. Data Retention</h2>
          <p>We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. Analytics data is typically anonymized or deleted after 14 to 26 months.</p>
          
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>6. Your Legal Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</p>
          
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink2)', margin: '24px 0 12px' }}>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, including any requests to exercise your legal rights, please contact us at <a href="mailto:contact@worldcraftmedia.com" style={{color: 'var(--blue)'}}>contact@worldcraftmedia.com</a>.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

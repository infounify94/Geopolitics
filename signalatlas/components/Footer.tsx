import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">SignalAtlas</div>
            <p className="footer-tagline">
              Global events explained through evidence, timelines, data, and India context.
              Independent research — not news, not opinion.
            </p>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,.2)', marginTop: '.75rem', letterSpacing: '.08em' }}>
              CONFIDENCE-SCORED · SOURCE-ATTRIBUTED · INDIA-FOCUSED
            </p>
          </div>

          {/* Research */}
          <div>
            <div className="footer-col-title">Research</div>
            <div className="footer-links">
              <Link href="/topics/power-networks">Power Networks</Link>
              <Link href="/topics/trade-wars">Trade Wars</Link>
              <Link href="/topics/sanctions">Sanctions</Link>
              <Link href="/topics/media-bias">Media Bias</Link>
              <Link href="/topics/brics">BRICS</Link>
            </div>
          </div>

          {/* Regions */}
          <div>
            <div className="footer-col-title">Regions</div>
            <div className="footer-links">
              <Link href="/topics/middle-east">Middle East</Link>
              <Link href="/topics/south-asia">South Asia</Link>
              <Link href="/topics/africa">Africa</Link>
              <Link href="/topics/americas">Americas</Link>
              <Link href="/topics/europe">Europe</Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <div className="footer-col-title">Platform</div>
            <div className="footer-links">
              <Link href="/methodology">Methodology</Link>
              <Link href="/sources">Data Sources</Link>
              <Link href="/confidence">Confidence System</Link>
              <Link href="/about">About</Link>
              <Link href="/team">Our Team</Link>
              <Link href="#subscribe">Subscribe</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} SignalAtlas · All research based on publicly available sources</div>
          <div className="footer-bottom-links">
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

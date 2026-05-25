import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            Signal<span style={{ color: 'var(--red)', fontStyle: 'italic' }}>Atlas</span>
          </div>
          <div className="footer-desc">
            Global events explained through evidence, timelines, data, and India context.
            Independent research — not news, not opinion. Every claim attributed.
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--ink4)' }}>
            Confidence-scored · Source-attributed · India-focused
          </div>
        </div>
        {[
          { head: 'Research',  links: [['Power Networks', '/topics/power-networks'], ['Trade Wars', '/topics/trade-wars'], ['Sanctions', '/topics/sanctions'], ['Media Bias', '/topics/media-bias']] },
          { head: 'Regions',   links: [['Middle East', '/topics/middle-east'], ['South Asia', '/topics/south-asia'], ['Africa', '/topics/africa'], ['Americas', '/topics/americas']] },
          { head: 'Platform',  links: [['Methodology', '/methodology'], ['Data Sources', '/sources'], ['Confidence System', '/confidence'], ['Subscribe', '#subscribe']] },
        ].map(col => (
          <div key={col.head}>
            <div className="footer-head">{col.head}</div>
            {col.links.map(([label, href]) => (
              <Link key={label} href={href} className="footer-link">{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SignalAtlas · All research based on publicly available sources</span>
        <span>Methodology · Privacy · Sources</span>
      </div>
    </footer>
  );
}

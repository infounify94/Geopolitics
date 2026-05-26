import Link from 'next/link';
import type { Article } from '@/lib/types';

interface Props { articles: Article[]; }

const INDIA_FALLBACK = [
  { title: 'Apple India supply chain — What it means for Indian manufacturing jobs and GDP', meta: 'Impact 8.8 · Power Networks', slug: 'apple-india-pivot-supply-chain-geopolitics' },
  { title: 'Rubio India visit — The silent shift in US–India tech trade relations',           meta: 'Impact 8.5 · Diplomacy',      slug: 'marco-rubio-india-visit-tariffs-tech-geopolitics' },
  { title: 'Strait of Hormuz disruption — India\'s oil import vulnerability exposed',         meta: 'Impact 9.0 · Economic Warfare',slug: 'strait-of-hormuz-closure-disrupts-global-supply-chains' },
  { title: 'BRICS expansion — India\'s dollar hedge in an era of de-dollarisation',          meta: 'Impact 8.2 · BRICS',           slug: '#' },
  { title: 'Sudan conflict — The underreported India connection in the Red Sea crisis',       meta: 'Impact 7.6 · Conflicts',       slug: '#' },
];

export default function IndiaBand({ articles }: Props) {
  // Filter India-lens articles or fallback
  const indiaArts = articles.length > 0
    ? articles.filter(a => a.category === 'INDIA LENS' || a.countries?.includes('India')).slice(0, 5)
    : [];

  const items = indiaArts.length > 0
    ? indiaArts.map(a => ({ title: a.title, meta: `Impact ${a.impact_score} · ${a.category}`, slug: a.slug }))
    : INDIA_FALLBACK;

  return (
    <div className="india-band">
      <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="india-grid reveal">
          {/* Identity column */}
          <div>
            <div className="india-flag-accent">
              <div className="ifa-saffron" />
              <div className="ifa-white"><div className="ifa-chakra" /></div>
              <div className="ifa-green" />
            </div>
            <div className="india-tag">India Lens — Analytical Section</div>
            <h2 className="india-title">Strategic Analysis for South Asia</h2>
            <p className="india-desc">
              SignalAtlas tracks every major global development through a South Asia lens.
              How wars, sanctions, supply chain disruptions, and alliance shifts affect
              India's economy, security architecture, and strategic positioning globally.
            </p>
            <Link href="/topics/india-lens" className="btn-primary" style={{ marginTop: '1.25rem' }}>
              Explore India Analysis →
            </Link>
          </div>

          {/* Articles column */}
          <div className="india-articles">
            {items.map((item, i) => (
              <Link key={i} href={`/research/${item.slug}`} className="india-art">
                <div className="india-art-num">0{i + 1}</div>
                <div>
                  <div className="india-art-title">{item.title}</div>
                  <div className="india-art-meta">{item.meta}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

const TOPICS = [
  { label: 'Power Networks',   count: 14, slug: 'power-networks'  },
  { label: 'Color Revolutions',count: 8,  slug: 'color-revolutions'},
  { label: 'IMF Trap',         count: 6,  slug: 'imf-trap'         },
  { label: 'Arms Trade',       count: 11, slug: 'arms-trade'       },
  { label: 'Proxy Wars',       count: 18, slug: 'proxy-wars'       },
  { label: 'Dollar Decline',   count: 9,  slug: 'dollar-decline'   },
  { label: 'Media Bias',       count: 7,  slug: 'media-bias'       },
  { label: 'India Lens',       count: 22, slug: 'india-lens'       },
  { label: 'Sanctions',        count: 16, slug: 'sanctions'        },
  { label: 'Resource Wars',    count: 12, slug: 'resource-wars'    },
  { label: 'BRICS',            count: 10, slug: 'brics'            },
  { label: 'Regime Change',    count: 9,  slug: 'regime-change'    },
  { label: 'Economic Warfare', count: 19, slug: 'economic-warfare' },
  { label: 'Conflicts',        count: 31, slug: 'conflicts'        },
  { label: 'Trade Wars',       count: 13, slug: 'trade-wars'       },
];

export default function TopicStrip() {
  return (
    <div className="section">
      <div className="section-header reveal">
        <div>
          <div className="section-num">03 — Signal Radar</div>
          <div className="section-title">Browse by Topic</div>
        </div>
        <Link href="/topics" className="section-link">All Topics ↗</Link>
      </div>
      <div className="topic-grid reveal">
        {TOPICS.map(t => (
          <Link key={t.slug} href={`/topics/${t.slug}`} className="topic-chip">
            {t.label}
            <span className="tc-count">{t.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';

const TOPICS = [
  'Power Networks', 'Color Revolutions', 'IMF Trap', 'Arms Trade', 'Proxy Wars',
  'Dollar Decline', 'Media Bias', 'India Lens', 'Sanctions', 'Resource Wars',
  'BRICS', 'Regime Change', 'Economic Warfare', 'Conflicts',
];

export default function TopicStrip() {
  return (
    <div className="topic-strip fade" style={{ animationDelay: '0.2s' }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)', letterSpacing: '0.12em', whiteSpace: 'nowrap', marginRight: 4 }}>
        EXPLORE →
      </span>
      {TOPICS.map(t => (
        <Link
          key={t}
          href={`/topics/${t.toLowerCase().replace(/\s+/g, '-')}`}
          className="topic-tag"
        >
          {t}
        </Link>
      ))}
    </div>
  );
}

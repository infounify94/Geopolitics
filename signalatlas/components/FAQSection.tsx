import type { FAQ } from '@/lib/types';

interface Props { faqs: FAQ[]; articleTitle: string; }

export default function FAQSection({ faqs, articleTitle }: Props) {
  if (!faqs || faqs.length === 0) return null;

  // JSON-LD FAQPage schema for Google AI Overview
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section className="faq-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="sec-head" style={{ marginBottom: 4 }}>
        <div className="sec-bar" style={{ background: 'var(--blue)' }} />
        <div className="sec-title">Frequently Asked Questions</div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--ink4)', marginBottom: 16 }}>
        Key questions answered from the research
      </p>
      {faqs.map((faq, i) => (
        <div key={i} className="faq-item">
          <div className="faq-q">
            <span>{faq.question}</span>
            <span style={{ color: 'var(--ink4)', flexShrink: 0, fontSize: 16 }}>+</span>
          </div>
          <div className="faq-a">{faq.answer}</div>
        </div>
      ))}
    </section>
  );
}

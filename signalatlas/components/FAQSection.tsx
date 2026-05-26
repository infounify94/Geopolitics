'use client';
import { useState } from 'react';
import type { FAQ } from '@/lib/types';

interface Props { faqs: FAQ[]; articleTitle: string; }

export default function FAQSection({ faqs, articleTitle }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  // JSON-LD FAQPage schema for Google AI Overview / Rich Results
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
    <section className="faq-section" style={{ margin: '3rem 0', borderTop: '2px solid var(--navy)', paddingTop: '2rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="sec-head" style={{ marginBottom: 4 }}>
        <div className="sec-bar" style={{ background: 'var(--blue)' }} />
        <div className="sec-title" style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>Frequently Asked Questions</div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ink4)', marginBottom: 20 }}>
        Key questions answered from the research
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="faq-item" style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: isOpen ? 'var(--off)' : 'var(--white)',
              transition: 'all 0.2s ease',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  fontFamily: 'var(--serif)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: isOpen ? 'var(--amber)' : 'var(--navy)',
                  transition: 'color 0.2s ease'
                }}
              >
                <span>{faq.question}</span>
                <span style={{
                  fontSize: 18,
                  fontWeight: 'normal',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease',
                  color: isOpen ? 'var(--amber)' : 'var(--ink3)',
                  display: 'inline-block',
                  lineHeight: 1
                }}>
                  +
                </span>
              </button>
              <div style={{
                maxHeight: isOpen ? '500px' : '0px',
                opacity: isOpen ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: isOpen ? '0 1.25rem 1.25rem' : '0 1.25rem',
                fontSize: 14.5,
                lineHeight: 1.7,
                color: 'var(--ink2)',
                borderTop: isOpen ? '1px solid var(--border)' : '1px solid transparent'
              }}>
                <div style={{ paddingTop: isOpen ? '0.75rem' : 0 }}>
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

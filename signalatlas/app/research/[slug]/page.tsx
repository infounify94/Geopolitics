import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import ConfidenceCard from '@/components/ConfidenceCard';
import RelationshipGraph from '@/components/RelationshipGraph';
import ArticleCard from '@/components/ArticleCard';
import { getArticleBySlug, getAllPublishedSlugs, getRelatedArticles } from '@/lib/queries';
import { CATEGORY_COLORS } from '@/lib/types';
import type { Article } from '@/lib/types';

// Edge runtime required by Cloudflare Pages (next-on-pages adapter)
// Fresh data is fetched from Supabase on every request — no ISR needed
export const runtime = 'edge';
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Not Found | SignalAtlas' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  return {
    title: article.title,
    description: article.meta_description ?? undefined,
    keywords: [...(article.countries ?? []), ...(article.topics ?? [])],
    openGraph: {
      title: article.title,
      description: article.meta_description ?? undefined,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      tags: article.topics,
    },
    alternates: { canonical: `${siteUrl}/research/${slug}` },
  };
}


function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.id, 3);
  const cat = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS['GENERAL'];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  // Convert markdown content to HTML
  const contentHtml = article.content
    ? (marked.parse(article.content) as string)
    : '';

  // JSON-LD Article Schema (NewsArticle for rich results)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.meta_description,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { '@type': 'Organization', name: 'SignalAtlas Research', url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'SignalAtlas',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    keywords: [...(article.countries ?? []), ...(article.topics ?? [])].join(', '),
    articleSection: article.category,
    about: article.countries?.map(c => ({ '@type': 'Place', name: c })),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.quick-summary', '.article-body > p:first-child'],
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/research/${article.slug}` },
  };

  // FAQ Schema for AEO
  const faqSchema = article.faq?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Research', item: `${siteUrl}/research` },
      { '@type': 'ListItem', position: 3, name: article.category, item: `${siteUrl}/topics/${article.category.toLowerCase().replace(/\s+/g, '-')}` },
      { '@type': 'ListItem', position: 4, name: article.title, item: `${siteUrl}/research/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <Nav />

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 11, color: 'var(--ink4)', marginBottom: 20, fontFamily: 'var(--mono)' }}>
          <a href="/" style={{ color: 'var(--ink4)' }}>Home</a>
          {' / '}
          <a href="/research" style={{ color: 'var(--ink4)' }}>Research</a>
          {' / '}
          <span style={{ color: 'var(--ink3)' }}>{article.category}</span>
        </nav>

        {/* Category badge */}
        <div style={{ marginBottom: 14 }}>
          <span className="cat" style={{ background: cat.bg, color: cat.color }}>
            {article.category}
          </span>
        </div>

        {/* ── Smart Context Routing ── */}
        {/* Automatically links article to relevant Country Hub profiles and Conflict Map */}
        {(() => {
          const COUNTRY_CODES: Record<string, string> = {
            'United States': 'us', 'USA': 'us', 'America': 'us',
            'China': 'cn', 'Russia': 'ru', 'India': 'in',
            'United Kingdom': 'gb', 'UK': 'gb', 'Israel': 'il',
            'Iran': 'ir', 'Pakistan': 'pk', 'Ukraine': 'ua',
            'North Korea': 'kp', 'Germany': 'de', 'France': 'fr',
            'Japan': 'jp', 'Saudi Arabia': 'sa', 'Turkey': 'tr',
          };
          const CONFLICT_KEYWORDS: Record<string, string> = {
            'Ukraine': 'Russia–Ukraine War', 'Russia': 'Russia–Ukraine War',
            'Gaza': 'Gaza–Israel War', 'Hamas': 'Gaza–Israel War', 'Israel': 'Gaza–Israel War',
            'Iran': 'US–Iran Tensions', 'Houthi': 'Yemen Civil War', 'Yemen': 'Yemen Civil War',
            'Taiwan': 'Taiwan Strait', 'South China Sea': 'South China Sea',
            'Sudan': 'Sudan Civil War', 'Myanmar': 'Myanmar Civil War',
            'North Korea': 'North Korea Standoff', 'Hormuz': 'Strait of Hormuz',
          };

          const articleText = `${article.title} ${(article.countries || []).join(' ')} ${(article.topics || []).join(' ')}`;

          const linkedCountries = Object.entries(COUNTRY_CODES)
            .filter(([name]) => articleText.includes(name))
            .reduce<Record<string, string>>((acc, [, code]) => { acc[code] = code; return acc; }, {});

          const linkedConflicts = [...new Set(
            Object.entries(CONFLICT_KEYWORDS)
              .filter(([kw]) => articleText.includes(kw))
              .map(([, conflict]) => conflict)
          )];

          const hasLinks = Object.keys(linkedCountries).length > 0 || linkedConflicts.length > 0;
          if (!hasLinks) return null;

          return (
            <div style={{ background: 'var(--off)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', letterSpacing: '.08em', textTransform: 'uppercase', flexShrink: 0 }}>
                Track live:
              </span>
              {linkedConflicts.slice(0, 2).map(c => (
                <a key={c} href="/conflicts" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--mono)', fontSize: 10, color: '#E24B4A', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 2, padding: '3px 8px', textDecoration: 'none', fontWeight: 600 }}>
                  🔴 {c} — Conflict Map
                </a>
              ))}
              {Object.keys(linkedCountries).slice(0, 3).map(code => (
                <a key={code} href={`/countries/${code}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--navy)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 2, padding: '3px 8px', textDecoration: 'none' }}>
                  🌐 {code.toUpperCase()} Country Profile
                </a>
              ))}
            </div>
          );
        })()}

        {/* H1 Title */}
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 30, lineHeight: 1.3, color: 'var(--ink)', marginBottom: 16 }}>
          {article.title}
        </h1>

        {/* Article metadata */}
        <div className="art-meta" style={{ marginBottom: 20 }}>
          <span>{formatDate(article.published_at)}</span>
          {article.read_time_mins && (
            <>
              <span className="dot">·</span>
              <span>{article.read_time_mins} min read</span>
            </>
          )}
          {article.word_count && (
            <>
              <span className="dot">·</span>
              <span>{article.word_count.toLocaleString()} words</span>
            </>
          )}
          {article.impact_score && (
            <>
              <span className="dot">·</span>
              <span style={{ fontFamily: 'var(--serif)', color: article.impact_score >= 8.5 ? 'var(--red)' : 'var(--amber)', fontWeight: 700 }}>
                {article.impact_score} impact
              </span>
            </>
          )}
        </div>

        {/* Confidence badges */}
        {(article.confidence_level || article.evidence_level) && (
          <div className="conf-row" style={{ marginBottom: 24 }}>
            {article.confidence_level && (
              <span className={`badge badge-${article.confidence_level === 'High' ? 'green' : 'amber'}`}>
                ✓ {article.confidence_level} Confidence
              </span>
            )}
            {article.evidence_level && (
              <span className="badge badge-blue">◈ {article.evidence_level} Evidence</span>
            )}
            {article.source_count > 0 && (
              <span className="badge badge-neutral">{article.source_count} sources</span>
            )}
            {article.countries?.slice(0, 3).map(c => (
              <span key={c} className="badge badge-neutral">{c}</span>
            ))}
          </div>
        )}

        {/* Signal Brief — only show when AI provides rich bullets */}
        {article.summary_bullets?.length >= 3 && (
          <div className="quick-summary" style={{ marginBottom: 28 }}>
            <div className="quick-summary-label">⚡ SIGNAL BRIEF · KEY FINDINGS</div>
            <ul>
              {article.summary_bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        )}

        {/* Horizontal rule */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 28 }} />

        {/* Article Body */}
        {contentHtml && (
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        )}

        {/* India Lens Block — Strategic implications for South Asia */}
        {(article.countries?.includes('India') ||
          article.topics?.some(t => t.toLowerCase().includes('india')) ||
          article.category === 'INDIA LENS' ||
          article.summary_bullets?.some(b => b.toLowerCase().includes('india'))) && (
          <div style={{ margin: '32px 0', background: 'linear-gradient(135deg, #FFF8F0, #FFFBF5)', border: '1px solid #FDDCB0', borderLeft: '3px solid #FF9933', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ width: 24, height: 4, background: '#FF9933', borderRadius: 1 }} />
                <div style={{ width: 24, height: 4, background: '#E8E8E8', borderRadius: 1 }} />
                <div style={{ width: 24, height: 4, background: '#138808', borderRadius: 1 }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#FF9933', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 500 }}>India Lens</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--serif)' }}>Strategic Implications for India</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '📈', label: 'Economy', text: 'Impact on Indian GDP, trade balances, and investment flows.' },
                { icon: '🛡️', label: 'Security', text: 'Implications for India\'s defence posture and border security.' },
                { icon: '🤝', label: 'Diplomacy', text: 'Effect on India\'s strategic partnerships and multilateral standing.' },
                { icon: '🚢', label: 'Trade & Energy', text: 'Supply chain effects, oil imports, and corridor dependencies.' },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(255,255,255,.8)', border: '1px solid #FDDCB0', borderRadius: 'var(--radius)', padding: '12px' }}>
                  <div style={{ marginBottom: 4, fontSize: 18 }}>{item.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.04em', fontFamily: 'var(--mono)' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6 }}>{item.text}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #FDDCB0' }}>
              <a href="/topics/india-lens" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#FF9933', letterSpacing: '.06em', textDecoration: 'none' }}>Explore all India Lens analysis →</a>
            </div>
          </div>
        )}

        {/* Spacing */}
        <div style={{ margin: '40px 0 32px' }}>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
        </div>

        {/* Confidence Card — Source Nutrition Label */}
        <div style={{ marginBottom: 32 }}>
          <ConfidenceCard article={article} />
        </div>

        {/* FAQ Section — Critical for SEO */}
        {article.faq?.length > 0 && (
          <FAQSection faqs={article.faq} articleTitle={article.title} />
        )}

        {/* Relationship Graph */}
        <div style={{ marginBottom: 32 }}>
          <RelationshipGraph />
        </div>

        {/* Tags */}
        {article.topics?.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ink3)', marginBottom: 10 }}>
              TOPICS
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {article.topics.map(t => (
                <a key={t} href={`/topics/${t.toLowerCase().replace(/\s+/g, '-')}`} className="topic-tag">
                  {t}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div className="sec-head">
              <div className="sec-bar" style={{ background: 'var(--blue)' }} />
              <div className="sec-title">Connected Research</div>
            </div>
            {related.map((a, i) => (
              <ArticleCard key={a.id} article={a} index={i} showSummary={false} />
            ))}
          </div>
        )}

        <Footer />
      </main>
    </>
  );
}

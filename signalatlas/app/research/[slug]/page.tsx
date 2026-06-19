import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import ConfidenceCard from '@/components/ConfidenceCard';
import RelationshipGraph from '@/components/RelationshipGraph';
import ArticleCard from '@/components/ArticleCard';
import ScrollProgress from '@/components/ScrollProgress';
import RiskMatrix from '@/components/RiskMatrix';
import { getArticleBySlug, getAllPublishedSlugs, getRelatedArticles, getRecentArticles } from '@/lib/queries';
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldcraftmedia.com';

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
  const recent = await getRecentArticles(6);
  const recentBriefings = (recent || []).filter((a: Article) => a.id !== article.id).slice(0, 5);

  const cat = CATEGORY_COLORS[article.category] ?? CATEGORY_COLORS['GENERAL'];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldcraftmedia.com';

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
    // Use real Person schema when author is known; fall back to Organization
    author: article.author_name
      ? {
          '@type': 'Person',
          name: article.author_name,
          url: article.author_slug ? `${siteUrl}/team` : undefined,
          worksFor: { '@type': 'Organization', name: 'SignalAtlas', url: siteUrl },
        }
      : { '@type': 'Organization', name: 'SignalAtlas Research', url: siteUrl },
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
      cssSelector: ['h1', '.article-body > p:first-child'],
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

      <ScrollProgress />
      <Nav />

      {/* Hero Header Area (Dynamic by Article Type) */}
      <div style={{ 
        borderBottom: '1px solid var(--border)', 
        background: article.article_type === 'live_update' ? 'var(--navy)' : 'var(--white)', 
        padding: '2.5rem 0 2rem',
        color: article.article_type === 'live_update' ? 'var(--white)' : 'var(--ink)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          
          {/* Breadcrumb */}
          <nav style={{ fontSize: 11, color: article.article_type === 'live_update' ? 'rgba(255,255,255,0.6)' : 'var(--ink4)', marginBottom: 20, fontFamily: 'var(--mono)' }}>
            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a>
            {' / '}
            <a href="/research" style={{ color: 'inherit', textDecoration: 'none' }}>Research</a>
            {' / '}
            <span style={{ color: article.article_type === 'live_update' ? 'var(--amber)' : 'var(--ink3)' }}>{article.category}</span>
          </nav>

          {/* Category badge */}
          <div style={{ marginBottom: 14 }}>
            <span className="cat" style={{ background: cat.bg, color: cat.color }}>
              {article.article_type === 'live_update' ? '🔴 LIVE UPDATE' : article.category}
            </span>
          </div>

          {/* Smart Context Routing */}
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
              <div style={{ background: article.article_type === 'live_update' ? 'rgba(255,255,255,0.05)' : 'var(--off)', border: `1px solid ${article.article_type === 'live_update' ? 'rgba(255,255,255,0.1)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: article.article_type === 'live_update' ? 'rgba(255,255,255,0.5)' : 'var(--ink3)', letterSpacing: '.08em', textTransform: 'uppercase', flexShrink: 0 }}>
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
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)', fontWeight: 800, lineHeight: 1.25, color: article.article_type === 'live_update' ? 'var(--white)' : 'var(--ink)', marginBottom: 16, letterSpacing: '-0.02em' }}>
            {article.title}
          </h1>

          {/* Article metadata row */}
          <div className="art-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', fontSize: 11, color: article.article_type === 'live_update' ? 'rgba(255,255,255,0.6)' : 'var(--ink3)', fontFamily: 'var(--mono)', letterSpacing: '.02em' }}>
            {article.article_type === 'live_update' ? (
               <span style={{ color: 'var(--amber)', fontWeight: 700 }}>LAST UPDATED: {formatDate(article.updated_at || article.published_at)}</span>
            ) : (
               <span>{formatDate(article.published_at)}</span>
            )}
            
            {article.read_time_mins && (
              <>
                <span className="dot" style={{ color: 'inherit' }}>·</span>
                <span>{article.read_time_mins} min read</span>
              </>
            )}
            {article.word_count && (
              <>
                <span className="dot" style={{ color: 'inherit' }}>·</span>
                <span>{article.word_count.toLocaleString()} words</span>
              </>
            )}
            {article.impact_score && (
              <>
                <span className="dot" style={{ color: 'inherit' }}>·</span>
                <span style={{ fontFamily: 'var(--serif)', color: article.impact_score >= 8.5 ? 'var(--red)' : 'var(--amber)', fontWeight: 700 }}>
                  {article.impact_score} impact
                </span>
              </>
            )}
            {/* Author byline */}
            {article.author_name && (
              <>
                <span className="dot" style={{ color: 'inherit' }}>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: article.article_type === 'live_update' ? 'rgba(255,255,255,0.1)' : 'var(--navy)', color: 'var(--amber)', fontSize: 9, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {article.author_name.charAt(0).toUpperCase()}
                  </span>
                  <a href="/team" style={{ color: article.article_type === 'live_update' ? 'var(--white)' : 'var(--ink2)', textDecoration: 'none' }}>{article.author_name} · SignalAtlas</a>
                </span>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Main Grid Content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 20px 4rem' }}>
        <div className="grid-main">
          
          {/* LEFT COLUMN: Deep Geopolitical Analysis */}
          <div>
            {/* Confidence badges (Mini stats row) */}
            {(article.confidence_level || article.evidence_level) && (
              <div className="conf-row" style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
              </div>
            )}

            {/* Executive Summary Block */}
            {article.summary_bullets && article.summary_bullets.length > 0 && (
              <div style={{ background: 'linear-gradient(145deg, #ffffff, #f9fbfd)', border: '1px solid var(--border)', borderTop: '3px solid var(--navy)', borderRadius: 'var(--radius)', padding: '1.75rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '18px' }}>📌</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--navy)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Executive Summary</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {article.summary_bullets.map((bullet, i) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', fontSize: 15, color: 'var(--ink)', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--amber)', fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Premium Serif Article Body */}
            {contentHtml && (
              <div
                className={`article-body ${article.article_type === 'live_update' ? 'live-update-body' : 'analysis-body'}`}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            )}

            {/* Geopolitical Risk Matrix Data Vis */}
            <RiskMatrix impact={article.impact_score} pattern={article.pattern_score} evergreen={article.evergreen_score} />

            {/* India Lens Block — only show when article genuinely covers India */}
            {(article.category === 'INDIA LENS' ||
              article.countries?.includes('India')) && (
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

            {/* Elegant, AdSense-Compliant Support & Donation Card */}
            <div style={{
              margin: '2.5rem 0',
              padding: '1.5rem',
              background: 'var(--off)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>☕</span>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>
                  Support Independent Research
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6, margin: 0 }}>
                If you find our evidence-based, unsensationalized geopolitical analysis valuable, consider supporting our independent research network. Your contributions directly fund data feeds, public registry audits, and deep Global South coverage.
              </p>
              <div style={{ marginTop: 4 }}>
                <a
                  href={process.env.NEXT_PUBLIC_DONATION_URL || "https://buymeacoffee.com/signalatlas"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    fontWeight: 600,
                    background: 'var(--navy)',
                    color: 'var(--white)',
                    border: '1px solid var(--navy)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius)',
                    textDecoration: 'none',
                    letterSpacing: '.06em'
                  }}
                >
                  SUPPORT SIGNALATLAS ↗
                </a>
              </div>
            </div>

            {/* FAQ Section — Critical for SEO */}
            {article.faq?.length > 0 && (
              <div style={{ marginTop: '3.5rem' }}>
                <FAQSection faqs={article.faq} articleTitle={article.title} />
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sidebar (Bloomberg/FT style) */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Confidence Card (Source Nutrition Label) */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
              <ConfidenceCard article={article} />
            </div>

            {/* Related Analyses (Connected Internal Articles) */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <div style={{ width: 4, height: 16, background: 'var(--amber)' }} />
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--navy)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
                  Related Analyses
                </div>
              </div>
              
              {related.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {related.map(a => (
                    <a key={a.id} href={`/research/${a.slug}`} className="sidebar-briefing">
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', textTransform: 'uppercase' }}>
                        {a.category}
                      </div>
                      <h4 className="sidebar-briefing-title">
                        {a.title}
                      </h4>
                    </a>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--ink3)', fontStyle: 'italic' }}>
                  No connected analyses yet.
                </div>
              )}
            </div>

            {/* Recent Briefings */}
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <div style={{ width: 4, height: 16, background: 'var(--blue)' }} />
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--navy)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
                  Recent Briefings
                </div>
              </div>
              
              {recentBriefings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {recentBriefings.map(a => (
                    <a key={a.id} href={`/research/${a.slug}`} className="sidebar-briefing">
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink3)', textTransform: 'uppercase' }}>
                        {a.category} · {formatDate(a.published_at)}
                      </div>
                      <h4 className="sidebar-briefing-title">
                        {a.title}
                      </h4>
                    </a>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--ink3)', fontStyle: 'italic' }}>
                  No recent briefings published yet.
                </div>
              )}
            </div>

            {/* Keywords & Themes */}
            {article.topics?.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 4, height: 16, background: 'var(--ink)' }} />
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--navy)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
                    Keywords & Themes
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {article.topics.map(t => (
                    <a key={t} href={`/topics/${t.toLowerCase().replace(/\s+/g, '-')}`} className="topic-tag" style={{ textDecoration: 'none', fontSize: 10, padding: '4px 10px', borderRadius: 2 }}>
                      #{t}
                    </a>
                  ))}
                </div>
              </div>
            )}

          </aside>

        </div>

        {/* Dynamic Pattern relationship graph rendered below columns */}
        <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            <div style={{ width: 4, height: 16, background: 'var(--navy)' }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--navy)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
              Pattern Intelligence Graph
            </div>
          </div>
          <RelationshipGraph />
        </div>

      </main>

      <Footer />
    </>
  );
}

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

// ISR: revalidate every hour — no redeploy needed when new articles publish
export const dynamicParams = true;
export const revalidate = 3600;

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

  // JSON-LD Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { '@type': 'Organization', name: 'SignalAtlas Research' },
    publisher: {
      '@type': 'Organization',
      name: 'SignalAtlas',
      url: siteUrl,
    },
    keywords: [...(article.countries ?? []), ...(article.topics ?? [])].join(', '),
  };

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

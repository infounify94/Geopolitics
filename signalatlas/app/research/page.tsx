import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import LatestResearch from '@/components/LatestResearch';
import { getRecentArticles } from '@/lib/queries';

export const metadata = {
  title: 'Research Archive - SignalAtlas',
  description: 'All geopolitical research articles and analysis.',
};

export const revalidate = 3600;

export default async function ResearchPage() {
  const articles = await getRecentArticles(20);

  return (
    <>
      <Nav />
      <main className="main" style={{ padding: '80px 20px', maxWidth: 1000, margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, color: 'var(--ink)' }}>Research Archive</h1>
        <p style={{ color: 'var(--ink3)', marginBottom: 40 }}>Our complete database of geopolitical intelligence reports.</p>
        
        {articles.length > 0 ? (
          <LatestResearch articles={articles} />
        ) : (
          <div className="card card-pad" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--ink3)' }}>No research articles found yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

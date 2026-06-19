import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';
  const isProduction = siteUrl.includes('signalatlas.com') && !siteUrl.includes('pages.dev') && process.env.CF_PAGES !== '1';

  if (!isProduction) {
    // Block ALL indexing on pages.dev / localhost — domain not live yet
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      // No sitemap exposed on staging
    };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

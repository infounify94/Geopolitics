import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/research/us-iran-deal-war-implications', destination: '/research/west-asia-iran-us-israel-lebanon-conflict', permanent: true },
      { source: '/research/iran-war-day-112-us-iran-deal', destination: '/research/west-asia-iran-us-israel-lebanon-conflict', permanent: true },
      { source: '/research/iran-us-deal-implications', destination: '/research/west-asia-iran-us-israel-lebanon-conflict', permanent: true },
      { source: '/research/us-iran-deal-nuclear-diplomacy', destination: '/research/west-asia-iran-us-israel-lebanon-conflict', permanent: true },
      { source: '/research/us-iran-war-purpose', destination: '/research/west-asia-iran-us-israel-lebanon-conflict', permanent: true },
      { source: '/research/iran-us-deal-analysis', destination: '/research/west-asia-iran-us-israel-lebanon-conflict', permanent: true },
      { source: '/research/us-iran-agreement-explained', destination: '/research/west-asia-iran-us-israel-lebanon-conflict', permanent: true },
      { source: '/research/us-iran-deal-2026', destination: '/research/west-asia-iran-us-israel-lebanon-conflict', permanent: true },
      { source: '/research/iran-deal-offsets-hawkish-fed', destination: '/research/west-asia-iran-us-israel-lebanon-conflict', permanent: true },
    ];
  },
};
export default nextConfig;

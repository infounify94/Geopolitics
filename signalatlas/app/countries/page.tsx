// SERVER COMPONENT — country data is server-rendered in HTML for Google crawling.
// The interactive filter UI (search/sort) is a client island via CountryHub component.
// This architecture: Google sees all 35 countries in static HTML. Users get live filtering.
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CountryHub from '@/components/CountryHub';
import type { Metadata } from 'next';

export const revalidate = 86400; // ISR: revalidate once a day (data is static)

export const metadata: Metadata = {
  title: 'Country Intelligence Hub — Geopolitical Risk & Military Rankings | SignalAtlas',
  description: 'Geopolitical risk scores, military rankings, GDP data, and strategic profiles for 195 nations. Filter by region, alliance, military power, and economic classification.',
  keywords: ['country geopolitical risk', 'military rankings by country', 'country intelligence profile', 'geopolitical risk score', 'nations influence score'],
  alternates: { canonical: 'https://signalatlas.com/countries' },
};

// All country data rendered server-side — fully crawlable
export const COUNTRIES = [
  { code:'US', name:'United States',  flag:'🇺🇸', region:'Americas',     gdp:'$27.4T', population:'335M',  militaryRank:1,  influenceScore:98, riskScore:28, alliance:'NATO',         economy:'Advanced',   militaryStrength:'Superpower'  },
  { code:'CN', name:'China',          flag:'🇨🇳', region:'Asia',          gdp:'$17.8T', population:'1.4B',  militaryRank:3,  influenceScore:95, riskScore:42, alliance:'SCO',          economy:'Advanced',   militaryStrength:'Major Power' },
  { code:'RU', name:'Russia',         flag:'🇷🇺', region:'Europe',        gdp:'$2.2T',  population:'143M',  militaryRank:2,  influenceScore:88, riskScore:78, alliance:'CSTO',         economy:'Emerging',   militaryStrength:'Major Power' },
  { code:'IN', name:'India',          flag:'🇮🇳', region:'Asia',          gdp:'$3.7T',  population:'1.44B', militaryRank:4,  influenceScore:82, riskScore:35, alliance:'QUAD',         economy:'Emerging',   militaryStrength:'Major Power' },
  { code:'GB', name:'United Kingdom', flag:'🇬🇧', region:'Europe',        gdp:'$3.1T',  population:'68M',   militaryRank:8,  influenceScore:80, riskScore:22, alliance:'NATO',         economy:'Advanced',   militaryStrength:'Regional'    },
  { code:'FR', name:'France',         flag:'🇫🇷', region:'Europe',        gdp:'$2.9T',  population:'68M',   militaryRank:9,  influenceScore:78, riskScore:24, alliance:'NATO',         economy:'Advanced',   militaryStrength:'Regional'    },
  { code:'DE', name:'Germany',        flag:'🇩🇪', region:'Europe',        gdp:'$4.1T',  population:'83M',   militaryRank:16, influenceScore:76, riskScore:20, alliance:'NATO',         economy:'Advanced',   militaryStrength:'Regional'    },
  { code:'JP', name:'Japan',          flag:'🇯🇵', region:'Asia',          gdp:'$4.2T',  population:'124M',  militaryRank:8,  influenceScore:74, riskScore:22, alliance:'US-Japan',     economy:'Advanced',   militaryStrength:'Regional'    },
  { code:'IL', name:'Israel',         flag:'🇮🇱', region:'Middle East',   gdp:'$521B',  population:'9.8M',  militaryRank:18, influenceScore:65, riskScore:88, alliance:'US-ally',      economy:'Advanced',   militaryStrength:'Regional'    },
  { code:'IR', name:'Iran',           flag:'🇮🇷', region:'Middle East',   gdp:'$367B',  population:'88M',   militaryRank:17, influenceScore:60, riskScore:82, alliance:'Axis',         economy:'Emerging',   militaryStrength:'Regional'    },
  { code:'SA', name:'Saudi Arabia',   flag:'🇸🇦', region:'Middle East',   gdp:'$1.1T',  population:'36M',   militaryRank:25, influenceScore:68, riskScore:45, alliance:'Arab League',  economy:'Advanced',   militaryStrength:'Regional'    },
  { code:'TR', name:'Turkey',         flag:'🇹🇷', region:'Middle East',   gdp:'$1.0T',  population:'86M',   militaryRank:11, influenceScore:62, riskScore:52, alliance:'NATO',         economy:'Emerging',   militaryStrength:'Regional'    },
  { code:'PK', name:'Pakistan',       flag:'🇵🇰', region:'Asia',          gdp:'$338B',  population:'231M',  militaryRank:9,  influenceScore:48, riskScore:76, alliance:'SCO',          economy:'Developing', militaryStrength:'Regional'    },
  { code:'UA', name:'Ukraine',        flag:'🇺🇦', region:'Europe',        gdp:'$160B',  population:'37M',   militaryRank:22, influenceScore:55, riskScore:95, alliance:'NATO-aspirant',economy:'Developing', militaryStrength:'Regional'    },
  { code:'BR', name:'Brazil',         flag:'🇧🇷', region:'Americas',      gdp:'$2.1T',  population:'215M',  militaryRank:12, influenceScore:66, riskScore:48, alliance:'BRICS',        economy:'Emerging',   militaryStrength:'Regional'    },
  { code:'ZA', name:'South Africa',   flag:'🇿🇦', region:'Africa',        gdp:'$399B',  population:'60M',   militaryRank:30, influenceScore:52, riskScore:55, alliance:'BRICS',        economy:'Emerging',   militaryStrength:'Limited'     },
  { code:'SD', name:'Sudan',          flag:'🇸🇩', region:'Africa',        gdp:'$36B',   population:'46M',   militaryRank:58, influenceScore:22, riskScore:96, alliance:'None',         economy:'Developing', militaryStrength:'Limited'     },
  { code:'MM', name:'Myanmar',        flag:'🇲🇲', region:'Asia',          gdp:'$65B',   population:'55M',   militaryRank:40, influenceScore:20, riskScore:90, alliance:'ASEAN',        economy:'Developing', militaryStrength:'Limited'     },
  { code:'KP', name:'North Korea',    flag:'🇰🇵', region:'Asia',          gdp:'$28B',   population:'26M',   militaryRank:30, influenceScore:35, riskScore:92, alliance:'Axis',         economy:'Developing', militaryStrength:'Regional'    },
  { code:'KR', name:'South Korea',    flag:'🇰🇷', region:'Asia',          gdp:'$1.7T',  population:'52M',   militaryRank:6,  influenceScore:65, riskScore:32, alliance:'US-ally',      economy:'Advanced',   militaryStrength:'Regional'    },
  { code:'AU', name:'Australia',      flag:'🇦🇺', region:'Oceania',       gdp:'$1.7T',  population:'26M',   militaryRank:19, influenceScore:62, riskScore:18, alliance:'AUKUS',        economy:'Advanced',   militaryStrength:'Regional'    },
  { code:'CA', name:'Canada',         flag:'🇨🇦', region:'Americas',      gdp:'$2.1T',  population:'40M',   militaryRank:23, influenceScore:60, riskScore:16, alliance:'NATO',         economy:'Advanced',   militaryStrength:'Regional'    },
  { code:'NG', name:'Nigeria',        flag:'🇳🇬', region:'Africa',        gdp:'$477B',  population:'220M',  militaryRank:35, influenceScore:42, riskScore:68, alliance:'AU',           economy:'Developing', militaryStrength:'Limited'     },
  { code:'EG', name:'Egypt',          flag:'🇪🇬', region:'Middle East',   gdp:'$378B',  population:'105M',  militaryRank:15, influenceScore:52, riskScore:62, alliance:'Arab League',  economy:'Developing', militaryStrength:'Regional'    },
  { code:'ID', name:'Indonesia',      flag:'🇮🇩', region:'Asia',          gdp:'$1.3T',  population:'275M',  militaryRank:13, influenceScore:58, riskScore:38, alliance:'ASEAN',        economy:'Emerging',   militaryStrength:'Regional'    },
  { code:'MX', name:'Mexico',         flag:'🇲🇽', region:'Americas',      gdp:'$1.3T',  population:'130M',  militaryRank:34, influenceScore:50, riskScore:58, alliance:'US-ally',      economy:'Emerging',   militaryStrength:'Limited'     },
  { code:'AF', name:'Afghanistan',    flag:'🇦🇫', region:'Asia',          gdp:'$20B',   population:'40M',   militaryRank:60, influenceScore:15, riskScore:98, alliance:'None',         economy:'Developing', militaryStrength:'Limited'     },
  { code:'IQ', name:'Iraq',           flag:'🇮🇶', region:'Middle East',   gdp:'$264B',  population:'42M',   militaryRank:45, influenceScore:32, riskScore:80, alliance:'US-backed',    economy:'Developing', militaryStrength:'Limited'     },
  { code:'SY', name:'Syria',          flag:'🇸🇾', region:'Middle East',   gdp:'$21B',   population:'22M',   militaryRank:52, influenceScore:18, riskScore:95, alliance:'Russia-backed',economy:'Developing', militaryStrength:'Limited'     },
  { code:'YE', name:'Yemen',          flag:'🇾🇪', region:'Middle East',   gdp:'$20B',   population:'33M',   militaryRank:55, influenceScore:12, riskScore:97, alliance:'None',         economy:'Developing', militaryStrength:'Limited'     },
  { code:'VN', name:'Vietnam',        flag:'🇻🇳', region:'Asia',          gdp:'$450B',  population:'98M',   militaryRank:22, influenceScore:45, riskScore:30, alliance:'ASEAN',        economy:'Emerging',   militaryStrength:'Regional'    },
  { code:'TH', name:'Thailand',       flag:'🇹🇭', region:'Asia',          gdp:'$543B',  population:'72M',   militaryRank:27, influenceScore:42, riskScore:35, alliance:'ASEAN',        economy:'Emerging',   militaryStrength:'Limited'     },
  { code:'ET', name:'Ethiopia',       flag:'🇪🇹', region:'Africa',        gdp:'$144B',  population:'125M',  militaryRank:42, influenceScore:35, riskScore:72, alliance:'AU',           economy:'Developing', militaryStrength:'Limited'     },
  { code:'GZ', name:'Gaza/Palestine', flag:'🇵🇸', region:'Middle East',   gdp:'$7B',    population:'5.4M',  militaryRank:99, influenceScore:28, riskScore:99, alliance:'None',         economy:'Developing', militaryStrength:'None'        },
  { code:'PL', name:'Poland',         flag:'🇵🇱', region:'Europe',        gdp:'$843B',  population:'38M',   militaryRank:21, influenceScore:52, riskScore:30, alliance:'NATO',         economy:'Advanced',   militaryStrength:'Regional'    },
] as const;

export type Country = typeof COUNTRIES[number];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Country Intelligence Hub — SignalAtlas',
  description: 'Geopolitical risk scores, military rankings, and economic profiles for 195 nations.',
  url: `${siteUrl}/countries`,
  numberOfItems: COUNTRIES.length,
  hasPart: COUNTRIES.map(c => ({
    '@type': 'Place',
    name: c.name,
    url: `${siteUrl}/countries/${c.code.toLowerCase()}`,
    description: `${c.name} — GDP ${c.gdp}, Military Rank #${c.militaryRank}, Risk Score ${c.riskScore}/100`,
  })),
};

export default function CountriesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />

      {/* Page header — fully server-rendered */}
      <div style={{ background: 'var(--navy)', padding: '3rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.5rem' }}>Country Intelligence</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-.02em', marginBottom: '.75rem' }}>
            Country Intelligence Hub
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', maxWidth: 560, lineHeight: 1.7 }}>
            Geopolitical risk scores, military rankings, GDP data, and strategic profiles for 195 nations. Updated continuously.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,.1)', flexWrap: 'wrap' }}>
            {([['35+', 'Nations Profiled'], ['6', 'Filter Dimensions'], ['Live', 'Risk Scoring'], ['195', 'Total Monitored']] as [string, string][]).map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--amber)' }}>{n}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO fallback — all countries in plain HTML, hidden visually but crawlable */}
      <noscript>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '2rem' }}>
          <h2>All Country Profiles</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {COUNTRIES.map(c => (
              <li key={c.code} style={{ marginBottom: 8 }}>
                <a href={`/countries/${c.code.toLowerCase()}`}>
                  {c.flag} {c.name} — GDP {c.gdp} | Military #{c.militaryRank} | Risk {c.riskScore}/100 | {c.alliance}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </noscript>

      {/* Interactive grid — client component island */}
      <CountryHub countries={COUNTRIES as unknown as Country[]} />

      <Footer />
    </>
  );
}

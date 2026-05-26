import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { COUNTRIES } from '../page';

export const runtime = 'edge';
export const dynamicParams = true;

interface Props { params: Promise<{ code: string }> }

interface CountryDetail {
  name: string; flag: string; region: string; gdp: string; population: string;
  militaryRank: number; influenceScore: number; riskScore: number; alliance: string;
  economy: string; militaryStrength: string; capital: string; currency: string;
  overview: string; economyDetail: string; militaryDetail: string;
  foreignPolicy: string; tradePartners: string[]; strategicAlliances: string[];
  keyRisks: string[];
}

const COMMON_DETAILS: Record<string, { capital: string; currency: string }> = {
  fr: { capital: 'Paris', currency: 'Euro (EUR)' },
  de: { capital: 'Berlin', currency: 'Euro (EUR)' },
  jp: { capital: 'Tokyo', currency: 'Yen (JPY)' },
  sa: { capital: 'Riyadh', currency: 'Saudi Riyal (SAR)' },
  tr: { capital: 'Ankara', currency: 'Turkish Lira (TRY)' },
  br: { capital: 'Brasília', currency: 'Brazilian Real (BRL)' },
  za: { capital: 'Pretoria', currency: 'South African Rand (ZAR)' },
  sd: { capital: 'Khartoum', currency: 'Sudanese Pound (SDG)' },
  mm: { capital: 'Naypyidaw', currency: 'Kyat (MMK)' },
  kr: { capital: 'Seoul', currency: 'South Korean Won (KRW)' },
  au: { capital: 'Canberra', currency: 'Australian Dollar (AUD)' },
  ca: { capital: 'Ottawa', currency: 'Canadian Dollar (CAD)' },
  ng: { capital: 'Abuja', currency: 'Naira (NGN)' },
  eg: { capital: 'Cairo', currency: 'Egyptian Pound (EGP)' },
  id: { capital: 'Jakarta', currency: 'Indonesian Rupiah (IDR)' },
  mx: { capital: 'Mexico City', currency: 'Mexican Peso (MXN)' },
  af: { capital: 'Kabul', currency: 'Afghani (AFN)' },
  iq: { capital: 'Baghdad', currency: 'Iraqi Dinar (IQD)' },
  sy: { capital: 'Damascus', currency: 'Syrian Pound (SYP)' },
  ye: { capital: "Sana'a", currency: 'Yemeni Rial (YER)' },
  vn: { capital: 'Hanoi', currency: 'Dong (VND)' },
  th: { capital: 'Bangkok', currency: 'Baht (THB)' },
  et: { capital: 'Addis Ababa', currency: 'Birr (ETB)' },
  gz: { capital: 'Gaza / Ramallah', currency: 'ILS / JOD' },
  pl: { capital: 'Warsaw', currency: 'Złoty (PLN)' },
};

// Country data map — same data as the listing page, enriched with detail
const COUNTRY_DATA: Record<string, CountryDetail> = {
  us: { name:'United States', flag:'🇺🇸', region:'Americas', gdp:'$27.4T', population:'335M', militaryRank:1, influenceScore:98, riskScore:28, alliance:'NATO', economy:'Advanced', militaryStrength:'Superpower', capital:'Washington D.C.', currency:'USD', overview:'The world\'s dominant military and economic superpower. Maintains global reserve currency status and leads NATO. Under intensifying competition from China across tech, trade, and military domains.', economyDetail:'Largest nominal GDP globally at $27.4T. Technology, finance, and defence sectors drive growth. Dollar dominance increasingly challenged by BRICS de-dollarisation efforts. Debt at $34T is a long-term structural risk.', militaryDetail:'Ranked #1 globally. $858B defence budget (2024). 800+ overseas military bases. Nuclear triad: ICBM, SLBM, bomber. F-35 5th gen fighter. 11 carrier strike groups. Dominant in space and cyber domains.', foreignPolicy:'Leads Western alliance system. Indo-Pacific pivot to counter China. Ukraine support via $75B+ aid. Israel ironclad ally. Strained relations with Saudi Arabia and Turkey despite NATO/alliance ties.', tradePartners:['China','Canada','Mexico','Germany','Japan'], strategicAlliances:['NATO','AUKUS','QUAD','Five Eyes'], keyRisks:['US-China tech decoupling','Domestic political polarisation','$34T national debt','Dollar reserve status erosion'] },
  cn: { name:'China', flag:'🇨🇳', region:'Asia', gdp:'$17.8T', population:'1.4B', militaryRank:3, influenceScore:95, riskScore:42, alliance:'SCO', economy:'Advanced', militaryStrength:'Major Power', capital:'Beijing', currency:'CNY (Renminbi)', overview:'Second largest economy. Pursuing "great rejuvenation" — aims to be the world\'s dominant power by 2049. Belt & Road Initiative spans 140+ countries. Under increasing Western sanctions pressure on semiconductors.', economyDetail:'$17.8T GDP. Manufacturing powerhouse transitioning to tech/services. Property sector crisis (Evergrande collapse). Youth unemployment at 20%+. De-dollarisation drive through RMB internationalisation.', militaryDetail:'Ranked #3 globally, #1 in Asia. $225B budget. Rapid nuclear expansion — 500+ warheads by 2030. DF-41 ICBM. J-20 stealth fighter. Three aircraft carriers (fourth launching). Anti-satellite weapons. Taiwan contingency is primary focus.', foreignPolicy:'Wolf warrior diplomacy. Belt & Road in 140+ countries. Russia strategic partnership. Tensions with India (LAC). Philippines maritime disputes. Taiwan reunification as core national goal.', tradePartners:['USA','ASEAN','EU','Japan','South Korea'], strategicAlliances:['SCO','BRICS','Russia partnership'], keyRisks:['Taiwan strait conflict','Semiconductor export controls','Property sector collapse','Demographic decline'] },
  ru: { name:'Russia', flag:'🇷🇺', region:'Europe', gdp:'$2.2T', population:'143M', militaryRank:2, influenceScore:88, riskScore:78, alliance:'CSTO', economy:'Emerging', militaryStrength:'Major Power', capital:'Moscow', currency:'Ruble (RUB)', overview:'Waging full-scale war in Ukraine since Feb 2022. Under 267+ sanction packages. Pivoted east to China, India, and Global South. Nuclear arsenal of 5,977 warheads remains primary deterrent.', economyDetail:'$2.2T GDP — sustained by oil/gas exports despite sanctions. Rerouting oil to India and China. War economy — defence spending at 6%+ of GDP. $300B reserves frozen by G7. Significant inflation and labour shortage from mobilisation.', militaryDetail:'Ranked #2 globally on nuclear warheads (5,977). Conventional forces degraded by Ukraine war — 300K+ casualties estimated. Still possesses Iskander ballistic missiles, hypersonics (Kinzhal, Zircon). Nuclear doctrine under active discussion.', foreignPolicy:'Isolation from West — pivoted to China, Iran, North Korea, and Global South. Wagner/Africa Corps in Sahel. CSTO fragmented after Armenia-Azerbaijan war. Belarus fully in orbit. Nuclear threats as diplomatic tool.', tradePartners:['China','India','Turkey','UAE','Kazakhstan'], strategicAlliances:['CSTO','Belarus','North Korea','Iran'], keyRisks:['Ukraine war escalation','Sanctions tightening','Post-Putin succession','Economic isolation deepening'] },
  in: { name:'India', flag:'🇮🇳', region:'Asia', gdp:'$3.7T', population:'1.44B', militaryRank:4, influenceScore:82, riskScore:35, alliance:'QUAD', economy:'Emerging', militaryStrength:'Major Power', capital:'New Delhi', currency:'Indian Rupee (INR)', overview:'Fastest-growing major economy. Strategic autonomy policy — balancing US, Russia, and China. World\'s most populous nation. Nuclear power with 160+ warheads. Hosting G20, expanding global diplomatic footprint.', economyDetail:'$3.7T GDP, targeting $5T by 2027. Tech services ($250B exports), manufacturing (PLI push), defence indigenisation. Buying Russian oil at discount while Western sanctions apply. FDI surge as China+1 strategy benefits India.', militaryDetail:'Ranked #4 globally. $75B defence budget. Active nuclear deterrent (Agni-V ICBM range covers China). Two aircraft carriers. S-400 missile defence from Russia. Rafale jets from France. Two-front war concern: Pakistan + China LAC.', foreignPolicy:'Strategic autonomy — votes independently at UN. QUAD member but buys Russian weapons. G20 presidency (2023) elevated global standing. SCO member. Tensions with China on LAC (Galwan 2020). Relations with Pakistan — structured hostility.', tradePartners:['USA','China','UAE','Saudi Arabia','Russia'], strategicAlliances:['QUAD','SCO','BRICS','Commonwealth'], keyRisks:['China border escalation','Pakistan tensions','Russian weapons dependency','Climate vulnerability'] },
  gb: { name:'United Kingdom', flag:'🇬🇧', region:'Europe', gdp:'$3.1T', population:'68M', militaryRank:8, influenceScore:80, riskScore:22, alliance:'NATO', economy:'Advanced', militaryStrength:'Regional', capital:'London', currency:'GBP', overview:'Post-Brexit realignment. P5 UN Security Council member. Nuclear power (225 warheads). Global financial centre. AUKUS founding member — supplying nuclear submarines to Australia. Strongest bilateral ally of the US.', economyDetail:'$3.1T GDP. Financial services drive 12%+ of GDP. Post-Brexit trade disruption ongoing. Inflation hit 11% in 2022 — now declining. North Sea oil and gas. London remains global financial hub despite post-Brexit challenges.', militaryDetail:'Ranked #8. £50B+ defence budget. Trident nuclear submarine fleet — 225 warheads. Two Queen Elizabeth-class carriers. F-35B jets. SAS/SBS special forces globally deployed. Intelligence: GCHQ, MI6, MI5.', foreignPolicy:'"Global Britain" post-Brexit. Deepest US intelligence sharing (Five Eyes). AUKUS with US/Australia. NATO eastern flank commitment. £12B+ Ukraine military aid. Rejoining Pacific trade discussions.', tradePartners:['USA','Germany','Netherlands','France','Ireland'], strategicAlliances:['NATO','AUKUS','Five Eyes','G7'], keyRisks:['Post-Brexit trade impact','Scotland independence movement','Ageing military equipment','Declining global influence'] },
  fr: { name:'France', flag:'🇫🇷', region:'Europe', gdp:'$2.9T', population:'68M', militaryRank:9, influenceScore:78, riskScore:24, alliance:'NATO', economy:'Advanced', militaryStrength:'Regional', capital:'Paris', currency:'Euro (EUR)', overview:'A nuclear-armed P5 UN Security Council member, leading European Union power, and founding member of NATO. France retains strong global power projection capabilities and a highly diversified advanced economy.', economyDetail:'Nominal GDP of $2.9T. Powerhouse in luxury goods, aerospace (Airbus), finance, nuclear energy, and agriculture. Retains high structural debt and is facing active debate over industrial productivity and retirement age reforms.', militaryDetail:'Ranked #9 globally. Maintains a full nuclear deterrent (ASMP-A missiles, Triomphant-class submarines). Operates the Charles de Gaulle nuclear aircraft carrier, Rafale multirole fighters, and holds advanced cyber and space defense units.', foreignPolicy:'Promotes European strategic autonomy while remaining a core NATO ally. Balances relations with the Global South through extensive diplomatic networks. Highly active in Sahel stabilization and Indo-Pacific security.', tradePartners:['Germany','Italy','USA','Spain','Belgium'], strategicAlliances:['NATO','European Union','G7','UN Security Council'], keyRisks:['European Union internal fragmentation','Social unrest and domestic political polarization','Cyber warfare exposure','Sahel region strategic retreat'] },
  de: { name:'Germany', flag:'🇩🇪', region:'Europe', gdp:'$4.1T', population:'83M', militaryRank:16, influenceScore:76, riskScore:20, alliance:'NATO', economy:'Advanced', militaryStrength:'Regional', capital:'Berlin', currency:'Euro (EUR)', overview:'Europe\'s economic engine and a key leader of the European Union. Traditionally focused on export-led growth, Germany is undergoing a historic "Zeitenwende" (turning point) in defense and energy policy following the Ukraine war.', economyDetail:'Nominal GDP of $4.1T. Global leader in automotive, precision machinery, chemical manufacturing, and high-tech engineering. Navigating structural challenges from cheap energy loss and rapid industrial digitization.', militaryDetail:'Ranked #16 globally. Currently implementing a €100B special defense fund to modernize the Bundeswehr. Key participant in NATO nuclear sharing and hosting major US European Command bases.', foreignPolicy:'Committed to European integration and the transatlantic alliance. Pivoting away from Russian energy and Chinese market dependencies while actively strengthening NATO\'s eastern flank and providing heavy aid to Ukraine.', tradePartners:['USA','China','France','Netherlands','Poland'], strategicAlliances:['NATO','European Union','G7'], keyRisks:['Deindustrialization from energy cost hikes','Ageing demographic squeeze','Supply chain dependencies on China','NATO defense spending targets friction'] },
  jp: { name:'Japan', flag:'🇯🇵', region:'Asia', gdp:'$4.2T', population:'124M', militaryRank:8, influenceScore:74, riskScore:22, alliance:'US-Japan', economy:'Advanced', militaryStrength:'Regional', capital:'Tokyo', currency:'Yen (JPY)', overview:'The world\'s fourth-largest economy and a critical US ally in East Asia. Japan is upgrading its security posture, increasing defense spending, and acquiring counterstrike capabilities to counter regional assertiveness and Taiwan Strait risks.', economyDetail:'Nominal GDP of $4.2T. Tech, automotive (Toyota), robotics, and precision manufacturing leader. Facing long-term structural pressures from negative interest rate exit, high public debt, and population decline.', militaryDetail:'Ranked #8 globally. Japan Self-Defense Forces (JSDF) operate advanced Aegis destroyers, Izumo-class helicopter carriers (converting to F-35B stealth carrier jets), and advanced submarine fleets. Acquiring long-range Tomahawk missiles.', foreignPolicy:'Core pillar is the US-Japan alliance. Architect of the "Free and Open Indo-Pacific" strategy. Deepening security ties with Australia, India (QUAD), South Korea, and European allies to balance regional dynamics.', tradePartners:['China','USA','South Korea','Australia','Taiwan'], strategicAlliances:['US-Japan Alliance','QUAD','G7'], keyRisks:['Taiwan Strait military conflict','Demographic squeeze (rapidly ageing population)','Energy import vulnerability','Sovereign debt levels'] },
  il: { name:'Israel', flag:'🇮🇱', region:'Middle East', gdp:'$521B', population:'9.8M', militaryRank:18, influenceScore:65, riskScore:88, alliance:'US-ally', economy:'Advanced', militaryStrength:'Regional', capital:'Jerusalem', currency:'NIS', overview:'Military and intelligence superpower in a dangerous neighbourhood. At war in Gaza since Oct 7, 2023. Undeclared nuclear arsenal (80-400 warheads estimated). Iron Dome + Arrow missile defence. Tech powerhouse — "Startup Nation".', economyDetail:'$521B GDP. High-tech (22% of exports), defence ($13B in annual arms exports), pharma, agriculture (drip irrigation). Gaza war costs estimated at $50B+. Rating agencies downgraded due to war.', militaryDetail:'Iron Dome (>90% interception rate). Arrow 3 ballistic missile defence. F-35I stealth jets. Merkava MBT. Unit 8200 (world-class cyber intelligence). Undeclared nuclear arsenal. Mossad global operations.', foreignPolicy:'Abraham Accords (UAE, Bahrain, Morocco, Sudan). Iran as existential threat — shadow war ongoing. Full-scale Gaza operation since Oct 7. US unconditional military support. ICC arrest warrant (Netanyahu) complicating diplomacy.', tradePartners:['USA','China','Germany','UK','Netherlands'], strategicAlliances:['USA','Abraham Accords states'], keyRisks:['Gaza war escalation to regional war','Iran nuclear breakout','ICC warrants','West Bank annexation isolation'] },
  ir: { name:'Iran', flag:'🇮🇷', region:'Middle East', gdp:'$367B', population:'88M', militaryRank:17, influenceScore:60, riskScore:82, alliance:'Axis', economy:'Emerging', militaryStrength:'Regional', capital:'Tehran', currency:'Iranian Rial', overview:'Theocratic state. Pursuing nuclear program — breakout capability estimated at weeks. Leads "Axis of Resistance" (Hezbollah, Hamas, Houthis, Iraqi PMF). Under severe US sanctions since 2018.', economyDetail:'$367B GDP — heavily distorted by sanctions. Oil exports to China via ghost tankers. 40%+ inflation. Rial collapsed 90% vs USD. Significant barter/cryptocurrency use to evade SWIFT exclusion.', militaryDetail:'Ballistic missiles with 2,000km range. Proxy forces in Lebanon, Gaza, Yemen, Iraq, Syria. Shahed drones exported to Russia. Cyber capabilities (Shamoon, Stuxnet retaliation). No nuclear weapon yet — 60% enriched uranium stockpile.', foreignPolicy:'Axis of Resistance network. Nuclear talks with US at critical stage. Russia/China alignment. Houthi Red Sea attacks as leverage tool. ICC accusations against officials. Saudi détente brokered by China (2023).', tradePartners:['China','Iraq','UAE (via evasion)','Turkey'], strategicAlliances:['Russia partnership','China strategic partnership','Axis of Resistance'], keyRisks:['Nuclear program military strike','US maximum pressure return','Internal protests escalating','Proxy network retaliation'] },
  pk: { name:'Pakistan', flag:'🇵🇰', region:'Asia', gdp:'$338B', population:'231M', militaryRank:9, influenceScore:48, riskScore:76, alliance:'SCO', economy:'Developing', militaryStrength:'Regional', capital:'Islamabad', currency:'PKR', overview:'Nuclear-armed state on the edge of economic collapse. 23rd IMF bailout. Military dominates politics — Imran Khan imprisoned. China-Pakistan Economic Corridor ($62B CPEC) as strategic lifeline. Taliban-governed Afghanistan on western border.', economyDetail:'$338B GDP. 23rd IMF loan ($7B). 30%+ inflation (2023-24). Foreign reserves barely cover 1 month of imports. CPEC investments stalling. Textile exports hit by energy costs. Significant IMF conditionality pressure.', militaryDetail:'Nuclear arsenal: 160-170 warheads. Short-range tactical nukes as India deterrent. JF-17 (China co-developed). F-16 (US supplied). ISI intelligence deeply involved in Afghanistan. Army controls foreign policy de facto.', foreignPolicy:'All-weather friendship with China. US relationship transactional (counter-terrorism base access). India — structured hostility. Afghanistan — Taliban relations complex. Gulf states as labour export destination.', tradePartners:['China','USA','UAE','UK','Germany'], strategicAlliances:['China (CPEC)','SCO','OIC'], keyRisks:['Sovereign default risk','India-Pakistan military escalation','Taliban spillover','Political instability (PTI-army conflict)'] },
  ua: { name:'Ukraine', flag:'🇺🇦', region:'Europe', gdp:'$160B', population:'37M', militaryRank:22, influenceScore:55, riskScore:95, alliance:'NATO-aspirant', economy:'Developing', militaryStrength:'Regional', capital:'Kyiv', currency:'Hryvnia (UAH)', overview:'At war with Russia since Feb 2022. Receiving $75B+ in US aid, $100B+ total Western support. Lost ~20% of territory. NATO membership aspiration — currently blocked by Hungary and historically US. Zelensky leading wartime diplomacy.', economyDetail:'GDP collapsed 30% in 2022, partial recovery. Massive reconstruction costs estimated at $500B. Western budget support essential — $5B/month needed. Agricultural exports (grain corridor) critical for revenue. Hyperinflation contained by donor support.', militaryDetail:'Transformed into one of Europe\'s most experienced combat forces. Operating Western kit: HIMARS, Abrams, Leopard 2, F-16. 800K+ personnel. Drone warfare pioneers — "drone army" doctrine. Kursk incursion — first foreign soil operation since WWII.', foreignPolicy:'EU accession candidate (2024 chapters opened). NATO membership as war aim. Zelensky peace formula: territorial integrity + war crimes tribunal. China — cautious engagement for peace talks. Global South neutral on war.', tradePartners:['EU','USA','UK','Poland','Germany'], strategicAlliances:['NATO partners (not member)','EU accession','G7 support'], keyRisks:['Russian offensive escalation','Western aid fatigue','Nuclear escalation','Economic collapse without donor support'] },
  kp: { name:'North Korea', flag:'🇰🇵', region:'Asia', gdp:'$28B', population:'26M', militaryRank:30, influenceScore:35, riskScore:92, alliance:'Axis', economy:'Developing', militaryStrength:'Regional', capital:'Pyongyang', currency:'North Korean Won', overview:'Most sanctioned country on Earth. Rapidly expanding nuclear arsenal. Kim Jong-un sent troops to fight alongside Russia in Ukraine. ICBM program achieving intercontinental range. Pursuing miniaturised nuclear warheads.', economyDetail:'$28B GDP — largely isolated. China provides 90%+ of trade. Sanctions-busting via ship-to-ship transfers, crypto hacking ($1.7B stolen in 2022). Workers sent to Russia and China. Arms sales to Russia (artillery shells, missiles) generating revenue.', militaryDetail:'Nuclear warheads: 40-60 estimated. ICBMs tested: Hwasong-17 (15,000km range). Hypersonic glide vehicle tested. 1.2M active military personnel. 10,000+ troops sent to Russia (Ukraine front). Conventional forces significant but aging.', foreignPolicy:'Kim-Putin alignment (June 2024 treaty). China as primary patron — but relationship strained by nuclear tests. Rare direct diplomacy with US failed (2018-2019 Singapore). South Korea — no reunification dialogue. Japan — historical hostility.', tradePartners:['China (>90%)','Russia'], strategicAlliances:['Russia (2024 treaty)','China (cautious)'], keyRisks:['Nuclear miscalculation','Kim succession instability','US military action','Regime collapse causing refugee crisis'] },
};

function getCountryDetail(code: string): CountryDetail | null {
  const normalized = code.toLowerCase();
  if (COUNTRY_DATA[normalized]) {
    return COUNTRY_DATA[normalized];
  }

  // Fallback to basic list to generate detailed fallback on-the-fly (prevents 404s)
  const basic = COUNTRIES.find(c => c.code.toLowerCase() === normalized);
  if (!basic) return null;

  const meta = COMMON_DETAILS[normalized] || { capital: 'N/A', currency: 'N/A' };

  return {
    name: basic.name,
    flag: basic.flag,
    region: basic.region,
    gdp: basic.gdp,
    population: basic.population,
    militaryRank: basic.militaryRank,
    influenceScore: basic.influenceScore,
    riskScore: basic.riskScore,
    alliance: basic.alliance,
    economy: basic.economy,
    militaryStrength: basic.militaryStrength,
    capital: meta.capital,
    currency: meta.currency,
    overview: `A strategic player in the ${basic.region} region. Classified as a ${basic.economy} economy with ${basic.militaryStrength} capabilities. Under active SignalAtlas monitoring, it receives a Geopolitical Risk Score of ${basic.riskScore}/100 and holds a global influence index score of ${basic.influenceScore}/100.`,
    economyDetail: `Representing a nominal GDP of ${basic.gdp} and supporting a population of ${basic.population}, its economy is structurally categorized as ${basic.economy}. Geopolitical and regional trends are actively reshaping its trade linkages, industrial policies, and resource dependencies.`,
    militaryDetail: `Ranked #${basic.militaryRank} globally in overall military capability, its forces are characterized as holding ${basic.militaryStrength} strength. Its national defense doctrines emphasize sovereign integrity, regional stability, and alignment with the ${basic.alliance} framework.`,
    foreignPolicy: `Aligned with ${basic.alliance}, its diplomatic posture centers on securing trade routes, managing regional vulnerabilities, and balancing relationships between the Global South and Western alliances in the ${basic.region} hemisphere.`,
    tradePartners: ['USA', 'China', 'European Union', 'Regional Partners'],
    strategicAlliances: [basic.alliance],
    keyRisks: [
      `Geopolitical friction factors in ${basic.region}`,
      `Supply chain and currency fluctuations`,
      `Sovereign debt and macro-economic adjustments`
    ]
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const country = getCountryDetail(code);
  if (!country) return { title: 'Country Not Found | SignalAtlas' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  return {
    title: `${country.name} Intelligence Profile — Risk, Military & Economy | SignalAtlas`,
    description: `${country.name} geopolitical profile: ${country.overview.slice(0, 140)}...`,
    keywords: [country.name, `${country.name} geopolitics`, `${country.name} military`, `${country.name} economy`, `${country.name} foreign policy`],
    alternates: { canonical: `${siteUrl}/countries/${code.toLowerCase()}` },
  };
}

export default async function CountryDetailPage({ params }: Props) {
  const { code } = await params;
  const country = getCountryDetail(code);
  if (!country) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://signalatlas.com';

  // Fetch related articles — static import (edge-compatible)
  let articles: any[] = [];
  try {
    const { data } = await supabase
      .from('articles')
      .select('id,slug,title,published_at,category,meta_description')
      .eq('status', 'published')
      .contains('countries', [country.name])
      .order('published_at', { ascending: false })
      .limit(6);
    articles = data || [];
  } catch { /* no articles */ }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${country.name} Intelligence Profile — SignalAtlas`,
    description: country.overview,
    url: `${siteUrl}/countries/${code}`,
  };

  const riskColor = country.riskScore >= 81 ? '#E24B4A' : country.riskScore >= 61 ? '#E8931A' : country.riskScore >= 31 ? '#F59E0B' : '#22C55E';
  const riskLabel = country.riskScore >= 81 ? 'CRITICAL' : country.riskScore >= 61 ? 'HIGH' : country.riskScore >= 31 ? 'MEDIUM' : 'LOW';

  const statCard = (label: string, value: string, sub?: string) => (
    <div key={label} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--radius)', padding: '1rem' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--white)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{sub}</div>}
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />

      {/* Hero header */}
      <div style={{ background: 'var(--navy)', padding: '3rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <a href="/countries" style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(255,255,255,.4)', letterSpacing: '.08em', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
            ← Country Intelligence Hub
          </a>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: 64 }}>{country.flag}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '.5rem', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.12em', textTransform: 'uppercase' }}>{country.region}</div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 1, background: `${riskColor}22`, color: riskColor, letterSpacing: '.08em' }}>
                  {riskLabel} RISK
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '2px 8px', borderRadius: 1, background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.4)', letterSpacing: '.06em' }}>
                  {country.militaryStrength}
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-.02em', marginBottom: '.5rem' }}>
                {country.name}
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.55)', lineHeight: 1.7, maxWidth: 680 }}>{country.overview}</p>
            </div>
          </div>

          {/* Key stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginTop: '1.5rem' }}>
            {statCard('GDP', country.gdp, 'Nominal')}
            {statCard('Population', country.population)}
            {statCard('Military Rank', `#${country.militaryRank}`, 'Global')}
            {statCard('Alliance', country.alliance)}
            {statCard('Capital', country.capital)}
            {statCard('Currency', country.currency)}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* Main content */}
          <div>
            {/* Influence + Risk bars */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Intelligence Scores</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[['Global Influence', country.influenceScore, '#C8760A'], ['Geopolitical Risk', country.riskScore, riskColor]].map(([label, score, color]) => (
                  <div key={label as string}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{label as string}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: color as string }}>{score as number}/100</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${score}%`, background: color as string, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Intelligence tabs - Economy */}
            {[
              { title: 'Economy', icon: '📈', color: '#059669', content: country.economyDetail },
              { title: 'Military Capability', icon: '🛡️', color: '#DC2626', content: country.militaryDetail },
              { title: 'Foreign Policy', icon: '🤝', color: '#2563EB', content: country.foreignPolicy },
            ].map(s => (
              <div key={s.title} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: s.color, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>{s.title}</div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.8 }}>{s.content}</p>
              </div>
            ))}

            {/* Trade partners */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>🚢 Top Trade Partners</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {country.tradePartners.map((p, i) => (
                  <a key={p} href={`/countries/${p.toLowerCase().replace(/\s+/g,'-').substring(0,2)}`}
                    style={{ fontFamily: 'var(--mono)', fontSize: 11, background: 'var(--off)', border: '1px solid var(--border)', borderRadius: 2, padding: '4px 10px', color: 'var(--ink2)', textDecoration: 'none', fontWeight: i === 0 ? 700 : 400 }}>
                    {i === 0 && '★ '}{p}
                  </a>
                ))}
              </div>
            </div>

            {/* Strategic alliances */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>🔗 Strategic Alliances</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {country.strategicAlliances.map(a => (
                  <span key={a} style={{ fontFamily: 'var(--mono)', fontSize: 11, background: 'var(--navy)', color: 'var(--amber)', borderRadius: 2, padding: '4px 10px' }}>{a}</span>
                ))}
              </div>
            </div>

            {/* Key risks */}
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#DC2626', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>⚠️ Key Risk Vectors</div>
              {country.keyRisks.map((r, i) => (
                <div key={r} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < country.keyRisks.length - 1 ? 8 : 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#DC2626', color: 'white', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <div style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.5 }}>{r}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Related articles */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                📰 Latest SignalAtlas Analysis
              </div>
              {articles.length > 0 ? (
                articles.map(a => (
                  <a key={a.id} href={`/research/${a.slug}`} style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--amber)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 3 }}>{a.category}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', lineHeight: 1.4 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 3 }}>{a.published_at?.slice(0, 10)}</div>
                  </a>
                ))
              ) : (
                <div style={{ fontSize: 12, color: 'var(--ink3)', textAlign: 'center', padding: '20px 0' }}>
                  No articles yet for {country.name}.<br />
                  <a href="/research" style={{ color: 'var(--amber)', fontSize: 11 }}>Browse all research →</a>
                </div>
              )}
              {articles.length > 0 && (
                <a href={`/research?country=${country.name}`} style={{ display: 'block', marginTop: '1rem', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.06em', textDecoration: 'none' }}>
                  View all {country.name} analysis →
                </a>
              )}
            </div>

            {/* Quick intel card */}
            <div style={{ background: 'var(--navy)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Intel</div>
              {[
                ['Economy Type', country.economy],
                ['Military', country.militaryStrength],
                ['Alliance Bloc', country.alliance],
                ['Risk Score', `${country.riskScore}/100`],
                ['Influence Score', `${country.influenceScore}/100`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontFamily: 'var(--mono)' }}>{k}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--white)', fontFamily: 'var(--mono)' }}>{v}</span>
                </div>
              ))}
              <a href="/countries" style={{ display: 'block', marginTop: '1rem', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '.06em', textDecoration: 'none', textAlign: 'center' }}>
                ← All Countries
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

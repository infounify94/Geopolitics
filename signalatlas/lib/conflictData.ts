// Shared conflict data — used by both ConflictMap (client) and conflicts/page.tsx (server)
// Day counts are ALWAYS computed dynamically from start_date — never hardcoded

export interface ConflictPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'active-war' | 'diplomatic-crisis' | 'sanctions' | 'flashpoint' | 'resolved';
  alertLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  region: string;
  startDate: string;      // ISO date string — day count computed from this
  intensity: number;
  summary: string;
  slug?: string;
}

/** Compute how many days a conflict has been active from its start date */
export function getDaysActive(startDate: string): number {
  return Math.floor((Date.now() - new Date(startDate).getTime()) / 86_400_000);
}

export const CONFLICT_POINTS: ConflictPoint[] = [
  { id:'1',  name:'Russia–Ukraine War',     lat:49.0,  lng:32.0,  type:'active-war',        alertLevel:'CRITICAL', region:'Europe',      startDate:'2022-02-24', intensity:9.2, summary:'Full-scale Russian invasion. Largest land war in Europe since WWII. Active frontlines across eastern Ukraine.',             slug:'russian-strike-kyiv-may-2026' },
  { id:'2',  name:'Gaza–Israel War',        lat:31.4,  lng:34.4,  type:'active-war',        alertLevel:'CRITICAL', region:'Middle East', startDate:'2023-10-07', intensity:9.5, summary:'Ongoing military conflict following Oct 7, 2023. Humanitarian crisis in Gaza Strip. Regional escalation risk.',              slug:'us-iran-inch-toward-deal-uranium-enrichment' },
  { id:'3',  name:'Sudan Civil War',        lat:15.5,  lng:32.5,  type:'active-war',        alertLevel:'CRITICAL', region:'Africa',      startDate:'2023-04-15', intensity:8.1, summary:'RSF vs SAF. 8M+ internally displaced. Largest global humanitarian crisis. Ceasefire talks collapsed.' },
  { id:'4',  name:'Myanmar Civil War',      lat:19.7,  lng:96.0,  type:'active-war',        alertLevel:'HIGH',     region:'Asia',        startDate:'2021-02-01', intensity:7.8, summary:'Military junta vs resistance forces since 2021 coup. Mass civilian casualties. Regional instability.' },
  { id:'5',  name:'US–Iran Tensions',       lat:32.0,  lng:53.0,  type:'diplomatic-crisis', alertLevel:'HIGH',     region:'Middle East', startDate:'2024-01-01', intensity:7.5, summary:'Nuclear talks at critical juncture. Uranium enrichment the core dispute. Proxy conflicts across the theater.',               slug:'us-iran-inch-toward-deal-uranium-enrichment' },
  { id:'6',  name:'Taiwan Strait',          lat:24.0,  lng:121.0, type:'flashpoint',        alertLevel:'HIGH',     region:'Asia',        startDate:'2020-12-01', intensity:7.2, summary:'PRC military pressure on Taiwan. Regular incursions into ADIZ. US carrier deployments. Escalation risk.' },
  { id:'7',  name:'South China Sea',        lat:12.0,  lng:115.0, type:'flashpoint',        alertLevel:'HIGH',     region:'Asia',        startDate:'2015-01-01', intensity:6.8, summary:'Territorial disputes: China vs Philippines, Vietnam. Coast guard incidents escalating. US FONOPS continue.' },
  { id:'8',  name:'Yemen Civil War',        lat:15.8,  lng:44.2,  type:'active-war',        alertLevel:'HIGH',     region:'Middle East', startDate:'2015-03-26', intensity:7.0, summary:'Houthi attacks disrupting Red Sea shipping. Iran-backed forces. Coalition airstrikes continuing.',                         slug:'strait-of-hormuz-closure-disrupts-global-supply-chains' },
  { id:'9',  name:'Haiti Collapse',         lat:18.9,  lng:-72.3, type:'active-war',        alertLevel:'HIGH',     region:'Americas',    startDate:'2023-03-01', intensity:7.5, summary:'Gang control of 80% of Port-au-Prince. State collapse. Kenyan-led MSS mission deployed.' },
  { id:'10', name:'Sahel Instability',      lat:14.0,  lng:0.0,   type:'active-war',        alertLevel:'HIGH',     region:'Africa',      startDate:'2020-08-18', intensity:7.2, summary:'Mali, Niger, Burkina Faso under military juntas. France expelled. Wagner/Africa Corps operating.' },
  { id:'11', name:'US–China Trade War',     lat:35.0,  lng:103.0, type:'sanctions',         alertLevel:'HIGH',     region:'Asia',        startDate:'2018-01-22', intensity:6.5, summary:'Semiconductor export controls. 180%+ tariffs. Tech decoupling accelerating. Supply chain realignment.' },
  { id:'12', name:'Russia Sanctions',       lat:60.0,  lng:38.0,  type:'sanctions',         alertLevel:'HIGH',     region:'Europe',      startDate:'2022-02-24', intensity:7.0, summary:'$300B assets frozen. SWIFT exclusion. 267 sanction packages. Oil price cap. Evasion networks developing.' },
  { id:'13', name:'North Korea Standoff',   lat:40.0,  lng:127.0, type:'flashpoint',        alertLevel:'HIGH',     region:'Asia',        startDate:'1953-07-27', intensity:6.8, summary:'ICBM tests continuing. Nuclear arsenal expansion. Russia military cooperation. Troops in Ukraine.' },
  { id:'14', name:'India–Pakistan LoC',     lat:32.0,  lng:74.0,  type:'flashpoint',        alertLevel:'MEDIUM',   region:'Asia',        startDate:'1947-08-15', intensity:5.5, summary:'LOC skirmishes periodic. Nuclear-armed adversaries with periodic flare-ups. Post-Pulwama dynamics.' },
  { id:'15', name:'Strait of Hormuz',       lat:26.5,  lng:56.5,  type:'flashpoint',        alertLevel:'HIGH',     region:'Middle East', startDate:'2023-11-19', intensity:7.8, summary:'Iran threatens closure. 20% global oil transits here. Houthi Red Sea attacks linked to Hormuz risk.',                     slug:'strait-of-hormuz-closure-disrupts-global-supply-chains' },
  { id:'16', name:'Venezuela Crisis',       lat:8.0,   lng:-66.0, type:'diplomatic-crisis', alertLevel:'MEDIUM',   region:'Americas',    startDate:'2019-01-10', intensity:5.5, summary:'Disputed election. US sanctions. 7M+ migrants. Maduro regime consolidating control.' },
  { id:'17', name:'Kosovo–Serbia',          lat:42.7,  lng:21.1,  type:'diplomatic-crisis', alertLevel:'MEDIUM',   region:'Europe',      startDate:'1998-02-28', intensity:4.5, summary:'Status dispute ongoing. EU mediation. Periodic border incidents. NATO KFOR deployed.' },
  { id:'18', name:'Ethiopia Tensions',      lat:14.0,  lng:39.0,  type:'diplomatic-crisis', alertLevel:'MEDIUM',   region:'Africa',      startDate:'2022-11-02', intensity:5.0, summary:'Cessation of hostilities holding. Humanitarian access improving. Reconstruction phase ongoing.' },
];

export const TYPE_LABELS: Record<string, string> = {
  'active-war':        'Active War',
  'diplomatic-crisis': 'Diplomatic Crisis',
  'sanctions':         'Sanctions/Economic',
  'flashpoint':        'Strategic Flashpoint',
  'resolved':          'Resolved',
};

export const TYPE_COLORS: Record<string, string> = {
  'active-war':        '#E24B4A',
  'diplomatic-crisis': '#F59E0B',
  'sanctions':         '#3B82F6',
  'flashpoint':        '#E8931A',
  'resolved':          '#6B7280',
};

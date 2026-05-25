'use client';
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { useRouter } from 'next/navigation';
import type { Country } from '@/lib/types';

interface Props { countries: Country[]; }

const geoUrl = "/features.json";

const ALERT_CLASS: Record<string, string> = {
  CRITICAL: 'var(--red)',
  HIGH:     'var(--amber)',
  ACTIVE:   'var(--amber)',
  WATCH:    'var(--green)',
};

// Map country names to coordinates for markers
const COORDS: Record<string, [number, number]> = {
  "United States": [-95.7129, 37.0902],
  "China": [104.1954, 35.8617],
  "Russia": [105.3188, 61.5240],
  "India": [78.9629, 20.5937],
  "Pakistan": [69.3451, 30.3753],
  "Israel": [34.8516, 31.0461],
  "Ukraine": [31.1656, 48.3794],
  "Iran": [53.6880, 32.4279],
  "Taiwan": [120.9605, 23.6978],
  "Venezuela": [-66.5897, 6.4238],
  "France": [2.2137, 46.2276],
  "Germany": [10.4515, 51.1657],
  "United Kingdom": [-3.4360, 55.3781],
  "Sudan": [30.2176, 12.8628],
  "Yemen": [47.5146, 15.5527]
};

const FALLBACK: Country[] = [
  { id: '1', name: 'United States', flag_emoji: '🇺🇸', alert_level: 'HIGH',     status_line: 'Trade wars + election cycle active', article_count: 0 },
  { id: '2', name: 'China',         flag_emoji: '🇨🇳', alert_level: 'HIGH',     status_line: 'Taiwan + BRI debt diplomacy',        article_count: 0 },
  { id: '3', name: 'Russia',        flag_emoji: '🇷🇺', alert_level: 'CRITICAL', status_line: 'Ukraine war + 267 active sanctions', article_count: 0 },
  { id: '4', name: 'India',         flag_emoji: '🇮🇳', alert_level: 'WATCH',    status_line: 'Strategic realignment underway',     article_count: 0 },
  { id: '5', name: 'Pakistan',      flag_emoji: '🇵🇰', alert_level: 'HIGH',     status_line: 'IMF loan #23 + economic crisis',     article_count: 0 },
];

export default function CountryWatch({ countries }: Props) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<Country | null>(null);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const list = countries.length > 0 ? countries : FALLBACK;

  if (!mounted) return <div className="card card-pad" style={{ minHeight: 300 }} />;

  return (
    <div className="card card-pad fade" style={{ animationDelay: '0.15s', overflow: 'hidden', position: 'relative' }}>
      <div className="sec-head" style={{ marginBottom: 10 }}>
        <div className="sec-bar" style={{ background: 'var(--blue)' }} />
        <div className="sec-title">Global Watch Map</div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 12 }}>Scroll to zoom. Click a hotspot to view intelligence.</p>
      
      <div style={{ position: 'relative', width: '100%', height: 260, background: 'var(--blue)', borderRadius: 8, overflow: 'hidden' }}>
        <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400} style={{ width: '100%', height: '100%' }}>
          <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={8}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1e3a5c"
                    stroke="#142c47"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover:   { outline: "none", fill: "#2a4c7a" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {list.map((c) => {
              const coords = COORDS[c.name];
              if (!coords) return null;
              return (
                <Marker 
                  key={c.id} 
                  coordinates={coords} 
                  onMouseEnter={() => setHovered(c)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => router.push('/countries')}
                >
                  <circle 
                    r={5} 
                    fill={ALERT_CLASS[c.alert_level ?? 'WATCH'] || 'var(--green)'} 
                    stroke="#fff" 
                    strokeWidth={1} 
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  />
                  <circle 
                    r={14} 
                    fill={ALERT_CLASS[c.alert_level ?? 'WATCH'] || 'var(--green)'} 
                    opacity={0.3} 
                    style={{ animation: 'pulse 2s infinite', pointerEvents: 'none' }}
                  />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {hovered && (
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'var(--white)',
            padding: '10px 14px',
            borderRadius: 6,
            boxShadow: 'var(--shadow-hover)',
            border: '1px solid var(--border)',
            pointerEvents: 'none',
            zIndex: 10,
            maxWidth: 220
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{hovered.flag_emoji}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{hovered.name}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink3)', lineHeight: 1.4 }}>
              {hovered.status_line}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: ALERT_CLASS[hovered.alert_level ?? 'WATCH'], color: '#fff' }}>
                {hovered.alert_level}
              </span>
              <span style={{ fontSize: 11, color: 'var(--ink4)', fontWeight: 600 }}>{hovered.article_count} art.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #080808; color: #f0ede6; font-family: 'DM Mono', monospace; cursor: none; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #080808; }
  ::-webkit-scrollbar-thumb { background: #1f1f1f; }

  .cursor {
    position: fixed; width: 8px; height: 8px; background: #c8f060; border-radius: 50%;
    pointer-events: none; z-index: 9999; transform: translate(-50%, -50%);
  }
  .cursor-ring {
    position: fixed; width: 28px; height: 28px; border: 1px solid rgba(200,240,96,0.35);
    border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%);
    transition: left 0.1s ease-out, top 0.1s ease-out, width 0.2s, height 0.2s, border-color 0.2s;
  }
  .cursor-ring.hovered { width: 46px; height: 46px; border-color: rgba(200,240,96,0.65); }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 48px; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(8,8,8,0.88); backdrop-filter: blur(16px); border-bottom: 1px solid #1f1f1f;
  }
  .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: #f0ede6; letter-spacing: -0.02em; text-decoration: none; }
  .nav-links { display: flex; gap: 32px; }
  .nav-link { font-family: 'DM Mono', monospace; font-size: 11px; color: #7a7a78; text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; cursor: none; transition: color 0.2s; position: relative; padding-bottom: 4px; }
  .nav-link:hover { color: #c8f060; }
  .nav-link.active { color: #c8f060; }
  .nav-link.active::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 1px; background: #c8f060; }

  .noise {
    position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px;
  }

  .page { max-width: 900px; margin: 0 auto; padding: 120px 48px 80px; }

  .page-eyebrow { font-family: 'DM Mono', monospace; font-size: 11px; color: #c8f060; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 20px; opacity: 0; animation: fadeUp 0.6s 0.1s forwards; }
  .page-title { font-family: 'Playfair Display', serif; font-size: clamp(40px, 6vw, 72px); font-weight: 400; line-height: 1.05; opacity: 0; animation: fadeUp 0.6s 0.25s forwards; }
  .page-title-italic { font-style: italic; color: #7a7a78; }
  .page-sub { font-family: 'DM Mono', monospace; font-size: 13px; color: #7a7a78; line-height: 1.9; max-width: 480px; margin-top: 20px; opacity: 0; animation: fadeUp 0.6s 0.4s forwards; }

  .projects-list { margin-top: 72px; display: flex; flex-direction: column; gap: 32px; }

  /* Project card */
  .project-card {
    display: grid; grid-template-columns: 1fr 340px; gap: 0;
    background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 6px;
    overflow: hidden; transition: border-color 0.3s, transform 0.3s;
    opacity: 0; transform: translateY(28px);
    transition: border-color 0.3s, transform 0.5s, opacity 0.5s;
  }
  .project-card.visible { opacity: 1; transform: translateY(0); }
  .project-card:hover { border-color: #c8f060; }

  .project-content { padding: 32px; border-right: 1px solid #1f1f1f; display: flex; flex-direction: column; }
  .project-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
  .project-number { font-family: 'DM Mono', monospace; font-size: 10px; color: #3d3d3b; letter-spacing: 0.15em; margin-bottom: 10px; }
  .project-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #f0ede6; }
  .project-tagline { font-family: 'DM Mono', monospace; font-size: 12px; color: #c8f060; letter-spacing: 0.06em; margin-top: 4px; margin-bottom: 16px; }
  .project-desc { font-family: 'DM Mono', monospace; font-size: 12.5px; color: #7a7a78; line-height: 1.85; flex: 1; }
  .project-bullets { margin-top: 16px; display: flex; flex-direction: column; gap: 6px; }
  .project-bullet { font-family: 'DM Mono', monospace; font-size: 12px; color: #7a7a78; line-height: 1.7; padding-left: 16px; position: relative; }
  .project-bullet::before { content: '—'; position: absolute; left: 0; color: #c8f060; }
  .project-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 20px; }
  .project-tag { display: inline-block; padding: 3px 9px; background: #161616; border: 1px solid #1f1f1f; border-radius: 2px; font-family: 'DM Mono', monospace; font-size: 11px; color: #7a7a78; }
  .project-tag.hero { border-color: rgba(200,240,96,0.4); color: #c8f060; background: rgba(200,240,96,0.06); }
  .project-links { display: flex; gap: 12px; margin-top: 20px; align-items: center; }
  .project-link-primary { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; color: #080808; background: #c8f060; padding: 7px 16px; border-radius: 2px; text-decoration: none; transition: opacity 0.2s; }
  .project-link-primary:hover { opacity: 0.85; }
  .project-link-secondary { font-family: 'DM Mono', monospace; font-size: 12px; color: #7a7a78; text-decoration: none; transition: color 0.2s; display: flex; align-items: center; gap: 6px; }
  .project-link-secondary:hover { color: #f0ede6; }

  .badge-wip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.25); border-radius: 2px; font-family: 'DM Mono', monospace; font-size: 10px; color: #fbbf24; letter-spacing: 0.1em; text-transform: uppercase; }
  .badge-live { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; background: rgba(200,240,96,0.08); border: 1px solid rgba(200,240,96,0.25); border-radius: 2px; font-family: 'DM Mono', monospace; font-size: 10px; color: #c8f060; letter-spacing: 0.1em; text-transform: uppercase; }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; animation: pulse-dot 2s ease-in-out infinite; }
  .badge-live .badge-dot { background: #c8f060; }
  .badge-wip .badge-dot { background: #fbbf24; }

  /* Mock UI panel */
  .project-mock { background: #080808; display: flex; align-items: center; justify-content: center; padding: 24px; min-height: 280px; position: relative; overflow: hidden; }

  /* ── Six Seven mock ── */
  .sixseven-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; width: 100%; }
  .phone-frame { width: 140px; height: 220px; border: 2px solid #2a2a2a; border-radius: 20px; background: #0a0a0a; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; position: relative; overflow: hidden; }
  .phone-notch { width: 40px; height: 6px; background: #1f1f1f; border-radius: 3px; position: absolute; top: 10px; }
  .phone-counter-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 36px; animation: seesaw 2s ease-in-out infinite; display: inline-block; }
  .phone-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; }
  .phone-awards { display: flex; gap: 5px; margin-top: 4px; }
  .award-dot { width: 7px; height: 7px; border-radius: 50%; border: 1px solid #2a2a2a; }
  .award-dot.earned { animation: glow-dot 1.5s ease-in-out infinite alternate; }
  .phone-milestone { font-family: 'DM Mono', monospace; font-size: 8px; color: #7a7a78; letter-spacing: 0.1em; }

  /* ── Inkplate mock ── */
  .inkplate-frame { width: 200px; height: 150px; border: 2px solid #2a2a2a; border-radius: 4px; background: #e8e4dc; position: relative; overflow: hidden; display: flex; flex-direction: column; }
  .inkplate-scanlines { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px); pointer-events: none; z-index: 2; }
  .inkplate-screen { flex: 1; display: flex; flex-direction: column; padding: 8px; }
  .inkplate-panel { position: absolute; inset: 0; padding: 8px; display: flex; flex-direction: column; transition: opacity 0.8s; }
  .inkplate-panel.hidden { opacity: 0; pointer-events: none; }

  /* weather panel */
  .ink-weather-title { font-family: 'DM Mono', monospace; font-size: 7px; color: #1a1a1a; letter-spacing: 0.15em; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 6px; }
  .ink-city-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
  .ink-city-name { font-family: 'DM Mono', monospace; font-size: 8px; color: #1a1a1a; font-weight: bold; }
  .ink-city-temp { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #1a1a1a; }
  .ink-city-cond { font-family: 'DM Mono', monospace; font-size: 7px; color: #555; }
  .ink-headline { font-family: 'DM Mono', monospace; font-size: 6.5px; color: #333; line-height: 1.5; margin-top: 6px; border-top: 1px solid #ccc; padding-top: 4px; }

  /* year progress panel */
  .ink-year-title { font-family: 'DM Mono', monospace; font-size: 7px; color: #1a1a1a; letter-spacing: 0.15em; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 6px; }
  .ink-pixel-grid { display: grid; grid-template-columns: repeat(26, 1fr); gap: 1px; margin-bottom: 6px; }
  .ink-pixel { width: 4px; height: 4px; border-radius: 0.5px; }
  .ink-pixel.filled { background: #1a1a1a; }
  .ink-pixel.empty { background: #ccc; }
  .ink-quote { font-family: 'DM Mono', monospace; font-size: 6px; color: #555; line-height: 1.5; font-style: italic; border-top: 1px solid #ccc; padding-top: 4px; }

  /* spotify panel */
  .ink-spotify-wrap { display: flex; gap: 8px; align-items: center; height: 100%; }
  .ink-album { width: 56px; height: 56px; background: #333; border-radius: 2px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .ink-track-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .ink-track-title { font-family: 'Syne', sans-serif; font-size: 9px; font-weight: 700; color: #1a1a1a; }
  .ink-track-artist { font-family: 'DM Mono', monospace; font-size: 7px; color: #555; }
  .ink-progress-bar { height: 3px; background: #ccc; border-radius: 1px; margin-top: 6px; position: relative; overflow: hidden; }
  .ink-progress-fill { height: 100%; background: #1a1a1a; border-radius: 1px; animation: progress-fill 4s linear infinite; }
  .ink-now-playing { font-family: 'DM Mono', monospace; font-size: 6px; color: #555; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }

  /* ── ResumeMatch mock ── */
  .browser-frame { width: 200px; height: 220px; border: 1.5px solid #2a2a2a; border-radius: 6px; background: #0d0d0d; display: flex; flex-direction: column; overflow: hidden; }
  .browser-bar { height: 22px; background: #161616; border-bottom: 1px solid #1f1f1f; display: flex; align-items: center; padding: 0 8px; gap: 4px; flex-shrink: 0; }
  .browser-dot { width: 5px; height: 5px; border-radius: 50%; }
  .browser-url { flex: 1; height: 12px; background: #1f1f1f; border-radius: 2px; margin-left: 6px; }
  .browser-body { flex: 1; display: flex; overflow: hidden; }
  .browser-page { flex: 1; padding: 8px; background: #f8f8f8; overflow: hidden; }
  .browser-page-line { height: 5px; background: #e0e0e0; border-radius: 2px; margin-bottom: 4px; }
  .browser-panel { width: 72px; background: #0d0d0d; border-left: 1px solid #1f1f1f; padding: 8px 6px; display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
  .panel-label { font-family: 'DM Mono', monospace; font-size: 6px; color: #3d3d3b; letter-spacing: 0.1em; text-transform: uppercase; }
  .panel-score-ring { width: 36px; height: 36px; border-radius: 50%; border: 3px solid #1f1f1f; display: flex; align-items: center; justify-content: center; margin: 2px auto; position: relative; }
  .panel-score-ring svg { position: absolute; inset: -3px; width: calc(100% + 6px); height: calc(100% + 6px); transform: rotate(-90deg); }
  .panel-score-text { font-family: 'Syne', sans-serif; font-size: 9px; font-weight: 700; color: #c8f060; z-index: 1; }
  .panel-kw { display: flex; flex-direction: column; gap: 3px; }
  .panel-kw-row { display: flex; align-items: center; gap: 3px; }
  .panel-kw-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }
  .panel-kw-label { font-family: 'DM Mono', monospace; font-size: 6px; color: #7a7a78; }

  /* Section label */
  .section-label { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; }
  .section-label-text { font-family: 'DM Mono', monospace; font-size: 11px; color: #c8f060; letter-spacing: 0.15em; white-space: nowrap; }
  .section-label-line { flex: 1; height: 1px; background: #1f1f1f; }

  /* Footer */
  .footer { border-top: 1px solid #1f1f1f; padding: 28px 48px; display: flex; justify-content: space-between; align-items: center; max-width: 900px; margin: 0 auto; }
  .footer-text { font-family: 'DM Mono', monospace; font-size: 11px; color: #3d3d3b; }
  .icon-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: 1px solid #1f1f1f; border-radius: 2px; background: #0f0f0f; text-decoration: none; transition: border-color 0.2s; }
  .icon-btn:hover { border-color: #c8f060; }

  /* Animations */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes seesaw { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
  @keyframes glow-dot { from { box-shadow: 0 0 0 0 currentColor; } to { box-shadow: 0 0 6px 2px currentColor; } }
  @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes progress-fill { 0% { width: 15%; } 100% { width: 85%; } }
  @keyframes score-draw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 22; } }
  @keyframes pulse-btn { 0%,100% { box-shadow: 0 0 0 0 rgba(200,240,96,0.4); } 50% { box-shadow: 0 0 0 4px rgba(200,240,96,0); } }
  @keyframes color-cycle {
    0%   { color: #a855f7; }
    25%  { color: #f97316; }
    50%  { color: #c8f060; }
    75%  { color: #06b6d4; }
    100% { color: #a855f7; }
  }
  @keyframes counter-tick {
    0%  { opacity: 1; }
    45% { opacity: 1; }
    50% { opacity: 0; }
    55% { opacity: 1; }
    100%{ opacity: 1; }
  }

  @media (max-width: 720px) {
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
    .nav { padding: 0 24px; }
    .page { padding: 100px 24px 60px; }
    .project-card { grid-template-columns: 1fr; }
    .project-mock { min-height: 200px; border-top: 1px solid #1f1f1f; border-right: none; }
    .project-content { border-right: none; border-bottom: 1px solid #1f1f1f; }
    .nav-links { display: none; }
    .footer { padding: 24px; flex-direction: column; gap: 8px; }
  }
`;

// ── Six Seven Mock ──────────────────────────────────────────
const PALETTES = [
  { num: "6", color: "#a855f7", label: "MILESTONE" },
  { num: "7", color: "#f97316", label: "UNLOCKED" },
  { num: "67", color: "#c8f060", label: "LEGENDARY" },
  { num: "100", color: "#06b6d4", label: "CENTURY" },
];
function SixSevenMock() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PALETTES.length), 2000);
    return () => clearInterval(t);
  }, []);
  const p = PALETTES[idx];
  return (
    <div className="sixseven-wrap">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 8 }}>
          <div className="phone-label" style={{ color: p.color, fontSize: 8, letterSpacing: "0.2em" }}>{p.label}</div>
          <div className="phone-counter-num" style={{ color: p.color, transition: "color 0.4s" }}>{p.num}</div>
          <div className="phone-milestone" style={{ color: p.color, opacity: 0.6 }}>next: {parseInt(p.num) + 1} taps</div>
          <div className="phone-awards">
            {[true, true, true, false, false, false].map((e, i) => (
              <div key={i} className={`award-dot ${e ? "earned" : ""}`} style={{ background: e ? p.color : "transparent", borderColor: e ? p.color : "#2a2a2a", boxShadow: e ? `0 0 4px ${p.color}` : "none", transition: "all 0.4s" }} />
            ))}
          </div>
          <div style={{ width: "70%", height: 3, background: "#1a1a1a", borderRadius: 2, marginTop: 2 }}>
            <div style={{ width: "60%", height: "100%", background: p.color, borderRadius: 2, transition: "background 0.4s" }} />
          </div>
        </div>
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#3d3d3b", letterSpacing: "0.1em", textAlign: "center" }}>
        TAP · MILESTONE · AWARD
      </div>
    </div>
  );
}

// ── Inkplate Mock ──────────────────────────────────────────
const SCREENS = ["weather", "year", "spotify"];
function InklateMock() {
  const [screen, setScreen] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setScreen(s => (s + 1) % SCREENS.length), 3000);
    return () => clearInterval(t);
  }, []);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const totalDays = 365;
  const pixels = Array.from({ length: 52 }, (_, i) => i < Math.floor(dayOfYear / 7));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div className="inkplate-frame">
        <div className="inkplate-scanlines" />
        {/* Weather */}
        <div className="inkplate-panel" style={{ opacity: screen === 0 ? 1 : 0, transition: "opacity 0.6s" }}>
          <div className="ink-weather-title">⛅ Weather · Real-time</div>
          <div className="ink-city-row">
            <div><div className="ink-city-name">Seattle</div><div className="ink-city-cond">Overcast</div></div>
            <div className="ink-city-temp">52°F</div>
          </div>
          <div className="ink-city-row">
            <div><div className="ink-city-name">Houston</div><div className="ink-city-cond">Sunny</div></div>
            <div className="ink-city-temp">78°F</div>
          </div>
          <div className="ink-headline">📰 World News · Reddit<br />Global markets steady ahead of Fed decision — analysts weigh in on rate outlook</div>
        </div>
        {/* Year Progress */}
        <div className="inkplate-panel" style={{ opacity: screen === 1 ? 1 : 0, transition: "opacity 0.6s" }}>
          <div className="ink-year-title">📅 {new Date().getFullYear()} Progress · {dayOfYear}/{totalDays} days</div>
          <div className="ink-pixel-grid">
            {pixels.map((f, i) => <div key={i} className={`ink-pixel ${f ? "filled" : "empty"}`} />)}
          </div>
          <div className="ink-quote">"The impediment to action advances action. What stands in the way becomes the way." — Marcus Aurelius</div>
        </div>
        {/* Spotify */}
        <div className="inkplate-panel" style={{ opacity: screen === 2 ? 1 : 0, transition: "opacity 0.6s" }}>
          <div className="ink-now-playing">▶ Now Playing</div>
          <div className="ink-spotify-wrap">
            <div className="ink-album">🎵</div>
            <div className="ink-track-info">
              <div className="ink-track-title">Blinding Lights</div>
              <div className="ink-track-artist">The Weeknd</div>
              <div className="ink-progress-bar"><div className="ink-progress-fill" /></div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6, color: "#555", marginTop: 4 }}>2:14 / 3:20</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {SCREENS.map((_, i) => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: screen === i ? "#c8f060" : "#2a2a2a", transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#3d3d3b", letterSpacing: "0.1em" }}>
        E-INK · ESP32 · C++
      </div>
    </div>
  );
}

// ── ResumeMatch Mock ──────────────────────────────────────────
function ResumeMatchMock() {
  const [score, setScore] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      setAnalyzing(false);
      let s = 0;
      const inc = setInterval(() => { s += 2; setScore(s); if (s >= 87) clearInterval(inc); }, 30);
    }, 1500);
    const reset = setInterval(() => { setScore(0); setAnalyzing(true); setTimeout(() => { setAnalyzing(false); let s2 = 0; const inc2 = setInterval(() => { s2 += 2; setScore(s2); if (s2 >= 87) clearInterval(inc2); }, 30); }, 1500); }, 7000);
    return () => { clearTimeout(t); clearInterval(reset); };
  }, []);
  const circ = 2 * Math.PI * 14;
  const offset = circ - (score / 100) * circ;
  const keywords = [
    { label: "Java", match: true },
    { label: "AWS", match: true },
    { label: "CI/CD", match: true },
    { label: "Go", match: false },
  ];
  return (
    <div className="browser-frame">
      <div className="browser-bar">
        <div className="browser-dot" style={{ background: "#ff5f57" }} />
        <div className="browser-dot" style={{ background: "#ffbd2e" }} />
        <div className="browser-dot" style={{ background: "#28c840" }} />
        <div className="browser-url" />
      </div>
      <div className="browser-body">
        <div className="browser-page">
          {[90, 75, 85, 60, 70, 80, 55, 65].map((w, i) => (
            <div key={i} className="browser-page-line" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="browser-panel">
          <div className="panel-label">{analyzing ? "Analyzing…" : "Match Score"}</div>
          <div className="panel-score-ring">
            {!analyzing && (
              <svg viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#1f1f1f" strokeWidth="3" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#c8f060" strokeWidth="3"
                  strokeDasharray={circ} strokeDashoffset={offset}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.05s linear" }} />
              </svg>
            )}
            <div className="panel-score-text">{analyzing ? "…" : `${score}%`}</div>
          </div>
          {!analyzing && (
            <div className="panel-kw">
              <div className="panel-label" style={{ marginBottom: 2 }}>Keywords</div>
              {keywords.map(k => (
                <div key={k.label} className="panel-kw-row">
                  <div className="panel-kw-dot" style={{ background: k.match ? "#c8f060" : "#3d3d3b" }} />
                  <div className="panel-kw-label" style={{ color: k.match ? "#9a9a98" : "#3d3d3b" }}>{k.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ProfileUnhider Mock ──────────────────────────────────────────
const REDDIT_POSTS = [
  { title: "Found this hiking trail in WA", sub: "r/Seattle", votes: "1.2k" },
  { title: "My ESP32 project after 3 months", sub: "r/arduino", votes: "847" },
  { title: "Tips for system design interviews", sub: "r/cscareerquestions", votes: "3.4k" },
];
const REDDIT_COMMENTS = [
  { text: "This is exactly what I needed, thanks!", sub: "r/webdev" },
  { text: "Great point — the async approach works better here", sub: "r/programming" },
];
function ProfileUnhiderMock() {
  const [phase, setPhase] = useState("hidden"); // hidden → revealing → revealed
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setPhase("hidden");
      setVisiblePosts([]);
      setVisibleComments([]);
      setCount(0);
      // pause on hidden state
      setTimeout(() => {
        setPhase("revealing");
        // stagger posts in
        REDDIT_POSTS.forEach((_, i) => {
          setTimeout(() => {
            setVisiblePosts(p => [...p, i]);
            setCount(c => c + 1);
          }, 600 + i * 500);
        });
        // stagger comments in after posts
        REDDIT_COMMENTS.forEach((_, i) => {
          setTimeout(() => {
            setVisibleComments(p => [...p, i]);
            setCount(c => c + 1);
          }, 600 + REDDIT_POSTS.length * 500 + i * 400);
        });
        // final revealed state
        setTimeout(() => setPhase("revealed"), 600 + (REDDIT_POSTS.length + REDDIT_COMMENTS.length) * 500);
      }, 1200);
    };
    cycle();
    const interval = setInterval(cycle, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="browser-frame" style={{ width: 210, height: 240 }}>
      <div className="browser-bar">
        <div className="browser-dot" style={{ background: "#ff5f57" }} />
        <div className="browser-dot" style={{ background: "#ffbd2e" }} />
        <div className="browser-dot" style={{ background: "#28c840" }} />
        <div className="browser-url" />
      </div>
      <div style={{ flex: 1, background: "#f6f7f8", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Reddit profile header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #edeff1", padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: phase === "hidden" ? "#edeff1" : "#ff4500", flexShrink: 0, transition: "background 0.4s", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
            {phase !== "hidden" && "👤"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 8, fontWeight: 700, color: phase === "hidden" ? "#edeff1" : "#1c1c1c", background: phase === "hidden" ? "#edeff1" : "transparent", borderRadius: 2, transition: "all 0.4s" }}>
              {phase === "hidden" ? "██████████" : "u/srijanreddy"}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6, color: "#878a8c", marginTop: 1 }}>
              {phase === "hidden" ? "Profile hidden" : `${count} items found`}
            </div>
          </div>
          {/* Injected Reveal button */}
          {phase === "hidden" && (
            <div style={{ background: "#c8f060", color: "#080808", fontFamily: "'Syne', sans-serif", fontSize: 6, fontWeight: 700, padding: "3px 6px", borderRadius: 2, letterSpacing: "0.05em", animation: "pulse-btn 1.5s ease-in-out infinite" }}>
              Reveal →
            </div>
          )}
          {phase !== "hidden" && (
            <div style={{ background: "rgba(200,240,96,0.15)", border: "1px solid rgba(200,240,96,0.4)", color: "#c8f060", fontFamily: "'DM Mono', monospace", fontSize: 6, padding: "2px 5px", borderRadius: 2 }}>
              ✓ Found
            </div>
          )}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: "hidden", padding: "6px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {phase === "hidden" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: "#878a8c", textAlign: "center", lineHeight: 1.6 }}>
                🔒 This profile is hidden<br />
                <span style={{ color: "#c8f060", fontSize: 6 }}>Click Reveal to surface activity</span>
              </div>
            </div>
          )}
          {phase !== "hidden" && (
            <>
              {visiblePosts.length > 0 && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6, color: "#878a8c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Posts</div>
              )}
              {REDDIT_POSTS.map((post, i) => (
                <div key={i} style={{
                  background: "#fff", border: "1px solid #edeff1", borderRadius: 2, padding: "4px 6px",
                  opacity: visiblePosts.includes(i) ? 1 : 0,
                  transform: visiblePosts.includes(i) ? "translateY(0)" : "translateY(4px)",
                  transition: "opacity 0.3s, transform 0.3s",
                }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 7, fontWeight: 600, color: "#1c1c1c", lineHeight: 1.3 }}>{post.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6, color: "#ff4500" }}>{post.sub}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6, color: "#878a8c" }}>▲ {post.votes}</div>
                  </div>
                </div>
              ))}
              {visibleComments.length > 0 && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6, color: "#878a8c", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2, marginBottom: 2 }}>Comments</div>
              )}
              {REDDIT_COMMENTS.map((comment, i) => (
                <div key={i} style={{
                  background: "#fff", border: "1px solid #edeff1", borderLeft: "2px solid #c8f060", borderRadius: 2, padding: "4px 6px",
                  opacity: visibleComments.includes(i) ? 1 : 0,
                  transform: visibleComments.includes(i) ? "translateY(0)" : "translateY(4px)",
                  transition: "opacity 0.3s, transform 0.3s",
                }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6.5, color: "#1c1c1c", lineHeight: 1.4 }}>{comment.text}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6, color: "#ff4500", marginTop: 2 }}>{comment.sub}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────
const IconGithub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);
const IconEmail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8f060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLinkedIn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c8f060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

// ── Projects data ──────────────────────────────────────────
const projects = [
  {
    id: "profileunhider",
    number: "01",
    title: "Profile Unhider",
    tagline: "A Chrome extension that surfaces hidden Reddit profile activity",
    status: "live",
    statusLabel: "Live on Chrome Web Store",
    description: "A Chrome extension that detects hidden Reddit profiles and reveals their publicly indexed posts and comments. The trickiest engineering challenge was that Reddit's search API strips comment IDs from permalinks for hidden profiles — solved by fetching each thread and recursively walking the comment tree to find the author's comment. All data sourced exclusively from Reddit's public search index.",
    bullets: [
      "Recursive comment-tree search across parallel thread fetches — Reddit strips comment IDs for hidden profiles so each thread is fetched and walked to find the author's t1 comment",
      "25 parallel Promise.all hydrations for comment body fetching with per-card DOM updates as each resolves",
      "SPA-aware MutationObserver detects Reddit's client-side navigation and re-runs detection on profile changes",
      "Chrome MV3 content script with zero permissions beyond reddit.com — no background service worker needed",
      "Auto-detects hidden profiles via DOM text matching, injects Reveal button and full panel without page reload",
      "Published to Chrome Web Store with landing page, privacy policy, and store screenshots",
    ],
    tags: ["JavaScript", "Chrome MV3", "Reddit Indexing", "Content Scripts", "CSS", "Netlify"],
    heroTags: ["Chrome MV3", "Reddit Indexing", "JavaScript"],
    github: "https://github.com/srijanreddy",
    demo: "https://profile-unhider.netlify.app",
    Mock: ProfileUnhiderMock,
  },
  {
    id: "resumematch",
    number: "02",
    title: "ResumeMatch AI",
    tagline: "Chrome extension that scores & tailors your resume against any job posting",
    status: "wip",
    statusLabel: "In Development",
    description: "A Chrome extension that auto-detects job postings on LinkedIn, Greenhouse, Workday, and Lever — then scores your resume against the role using a two-pass AI pipeline (GPT-4o-mini verifies JD requirements before GPT-4o tailors the resume). Returns a match percentage with keyword-level breakdown, gap analysis, and one-click PDF export matching your original resume format.",
    bullets: [
      "Two-pass anti-hallucination AI: GPT-4o-mini verifies JD before GPT-4o tailors",
      "Auto-detects job postings on LinkedIn, Greenhouse, Workday, and Lever via content scripts",
      "Scores resume match % with keyword-level breakdown across skills, experience, and keywords",
      "Gap analysis with evidence-validated hard/soft skill gaps",
      "One-click PDF export matching original resume format via jsPDF + pdf.js",
      "Zero backend — all data in chrome.storage.local, API key goes directly to OpenAI",
    ],
    tags: ["React", "TypeScript", "Vite", "Chrome MV3", "GPT-4o", "jsPDF", "pdf.js"],
    heroTags: ["GPT-4o", "Chrome MV3", "TypeScript"],
    github: null,
    demo: "https://srijanreddy.vercel.app",
    Mock: ResumeMatchMock,
  },
  {
    id: "sixseven",
    number: "03",
    title: "Six Seven",
    tagline: "A tap counter app with milestone awards & spring animations",
    status: "live",
    statusLabel: "Live on Play Store",
    description: "A minimalist yet deeply satisfying tap counter app built around the numbers 6 and 7. Tap the screen, watch the counter climb, and unlock 13 unique awards at milestone numbers — each accompanied by dynamic color palette shifts and spring-physics animations that make every tap feel rewarding.",
    bullets: [
      "13-award milestone system with earned/locked states and glow animations",
      "Spring-physics seesaw animation on the 6–7 display using React Native Reanimated",
      "Dynamic color palettes that shift on each milestone hit",
      "AsyncStorage persistence — progress survives app restarts",
      "Milestone banner slide-in with staggered entrance animations",
      "Published to Google Play Store under Alpharot Industries",
    ],
    tags: ["React Native", "Expo", "TypeScript", "Reanimated", "AsyncStorage", "expo-router"],
    heroTags: ["React Native", "Reanimated", "TypeScript"],
    github: "https://github.com/srijanreddy",
    demo: null,
    Mock: SixSevenMock,
  },
  {
    id: "inkplate",
    number: "04",
    title: "E-ink Dashboard",
    tagline: "A standalone hardware dashboard with weather, Spotify & stoic quotes",
    status: "live",
    statusLabel: "Built & Running",
    description: "A personal always-on dashboard built with an Inkplate 6 (ESP32-based e-ink display). Three screens cycle automatically — real-time weather for two cities via WeatherAPI, Reddit world news headlines with a year-progress pixel grid and stoic quote, and a Spotify fullscreen mode that activates automatically when music is playing, showing album art and a live progress bar.",
    bullets: [
      "SpotifyEsp32 OAuth with NVS token persistence — survives reboots without re-auth",
      "Auto-detects active Spotify playback and switches screens automatically",
      "Real-time weather for two cities via WeatherAPI REST integration",
      "Year progress pixel grid (52 weeks) with dynamically fetched stoic quotes",
      "Runs standalone via USB-C, no cloud dependency beyond API calls",
      "Built entirely in Arduino/C++ with efficient memory management for ESP32",
    ],
    tags: ["Arduino", "C++", "ESP32", "Inkplate 6", "SpotifyEsp32", "WeatherAPI", "OAuth"],
    heroTags: ["C++", "ESP32", "SpotifyEsp32"],
    github: "https://github.com/srijanreddy",
    demo: null,
    Mock: InklateMock,
  },
];

// ── Main page ──────────────────────────────────────────
function useCardReveal(count) {
  const refs = useRef([]);
  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setTimeout(() => el.classList.add("visible"), i * 120); obs.disconnect(); }
      }, { threshold: 0.08 });
      obs.observe(el);
      return () => obs.disconnect();
    });
  }, []);
  return refs;
}

export default function Projects() {
  const cursorRef = useRef();
  const ringRef = useRef();
  const cardRefs = useCardReveal(projects.length);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) { cursorRef.current.style.left = e.clientX + "px"; cursorRef.current.style.top = e.clientY + "px"; }
      if (ringRef.current) { ringRef.current.style.left = e.clientX + "px"; ringRef.current.style.top = e.clientY + "px"; }
    };
    const hover = () => ringRef.current?.classList.add("hovered");
    const unhover = () => ringRef.current?.classList.remove("hovered");
    window.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, .project-card").forEach(el => {
      el.addEventListener("mouseenter", hover);
      el.addEventListener("mouseleave", unhover);
    });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="noise" />
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">SR</Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">About</Link>
          <Link href="/#experience" className="nav-link">Experience</Link>
          <span className="nav-link active">Projects</span>
          <Link href="/#skills" className="nav-link">Skills</Link>
          <Link href="/#contact" className="nav-link">Contact</Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="page">
        <div className="page-eyebrow">Selected Work</div>
        <h1 className="page-title">
          Things I've<br />
          <span className="page-title-italic">built & shipped.</span>
        </h1>
        <p className="page-sub">
          A mix of mobile apps, hardware projects, and developer tools — each one scratching a different itch.
        </p>

        {/* PROJECTS */}
        <div className="projects-list">
          {projects.map((p, i) => (
            <div key={p.id} className="project-card" ref={el => cardRefs.current[i] = el}>
              {/* Content */}
              <div className="project-content">
                <div className="project-number">{p.number} / {projects.length.toString().padStart(2, "0")}</div>
                <div className="project-header">
                  <div className="project-title">{p.title}</div>
                  {p.status === "wip"
                    ? <div className="badge-wip"><div className="badge-dot" />{p.statusLabel}</div>
                    : <div className="badge-live"><div className="badge-dot" />{p.statusLabel}</div>
                  }
                </div>
                <div className="project-tagline">{p.tagline}</div>
                <div className="project-desc">{p.description}</div>
                <div className="project-bullets">
                  {p.bullets.map((b, j) => <div key={j} className="project-bullet">{b}</div>)}
                </div>
                <div className="project-tags">
                  {p.tags.map(t => <span key={t} className={`project-tag ${p.heroTags.includes(t) ? "hero" : ""}`}>{t}</span>)}
                </div>
                <div className="project-links">
                  {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="project-link-primary">View Project →</a>}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" className="project-link-secondary">
                      <IconGithub /> GitHub
                    </a>
                  )}
                </div>
              </div>
              {/* Mock UI */}
              <div className="project-mock">
                <p.Mock />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-text">© 2026 Srijan Reddy</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="mailto:srijanreddy309@gmail.com" className="icon-btn"><IconEmail /></a>
          <a href="https://www.linkedin.com/in/srijanreddy/" target="_blank" rel="noreferrer" className="icon-btn"><IconLinkedIn /></a>
          <span className="footer-text" style={{ marginLeft: 4 }}>Built with <span style={{ color: "#c8f060" }}>React</span> · <span style={{ color: "#c8f060" }}>Vercel</span></span>
        </div>
      </footer>
    </>
  );
}
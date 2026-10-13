"use client";
import { useState, useEffect, useRef } from "react";

const data = {
  name: "Srijan Reddy",
  title: "Software Engineer",
  location: "Seattle, WA",
  email: "srijanreddy309@gmail.com",
  linkedin: "https://www.linkedin.com/in/srijanreddy/",
  summary: "Software Engineer with 4+ years of experience building and scaling high-availability distributed systems at Amazon and GEICO. Strong expertise in Java, Node.js, .NET, and cloud platforms (AWS, Azure), with a focus on microservices, API design, and system reliability. Proven track record of improving performance, reducing latency, and delivering impactful customer-facing features in large-scale production systems.",
  experience: [
    {
    role: "Software Development Engineer II",
    company: "Expedia Group",
    location: "Seattle, WA",
    period: "Joining Soon",
    wip: true, // flag to render the construction placeholder instead of bullets
    tags: [],
  },
    {
      role: "Engineer II",
      company: "GEICO",
      logo: "G",
      location: "Chevy Chase, MD (Remote)",
      period: "Apr 2026 — Jul 2026",
      bullets: [
        "Maintaining and enhancing enterprise-scale insurance applications using .NET, Azure, Flutter, and Dart",
        "Resolved high-severity production incidents and improved system stability across insurance data services",
        "Developed batch-processing workflows for insurance data pipelines, improving backend processing efficiency",
        "Built and enhanced Flutter-based UI features for commercial insurance applications, improving usability and user experience",
        "Integrated REST APIs across internal systems to improve data flow and service interoperability",
      ],
      tags: [".NET", "Azure", "Flutter", "Dart", "REST APIs", "Microservices"],
    },
    {
      role: "Software Development Engineer",
      company: "Amazon",
      logo: "a",
      location: "Seattle, WA",
      period: "Jul 2022 — Apr 2026",
      bullets: [
        "Building high-availability Java applications supporting 10+ global marketplaces and millions of users",
        "Reduced product return rates by 20% through UX-focused infrastructure improvements on Detail Page",
        "Developed Node.js APIs handling 1M+ requests/day with minimal latency via async programming",
        "Reduced API response times by 30% by architecting and integrating internal service APIs",
        "Cut deployment times by 40% by automating Jenkins/GitLab CI pipelines with canary & blue-green deployments",
        "Maintained 99.9% uptime as primary on-call engineer resolving P0/P1 incidents",
      ],
      tags: ["Java", "Node.js", "AWS", "Microservices", "CI/CD", "DynamoDB"],
    },
  ],
skills: [
  {
    group: "Languages",
    items: ["Java", "Python", "Kotlin", "TypeScript", "JavaScript"]
  },
  {
    group: "Backend & Systems",
    items: ["Spring Boot", "Node.js", ".NET Core", "REST APIs", "Microservices"]
  },
  {
    group: "Cloud & Infrastructure",
    items: ["AWS (S3, Lambda, Glue)", "Azure", "Docker", "Kubernetes", "Terraform", "CloudFormation"]
  },
  {
    group: "Databases",
    items: ["MySQL", "MongoDB", "DynamoDB"]
  },
  {
    group: "Frontend",
    items: ["React Native", "Angular.js", "Flutter", "Dart", "HTML", "CSS"]
  },
  {
    group: "DevOps & CI/CD",
    items: ["Jenkins", "GitLab CI", "CI/CD Pipelines", "Grafana"]
  }
],
};

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
    transition: width 0.15s, height 0.15s;
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
    transition: background 0.4s, border-bottom 0.4s;
  }
  .nav.scrolled { background: rgba(8,8,8,0.88); backdrop-filter: blur(16px); border-bottom: 1px solid #1f1f1f; }
  .nav-links { display: flex; gap: 32px; }
  .nav-link { font-family: 'DM Mono', monospace; font-size: 11px; color: #7a7a78; text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; cursor: none; transition: color 0.2s; position: relative; padding-bottom: 4px; }
  .nav-link:hover { color: #c8f060; }
  .nav-link.active { color: #c8f060; }
  .nav-link.active::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 1px; background: #c8f060; border-radius: 1px; }

  .section { padding: 100px 48px; max-width: 900px; margin: 0 auto; }
  .section-label { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; }
  .section-label-text { font-family: 'DM Mono', monospace; font-size: 11px; color: #c8f060; letter-spacing: 0.15em; white-space: nowrap; }
  .section-label-line { flex: 1; height: 1px; background: #1f1f1f; }

  .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 0 48px; max-width: 900px; margin: 0 auto; position: relative; }
  .hero-glow {
    position: absolute; top: 30%; left: -5%; width: 550px; height: 380px; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at center, rgba(200,240,96,0.06) 0%, transparent 65%);
    filter: blur(48px);
  }
  .hero-eyebrow { font-family: 'DM Mono', monospace; font-size: 11px; color: #c8f060; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; opacity: 0; animation: fadeUp 0.6s 0.2s forwards; position: relative; z-index: 1; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(52px, 8vw, 88px); font-weight: 400; line-height: 1.0; margin-bottom: 8px; opacity: 0; animation: fadeUp 0.6s 0.35s forwards; position: relative; z-index: 1; }
  .hero-title-italic { font-style: italic; color: #7a7a78; display: block; }
  .hero-summary { font-family: 'DM Mono', monospace; font-size: 14px; color: #7a7a78; line-height: 1.9; max-width: 520px; margin-top: 32px; margin-bottom: 40px; opacity: 0; animation: fadeUp 0.6s 0.5s forwards; position: relative; z-index: 1; }
  .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; opacity: 0; animation: fadeUp 0.6s 0.65s forwards; position: relative; z-index: 1; }
  .hero-meta { position: absolute; bottom: 48px; left: 48px; display: flex; gap: 28px; z-index: 1; }
  .hero-meta-item { font-family: 'DM Mono', monospace; font-size: 13px; color: #7a7a78; letter-spacing: 0.04em; display: flex; align-items: center; gap: 8px; }
  .hero-meta-item span { color: #f0ede6; }
  .hero-line { position: absolute; right: 0; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, #1f1f1f 30%, #1f1f1f 70%, transparent); }

  .noise {
    position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px;
  }

  .btn-primary { background: #c8f060; color: #080808; border: none; padding: 11px 28px; border-radius: 2px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; cursor: none; letter-spacing: 0.04em; transition: opacity 0.2s, transform 0.2s; }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-secondary { background: transparent; color: #f0ede6; border: 1px solid #1f1f1f; padding: 11px 28px; border-radius: 2px; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px; cursor: none; transition: border-color 0.2s, transform 0.2s; }
  .btn-secondary:hover { border-color: #2e2e2e; transform: translateY(-1px); }

  .exp-card { padding: 28px; background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 4px; transition: border-color 0.25s, transform 0.25s; }
  .exp-card:hover { border-color: #c8f060; transform: translateY(-2px); }
  .exp-period { font-family: 'DM Mono', monospace; font-size: 11px; color: #c8f060; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
  .exp-role { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #f0ede6; }
  .exp-logo { height: 42px; min-width: 42px; padding: 0 12px; border-radius: 8px; background: #161616; border: 1px solid #2a2a2a; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .exp-logo svg { height: 22px; width: auto; display: block; }
  .exp-company { font-family: 'Syne', sans-serif; font-size: 14px; color: #7a7a78; margin-top: 3px; }
  .exp-divider { height: 1px; background: #1f1f1f; margin: 20px 0; }
  .exp-bullets { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 24px; }
  .exp-bullet { font-family: 'DM Mono', monospace; font-size: 12.5px; color: #7a7a78; line-height: 1.75; padding-left: 16px; position: relative; margin-bottom: 8px; }
  .exp-bullet::before { content: '—'; position: absolute; left: 0; color: #c8f060; }
  .exp-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 20px; }
  .exp-tag { display: inline-block; padding: 4px 10px; background: #161616; border: 1px solid #1f1f1f; border-radius: 2px; font-family: 'DM Mono', monospace; font-size: 11px; color: #7a7a78; transition: border-color 0.2s, color 0.2s; cursor: default; }
  .exp-tag:hover { border-color: #c8f060; color: #c8f060; }

  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1px; background: #1f1f1f; border: 1px solid #1f1f1f; border-radius: 4px; overflow: hidden; }
  .skill-group { background: #080808; padding: 24px; transition: background 0.2s; }
  .skill-group:hover { background: #0f0f0f; }
  .skill-group:hover .skill-group-label { color: #f0ede6; }
  .skill-group-label { font-family: 'DM Mono', monospace; font-size: 10px; color: #c8f060; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 14px; transition: color 0.2s; }
  .skill-items { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-item { font-family: 'DM Mono', monospace; font-size: 12px; color: #7a7a78; padding: 3px 8px; border: 1px solid #1f1f1f; border-radius: 2px; transition: color 0.2s, border-color 0.2s; }
  .skill-group:hover .skill-item { color: #9a9a98; border-color: #2a2a2a; }

  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
  .contact-blurb { font-family: 'DM Mono', monospace; font-size: 14px; color: #7a7a78; line-height: 1.9; }
  .contact-link { display: flex; align-items: center; gap: 12px; text-decoration: none; padding: 10px 12px; margin: 0 -12px; border-radius: 4px; transition: background 0.2s; }
  .contact-link:hover { background: #0f0f0f; }
  .contact-link-label { font-family: 'DM Mono', monospace; font-size: 11px; color: #3d3d3b; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }
  .contact-link-value { font-family: 'Syne', sans-serif; font-size: 14px; color: #f0ede6; transition: color 0.2s; }
  .contact-link:hover .contact-link-value { color: #c8f060; }
  .form-label { font-family: 'DM Mono', monospace; font-size: 11px; color: #7a7a78; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display: block; }
  .form-input { width: 100%; background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 2px; padding: 10px 14px; font-family: 'DM Mono', monospace; font-size: 13px; color: #f0ede6; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: #c8f060; }
  .form-input::placeholder { color: #3d3d3b; }
  .form-group { margin-bottom: 16px; }

  .scroll-top {
    position: fixed; bottom: 32px; right: 32px; z-index: 200;
    width: 40px; height: 40px; background: #0f0f0f; border: 1px solid #1f1f1f;
    border-radius: 2px; display: flex; align-items: center; justify-content: center;
    cursor: none; color: #7a7a78; font-size: 16px; font-family: 'DM Mono', monospace;
    transition: opacity 0.3s, transform 0.3s, border-color 0.2s, color 0.2s;
  }
  .scroll-top:hover { border-color: #c8f060; color: #c8f060; }
  .scroll-top.hidden { opacity: 0; pointer-events: none; transform: translateY(10px); }

  .icon-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: 1px solid #1f1f1f; border-radius: 2px; background: #0f0f0f; text-decoration: none; transition: border-color 0.2s; }
  .icon-btn:hover { border-color: #c8f060; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s, transform 0.65s; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 640px) {
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
    .nav { padding: 0 24px; }
    .hero { padding: 0 24px; }
    .hero-meta { flex-wrap: wrap; gap: 14px; }
    .section { padding: 80px 24px; }
    .contact-grid { grid-template-columns: 1fr; }
    .exp-bullets { grid-template-columns: 1fr; }
    .nav-links { display: flex; gap: 20px; overflow-x: auto; scrollbar-width: none; padding: 0 4px; }
    .nav-links::-webkit-scrollbar { display: none; }
    .nav-link { font-size: 10px; white-space: nowrap; }
    .scroll-top { bottom: 20px; right: 20px; }
  }
  .wip-box {
  min-height: 110px;
  border-radius: 4px;
  background: #0a0a0a;
  border: 1px dashed #2a2a2a;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.wip-stripes {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(-45deg, rgba(251,191,36,0.05) 0 10px, transparent 10px 20px);
  opacity: 0.6;
}
.wip-scene { position: relative; width: 100%; height: 24px; }
.wip-truck { position: absolute; top: 0; font-size: 20px; transition: left 0.04s linear; transform: translateX(-50%); }
.wip-text { font-family: 'DM Mono', monospace; font-size: 11px; color: #7a7a78; letter-spacing: 0.05em; z-index: 1; }
.wip-cursor { color: #c8f060; animation: pulse-dot 1s step-end infinite; }
.wip-airport { position: relative; height: 240px; background: #0a0a0a; border: 1px dashed #2a2a2a; border-radius: 4px; overflow: hidden; transition: opacity 0.4s ease; }
.wip-airport.wip-scene-reset { opacity: 0; }
.wip-sky { position: absolute; inset: 0; }
.wip-cloud { position: absolute; left: 0; animation: wip-drift linear infinite; }
.wip-cloud-1 { top: 30px; animation-duration: 26s; }
.wip-cloud-2 { top: 64px; animation-duration: 38s; animation-delay: -14s; }
.wip-cloud-3 { top: 14px; animation-duration: 50s; animation-delay: -32s; }
@keyframes wip-drift { from { transform: translateX(-70px); } to { transform: translateX(640px); } }
.wip-board { position: absolute; top: 12px; left: 12px; z-index: 6; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.08em; color: #c8f060; background: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 2px; padding: 6px 10px; perspective: 160px; }
.wip-board span { display: inline-block; transform-origin: 50% 0%; animation: wip-flip 0.5s cubic-bezier(0.2, 0.7, 0.3, 1); }
@keyframes wip-flip { 0% { transform: rotateX(-88deg); opacity: 0; } 55% { opacity: 1; } 100% { transform: rotateX(0deg); opacity: 1; } }
.wip-alt { position: absolute; top: 15px; right: 12px; z-index: 6; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.08em; color: #7a7a78; font-variant-numeric: tabular-nums; }
.wip-skyline { position: absolute; left: 0; right: 0; bottom: 30px; height: 130px; opacity: 0; transition: opacity 0.9s ease; pointer-events: none; }
.wip-skyline.on { opacity: 1; }
.wip-skyline svg { display: block; width: 100%; height: 100%; }
.wip-plane { position: absolute; left: 8%; bottom: 40px; z-index: 5; }
.wip-plane svg { display: block; transition: transform 1.1s ease-in-out; }
.wip-plane-taxi { animation: wip-taxi 1.8s linear forwards; }
@keyframes wip-taxi { from { left: 8%; } to { left: 38%; } }
.wip-plane-takeoff { animation: wip-takeoff 1.6s ease-in forwards; }
.wip-plane-takeoff svg { transform: rotate(-28deg); }
@keyframes wip-takeoff { from { left: 38%; bottom: 40px; } to { left: 92%; bottom: 200px; } }
.wip-plane-gone { left: 92%; bottom: 200px; opacity: 0; }
.wip-plane-descend { animation: wip-descend 1.6s ease-out forwards; }
.wip-plane-descend svg { transform: rotate(10deg); }
@keyframes wip-descend { from { left: 108%; bottom: 215px; opacity: 0; } 20% { opacity: 1; } to { left: 64%; bottom: 40px; opacity: 1; } }
.wip-plane-landing { animation: wip-landing 1.2s ease-out forwards; }
@keyframes wip-landing { from { left: 64%; bottom: 40px; } to { left: 44%; bottom: 40px; } }
.wip-plane-landed { left: 44%; bottom: 40px; }
.wip-plane-reset { opacity: 0; }
.wip-runway { position: absolute; left: 0; right: 0; bottom: 30px; height: 3px; background: #262626; }
.wip-runway-lines { position: absolute; left: 0; right: 0; bottom: 30px; height: 3px; background: repeating-linear-gradient(90deg, #c8f060 0 14px, transparent 14px 30px); opacity: 0.3; }
.wip-runway-lines.streaming { animation: wip-stream 0.45s linear infinite; }
@keyframes wip-stream { from { background-position-x: 0; } to { background-position-x: -30px; } }
.wip-caption { position: absolute; left: 0; right: 0; bottom: 8px; text-align: center; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.05em; color: #7a7a78; }
`;

const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8f060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconBriefcase = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8f060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 12h20"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8f060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
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

function WipBuild() {
  const [phase, setPhase] = useState("taxi");
  const [alt, setAlt] = useState(0);
  const altRef = useRef(0);

  useEffect(() => {
    const seq = [["taxi", 1800], ["takeoff", 1600], ["gone", 1000], ["descend", 1600], ["landing", 1200], ["landed", 2500], ["reset", 500]];
    let i = 0;
    let t;
    const run = () => {
      setPhase(seq[i][0]);
      t = setTimeout(() => { i = (i + 1) % seq.length; run(); }, seq[i][1]);
    };
    run();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const target = phase === "takeoff" || phase === "gone" ? 35000 : 0;
    let raf;
    const tick = () => {
      const v = altRef.current;
      const next = v + (target - v) * 0.07;
      if (Math.abs(target - next) < 2) { altRef.current = target; setAlt(target); return; }
      altRef.current = next;
      setAlt(Math.round(next));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const board =
    phase === "taxi" || phase === "takeoff" ? "SEA → EXPEDIA · BOARDING" :
    phase === "landing" || phase === "landed" || phase === "reset" ? "EXPEDIA → SEA · ARRIVED" :
    "EXPEDIA → SEA · LANDING";
  const skylineOn = phase === "descend" || phase === "landing" || phase === "landed";
  const streaming = phase === "taxi" || phase === "takeoff";

  return (
    <div className={`wip-airport${phase === "reset" ? " wip-scene-reset" : ""}`}>
      <div className="wip-sky">
        <svg className="wip-cloud wip-cloud-1" width="46" height="16" viewBox="0 0 46 16"><g fill="#1e1e1e"><ellipse cx="14" cy="11" rx="10" ry="5"/><ellipse cx="26" cy="8" rx="12" ry="6"/><ellipse cx="36" cy="11" rx="8" ry="4"/></g></svg>
        <svg className="wip-cloud wip-cloud-2" width="34" height="12" viewBox="0 0 46 16"><g fill="#1e1e1e"><ellipse cx="14" cy="11" rx="10" ry="5"/><ellipse cx="26" cy="8" rx="12" ry="6"/><ellipse cx="36" cy="11" rx="8" ry="4"/></g></svg>
        <svg className="wip-cloud wip-cloud-3" width="56" height="18" viewBox="0 0 46 16"><g fill="#181818"><ellipse cx="14" cy="11" rx="10" ry="5"/><ellipse cx="26" cy="8" rx="12" ry="6"/><ellipse cx="36" cy="11" rx="8" ry="4"/></g></svg>
      </div>
      <div className="wip-board" key={board}><span>{board}</span></div>
      <div className="wip-alt">ALT {String(alt).padStart(5, "0")} FT</div>
      <div className={`wip-skyline${skylineOn ? " on" : ""}`}>
        <svg viewBox="0 0 520 120" preserveAspectRatio="xMidYMax meet">
          <path d="M40 120 L195 28 L350 120 Z" fill="#111111" stroke="#2e2e2e" strokeWidth="1.5"/>
          <path d="M168 44 L195 28 L222 44 L208 52 L182 52 Z" fill="#2e2e2e"/>
          <rect x="320" y="62" width="34" height="58" fill="#0d0d0d" stroke="#2e2e2e"/>
          <rect x="362" y="44" width="30" height="76" fill="#0d0d0d" stroke="#2e2e2e"/>
          <rect x="400" y="70" width="40" height="50" fill="#0d0d0d" stroke="#2e2e2e"/>
          <rect x="448" y="56" width="28" height="64" fill="#0d0d0d" stroke="#2e2e2e"/>
          <g stroke="#3d3d3d" strokeWidth="2" fill="none">
            <line x1="250" y1="120" x2="250" y2="52"/>
            <line x1="242" y1="120" x2="248" y2="80"/>
            <line x1="258" y1="120" x2="252" y2="80"/>
            <ellipse cx="250" cy="46" rx="24" ry="7" fill="#0d0d0d"/>
            <line x1="250" y1="39" x2="250" y2="26"/>
          </g>
        </svg>
      </div>
      <div className={`wip-plane wip-plane-${phase}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8f060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 L14 9 L21 12 L14 13 L13 20 L16 22 L12 20.5 L8 22 L11 20 L10 13 L3 12 L10 9 Z" fill="#c8f060" stroke="none" />
        </svg>
      </div>
      <div className="wip-runway" />
      <div className={`wip-runway-lines${streaming ? " streaming" : ""}`} />
      <div className="wip-caption">Joining Expedia — details taking off soon</div>
    </div>
  );
}

function useReveal() {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}



function SectionLabel({ num, label }) {
  return (
    <div className="section-label">
      <span className="section-label-text">{num} / {label}</span>
      <div className="section-label-line" />
    </div>
  );
}

const companyLogos = {
  "Expedia Group": (
    <svg viewBox="0 0 560 400" xmlns="http://www.w3.org/2000/svg" aria-label="Expedia"><g fill="#c8f060"><g fill-rule="nonzero" transform="matrix(2.12849 0 0 2.12849 56.3236 144.996)"><path d="m29.996 42.473h-22.236c-4.278 0-7.76-3.482-7.76-7.776v-22.237c0-4.278 3.482-7.76 7.76-7.76h22.236c4.295 0 7.761 3.482 7.761 7.76v22.237c.016 4.294-3.466 7.776-7.761 7.776z" fill="#c8f060"/><g fill="#c8f060"><path d="m11.538 35.128v-3.664c0-.299-.232-.531-.53-.531h-3.665c-.298 0-.53.232-.53.531v3.664c0 .299.232.531.53.531h3.665c.298 0 .53-.232.53-.531z"/><path d="m30.959 31.977v-18.058c0-1.343-1.077-2.42-2.421-2.42h-18.057c-.365 0-.581.132-.813.364l-3.598 3.632c-.265.265-.083.663.315.663h16.333l-10.131 10.131c-.183.183-.266.365-.266.664v2.669c0 .315.216.531.531.531h2.67c.315 0 .497-.083.663-.265l10.131-10.132v16.333c0 .398.398.581.664.315l3.631-3.615c.216-.232.348-.447.348-.812z"/><path d="m85.778 27.318 7.395-10.215c.216-.315.05-.63-.315-.63h-4.029c-.216 0-.498.083-.63.315l-4.875 7.114-4.991-7.114c-.133-.215-.398-.315-.631-.315h-4.294c-.216 0-.365.183-.365.365 0 .083 0 .182.083.265l7.412 10.248-8.175 11.242c-.216.315-.05.63.265.63h4.063c.215 0 .497-.083.63-.315l5.654-8.141 5.738 8.141c.132.232.398.315.63.315h4.328c.215 0 .364-.182.364-.364 0-.083-.049-.183-.082-.266z"/><path d="m69.262 7.934c.315 0 .531.215.531.53v3.035c0 .315-.216.53-.531.53h-14.442v9.021h12.967c.315 0 .53.215.53.53v3.018c0 .315-.215.531-.53.531h-12.967v9.883h14.442c.315 0 .531.215.531.53v3.134c0 .315-.216.531-.531.531h-16.897c-1.293 0-2.271-.979-2.271-2.272v-26.73c0-1.293.978-2.271 2.271-2.271z"/><path d="m109.256 15.76c-4.377 0-6.699 1.924-8.042 3.715v-2.471c0-.315-.215-.531-.53-.531h-3.532c-.315 0-.531.232-.531.531v29.449c0 .315.216.531.531.531h3.581c.315 0 .531-.216.531-.531v-10.148c1.293 1.791 3.615 3.582 7.992 3.582 7.114 0 11.259-5.356 11.259-12.072 0-6.715-4.145-12.055-11.259-12.055zm-.796 20.28c-4.377 0-7.378-2.952-7.378-8.175s3.001-8.274 7.378-8.274c4.378 0 7.33 3.034 7.33 8.274 0 5.223-2.952 8.175-7.33 8.175z"/><path d="m134.61 15.76c-6.218 0-11.176 4.477-11.176 11.889 0 7.595 4.377 12.254 11.756 12.254 4.245 0 7.777-1.873 9.966-4.477.132-.132.182-.265.182-.398 0-.132-.05-.265-.182-.398l-2.056-2.023c-.133-.132-.266-.182-.398-.182-.133 0-.266.083-.398.216-1.692 1.84-3.897 3.399-7.064 3.399-4.627 0-6.848-2.852-7.197-6.965h17.162c.315 0 .531-.232.531-.53v-.896c0-6.798-4.112-11.889-11.126-11.889zm-6.401 9.833c.531-3.731 2.487-6.168 6.368-6.168 3.979 0 6.085 2.272 6.383 6.168z"/><path d="m209.642 16.473h-3.532c-.315 0-.531.215-.531.53v2.504c-1.343-1.791-3.664-3.714-8.141-3.714-7.014 0-11.176 5.356-11.176 12.072 0 6.715 4.162 12.071 11.176 12.071 4.477 0 6.798-1.923 8.141-3.714v2.454c0 .315.216.53.531.53h3.532c.315 0 .531-.215.531-.53v-21.673c.016-.315-.216-.53-.531-.53zm-11.309 19.616c-4.377 0-7.329-3.034-7.329-8.274 0-5.223 2.952-8.175 7.329-8.175 4.378 0 7.379 2.952 7.379 8.175 0 5.24-3.001 8.274-7.379 8.274z"/><path d="m172.021 7.934h-3.582c-.315 0-.53.215-.53.53v11.044c-1.344-1.791-3.615-3.715-8.092-3.715-7.014 0-11.176 5.356-11.176 12.072 0 6.715 4.162 12.071 11.176 12.071 4.477 0 6.798-1.923 8.141-3.714v2.454c0 .315.216.531.531.531h3.532c.315 0 .53-.216.53-.531v-30.212c0-.315-.215-.53-.53-.53zm-11.309 28.155c-4.377 0-7.329-3.034-7.329-8.274 0-5.223 2.952-8.175 7.329-8.175 4.378 0 7.379 2.952 7.379 8.175 0 5.24-3.001 8.274-7.379 8.274z"/><path d="m181.754 7.934c.315 0 .53.215.53.53v3.665c0 .315-.215.53-.53.53h-3.665c-.315 0-.53-.215-.53-.53v-3.665c0-.315.215-.53.53-.53z"/><path d="m181.718 16.473c.315 0 .53.216.53.531v21.672c0 .315-.215.531-.53.531h-3.582c-.315 0-.531-.216-.531-.531v-21.672c0-.315.216-.531.531-.531z"/></g></g></g></svg>
  ),
  "GEICO": (
    <svg viewBox="0 0 450 90" xmlns="http://www.w3.org/2000/svg" aria-label="GEICO"><g transform="translate(30,-685)" fill="#c8f060" fill-rule="evenodd"><path d="m-28 712.7c0-19.2 10.8-23.7 28.9-23.7h30.3c22.8 0 26 8.2 26 21v2.1h-19.8c0-6.5-3.7-7.3-10.1-7.3h-21.9c-10.2 0-12.8 2.4-12.8 13.7v8.2c0 11.2 2.6 13.7 12.8 13.7h21.5c5.3 0 10.5-.8 10.5-7.2v-1.9h-25v-13.6h45.1v18.7c0 18.8-9.8 19.8-32.4 19.8h-24.2c-18.1 0-28.9-4.5-28.9-23.7zm90.5-23h71.8v15.2h-51.7v10.5h48.9v13.6h-48.9v10.5h52.8v15.8h-72.9zm79 0h20.1v65.6h-20.1zm26.2 23c0-19.2 10.8-23.7 28.9-23.7h23.7c28.6 0 32.4 6.2 32.2 24.7h-20.1v-1.8c0-4.7-3.4-6.1-9.4-6.1h-22c-10.6 0-12.6 5-12.6 13.1v7.1c0 9.5 2 13.1 11.5 13.1h21.5c9.1 0 11.8-.9 11.8-9.1h20.1v6.2c0 11.1-4 19.8-24.2 19.8h-32.4c-18.1 0-28.9-4.5-28.9-23.7v-19.6zm109.8 13.3c0 9.5 2 13.1 11.5 13.1h25.7c9.5 0 11.5-3.6 11.5-13.1v-7.1c0-8.2-2-13.1-12.6-13.1h-23.6c-10.6 0-12.6 5-12.6 13.1v7.1zm-20.7-13.3c0-19.2 10.8-23.7 28.9-23.7h32.3c18.1 0 28.9 4.5 28.9 23.7v19.6c0 19.2-10.8 23.7-28.9 23.7h-32.3c-18.1 0-28.9-4.5-28.9-23.7zm97.7 35.1c1 0 2.6.2 2.6-1.3 0-1.1-1-1.3-1.9-1.3h-2.1v2.6zm3.4 4.1h-1.1l-2.1-3.3h-1.6v3.3h-.9v-7.3h3.2c.6 0 1.2 0 1.8.4.5.3.8 1 .8 1.6 0 1.4-1 2-2.3 2zm2.5-3.7c0-3.1-2.6-5.7-5.7-5.7-3.2 0-5.7 2.5-5.7 5.7s2.5 5.7 5.7 5.7c3.1.1 5.7-2.5 5.7-5.7m-12.2 0c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5-6.5-2.9-6.5-6.5"/></g></svg>
  ),
  "Amazon": (
    <svg viewBox="0 0 560 400" xmlns="http://www.w3.org/2000/svg" aria-label="Amazon"><g fill="#c8f060"><path d="m342.597 244.195c-30.218 22.274-74.017 34.157-111.726 34.157-52.877 0-100.479-19.557-136.492-52.084-2.829-2.557-.294-6.044 3.101-4.051 38.865 22.612 86.92 36.216 136.559 36.216 33.477 0 70.305-6.927 104.168-21.3 5.115-2.172 9.393 3.35 4.39 7.062m12.563-14.373c-3.848-4.934-25.532-2.332-35.265-1.177-2.966.362-3.418-2.218-.747-4.075 17.271-12.155 45.61-8.646 48.914-4.571 3.306 4.096-.859 32.503-17.089 46.062-2.49 2.083-4.867.973-3.757-1.788 3.643-9.1 11.815-29.494 7.944-34.451" fill="#c8f060"/><path d="m320.574 138.761v-11.816c0-1.788 1.358-2.988 2.988-2.988h52.898c1.698 0 3.056 1.222 3.056 2.988v10.117c-.022 1.699-1.449 3.917-3.984 7.424l-27.411 39.138c10.186-.25 20.937 1.266 30.173 6.474 2.083 1.177 2.647 2.896 2.807 4.594v12.608c0 1.72-1.902 3.735-3.894 2.693-16.275-8.533-37.892-9.461-55.886.091-1.834.996-3.758-.996-3.758-2.717v-11.974c0-1.924.022-5.206 1.946-8.126l31.758-45.541h-27.638c-1.697 0-3.055-1.2-3.055-2.965m-192.966 73.723h-16.094c-1.539-.114-2.761-1.269-2.874-2.74v-82.596c0-1.652 1.38-2.965 3.101-2.965h15.007c1.562.068 2.807 1.268 2.92 2.762v10.797h.294c3.916-10.436 11.272-15.301 21.187-15.301 10.072 0 16.366 4.865 20.892 15.301 3.893-10.436 12.743-15.301 22.228-15.301 6.745 0 14.125 2.783 18.629 9.031 5.093 6.948 4.052 17.044 4.052 25.894l-.024 52.13c0 1.652-1.38 2.988-3.101 2.988h-16.07c-1.607-.114-2.898-1.404-2.898-2.988v-43.777c0-3.486.317-12.177-.453-15.483-1.199-5.545-4.798-7.107-9.461-7.107-3.893 0-7.968 2.603-9.62 6.768s-1.494 11.136-1.494 15.822v43.777c0 1.652-1.38 2.988-3.101 2.988h-16.07c-1.63-.114-2.898-1.404-2.898-2.988l-.023-43.777c0-9.212 1.517-22.771-9.914-22.771-11.566 0-11.114 13.218-11.114 22.771v43.777c0 1.652-1.38 2.988-3.101 2.988m297.45-90.043c23.881 0 36.805 20.507 36.805 46.582 0 25.193-14.282 45.18-36.805 45.18-23.45 0-36.216-20.507-36.216-46.062 0-25.713 12.924-45.7 36.216-45.7m.135 16.862c-11.86 0-12.607 16.163-12.607 26.235 0 10.095-.159 31.643 12.472 31.643 12.472 0 13.061-17.383 13.061-27.977 0-6.971-.294-15.301-2.399-21.911-1.812-5.748-5.41-7.99-10.527-7.99m67.635 73.181h-16.026c-1.607-.114-2.898-1.404-2.898-2.988l-.022-82.62c.136-1.516 1.471-2.693 3.101-2.693h14.917c1.404.068 2.557 1.019 2.874 2.309v12.63h.294c4.506-11.294 10.821-16.681 21.935-16.681 7.22 0 14.26 2.602 18.787 9.732 4.21 6.61 4.21 17.724 4.21 25.714v51.993c-.181 1.449-1.516 2.604-3.101 2.604h-16.139c-1.471-.114-2.693-1.2-2.852-2.604v-44.863c0-9.031 1.041-22.25-10.072-22.25-3.917 0-7.516 2.626-9.304 6.609-2.263 5.048-2.557 10.073-2.557 15.641v44.479c-.024 1.652-1.427 2.988-3.147 2.988m-214.423-39.454c0 6.27.158 11.499-3.012 17.068-2.557 4.526-6.631 7.31-11.136 7.31-6.18 0-9.801-4.708-9.801-11.657 0-13.716 12.291-16.206 23.949-16.206zm16.228 39.227c-1.063.951-2.602 1.018-3.802.385-5.341-4.437-6.315-6.497-9.236-10.73-8.827 9.009-15.097 11.703-26.528 11.703-13.559 0-24.084-8.352-24.084-25.08 0-13.06 7.062-21.956 17.158-26.302 8.737-3.848 20.938-4.527 30.264-5.59v-2.083c0-3.825.294-8.353-1.971-11.657-1.946-2.965-5.703-4.189-9.031-4.189-6.134 0-11.589 3.148-12.924 9.667-.272 1.448-1.336 2.874-2.807 2.942l-15.595-1.676c-1.313-.294-2.785-1.357-2.4-3.371 3.577-18.924 20.688-24.628 35.99-24.628 7.832 0 18.063 2.082 24.242 8.013 7.832 7.311 7.085 17.067 7.085 27.682v25.081c0 7.538 3.123 10.842 6.066 14.917 1.019 1.448 1.246 3.191-.067 4.277-3.282 2.739-9.123 7.832-12.337 10.685zm-227.213-39.227c0 6.27.159 11.499-3.01 17.068-2.557 4.526-6.61 7.31-11.136 7.31-6.18 0-9.778-4.708-9.778-11.657 0-13.716 12.291-16.206 23.924-16.206zm16.23 39.227c-1.063.951-2.603 1.018-3.803.385-5.342-4.437-6.292-6.497-9.234-10.73-8.829 9.009-15.076 11.703-26.529 11.703-13.536 0-24.084-8.352-24.084-25.08 0-13.06 7.085-21.956 17.158-26.302 8.737-3.848 20.937-4.527 30.262-5.59v-2.083c0-3.825.295-8.353-1.946-11.657-1.969-2.965-5.726-4.189-9.031-4.189-6.134 0-11.612 3.148-12.947 9.667-.272 1.448-1.336 2.874-2.785 2.942l-15.619-1.676c-1.311-.294-2.76-1.357-2.399-3.371 3.6-18.924 20.689-24.628 35.99-24.628 7.832 0 18.063 2.082 24.243 8.013 7.832 7.311 7.085 17.067 7.085 27.682v25.081c0 7.538 3.123 10.842 6.066 14.917 1.041 1.448 1.268 3.191-.045 4.277-3.283 2.739-9.122 7.832-12.337 10.685z" fill="#c8f060"/></g></svg>
  ),
};


export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const cursorRef = useRef();
  const ringRef = useRef();
  const isHovered = useRef(false);

  // Custom cursor
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) { cursorRef.current.style.left = e.clientX + "px"; cursorRef.current.style.top = e.clientY + "px"; }
      if (ringRef.current) { ringRef.current.style.left = e.clientX + "px"; ringRef.current.style.top = e.clientY + "px"; }
    };
    const setHover = (v) => () => { isHovered.current = v; ringRef.current?.classList.toggle("hovered", v); };
    const interactables = document.querySelectorAll("a, button, .nav-link, .skill-group, .exp-card, .scroll-top");
    window.addEventListener("mousemove", move);
    interactables.forEach(el => { el.addEventListener("mouseenter", setHover(true)); el.addEventListener("mouseleave", setHover(false)); });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowTop(window.scrollY > 400);
      const sections = ["contact", "skills", "experience", "about"];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 130) { setActiveSection(s); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleSubmit = () => {
    if (!formState.name || !formState.email) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  const expRef = useReveal();
  const skillsRef = useReveal();
  const contactRef = useReveal();

  const iconBox = { width: 36, height: 36, background: "#161616", border: "1px solid #1f1f1f", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

  return (
    <>
      <style>{css}</style>
      <div className="noise" />
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      {/* Scroll to top */}
      <div className={`scroll-top ${showTop ? "" : "hidden"}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</div>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-links">
          {["about", "experience", "skills", "contact"].map(s => (
            <span key={s} className={`nav-link ${activeSection === s ? "active" : ""}`} onClick={() => scrollTo(s)}>{s}</span>
          ))}
          <a href="/projects" className="nav-link" style={{ textDecoration: "none" }}>projects</a>
        </div>
      </nav>

      {/* HERO */}
      <div id="about" className="hero">
        <div className="hero-glow" />
        {/* N/A <div className="hero-eyebrow">Available for new opportunities</div> */}
        <h1 className="hero-title">
          Srijan Reddy
          <span className="hero-title-italic">Software Engineer.</span>
        </h1>
        <p className="hero-summary">{data.summary}</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => scrollTo("contact")}>Get in Touch →</button>
          <button className="btn-secondary" onClick={() => scrollTo("experience")}>View Experience</button>
        </div>
        <div className="hero-meta">
          <div className="hero-meta-item"><IconPin /><span>{data.location}</span></div>
          <div className="hero-meta-item"><IconBriefcase /><span>Expedia SDE</span></div>
          <div className="hero-meta-item"><IconClock /><span>4+ Years Exp</span></div>
        </div>
        <div className="hero-line" />
      </div>

      {/* EXPERIENCE */}
      <div id="experience" className="section">
        <SectionLabel num="01" label="Experience" />
        <div ref={expRef} className="reveal">
          {data.experience.map((exp, i) => (
            <div key={i} className="exp-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div className="exp-logo">{companyLogos[exp.company]}</div>
                  <div>
                    <div className="exp-period">{exp.period}</div>
                    <div className="exp-role">{exp.role}</div>
                    <div className="exp-company">{exp.company} · {exp.location}</div>
                  </div>
                </div>
                <a href={data.linkedin} target="_blank" rel="noreferrer" style={{ ...iconBox, color: "#7a7a78", fontSize: 14, textDecoration: "none" }}>↗</a>
              </div>
              <div className="exp-divider" />
              {exp.wip ? (
                <WipBuild />
              ) : (
                <div className="exp-bullets">
                  {exp.bullets.map((b, j) => <div key={j} className="exp-bullet">{b}</div>)}
                </div>
              )}
              {exp.tags.length > 0 && (
                <div className="exp-tags">
                  {exp.tags.map(t => <span key={t} className="exp-tag">{t}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SKILLS */}
      <div id="skills" className="section" style={{ paddingTop: 0 }}>
        <SectionLabel num="02" label="Skills" />
        <div ref={skillsRef} className="reveal">
          <div className="skills-grid">
            {data.skills.map(({ group, items }) => (
              <div key={group} className="skill-group">
                <div className="skill-group-label">{group}</div>
                <div className="skill-items">
                  {items.map(item => <span key={item} className="skill-item">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" className="section" style={{ paddingTop: 0 }}>
        <SectionLabel num="03" label="Contact" />
        <div ref={contactRef} className="reveal contact-grid">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.2, marginBottom: 20 }}>
              Let's build<br /><span style={{ fontStyle: "italic", color: "#7a7a78" }}>something great.</span>
            </h2>
            <p className="contact-blurb">Open to senior SDE roles, staff engineering positions, and interesting problems. Currently based in Seattle.</p>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column" }}>
              <a href={`mailto:${data.email}`} className="contact-link">
                <div style={iconBox}><IconEmail /></div>
                <div>
                  <div className="contact-link-label">Email</div>
                  <div className="contact-link-value">{data.email}</div>
                </div>
              </a>
              <a href={data.linkedin} target="_blank" rel="noreferrer" className="contact-link">
                <div style={iconBox}><IconLinkedIn /></div>
                <div>
                  <div className="contact-link-label">LinkedIn</div>
                  <div className="contact-link-value">linkedin.com/in/srijanreddy</div>
                </div>
              </a>
            </div>
          </div>

          <div>
            {sent ? (
              <div style={{ padding: "32px", background: "#0f0f0f", border: "1px solid #c8f060", borderRadius: 4, textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#c8f060", marginBottom: 8 }}>Message sent ✓</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#7a7a78" }}>I'll get back to you soon.</div>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" placeholder="Your name" value={formState.name} onChange={e => setFormState(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="your@email.com" value={formState.email} onChange={e => setFormState(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-input" rows={4} placeholder="What are you working on?" style={{ resize: "vertical" }} value={formState.message} onChange={e => setFormState(p => ({ ...p, message: e.target.value }))} />
                </div>
                <button className="btn-primary" style={{ width: "100%", opacity: sending ? 0.7 : 1 }} onClick={handleSubmit} disabled={sending}>
                  {sending ? "Sending…" : "Send Message →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1f1f1f", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 900, margin: "0 auto" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#3d3d3b" }}>© 2026 Srijan Reddy</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href={`mailto:${data.email}`} className="icon-btn"><IconEmail /></a>
          <a href={data.linkedin} target="_blank" rel="noreferrer" className="icon-btn"><IconLinkedIn /></a>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#3d3d3b", marginLeft: 4 }}>
            Built with <span style={{ color: "#c8f060" }}>React</span> · <span style={{ color: "#c8f060" }}>Vercel</span>
          </span>
        </div>
      </footer>
    </>
  );
}

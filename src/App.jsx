import { useState, useEffect, useRef, useCallback } from "react";

// ── LOADER ────────────────────────────────────────────────────────────────
const GOLD = "#b8730a";
const GOLD_L = "#e9a830";
const DARK = "#0c0904";

const LoaderGrain = ({ style }) => (
  <svg viewBox="0 0 12 28" width="12" height="28" style={style}>
    <ellipse cx="6" cy="14" rx="4.5" ry="12" fill="none" stroke={GOLD_L} strokeWidth="1" opacity="0.55" />
    <line x1="6" y1="4" x2="6" y2="24" stroke={GOLD_L} strokeWidth="0.6" opacity="0.3" />
  </svg>
);

const GRAINS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  dur: 4 + Math.random() * 4,
  size: 0.5 + Math.random() * 0.8,
  startY: 60 + Math.random() * 40,
  rotate: Math.random() * 360,
}));

function Loader({ onDone }) {
  const [phase, setPhase] = useState("in");
  const [progress, setProgress] = useState(0);
  const raf = useRef(null);
  const start = useRef(null);
  const TOTAL = 2200;

  useEffect(() => {
    const step = (ts) => {
      if (!start.current) start.current = ts;
      const elapsed = ts - start.current;
      const p = Math.min(elapsed / TOTAL, 1);
      const eased = 1 - Math.pow(1 - p, 2.4);
      setProgress(Math.floor(eased * 100));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 300);
    const t2 = setTimeout(() => setPhase("out"), TOTAL - 400);
    const t3 = setTimeout(() => onDone?.(), TOTAL);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: DARK,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      opacity: phase === "out" ? 0 : 1,
      transform: phase === "out" ? "scale(1.03)" : "scale(1)",
      transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s ease",
      pointerEvents: phase === "out" ? "none" : "all",
    }}>
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.6 }} />
      <div style={{ position:"absolute", width:480, height:480, borderRadius:"50%",
        background:`radial-gradient(circle, rgba(184,115,10,0.13) 0%, transparent 70%)`,
        top:"50%", left:"50%", transform:"translate(-50%, -60%)", pointerEvents:"none",
        animation:"glowPulse 3s ease-in-out infinite" }} />
      {GRAINS.map(g => (
        <div key={g.id} style={{ position:"absolute", left:`${g.x}%`, bottom:`${g.startY}%`,
          transform:`scale(${g.size}) rotate(${g.rotate}deg)`,
          animation:`riseGrain ${g.dur}s ${g.delay}s ease-in-out infinite`,
          pointerEvents:"none", zIndex:1 }}>
          <LoaderGrain style={{ display:"block" }} />
        </div>
      ))}
      <div style={{ position:"absolute", top:"50%", left:0, right:0,
        transform:"translateY(-120px)", display:"flex", gap:0, pointerEvents:"none",
        zIndex:1, justifyContent:"center" }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ height:1, width:i===1?160:48,
            background:i===1?`linear-gradient(90deg,transparent,${GOLD},transparent)`:`rgba(184,115,10,${i===0?"0.18":"0.12"})`,
            margin:"0 2px", opacity:phase==="in"?0:1,
            transition:`opacity 0.6s ease ${0.2+i*0.1}s` }} />
        ))}
      </div>
      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column",
        alignItems:"center", gap:20,
        opacity:phase==="in"?0:1, transform:phase==="in"?"translateY(16px)":"translateY(0)",
        transition:"opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)" }}>
        <div style={{ width:68, height:68, background:`linear-gradient(135deg,${GOLD},${GOLD_L})`,
          borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 12px 48px rgba(184,115,10,0.5), 0 0 0 1px rgba(233,168,48,0.2)`,
          color:"#fff", animation:"badgeBob 4s ease-in-out infinite" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M11 3v18M6.5 8C5 7 3.5 5 3.5 5S5.5 3 8 4.5M17.5 8C19 7 20.5 5 20.5 5S18.5 3 16 4.5M6.5 13C5 12 3.5 10 3.5 10S5.5 8 8 9.5M17.5 13C19 12 20.5 10 20.5 10S18.5 8 16 9.5M6.5 18C5 17 3.5 15 3.5 15S5.5 13 8 14.5M17.5 18C19 17 20.5 15 20.5 15S18.5 13 16 14.5"/>
          </svg>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:1, background:`linear-gradient(90deg,transparent,${GOLD})` }} />
          <div style={{ width:4, height:4, borderRadius:"50%", background:GOLD_L }} />
          <div style={{ width:32, height:1, background:`linear-gradient(90deg,${GOLD},transparent)` }} />
        </div>
        <div style={{ textAlign:"center", lineHeight:1 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:800,
            color:"#fff", letterSpacing:"-0.02em", marginBottom:8 }}>Lizz wa Pishori</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:9, letterSpacing:"0.38em",
            color:GOLD, textTransform:"uppercase", fontWeight:700 }}>Premium Rice · Kenya · Est. 2009</div>
        </div>
        <div style={{ marginTop:8, width:200, position:"relative" }}>
          <div style={{ height:1.5, background:"rgba(255,255,255,0.07)", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`,
              background:`linear-gradient(90deg,${GOLD},${GOLD_L})`, borderRadius:2,
              transition:"width 0.08s linear", boxShadow:`0 0 8px ${GOLD_L}` }} />
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700,
            color:"rgba(255,255,255,0.2)", textAlign:"right", marginTop:8,
            letterSpacing:"0.1em", fontVariantNumeric:"tabular-nums" }}>{progress}%</div>
        </div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5,
          color:"rgba(255,255,255,0.22)", letterSpacing:"0.08em", marginTop:-4 }}>
          Sourced from Mwea · Delivered Nationwide
        </div>
      </div>
      <style>{`
        @keyframes riseGrain {
          0%   { transform: scale(1) rotate(0deg) translateY(0); opacity:0; }
          15%  { opacity:0.6; }
          80%  { opacity:0.3; }
          100% { transform: scale(1) rotate(40deg) translateY(-120px); opacity:0; }
        }
        @keyframes glowPulse {
          0%,100% { opacity:0.7; transform:translate(-50%,-60%) scale(1); }
          50%     { opacity:1;   transform:translate(-50%,-60%) scale(1.12); }
        }
        @keyframes badgeBob {
          0%,100% { transform:translateY(0) rotate(-1deg); }
          50%     { transform:translateY(-8px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}

// ── SVGs ──────────────────────────────────────────────────────────────────
const WA_SVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const IG_SVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
const MENU_SVG = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const X_SVG = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CART_SVG = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>;
const ARR_SVG = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const CHK_SVG = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const STR_SVG = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const TRK_SVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const SHD_SVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const LF_SVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34A10 10 0 0012 22c5.523 0 10-4.477 10-10 0-3.5-3-7-5-4z"/></svg>;
const GLB_SVG = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const AWD_SVG = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const PHN_SVG = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.46 13a19.79 19.79 0 01-3.07-8.67A2 2 0 012.38 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const FB_SVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
const TT_SVG = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z"/></svg>;
const ML_SVG = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const CLK_SVG = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const PIN_SVG = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const WHT_SVG = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 3v18M6.5 8C5 7 3.5 5 3.5 5S5.5 3 8 4.5M17.5 8C19 7 20.5 5 20.5 5S18.5 3 16 4.5M6.5 13C5 12 3.5 10 3.5 10S5.5 8 8 9.5M17.5 13C19 12 20.5 10 20.5 10S18.5 8 16 9.5M6.5 18C5 17 3.5 15 3.5 15S5.5 13 8 14.5M17.5 18C19 17 20.5 15 20.5 15S18.5 13 16 14.5"/></svg>;
const PKG_SVG = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const SPK_SVG = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/></svg>;
const EXT_SVG = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const DWN_SVG = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const PRV_SVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const NXT_SVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const QT_SVG = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.12"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>;

// ── Constants ─────────────────────────────────────────────────────────────
const WA_NUM = "254719828392";
const PHONE = "+254 719 828 392";
const FB_URL = "https://www.facebook.com/imogen.lizzie.71";
const IG_URL = "https://www.instagram.com/mwearicehub?igsh=bjlxOG5uZWg5OHho";
const TT_URL = "https://vm.tiktok.com/ZS9LjjgvGnLHq-BqWLq/";
const EMAIL = "Imogenlizah1@gmail.com";
const NAV_ITEMS = ["Home", "About", "Products", "Gallery", "Delivery", "Contact"];
const NAV_MAP = { Home:"home", About:"about", Products:"products", Gallery:"gallery", Delivery:"delivery", Contact:"contact" };

const HERO_IMAGES = [
  { src:"https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1000&q=90", label:"Kenyan Pilau" },
  { src:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&q=90", label:"Beef Biryani" },
  { src:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&q=90", label:"Steamed Pishori" },
];

const PRODUCTS = [
  { name:"Pishori 1kg", price:"KSh 160", badge:"Starter Pack", bc:"#b8730a", desc:"Perfect for individuals and small households. Pure Mwea pishori, naturally fragrant and stone-free.", weight:"1 kg", serves:"Serves 3–4", img:"/pishori.jpg" },
  { name:"Dog Rice 1kg", price:"KSh 90", badge:"Budget Buy", bc:"#7a5c2e", desc:"Broken rice grains perfect for dog food, porridge and animal feeds. Affordable and available in all quantities.", weight:"1 kg", serves:"Per KG pricing", img:"/dogrice.jpg" },
  { name:"Brown Rice 1kg", price:"KSh 170", badge:"Healthy Choice", bc:"#4a7c3f", desc:"High-fiber pishori brown rice naturally aromatic and recommended for diabetics and anyone on a healthy high-fiber diet.", weight:"1 kg", serves:"Per KG pricing", img:"/brownrice.jpg" },
];

const GALLERY = [
  { name:"Kenyan Pilau", desc:"The soul of Kenyan celebrations", img:"https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=85", tag:"Fan Favourite", big:true },
  { name:"Steamed Pishori", desc:"Every grain perfectly separate", img:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=85", tag:"Daily Staple", big:false },
  { name:"Beef Biryani", desc:"Layered spices, tender beef", img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=85", tag:"Restaurant Style", big:false },
  { name:"Coconut Rice", desc:"Creamy coastal delight", img:"https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=85", tag:"Coastal Vibes", big:false },
  { name:"Rice & Beans", desc:"Hearty Kenyan classic", img:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=85", tag:"Comfort Food", big:false },
];

const TESTIMONIALS = [
  { name:"Wanjiku Muthoni", loc:"Nairobi", text:"The fragrance when cooking fills the entire house. My family now refuses any other brand!", init:"W", role:"Home Cook" },
  { name:"Chef Otieno", loc:"Mombasa", text:"We use it for pilau and biryani. Guests always compliment the rice. Deliveries always prompt.", init:"O", role:"Head Chef" },
  { name:"Grace Njeri", loc:"Kisumu", text:"Zero stones, perfectly sorted every time. The best pishori in Kenya — without question.", init:"G", role:"Restaurant Owner" },
  { name:"James Kamau", loc:"Nakuru", text:"As a distributor, Lizz wa Pishori's supply chain is reliable and consistent. Great pricing, nationwide.", init:"J", role:"Distributor" },
];

const COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Machakos","Nyeri","Meru","Garissa","Kisii","Kakamega","Embu","Kitui","Lamu","Malindi","Nanyuki","Naivasha","All 47 Counties ✦"];

const C = {
  gold:"#b8730a", goldL:"#e9a830", goldP:"#fdf6e8",
  green:"#1b4a18", greenL:"#2c6b27",
  txt:"#140f07", mut:"#6b5535", crm:"#f8f2e6",
  bdr:"rgba(184,115,10,0.14)",
};

const INP = { width:"100%", background:"#fff", border:"1.5px solid #e5ddd0", color:C.txt, padding:"13px 16px", fontSize:14, fontFamily:"'DM Sans',sans-serif", borderRadius:9, outline:"none", boxSizing:"border-box", display:"block", transition:"border-color 0.2s, box-shadow 0.2s" };

// ── Scroll Reveal Hook ────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(26px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  );
}

// ── Animated stat counter ─────────────────────────────────────────────────
function useCounter(target, duration = 1600, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return count;
}

// ── HERO ──────────────────────────────────────────────────────────────────
function Hero({ onWA, onScrollTo }) {
  const [heroImg, setHeroImg] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const t = setInterval(() => setHeroImg(p => (p + 1) % HERO_IMAGES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const anim = (n) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.68s cubic-bezier(0.22,1,0.36,1) ${n * 0.09}s, transform 0.68s cubic-bezier(0.22,1,0.36,1) ${n * 0.09}s`,
  });

  return (
    <section id="home" style={{
      minHeight:"100svh", display:"grid",
      gridTemplateColumns:"1fr 1fr",
      background:"#0d0a05",
      position:"relative", overflow:"hidden",
      fontFamily:"'DM Sans',sans-serif",
    }}>
      <div style={{
        position:"relative", zIndex:10,
        display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"88px 52px 80px 5%",
        background:"linear-gradient(108deg, #0d0a05 0%, #0d0a05 68%, rgba(13,10,5,0.85) 85%, transparent 100%)",
      }}>
        <div style={{ ...anim(0), display:"inline-flex", alignItems:"center", gap:8, background:"rgba(184,115,10,0.11)", border:"1px solid rgba(184,115,10,0.26)", borderRadius:100, padding:"6px 16px 6px 10px", marginBottom:22, width:"fit-content" }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", animation:"hblink 2s infinite", flexShrink:0 }} />
          <span style={{ fontSize:9.5, fontWeight:700, color:C.goldL, letterSpacing:"0.22em", textTransform:"uppercase" }}>Now Accepting Orders</span>
        </div>
        <div style={{ ...anim(1), display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <div style={{ height:1.5, width:32, background:`linear-gradient(90deg,${C.gold},${C.goldL})` }} />
          <div style={{ width:5, height:5, borderRadius:"50%", background:C.goldL }} />
          <span style={{ fontSize:8.5, letterSpacing:"0.34em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", fontWeight:700 }}>Mwea · Kenya · Est. 2009</span>
        </div>
        <h1 style={{ ...anim(2), fontFamily:"'Playfair Display',serif", fontSize:"clamp(3rem,5vw,5.6rem)", fontWeight:900, lineHeight:0.9, letterSpacing:"-0.03em", margin:"0 0 26px", color:"#fff" }}>
          Rice That<br />
          <em style={{ fontStyle:"italic", color:C.goldL, fontWeight:800 }}>Fills Hearts</em><br />
          <span style={{ fontWeight:400, fontSize:"0.5em", color:"rgba(255,255,255,0.48)", letterSpacing:"-0.01em" }}>& Every Table</span>
        </h1>
        <div style={{ ...anim(3), display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
          <div style={{ height:1, width:36, background:`linear-gradient(90deg,${C.gold},transparent)` }} />
          <span style={{ fontSize:15, opacity:0.6 }}>🌾</span>
          <div style={{ height:1, width:120, background:`linear-gradient(90deg,rgba(184,115,10,0.35),transparent)` }} />
        </div>
        <p style={{ ...anim(4), fontSize:15.5, lineHeight:1.88, color:"rgba(255,255,255,0.48)", marginBottom:36, maxWidth:430 }}>
          Handpicked from Mwea — Kenya's heartland of pishori. Long grain, naturally fragrant, stone-free. Delivered fresh across all 47 counties.
        </p>
        <div style={{ ...anim(5), display:"flex", gap:10, flexWrap:"wrap", marginBottom:32 }}>
          <button onClick={() => onWA(null)} style={{ background:"linear-gradient(135deg,#25D366,#128C7E)", color:"#fff", border:"none", cursor:"pointer", padding:"14px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, borderRadius:12, display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 6px 24px rgba(37,211,102,0.3)", transition:"all 0.25s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(37,211,102,0.48)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 6px 24px rgba(37,211,102,0.3)"}}>
            <WA_SVG /> Order on WhatsApp
          </button>
          <button onClick={() => onScrollTo("products")} style={{ background:"linear-gradient(135deg,#b8730a,#d4851a)", color:"#fff", border:"none", cursor:"pointer", padding:"14px 28px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, borderRadius:12, display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 6px 24px rgba(184,115,10,0.3)", transition:"all 0.25s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.filter="brightness(1.1)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.filter="none"}}>
            <CART_SVG /> View Products
          </button>
        </div>
        <div style={{ ...anim(6), display:"flex", gap:8, flexWrap:"wrap", marginBottom:36 }}>
          {[[<SHD_SVG />,"Stone-Free"],[<TRK_SVG />,"All 47 Counties"],[<LF_SVG />,"100% Natural"],[null,"✓ Same-Day Nairobi"]].map(([Ic, lb]) => (
            <div key={lb} style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:100, padding:"7px 14px", color:"rgba(255,255,255,0.62)", fontSize:12, fontWeight:500 }}>
              {Ic && <span style={{ color:C.goldL }}>{Ic}</span>}
              {lb}
            </div>
          ))}
        </div>
        <div style={{ ...anim(7), display:"grid", gridTemplateColumns:"repeat(4,1fr)", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden" }}>
          {[["10K+","Families"],["15+","Yrs Exp."],["47","Counties"],["100%","Pishori"]].map(([val,lbl],i) => (
            <div key={lbl} style={{ textAlign:"center", padding:"14px 6px", borderLeft:i>0?"1px solid rgba(255,255,255,0.06)":"none" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:C.goldL, lineHeight:1, letterSpacing:"-0.02em" }}>{val}</div>
              <div style={{ fontSize:8.5, color:"rgba(255,255,255,0.3)", letterSpacing:"0.14em", textTransform:"uppercase", marginTop:4, fontWeight:600 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position:"relative", overflow:"hidden" }}>
        {HERO_IMAGES.map((img, i) => (
          <img key={i} src={img.src} alt={img.label} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", opacity:heroImg===i?1:0, transform:heroImg===i?"scale(1)":"scale(1.05)", transition:"opacity 1.1s cubic-bezier(0.4,0,0.2,1), transform 6s ease", willChange:"opacity,transform" }} />
        ))}
        <div style={{ position:"absolute", inset:0, zIndex:2, pointerEvents:"none", background:"linear-gradient(90deg, #0d0a05 0%, rgba(13,10,5,0.6) 28%, rgba(13,10,5,0.18) 60%, rgba(13,10,5,0.08) 100%)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:200, zIndex:2, pointerEvents:"none", background:"linear-gradient(to top, rgba(13,10,5,0.88) 0%, transparent 100%)" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:120, zIndex:2, pointerEvents:"none", background:"linear-gradient(to bottom, rgba(13,10,5,0.5) 0%, transparent 100%)" }} />
        <div style={{ position:"absolute", top:28, right:28, bottom:28, left:10, border:"1px solid rgba(233,168,48,0.18)", borderRadius:"0 24px 24px 0", zIndex:3, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:48, right:40, zIndex:10, background:"#fff", borderRadius:18, padding:"14px 18px", boxShadow:"0 20px 56px rgba(0,0,0,0.28)", minWidth:190, animation:"hfloatL 6s ease-in-out infinite" }}>
          <div style={{ display:"flex", gap:2, marginBottom:6 }}>{[...Array(5)].map((_,j) => <span key={j} style={{ color:"#f59e0b", fontSize:11 }}>★</span>)}</div>
          <div style={{ fontSize:11, color:"#3d2c12", lineHeight:1.55, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>"Stone-free every time. My family won't eat any other brand!"</div>
          <div style={{ fontSize:9, color:"#9c7840", marginTop:6, fontWeight:700, fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.06em" }}>📍 Wanjiku M. · Nairobi</div>
        </div>
        <div style={{ position:"absolute", bottom:120, left:24, zIndex:10, background:"linear-gradient(135deg,#b8730a,#e9a830)", borderRadius:16, padding:"14px 20px", boxShadow:"0 14px 40px rgba(184,115,10,0.52)", textAlign:"center", animation:"hfloatR 5s ease-in-out infinite" }}>
          <div style={{ fontSize:8.5, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.78)", fontWeight:700, fontFamily:"'DM Sans',sans-serif", marginBottom:4 }}>From only</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:"#fff", lineHeight:1 }}>KSh 160</div>
          <div style={{ fontSize:9.5, color:"rgba(255,255,255,0.78)", marginTop:3, fontFamily:"'DM Sans',sans-serif" }}>per 1kg pack</div>
        </div>
        <div style={{ position:"absolute", right:18, top:"50%", transform:"translateY(-50%)", zIndex:10, display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setHeroImg(i)} aria-label={`View ${HERO_IMAGES[i].label}`} style={{ width:5, height:heroImg===i?28:5, borderRadius:3, border:"none", cursor:"pointer", padding:0, background:heroImg===i?C.goldL:"rgba(255,255,255,0.3)", transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)" }} />
          ))}
        </div>
        <div style={{ position:"absolute", bottom:32, right:32, zIndex:10, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)", border:"1px solid rgba(255,255,255,0.16)", borderRadius:18, padding:"12px 18px", display:"flex", alignItems:"center", gap:12, animation:"hfloat 5s ease-in-out infinite" }}>
          <div style={{ width:50, height:50, borderRadius:12, overflow:"hidden", flexShrink:0, border:"2px solid rgba(233,168,48,0.4)" }}>
            <img src={HERO_IMAGES[heroImg].src} alt={HERO_IMAGES[heroImg].label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div>
            <div style={{ fontSize:8.5, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", fontWeight:700, fontFamily:"'DM Sans',sans-serif", marginBottom:3 }}>Now Showing</div>
            <div style={{ fontSize:13.5, fontWeight:700, color:"#fff", fontFamily:"'Playfair Display',serif", marginBottom:6 }}>{HERO_IMAGES[heroImg].label}</div>
            <div style={{ display:"flex", gap:5 }}>
              {HERO_IMAGES.map((_, i) => (
                <button key={i} onClick={() => setHeroImg(i)} style={{ width:i===heroImg?18:5, height:4, borderRadius:2, border:"none", cursor:"pointer", padding:0, background:i===heroImg?C.goldL:"rgba(255,255,255,0.25)", transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} aria-label={HERO_IMAGES[i].label} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%) rotate(-90deg)", transformOrigin:"center", fontSize:8, letterSpacing:"0.4em", color:"rgba(255,255,255,0.12)", textTransform:"uppercase", fontWeight:700, fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap", zIndex:4 }}>Kenya's Finest Pishori · Est. 2009</div>
      </div>

      <button onClick={() => onScrollTo("about")} aria-label="Scroll down" style={{ position:"absolute", bottom:24, left:"25%", transform:"translateX(-50%)", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5, color:"rgba(255,255,255,0.2)", zIndex:10, animation:"hbob 3s ease-in-out infinite" }}>
        <span style={{ fontSize:7.5, letterSpacing:"0.34em", textTransform:"uppercase", fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>Scroll</span>
        <DWN_SVG />
      </button>
    </section>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [orderModal, setOrderModal] = useState(null);
  const [orderDone, setOrderDone] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", county:"", qty:"" });
  const [hovProd, setHovProd] = useState(null);
  const [hovGal, setHovGal] = useState(null);
  const [testi, setTesti] = useState(0);
  const [cform, setCform] = useState({ name:"", phone:"", msg:"" });
  const [csent, setCsent] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  if (!appReady) return <Loader onDone={() => setAppReady(true)} />;

  return <AppContent
    activeNav={activeNav} setActiveNav={setActiveNav}
    menuOpen={menuOpen} setMenuOpen={setMenuOpen}
    scrolled={scrolled} setScrolled={setScrolled}
    orderModal={orderModal} setOrderModal={setOrderModal}
    orderDone={orderDone} setOrderDone={setOrderDone}
    form={form} setForm={setForm}
    hovProd={hovProd} setHovProd={setHovProd}
    hovGal={hovGal} setHovGal={setHovGal}
    testi={testi} setTesti={setTesti}
    cform={cform} setCform={setCform}
    csent={csent} setCsent={setCsent}
    showStickyBar={showStickyBar} setShowStickyBar={setShowStickyBar}
    progressWidth={progressWidth} setProgressWidth={setProgressWidth}
  />;
}

function AppContent({
  activeNav, setActiveNav, menuOpen, setMenuOpen,
  scrolled, setScrolled, orderModal, setOrderModal,
  orderDone, setOrderDone, form, setForm,
  hovProd, setHovProd, hovGal, setHovGal,
  testi, setTesti, cform, setCform, csent, setCsent,
  showStickyBar, setShowStickyBar, progressWidth, setProgressWidth,
}) {
  useEffect(() => {
    document.body.style.overflow = (orderModal || menuOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [orderModal, menuOpen]);

  useEffect(() => {
    if (!orderModal) return;
    const fn = (e) => { if (e.key === "Escape") setOrderModal(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [orderModal]);

  useEffect(() => {
    const fn = () => {
      const sy = window.scrollY;
      setScrolled(sy > 50);
      setShowStickyBar(sy > window.innerHeight * 0.85);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgressWidth(docH > 0 ? (sy / docH) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTesti(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = useCallback((id) => {
    const sectionId = NAV_MAP[id] ?? id.toLowerCase();
    document.getElementById(sectionId)?.scrollIntoView({ behavior:"smooth" });
    const navKey = Object.keys(NAV_MAP).find(k => NAV_MAP[k] === sectionId) ?? id;
    setActiveNav(navKey);
    setMenuOpen(false);
  }, []);

  const openWA = useCallback((product) => {
    const msg = product
      ? `Hello Lizz wa Pishori! I'd like to order *${product.name}* (${product.price}). Please confirm availability.`
      : `Hello Lizz wa Pishori! I'm interested in your pishori rice. Please share more details.`;
    window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
  }, []);

  const submitOrder = (e) => {
    e.preventDefault();
    const msg = `Hello! I'm *${form.name}*. Order: *${orderModal?.name}* (${orderModal?.price}). County: ${form.county}. Qty: ${form.qty || "1"}. Phone: ${form.phone}.`;
    window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
    setOrderDone(true);
    setTimeout(() => { setOrderModal(null); setOrderDone(false); setForm({ name:"", phone:"", county:"", qty:"" }); }, 3000);
  };

  const submitContact = (e) => {
    e.preventDefault();
    const msg = `Hello Lizz wa Pishori! I'm *${cform.name}* (${cform.phone}). ${cform.msg}`;
    window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
    setCsent(true);
    setTimeout(() => { setCsent(false); setCform({ name:"", phone:"", msg:"" }); }, 3000);
  };

  return (
    <div style={{ fontFamily:"'Playfair Display','Georgia',serif", background:"#fafaf7", color:C.txt, overflowX:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{overflow-x:hidden}
        .dm{font-family:'DM Sans',sans-serif}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${C.gold};border-radius:3px}
        .prog{position:fixed;top:0;left:0;height:2.5px;background:linear-gradient(90deg,${C.gold},${C.goldL});z-index:500;transition:width 0.1s linear;pointer-events:none}
        @keyframes hblink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes hbob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-7px)}}
        @keyframes hfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes hfloatL{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-11px) rotate(1deg)}}
        @keyframes hfloatR{0%,100%{transform:translateY(0) rotate(2deg)}50%{transform:translateY(-10px) rotate(-1deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes bobS{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes stickyIn{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,0.5)}70%{box-shadow:0 0 0 10px rgba(37,211,102,0)}}
        @keyframes tagFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-6px) rotate(1deg)}}
        .bwa{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;border:none;cursor:pointer;padding:12px 24px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;border-radius:8px;display:inline-flex;align-items:center;gap:8px;transition:all 0.25s;box-shadow:0 4px 18px rgba(37,211,102,0.28);white-space:nowrap}
        .bwa:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(37,211,102,0.45)}
        .bgold{background:linear-gradient(135deg,${C.gold},#d4851a);color:#fff;border:none;cursor:pointer;padding:12px 24px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;border-radius:8px;display:inline-flex;align-items:center;gap:8px;transition:all 0.25s;box-shadow:0 4px 18px rgba(184,115,10,0.3);white-space:nowrap}
        .bgold:hover{transform:translateY(-2px);filter:brightness(1.08)}
        .bghst{background:transparent;color:${C.gold};border:1.5px solid ${C.gold};cursor:pointer;padding:11px 22px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;border-radius:8px;display:inline-flex;align-items:center;gap:8px;transition:all 0.25s;white-space:nowrap}
        .bghst:hover{background:${C.gold};color:#fff;transform:translateY(-2px)}
        .card{background:#fff;border-radius:18px;border:1px solid ${C.bdr};box-shadow:0 2px 24px rgba(0,0,0,0.05);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.3s ease}
        .card:hover{transform:translateY(-6px);box-shadow:0 20px 56px rgba(0,0,0,0.11)}
        .lbl{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:${C.gold};display:inline-flex;align-items:center;gap:10px}
        .lbl::before{content:'';width:28px;height:1.5px;background:linear-gradient(90deg,${C.gold},${C.goldL});display:block;flex-shrink:0}
        .wafab{position:fixed;bottom:24px;right:24px;z-index:400;width:58px;height:58px;background:linear-gradient(135deg,#25D366,#128C7E);border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 28px rgba(37,211,102,0.5);color:#fff;transition:transform 0.22s;animation:pulse 2.5s infinite}
        .wafab:hover{transform:scale(1.12)}
        .sticky-bar{position:fixed;bottom:0;left:0;right:0;z-index:350;background:linear-gradient(135deg,${C.green},${C.greenL});padding:12px 5%;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;box-shadow:0 -4px 30px rgba(0,0,0,0.18);animation:stickyIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both}
        .nl{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:4px 0;color:${C.mut};position:relative;transition:color 0.2s}
        .nl.on,.nl:hover{color:${C.txt}}
        .nl::after{content:'';position:absolute;bottom:-3px;left:0;right:0;height:1.5px;background:linear-gradient(90deg,${C.gold},${C.goldL});transform:scaleX(0);transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1);transform-origin:center}
        .nl.on::after,.nl:hover::after{transform:scaleX(1)}
        .shimmer-btn{background:linear-gradient(90deg,${C.goldL} 0%,#f5c442 50%,${C.goldL} 100%);background-size:200% 100%;animation:shimmer 2.5s infinite}
        input:focus,textarea:focus{border-color:${C.gold}!important;box-shadow:0 0 0 3px rgba(184,115,10,0.1)!important;outline:none}
        input,textarea{outline:none}
        .testi-wrap{overflow:hidden;position:relative}
        .testi-track{display:flex;transition:transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)}
        @media(max-width:920px){.ht{display:none!important}}
        @media(max-width:768px){
          #home{grid-template-columns:1fr!important;grid-template-rows:52vh auto!important}
          #home>div:first-child{grid-row:2;background:#0d0a05!important;padding:28px 5% 52px!important;justify-content:flex-start!important;}
          #home>div:nth-child(2){grid-row:1}
          #home>div:nth-child(2)>div:nth-child(2){background:linear-gradient(180deg,rgba(13,10,5,0.05) 0%,rgba(13,10,5,0) 30%,rgba(13,10,5,0.9) 80%,#0d0a05 100%)!important}
        }
        @media(max-width:700px){
          .hm{display:none!important}
          .g21{grid-template-columns:1fr!important}
          .g42{grid-template-columns:1fr 1fr!important}
          .g31{grid-template-columns:1fr!important}
          .gg{grid-template-columns:1fr 1fr!important;grid-template-rows:auto!important}
          .hrow{flex-direction:column!important}
          .hrow>*{justify-content:center!important}
        }
        @media(max-width:460px){.g42{grid-template-columns:1fr!important}}
        .about-imgs{position:relative;height:540px}
        @media(max-width:700px){
          .about-imgs{height:auto;display:grid;grid-template-columns:1fr 1fr;gap:12px}
          .about-main-img{position:relative!important;width:100%!important;height:220px!important;top:auto!important;right:auto!important;border-radius:16px!important;overflow:hidden}
          .about-sec-img{position:relative!important;width:100%!important;height:160px!important;bottom:auto!important;left:auto!important;border-radius:14px!important;overflow:hidden;border:none!important}
          .about-badge-quality,.about-badge-fb{display:none!important}
          .about-badge-source{position:relative!important;bottom:auto!important;right:auto!important;border-radius:10px!important;margin-top:0!important}
        }
        .gal-big{grid-row:1/3}
        @media(max-width:700px){.gal-big{grid-row:auto!important}}
      `}</style>

      <div className="prog" style={{ width:`${progressWidth}%` }} role="progressbar" aria-valuenow={progressWidth} />

      <button className="wafab" onClick={() => openWA(null)} aria-label="Chat on WhatsApp" style={{ bottom:showStickyBar?86:24 }}>
        <WA_SVG />
      </button>

      {showStickyBar && (
        <div className="sticky-bar">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:C.goldL, animation:"blink 2s infinite" }} />
            <span className="dm" style={{ fontSize:13, color:"rgba(255,255,255,0.85)", fontWeight:500 }}>
              <strong style={{ color:"#fff" }}>Same-day delivery</strong> in Nairobi · All 47 counties
            </span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => openWA(null)} className="bwa" style={{ padding:"8px 16px", fontSize:12 }}><WA_SVG /> Order Now</button>
            <button onClick={() => setOrderModal(PRODUCTS[0])} className="bgold" style={{ padding:"8px 16px", fontSize:12 }}><CART_SVG /> Quick Order</button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:66, background:scrolled?"rgba(250,250,247,0.96)":"rgba(250,250,247,0.82)", backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)", borderBottom:scrolled?`1px solid ${C.bdr}`:"1px solid transparent", boxShadow:scrolled?"0 2px 28px rgba(0,0,0,0.07)":"none", transition:"all 0.35s", padding:"0 5%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={() => scrollTo("Home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:11 }}>
          <div style={{ width:37, height:37, background:`linear-gradient(135deg,${C.gold},${C.goldL})`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 14px rgba(184,115,10,0.38)`, color:"#fff" }}><WHT_SVG /></div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:16, color:C.txt, lineHeight:1.1 }}>Lizz wa Pishori</div>
            <div className="dm" style={{ fontSize:7.5, color:C.gold, letterSpacing:"0.28em", textTransform:"uppercase", fontWeight:700 }}>Premium Rice · Kenya</div>
          </div>
        </button>
        <div className="ht" style={{ display:"flex", gap:28 }}>
          {NAV_ITEMS.map(l => <button key={l} className={`nl${activeNav===l?" on":""}`} onClick={() => scrollTo(l)}>{l}</button>)}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={() => openWA(null)} className="bwa hm" style={{ padding:"8px 14px", fontSize:11 }}><WA_SVG /> WhatsApp</button>
          <button onClick={() => setOrderModal(PRODUCTS[0])} className="bgold hm" style={{ padding:"8px 14px", fontSize:11 }}><CART_SVG /> Order</button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", cursor:"pointer", padding:7, color:C.txt, display:"flex", borderRadius:8 }} aria-label={menuOpen?"Close menu":"Open menu"}>
            {menuOpen ? <X_SVG /> : <MENU_SVG />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div role="dialog" aria-modal="true" style={{ position:"fixed", inset:0, zIndex:190, background:"rgba(250,250,247,0.98)", backdropFilter:"blur(24px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:18, animation:"fadeIn 0.18s ease" }}>
          {NAV_ITEMS.map((l, i) => (
            <button key={l} onClick={() => scrollTo(l)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:700, color:activeNav===l?C.gold:C.txt, letterSpacing:"-0.02em", animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>{l}</button>
          ))}
          <div style={{ display:"flex", gap:10, marginTop:12, flexWrap:"wrap", justifyContent:"center" }}>
            <button onClick={() => { openWA(null); setMenuOpen(false); }} className="bwa"><WA_SVG /> WhatsApp</button>
            <button onClick={() => { setOrderModal(PRODUCTS[0]); setMenuOpen(false); }} className="bgold"><CART_SVG /> Order Now</button>
          </div>
          <div style={{ display:"flex", gap:14, marginTop:6 }}>
            <a href={FB_URL} target="_blank" rel="noreferrer" style={{ color:"#1877f2", width:40, height:40, background:"rgba(24,119,242,0.1)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }} aria-label="Facebook"><FB_SVG /></a>
            <a href={IG_URL} target="_blank" rel="noreferrer" style={{ color:"#E1306C", width:40, height:40, background:"rgba(225,48,108,0.1)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }} aria-label="Instagram"><IG_SVG /></a>
            <a href={TT_URL} target="_blank" rel="noreferrer" style={{ color:C.txt, width:40, height:40, background:"rgba(0,0,0,0.05)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }} aria-label="TikTok"><TT_SVG /></a>
            <a href={`tel:+${WA_NUM}`} style={{ color:C.green, width:40, height:40, background:"rgba(27,74,24,0.08)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }} aria-label="Call us"><PHN_SVG /></a>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT BAR */}
      <div style={{ background:`linear-gradient(135deg,${C.green},#3a8035)`, padding:"10px 5%", display:"flex", alignItems:"center", justifyContent:"center", gap:18, flexWrap:"wrap", marginTop:66, position:"relative", zIndex:100, overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.04, backgroundImage:`repeating-linear-gradient(45deg,#fff 0px,#fff 1px,transparent 1px,transparent 8px)` }} />
        <span className="dm" style={{ fontSize:12.5, color:"rgba(255,255,255,0.88)", fontWeight:400, position:"relative" }}>
          🌾 <strong>Same-day delivery in Nairobi</strong> · Countrywide across all 47 counties · WhatsApp orders welcome
        </span>
        <button onClick={() => openWA(null)} className="shimmer-btn dm" style={{ color:C.green, border:"none", cursor:"pointer", padding:"4px 16px", borderRadius:5, fontSize:11, fontWeight:800, letterSpacing:"0.1em", flexShrink:0, position:"relative" }}>
          ORDER NOW →
        </button>
      </div>

      <Hero onWA={openWA} onScrollTo={scrollTo} />

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding:"120px 5%", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:90, alignItems:"center" }} className="g21">
          <Reveal>
            <div className="about-imgs">
              <div className="about-main-img" style={{ position:"absolute", right:0, top:0, width:"80%", height:"76%", borderRadius:22, overflow:"hidden", boxShadow:"0 36px 90px rgba(0,0,0,0.16)" }}>
                <img src="/ourstorypic1.jpg" alt="Mwea farm pishori rice fields" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(20,15,7,0.25) 0%, transparent 55%)" }} />
              </div>
              <div className="about-sec-img" style={{ position:"absolute", left:0, bottom:22, width:"50%", height:"48%", borderRadius:16, overflow:"hidden", boxShadow:"0 22px 64px rgba(0,0,0,0.2)", border:"4px solid #fff" }}>
                <img src="/ourstorypic2.jpg" alt="Kenyan pilau dish" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
              <div className="about-badge-quality" style={{ position:"absolute", top:20, left:10, background:"#fff", borderRadius:14, padding:"14px 18px", boxShadow:"0 12px 40px rgba(0,0,0,0.12)", display:"flex", alignItems:"center", gap:10, animation:"bobS 4.5s ease-in-out infinite" }}>
                <div style={{ width:40, height:40, background:C.goldP, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:C.gold }}><AWD_SVG /></div>
                <div>
                  <div className="dm" style={{ fontSize:9, color:C.mut, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em" }}>Certified Quality</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:C.txt }}>Premium Grade</div>
                </div>
              </div>
              <div className="about-badge-source" style={{ position:"absolute", bottom:32, right:10, background:`linear-gradient(135deg,${C.green},${C.greenL})`, borderRadius:10, padding:"10px 18px", display:"flex", alignItems:"center", gap:8, color:"#fff", boxShadow:"0 8px 28px rgba(27,74,24,0.38)" }}>
                <LF_SVG /><span className="dm" style={{ fontSize:11.5, fontWeight:700, letterSpacing:"0.06em" }}>Sourced from Mwea</span>
              </div>
              <a href={FB_URL} target="_blank" rel="noreferrer" className="about-badge-fb" style={{ position:"absolute", top:24, right:20, background:"#1877f2", borderRadius:10, padding:"9px 16px", display:"flex", alignItems:"center", gap:8, textDecoration:"none", boxShadow:"0 6px 20px rgba(24,119,242,0.38)" }}>
                <FB_SVG /><span className="dm" style={{ fontSize:11.5, color:"#fff", fontWeight:700 }}>Follow Us</span>
              </a>
            </div>
          </Reveal>
          <div>
            <Reveal delay={0.05}>
              <div className="lbl" style={{ marginBottom:18 }}>Our Story</div>
              <h2 style={{ fontSize:"clamp(2rem,3.5vw,3.6rem)", fontWeight:800, lineHeight:1.06, marginBottom:24, color:C.txt, letterSpacing:"-0.02em" }}>
                From the Fields of<br /><em style={{ color:C.gold, fontWeight:700 }}>Mwea to Your Table</em>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="dm" style={{ fontSize:15.5, lineHeight:1.95, color:C.mut, marginBottom:18 }}>
                We are <strong style={{ color:C.txt }}>Lizz wa Pishori</strong>. Born among the paddies of Mwea — Kenya's heartland of pishori — we've spent over 15 years perfecting the art of sourcing and supplying the finest rice in the country.
              </p>
              <p className="dm" style={{ fontSize:15.5, lineHeight:1.95, color:C.mut, marginBottom:36 }}>
                Every sack is hand-sorted, stone-free, and packaged to preserve the natural aroma that makes pishori so special. We serve homes, restaurants, hotels, and distributors across all 47 counties.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, marginBottom:36 }} className="g42">
                {["Hand-sorted & stone-free","Direct from Mwea paddies","Consistent quality all sizes","15+ years nationwide supply"].map(pt => (
                  <div key={pt} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 12px", background:C.crm, borderRadius:10, border:`1px solid ${C.bdr}` }}>
                    <div style={{ width:22, height:22, background:C.goldP, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, color:C.gold }}><CHK_SVG /></div>
                    <span className="dm" style={{ fontSize:13, color:C.mut, lineHeight:1.65 }}>{pt}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button onClick={() => openWA(null)} className="bwa"><WA_SVG /> Chat with Us</button>
                <a href={FB_URL} target="_blank" rel="noreferrer" style={{ background:"#1877f2", color:"#fff", textDecoration:"none", padding:"12px 22px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 4px 16px rgba(24,119,242,0.3)" }}>
                  <FB_SVG /> Our Facebook
                </a>
                <a href={IG_URL} target="_blank" rel="noreferrer" style={{ background:"linear-gradient(135deg,#E1306C,#833AB4)", color:"#fff", textDecoration:"none", padding:"12px 22px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, display:"inline-flex", alignItems:"center", gap:8, boxShadow:"0 4px 16px rgba(225,48,108,0.3)" }}>
                  <IG_SVG /> Instagram
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ padding:"100px 5%", background:C.crm }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div className="lbl" style={{ justifyContent:"center", marginBottom:18 }}>Why Choose Us</div>
              <h2 style={{ fontSize:"clamp(2rem,3.5vw,3.4rem)", fontWeight:800, color:C.txt, letterSpacing:"-0.02em" }}>The Pishori <em style={{ color:C.gold }}>Difference</em></h2>
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }} className="g31">
            {[
              [<WHT_SVG />,"Mwea-Sourced","Directly from Kenya's premier rice-growing region — freshness guaranteed at source."],
              [<SHD_SVG />,"Stone-Free Guaranteed","Every batch is hand-sorted and cleaned. Pure grain, nothing else, every single time."],
              [<TRK_SVG />,"Countrywide Delivery","We deliver to all 47 counties. Same-day within Nairobi, 2–3 days upcountry."],
              [<LF_SVG />,"Naturally Fragrant","No additives. The aroma you smell is pure pishori, exactly as nature intended."],
              [<PKG_SVG />,"All Pack Sizes","From 1kg home packs to 50kg wholesale sacks — the right size for every need."],
              [<SPK_SVG />,"Premium Quality","Long grain, low starch, perfectly fluffy every time. Restaurant and home-grade."],
            ].map(([Ic,title,desc], i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="card" style={{ padding:"28px 24px", height:"100%" }}>
                  <div style={{ width:50, height:50, background:C.goldP, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, color:C.gold, border:`1px solid rgba(184,115,10,0.16)` }}>{Ic}</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, marginBottom:10, color:C.txt }}>{title}</h3>
                  <p className="dm" style={{ fontSize:13.5, lineHeight:1.85, color:C.mut }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" style={{ padding:"120px 5%", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:66 }}>
              <div className="lbl" style={{ justifyContent:"center", marginBottom:18 }}>Our Range</div>
              <h2 style={{ fontSize:"clamp(2rem,3.5vw,3.4rem)", fontWeight:800, color:C.txt, letterSpacing:"-0.02em" }}>Choose Your <em style={{ color:C.gold }}>Perfect Pack</em></h2>
              <p className="dm" style={{ fontSize:15.5, color:C.mut, marginTop:14, maxWidth:480, margin:"14px auto 0" }}>From household packs to wholesale sacks — every size, every need.</p>
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:22 }} className="g42">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.09}>
                <div className="card" style={{ overflow:"hidden", display:"flex", flexDirection:"column", height:"100%" }}>
                  <div style={{ height:200, overflow:"hidden", position:"relative", cursor:"pointer" }}
                    onMouseEnter={() => setHovProd(i)} onMouseLeave={() => setHovProd(null)}>
                    <img src={p.img} alt={`${p.name} — ${p.weight} pack of premium pishori rice`} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)", transform:hovProd===i?"scale(1.09)":"scale(1)" }} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(15,10,4,0.65) 0%, transparent 55%)" }} />
                    <div style={{ position:"absolute", top:0, left:0, background:p.bc, color:"#fff", padding:"5px 22px 5px 10px", fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", clipPath:"polygon(0 0,100% 0,88% 100%,0 100%)" }}>{p.badge}</div>
                    <div style={{ position:"absolute", bottom:14, right:14, background:"rgba(255,255,255,0.94)", borderRadius:9, padding:"7px 14px", backdropFilter:"blur(8px)" }}>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:800, color:C.gold }}>{p.price}</span>
                    </div>
                  </div>
                  <div style={{ padding:"20px 18px", flex:1, display:"flex", flexDirection:"column" }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, marginBottom:6, color:C.txt }}>{p.name}</h3>
                    <div className="dm" style={{ display:"flex", gap:14, marginBottom:12, fontSize:11.5, color:C.mut }}>
                      <span>⚖ {p.weight}</span><span>👥 {p.serves}</span>
                    </div>
                    <p className="dm" style={{ fontSize:13, lineHeight:1.8, color:C.mut, marginBottom:18, flex:1 }}>{p.desc}</p>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={() => openWA(p)} className="bwa" style={{ flex:1, justifyContent:"center", padding:"9px 6px", fontSize:11 }}><WA_SVG /> WhatsApp</button>
                      <button onClick={() => setOrderModal(p)} className="bgold" style={{ flex:2, justifyContent:"center", padding:"9px 10px", fontSize:11 }}>Order <ARR_SVG /></button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div style={{ marginTop:50, background:`linear-gradient(135deg,${C.green} 0%,#3a8035 100%)`, borderRadius:20, padding:"36px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:22, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-40, top:-40, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
              <div style={{ position:"relative" }}>
                <div className="lbl" style={{ color:"rgba(233,168,48,0.9)", marginBottom:12 }}>Bulk & Wholesale</div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.5rem,2.5vw,2.3rem)", fontWeight:800, color:"#fff" }}>Need large quantities? <em style={{ color:C.goldL }}>Let's talk.</em></h3>
                <p className="dm" style={{ fontSize:14, color:"rgba(255,255,255,0.58)", marginTop:8 }}>Special pricing for hotels, restaurants, distributors & institutions.</p>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", position:"relative" }}>
                <button onClick={() => openWA(null)} className="bwa"><WA_SVG /> WhatsApp Us</button>
                <a href={`tel:+${WA_NUM}`} className="bgold" style={{ textDecoration:"none" }}><PHN_SVG /> Call Now</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ padding:"120px 5%", background:C.crm }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <div className="lbl" style={{ justifyContent:"center", marginBottom:18 }}>Cuisine Gallery</div>
              <h2 style={{ fontSize:"clamp(2rem,3.5vw,3.4rem)", fontWeight:800, color:C.txt, letterSpacing:"-0.02em" }}>Dishes Made with <em style={{ color:C.gold }}>Pishori</em></h2>
              <p className="dm" style={{ fontSize:15.5, color:C.mut, marginTop:14 }}>From everyday meals to grand celebrations — our rice elevates every dish.</p>
            </div>
          </Reveal>
          <div className="gg" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gridTemplateRows:"300px 300px", gap:14 }}>
            {GALLERY.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.07} style={d.big ? { gridRow:"1/3" } : {}}>
                <div style={{ position:"relative", borderRadius:18, overflow:"hidden", cursor:"pointer", height:"100%" }}
                  onMouseEnter={() => setHovGal(i)} onMouseLeave={() => setHovGal(null)}>
                  <img src={d.img} alt={d.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)", transform:hovGal===i?"scale(1.07)":"scale(1)" }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)" }} />
                  <div style={{ position:"absolute", inset:0, background:"rgba(184,115,10,0.12)", opacity:hovGal===i?1:0, transition:"opacity 0.35s" }} />
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"22px 20px", transform:hovGal===i?"translateY(0)":"translateY(4px)", transition:"transform 0.35s ease" }}>
                    <span className="dm" style={{ background:C.gold, color:"#fff", padding:"3px 11px", fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", borderRadius:4, display:"inline-block", marginBottom:9 }}>{d.tag}</span>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:d.big?28:20, fontWeight:700, color:"#fff", marginBottom:5 }}>{d.name}</h3>
                    <p className="dm" style={{ fontSize:12.5, color:"rgba(255,255,255,0.68)" }}>{d.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div style={{ textAlign:"center", marginTop:38, display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <a href={IG_URL} target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:9, background:"linear-gradient(135deg,#E1306C,#833AB4)", color:"#fff", textDecoration:"none", padding:"14px 28px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13 }}>
                <IG_SVG /> Follow on Instagram <EXT_SVG />
              </a>
              <a href={TT_URL} target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:9, background:C.txt, color:"#fff", textDecoration:"none", padding:"14px 28px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13 }}>
                <TT_SVG /> Watch Our TikTok <EXT_SVG />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"120px 5%", background:"#fff", overflow:"hidden" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div className="lbl" style={{ justifyContent:"center", marginBottom:18 }}>Testimonials</div>
              <h2 style={{ fontSize:"clamp(2rem,3.5vw,3.4rem)", fontWeight:800, color:C.txt, letterSpacing:"-0.02em" }}>What Our <em style={{ color:C.gold }}>Customers Say</em></h2>
            </div>
          </Reveal>
          <div style={{ position:"relative" }}>
            <div className="testi-wrap">
              <div className="testi-track" style={{ transform:`translateX(-${testi * 100}%)` }}>
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} style={{ minWidth:"100%", padding:"0 4px" }}>
                    <div style={{ maxWidth:760, margin:"0 auto", background:C.crm, borderRadius:22, padding:"44px 48px", border:`1.5px solid ${C.bdr}`, position:"relative", overflow:"hidden", textAlign:"center" }}>
                      <div style={{ position:"absolute", top:20, left:24 }}><QT_SVG /></div>
                      <div style={{ display:"flex", gap:3, justifyContent:"center", marginBottom:22 }}>{[...Array(5)].map((_,j) => <span key={j} style={{ color:C.goldL }}><STR_SVG /></span>)}</div>
                      <p className="dm" style={{ fontSize:18, lineHeight:1.9, color:C.txt, marginBottom:30, fontStyle:"italic", maxWidth:560, margin:"0 auto 30px" }}>"{t.text}"</p>
                      <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center", borderTop:`1px solid rgba(184,115,10,0.12)`, paddingTop:22 }}>
                        <div style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.goldL})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:20, color:"#fff" }}>{t.init}</span>
                        </div>
                        <div style={{ textAlign:"left" }}>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:C.txt }}>{t.name}</div>
                          <div className="dm" style={{ fontSize:12, color:C.gold, marginTop:2 }}>📍 {t.loc} · {t.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginTop:32 }}>
              <button onClick={() => setTesti(p => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} aria-label="Previous testimonial"
                style={{ width:38, height:38, borderRadius:"50%", background:C.crm, border:`1.5px solid ${C.bdr}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.gold }}
                onMouseEnter={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color="#fff"}}
                onMouseLeave={e=>{e.currentTarget.style.background=C.crm;e.currentTarget.style.color=C.gold}}>
                <PRV_SVG />
              </button>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTesti(i)} aria-label={`Go to testimonial ${i+1}`}
                  style={{ width:i===testi?28:8, height:8, borderRadius:4, border:"none", cursor:"pointer", background:i===testi?C.gold:`rgba(184,115,10,0.22)`, transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)", padding:0 }} />
              ))}
              <button onClick={() => setTesti(p => (p + 1) % TESTIMONIALS.length)} aria-label="Next testimonial"
                style={{ width:38, height:38, borderRadius:"50%", background:C.crm, border:`1.5px solid ${C.bdr}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.gold }}
                onMouseEnter={e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color="#fff"}}
                onMouseLeave={e=>{e.currentTarget.style.background=C.crm;e.currentTarget.style.color=C.gold}}>
                <NXT_SVG />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── DELIVERY ── */}
      <section id="delivery" style={{ padding:"120px 5%", background:C.crm }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }} className="g21">
          <Reveal>
            <div>
              <div className="lbl" style={{ marginBottom:18 }}>We Come to You</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,3.5vw,3.4rem)", fontWeight:800, lineHeight:1.08, marginBottom:24, color:C.txt, letterSpacing:"-0.02em" }}>
                Countrywide <em style={{ color:C.gold }}>Delivery</em><br />Guaranteed
              </h2>
              <p className="dm" style={{ fontSize:15.5, lineHeight:1.9, color:C.mut, marginBottom:36 }}>
                No matter where you are in Kenya, we bring fresh pishori to your doorstep. From Nairobi to Lamu, Kisumu to Mandera — our network covers every corner.
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:36 }} className="g42">
                {[
                  [<TRK_SVG />,"Same Day Nairobi","Orders before 12PM"],
                  [<GLB_SVG />,"2–3 Days Upcountry","All major towns"],
                  [<SHD_SVG />,"Bulk Discounts","Orders above 100kg"],
                  [<WA_SVG />,"WhatsApp Orders",PHONE],
                ].map(([Ic,title,sub]) => (
                  <div key={title} style={{ background:"#fff", borderRadius:13, padding:"15px 14px", border:`1px solid ${C.bdr}`, display:"flex", gap:11 }}>
                    <div style={{ width:34, height:34, background:C.goldP, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.gold }}>{Ic}</div>
                    <div>
                      <div className="dm" style={{ fontSize:12.5, fontWeight:700, color:C.txt }}>{title}</div>
                      <div className="dm" style={{ fontSize:11.5, color:C.mut, marginTop:3 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button onClick={() => openWA(null)} className="bwa"><WA_SVG /> Order via WhatsApp</button>
                <a href={`tel:+${WA_NUM}`} className="bghst" style={{ textDecoration:"none" }}><PHN_SVG /> {PHONE}</a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="card" style={{ padding:"30px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:13, marginBottom:24 }}>
                <div style={{ width:44, height:44, background:C.goldP, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", color:C.gold }}><GLB_SVG /></div>
                <div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:C.txt }}>Delivery Zones</h3>
                  <p className="dm" style={{ fontSize:12, color:C.mut }}>All 47 counties covered</p>
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {COUNTIES.map(c => (
                  <span key={c} className="dm" style={{ background:c.includes("47")?`linear-gradient(135deg,${C.gold},#d4851a)`:"#fff", color:c.includes("47")?"#fff":C.gold, padding:"5px 13px", fontSize:11.5, fontWeight:600, borderRadius:20, border:`1px solid ${c.includes("47")?C.gold:"rgba(184,115,10,0.22)"}`, boxShadow:c.includes("47")?`0 4px 14px rgba(184,115,10,0.3)`:"none" }}>{c}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding:"110px 5%", position:"relative", overflow:"hidden", textAlign:"center" }}>
        <div style={{ position:"absolute", inset:0 }}>
          <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1400&q=30" alt="" aria-hidden="true" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(20,12,4,0.96) 0%, rgba(30,60,25,0.94) 100%)" }} />
        </div>
        <Reveal>
          <div style={{ position:"relative", zIndex:1, maxWidth:680, margin:"0 auto" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:9, background:"rgba(233,168,48,0.12)", border:"1px solid rgba(233,168,48,0.28)", borderRadius:30, padding:"7px 20px", marginBottom:24 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", animation:"blink 2s infinite" }} />
              <span className="dm" style={{ fontSize:11, fontWeight:700, color:C.goldL, letterSpacing:"0.18em", textTransform:"uppercase" }}>Limited Stock Available</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.4rem,5vw,4.5rem)", fontWeight:800, color:"#fff", marginBottom:18, lineHeight:1.04, letterSpacing:"-0.02em" }}>
              Ready to Experience<br /><em style={{ color:C.goldL }}>Real Pishori?</em>
            </h2>
            <p className="dm" style={{ fontSize:16.5, color:"rgba(255,255,255,0.58)", maxWidth:440, margin:"0 auto 48px" }}>
              Order today and taste why thousands of Kenyan families and restaurants choose Lizz wa Pishori every month.
            </p>
            <div className="hrow" style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={() => openWA(null)} className="bwa" style={{ padding:"16px 36px", fontSize:14 }}><WA_SVG /> Order on WhatsApp</button>
              <button onClick={() => setOrderModal(PRODUCTS[0])} className="bgold" style={{ padding:"16px 36px", fontSize:14 }}><CART_SVG /> Place an Order</button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding:"120px 5%", background:"#fff" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <Reveal>
            <div style={{ textAlign:"center", marginBottom:66 }}>
              <div className="lbl" style={{ justifyContent:"center", marginBottom:18 }}>Get in Touch</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,3.5vw,3.4rem)", fontWeight:800, color:C.txt, letterSpacing:"-0.02em" }}>Contact <em style={{ color:C.gold }}>Lizz wa Pishori</em></h2>
              <p className="dm" style={{ fontSize:15.5, color:C.mut, marginTop:12 }}>Fastest response via WhatsApp — or fill in the form below.</p>
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64 }} className="g21">
            <Reveal>
              <div>
                {[
                  [<WA_SVG />,"WhatsApp / Calls",PHONE],
                  [<FB_SVG />,"Facebook","Lizz wa Pishori"],
                  [<IG_SVG />,"Instagram","@mwearicehub"],
                  [<TT_SVG />,"TikTok","@MweaRiceHub"],
                  [<ML_SVG />,"Email",EMAIL],
                  [<PIN_SVG />,"Location","Mwea, Kirinyaga County"],
                  [<CLK_SVG />,"Business Hours","Mon–Sat: 7AM – 8PM"],
                ].map(([Ic,label,val]) => (
                  <div key={label} style={{ display:"flex", gap:15, marginBottom:20, alignItems:"flex-start" }}>
                    <div style={{ width:44, height:44, background:C.goldP, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.gold, border:`1px solid ${C.bdr}` }}>{Ic}</div>
                    <div style={{ paddingTop:4 }}>
                      <div className="dm" style={{ fontSize:9.5, letterSpacing:"0.2em", color:C.gold, textTransform:"uppercase", fontWeight:700, marginBottom:4 }}>{label}</div>
                      <div className="dm" style={{ fontSize:15, color:C.txt, fontWeight:600 }}>{val}</div>
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", flexDirection:"column", gap:9, marginTop:16 }}>
                  <button onClick={() => openWA(null)} className="bwa" style={{ justifyContent:"center" }}><WA_SVG /> Chat on WhatsApp — {PHONE}</button>
                  <a href={FB_URL} target="_blank" rel="noreferrer" style={{ background:"#1877f2", color:"#fff", textDecoration:"none", padding:"13px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}><FB_SVG /> Follow on Facebook</a>
                  <a href={IG_URL} target="_blank" rel="noreferrer" style={{ background:"linear-gradient(135deg,#E1306C,#833AB4)", color:"#fff", textDecoration:"none", padding:"13px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}><IG_SVG /> Follow on Instagram</a>
                  <a href={TT_URL} target="_blank" rel="noreferrer" style={{ background:C.txt, color:"#fff", textDecoration:"none", padding:"13px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}><TT_SVG /> Watch on TikTok</a>
                  <a href={`mailto:${EMAIL}`} style={{ background:C.crm, color:C.gold, textDecoration:"none", padding:"13px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:9, border:`1.5px solid ${C.bdr}` }}><ML_SVG /> {EMAIL}</a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              {csent ? (
                <div style={{ textAlign:"center", padding:"64px 24px", background:C.crm, borderRadius:18 }}>
                  <div style={{ width:70, height:70, background:"#e8f5e9", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", color:"#2d7a3a" }}><CHK_SVG /></div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:C.txt, marginBottom:12 }}>Opening WhatsApp...</h3>
                  <p className="dm" style={{ fontSize:14.5, color:C.mut }}>Your message is ready. We'll reply shortly!</p>
                </div>
              ) : (
                <form onSubmit={submitContact} style={{ display:"flex", flexDirection:"column", gap:13, background:C.crm, padding:30, borderRadius:18, border:`1px solid ${C.bdr}` }}>
                  <div style={{ marginBottom:6 }}>
                    <div className="lbl" style={{ marginBottom:10 }}>Send a Message</div>
                    <p className="dm" style={{ fontSize:13, color:C.mut }}>We'll pre-fill your WhatsApp message for the fastest reply.</p>
                  </div>
                  <input style={INP} placeholder="Your Full Name *" required value={cform.name} onChange={e => setCform(p => ({...p, name:e.target.value}))} />
                  <input style={INP} type="tel" placeholder="Phone / WhatsApp *" required value={cform.phone} onChange={e => setCform(p => ({...p, phone:e.target.value}))} />
                  <textarea style={{...INP, resize:"vertical"}} rows={4} placeholder="Your message (order details, questions...)" required value={cform.msg} onChange={e => setCform(p => ({...p, msg:e.target.value}))} />
                  <button type="submit" className="bwa" style={{ justifyContent:"center", padding:"15px" }}><WA_SVG /> Send via WhatsApp <ARR_SVG /></button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#0c0904", padding:"60px 5% 32px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1.7fr 1fr 1fr", gap:50, marginBottom:46, borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:46 }} className="g31">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:16 }}>
                <div style={{ width:38, height:38, background:`linear-gradient(135deg,${C.gold},${C.goldL})`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}><WHT_SVG /></div>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:"#fff" }}>Lizz wa Pishori</div>
                  <div className="dm" style={{ fontSize:7.5, color:C.gold, letterSpacing:"0.25em", textTransform:"uppercase" }}>Premium Rice · Kenya</div>
                </div>
              </div>
              <p className="dm" style={{ fontSize:13, lineHeight:1.9, color:"rgba(255,255,255,0.28)", maxWidth:280, marginBottom:22 }}>
                Kenya's most trusted pishori supplier. Hand-sorted, stone-free, fragrant — delivered countrywide since 2009.
              </p>
              <div style={{ display:"flex", gap:9 }}>
                {[[FB_URL,"rgba(24,119,242,0.14)","rgba(24,119,242,0.3)",<FB_SVG />,"Facebook"],
                  [IG_URL,"rgba(225,48,108,0.12)","rgba(225,48,108,0.3)",<IG_SVG />,"Instagram"],
                  [TT_URL,"rgba(255,255,255,0.06)","rgba(255,255,255,0.14)",<TT_SVG />,"TikTok"],
                  [`https://wa.me/${WA_NUM}`,"rgba(37,211,102,0.1)","rgba(37,211,102,0.28)",<WA_SVG />,"WhatsApp"]
                ].map(([href,bg,border,Ic,label]) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                    style={{ width:36, height:36, borderRadius:9, background:bg, border:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", color:"rgba(255,255,255,0.6)", transition:"transform 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>{Ic}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="dm" style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:C.gold, fontWeight:700, marginBottom:20 }}>Quick Links</div>
              {NAV_ITEMS.map(l => (
                <button key={l} onClick={() => scrollTo(l)} style={{ display:"block", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.3)", fontFamily:"'DM Sans',sans-serif", fontSize:13.5, marginBottom:11, padding:0, transition:"color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.75)"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}>{l}</button>
              ))}
            </div>
            <div>
              <div className="dm" style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:C.gold, fontWeight:700, marginBottom:20 }}>Contact</div>
              {[[<WA_SVG />,PHONE],[<FB_SVG />,"Lizz wa Pishori"],[<IG_SVG />,"@mwearicehub"],[<ML_SVG />,EMAIL],[<PIN_SVG />,"Mwea, Kirinyaga County"],[<CLK_SVG />,"Mon–Sat: 7AM – 8PM"]].map(([Ic,val]) => (
                <div key={val} style={{ display:"flex", gap:9, marginBottom:13, alignItems:"flex-start" }}>
                  <span style={{ color:C.gold, flexShrink:0, marginTop:1 }}>{Ic}</span>
                  <span className="dm" style={{ fontSize:13, color:"rgba(255,255,255,0.28)", lineHeight:1.6 }}>{val}</span>
                </div>
              ))}
              <button onClick={() => openWA(null)} className="bwa" style={{ marginTop:16, padding:"10px 18px", fontSize:12 }}><WA_SVG /> Order Now</button>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <span className="dm" style={{ fontSize:11.5, color:"rgba(255,255,255,0.15)" }}>© {new Date().getFullYear()} Lizz wa Pishori. All rights reserved.</span>
            <span className="dm" style={{ fontSize:11.5, color:"rgba(255,255,255,0.15)" }}>Kenya's Finest Pishori · Countrywide Delivery</span>
          </div>
        </div>
      </footer>

      {/* ── ORDER MODAL ── */}
      {orderModal && (
        <div onClick={() => setOrderModal(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(10px)", animation:"fadeIn 0.18s ease" }}>
          <div onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" style={{ background:"#fff", borderRadius:22, padding:"34px 30px", maxWidth:440, width:"100%", boxShadow:"0 50px 120px rgba(0,0,0,0.3)", animation:"fadeUp 0.26s cubic-bezier(0.34,1.56,0.64,1)", maxHeight:"90vh", overflowY:"auto" }}>
            {orderDone ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ width:72, height:72, background:"#e8f5e9", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", color:"#2d7a3a" }}><CHK_SVG /></div>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:C.txt, marginBottom:12 }}>Opening WhatsApp!</h3>
                <p className="dm" style={{ fontSize:15, color:C.mut, lineHeight:1.8 }}>Your order is pre-filled. We'll confirm and arrange delivery.</p>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
                  <div>
                    <div className="dm" style={{ fontSize:10, letterSpacing:"0.2em", color:C.gold, textTransform:"uppercase", fontWeight:700, marginBottom:5 }}>Place Order</div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:800, color:C.txt }}>{orderModal.name}</h3>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:800, color:C.gold, marginTop:2 }}>{orderModal.price}</div>
                  </div>
                  <button onClick={() => setOrderModal(null)} aria-label="Close modal" style={{ background:C.crm, border:"none", cursor:"pointer", borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:C.mut, flexShrink:0 }}><X_SVG /></button>
                </div>
                <button onClick={() => openWA(orderModal)} className="bwa" style={{ width:"100%", justifyContent:"center", marginBottom:18, padding:"14px" }}>
                  <WA_SVG /> Quick Order via WhatsApp
                </button>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
                  <div style={{ flex:1, height:1, background:C.bdr }} />
                  <span className="dm" style={{ fontSize:11.5, color:C.mut }}>or fill the form</span>
                  <div style={{ flex:1, height:1, background:C.bdr }} />
                </div>
                <form onSubmit={submitOrder} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <input style={INP} placeholder="Full Name *" required value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))} />
                  <input style={INP} type="tel" placeholder="Phone / WhatsApp *" required value={form.phone} onChange={e => setForm(p => ({...p, phone:e.target.value}))} />
                  <input style={INP} placeholder="County / Town *" required value={form.county} onChange={e => setForm(p => ({...p, county:e.target.value}))} />
                  <input style={INP} placeholder="Quantity (e.g. 2 bags)" value={form.qty} onChange={e => setForm(p => ({...p, qty:e.target.value}))} />
                  <div style={{ display:"flex", gap:9, marginTop:6 }}>
                    <button type="button" onClick={() => setOrderModal(null)} className="bghst" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
                    <button type="submit" className="bgold" style={{ flex:2, justifyContent:"center" }}>Confirm Order <ARR_SVG /></button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

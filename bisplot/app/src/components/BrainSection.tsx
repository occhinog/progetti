import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { LogoMark } from './Logo';

/* ------------------------------------------------------------------------------------------------
 * Business Second Brain — an interactive animation of a company's operating "brain".
 *
 * Story: six departments drift in disorder (fragmentation) → the AI core wakes up and pulls them
 * into formation while connections reach out to them (connection) → the core ignites and sends each
 * department a concrete result (intelligence) → the network runs on its own (automation).
 *
 * Layers: a <canvas> underneath draws light — grid, particle field, bloom, shockwave, comet-trailed
 * data packets (additive blending). The SVG on top carries the structure: connections, departments,
 * core, text (crisp, focusable, accessible). One requestAnimationFrame loop drives both; it only
 * runs while the scene is on screen. prefers-reduced-motion gets the finished scene, static.
 * ---------------------------------------------------------------------------------------------- */

type Dept = { label: string; output: string };

// Clockwise from the top. The order drives every staggered effect.
const DEPTS: Dept[] = [
  { label: 'FINANCE', output: 'Cash flow forecast' },
  { label: 'OPERATIONS', output: 'Workflow automatizzati' },
  { label: 'MARKETING', output: 'Campagne ottimizzate' },
  { label: 'KNOWLEDGE', output: 'Memoria aziendale' },
  { label: 'HR', output: 'Knowledge management' },
  { label: 'SALES', output: 'Lead qualificati' },
];

const PHASES = [
  {
    number: '01',
    name: 'Frammentazione',
    start: 0,
    end: 5,
    caption: 'I reparti lavorano separati: ognuno va per conto suo e produce piccoli pacchetti di dati che non arrivano da nessuna parte.',
  },
  {
    number: '02',
    name: 'Connessione',
    start: 5,
    end: 10.5,
    caption: 'Il nucleo AI si accende, mette in ordine i reparti e li collega uno a uno. I dati iniziano a viaggiare lungo le connessioni.',
  },
  {
    number: '03',
    name: 'Intelligenza',
    start: 10.5,
    end: 15.5,
    caption: 'Il nucleo elabora le informazioni e restituisce a ogni reparto un risultato concreto.',
  },
  {
    number: '04',
    name: 'Automazione',
    start: 15.5,
    end: 18.5,
    caption: 'Ciclo continuo: i dati attraversano la rete e il nucleo AI coordina i processi, a ogni battito.',
  },
] as const;

const P2 = PHASES[1].start;
const P3 = PHASES[2].start;
const P4 = PHASES[3].start;
const STATIC_T = PHASES[3].end;

// Choreography
const nodeSettle = (i: number) => P2 + 0.35 + i * 0.16; // chaos → formation
const SETTLE_DUR = 1.7;
const spokeStart = (i: number) => P2 + 1.2 + i * 0.32; // connection reaches out from the core
const SPOKE_DUR = 1.0;
const connectedAt = (i: number) => spokeStart(i) + SPOKE_DUR;
const resultSpawn = (i: number) => P3 + 0.6 + i * 0.42;
const OUT_DUR = 1.0;
const resultArrival = (i: number) => resultSpawn(i) + OUT_DUR;
const TYPE_DUR = 0.55;
const WAVE_DUR = 2.4;
const FLASH_DUR = 0.75;
const easeOutQuad = (p: number) => 1 - (1 - p) * (1 - p);
const SYNC_EVERY = 6;

const IN_DUR = 1.25;
const DRIFT_DUR = 1.5;
const PEER_DUR = 2.0;
const SYNC_DUR = 0.75;
const MAX_PACKETS = 240;

/* ---------------------------------------- layouts ---------------------------------------- */

type Pt = { x: number; y: number };
type NodeLayout = { home: Pt; chaos: Pt; label: Pt; output: Pt; anchor: 'start' | 'middle' | 'end' };
type Layout = {
  kind: 'wide' | 'tall';
  w: number;
  h: number;
  core: Pt;
  coreR: number;
  rings: [number, number];
  markH: number;
  nodeR: number;
  labelSize: number;
  outputSize: number;
  wander: number;
  particles: number;
  nodes: NodeLayout[]; // label/output are offsets from the node centre
  links: [number, number][];
};

const side = (dir: 1 | -1, size: 'wide' | 'tall') =>
  size === 'wide'
    ? { label: { x: 44 * dir, y: -5 }, output: { x: 44 * dir, y: 20 }, anchor: dir === 1 ? ('start' as const) : ('end' as const) }
    : { label: { x: 0, y: -50 }, output: { x: 0, y: -29 }, anchor: 'middle' as const };

const WIDE: Layout = {
  kind: 'wide',
  w: 1200,
  h: 720,
  core: { x: 600, y: 360 },
  coreR: 56,
  rings: [80, 104],
  markH: 38,
  nodeR: 15,
  labelSize: 12.5,
  outputSize: 17,
  wander: 16,
  particles: 130,
  nodes: [
    { home: { x: 600, y: 122 }, chaos: { x: 500, y: 196 }, label: { x: 0, y: -60 }, output: { x: 0, y: -35 }, anchor: 'middle' },
    { home: { x: 900, y: 240 }, chaos: { x: 860, y: 132 }, ...side(1, 'wide') },
    { home: { x: 900, y: 480 }, chaos: { x: 805, y: 578 }, ...side(1, 'wide') },
    { home: { x: 600, y: 598 }, chaos: { x: 690, y: 492 }, label: { x: 0, y: 50 }, output: { x: 0, y: 75 }, anchor: 'middle' },
    { home: { x: 300, y: 480 }, chaos: { x: 365, y: 606 }, ...side(-1, 'wide') },
    { home: { x: 300, y: 240 }, chaos: { x: 252, y: 335 }, ...side(-1, 'wide') },
  ],
  links: [
    [5, 1],
    [4, 2],
  ],
};

const below = { label: { x: 0, y: 46 }, output: { x: 0, y: 67 }, anchor: 'middle' as const };

const TALL: Layout = {
  kind: 'tall',
  w: 420,
  h: 700,
  core: { x: 210, y: 350 },
  coreR: 40,
  rings: [56, 72],
  markH: 28,
  nodeR: 12,
  labelSize: 11,
  outputSize: 13,
  wander: 10,
  particles: 70,
  nodes: [
    { home: { x: 210, y: 114 }, chaos: { x: 150, y: 146 }, label: { x: 0, y: -56 }, output: { x: 0, y: -34 }, anchor: 'middle' },
    { home: { x: 335, y: 228 }, chaos: { x: 318, y: 156 }, ...side(1, 'tall') },
    { home: { x: 335, y: 472 }, chaos: { x: 300, y: 556 }, ...below },
    { home: { x: 210, y: 588 }, chaos: { x: 232, y: 466 }, ...below },
    { home: { x: 85, y: 472 }, chaos: { x: 108, y: 600 }, ...below },
    { home: { x: 85, y: 228 }, chaos: { x: 112, y: 300 }, ...side(-1, 'tall') },
  ],
  links: [
    [5, 1],
    [4, 2],
  ],
};

const WIDE_MIN_WIDTH = 960;

/* ---------------------------------------- helpers ---------------------------------------- */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeOutBack = (p: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

type PacketKind = 'drift' | 'in' | 'out' | 'peer' | 'sync';
type Packet = { kind: PacketKind; node: number; peer: number; t0: number; dur: number; ox: number; oy: number; dx: number; dy: number };
type Particle = { x: number; y: number; vx: number; vy: number; z: number };

const TRAIL: Record<PacketKind, number> = { drift: 0.35, in: 0.24, out: 0.32, peer: 0.18, sync: 0.28 };
const WIDTH: Record<PacketKind, number> = { drift: 1, in: 1.5, out: 3, peer: 1.2, sync: 2.2 };
const HEAD: Record<PacketKind, number> = { drift: 7, in: 13, out: 36, peer: 9, sync: 24 };

const ICE = '#DFEBF6';

function makeSprite(rgb: string): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.18, `rgba(${rgb},0.9)`);
    grad.addColorStop(0.45, `rgba(${rgb},0.25)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  return c;
}

/* ---------------------------------------- component ---------------------------------------- */

export default function BrainSection() {
  const [layout, setLayout] = useState<Layout>(WIDE);
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  // Simulation state (refs: the loop never re-renders React)
  const tRef = useRef(0);
  const startedRef = useRef(false);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);
  const activeRef = useRef<number | null>(null);
  const layoutRef = useRef<Layout>(WIDE);
  const phaseRef = useRef(0);
  const packets = useRef<Packet[]>([]);
  const particles = useRef<Particle[]>([]);
  const pos = useRef<Pt[]>(WIDE.nodes.map((n) => n.home));
  const resultsDone = useRef<boolean[]>(DEPTS.map(() => false));
  const connectedDone = useRef<boolean[]>(DEPTS.map(() => false));
  const igniteDone = useRef(false);
  const waveHit = useRef<boolean[]>(DEPTS.map(() => false));
  const nextSync = useRef(P4 + 1.5);
  const mix = useRef<number[]>(DEPTS.map(() => 0));
  const flash = useRef<number[]>(DEPTS.map(() => 0));
  const lastHit = useRef<number[]>(DEPTS.map(() => -10));
  const typed = useRef<number[]>(DEPTS.map(() => -1));
  const coreFlash = useRef(0);
  const ringAngle = useRef(0);
  const pointer = useRef({ x: 0, y: 0, on: false });
  const parallax = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const pointerType = useRef('mouse');
  const geo = useRef({ k: 1, ox: 0, oy: 0, cw: 0, ch: 0, dpr: 1 }); // canvas ↔ viewBox mapping

  // Elements
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLCanvasElement | null>(null);
  const sprites = useRef<{ ice: HTMLCanvasElement; warm: HTMLCanvasElement } | null>(null);
  const coreRef = useRef<SVGGElement>(null);
  const coreDiscRef = useRef<SVGCircleElement>(null);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const spokeRefs = useRef<(SVGPathElement | null)[]>([]);
  const linkRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const focusRefs = useRef<(SVGCircleElement | null)[]>([]);
  const labelRefs = useRef<(SVGTextElement | null)[]>([]);
  const outputRefs = useRef<(SVGTextElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* ----------------------------- simulation ----------------------------- */

  const seedParticles = useCallback(() => {
    const L = layoutRef.current;
    const { k, ox, oy, cw, ch } = geo.current;
    const x0 = -ox / k;
    const y0 = -oy / k;
    const x1 = (cw - ox) / k;
    const y1 = (ch - oy) / k;
    particles.current = Array.from({ length: L.particles }, () => ({
      x: x0 + Math.random() * (x1 - x0),
      y: y0 + Math.random() * (y1 - y0),
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      z: 0.25 + Math.random() * 0.75,
    }));
  }, []);

  const spawn = useCallback((kind: PacketKind, node: number, t0: number, peer = -1) => {
    if (packets.current.length >= MAX_PACKETS) return;
    const L = layoutRef.current;
    const p = pos.current[node];
    const a = Math.random() * Math.PI * 2;
    const d = (L.kind === 'wide' ? 28 : 18) + Math.random() * (L.kind === 'wide' ? 30 : 18);
    const dur =
      kind === 'in' ? IN_DUR : kind === 'out' ? OUT_DUR : kind === 'drift' ? DRIFT_DUR : kind === 'peer' ? PEER_DUR : SYNC_DUR;
    packets.current.push({ kind, node, peer, t0, dur, ox: p.x, oy: p.y, dx: Math.cos(a) * d, dy: Math.sin(a) * d });
  }, []);

  const burst = useCallback(
    (i: number) => {
      if (reducedRef.current) return;
      startedRef.current = true;
      const t = tRef.current;
      spawn('in', i, t);
      spawn('in', i, t + 0.2);
      spawn('out', i, t + IN_DUR + 0.05);
    },
    [spawn],
  );

  const burstAll = useCallback(() => {
    if (reducedRef.current) return;
    startedRef.current = true;
    const t = tRef.current;
    coreFlash.current = 1;
    DEPTS.forEach((_, i) => spawn('out', i, t + i * 0.06));
  }, [spawn]);

  /** Draw the light layer (canvas). Coordinates are viewBox units. */
  const drawCanvas = useCallback((t: number, simDt: number, uiDt: number, animate: boolean) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const spr = sprites.current;
    if (!canvas || !ctx || !spr) return;
    const L = layoutRef.current;
    const { k, ox, oy, cw, ch, dpr } = geo.current;
    if (!cw) return;
    const C = L.core;

    // parallax easing
    const px = parallax.current;
    const pe = uiDt > 0 ? Math.min(1, uiDt * 3) : 1;
    px.x += (px.tx - px.x) * pe;
    px.y += (px.ty - px.y) * pe;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // grid (pre-rendered), with a whisper of parallax
    if (gridRef.current) ctx.drawImage(gridRef.current, px.x * 4 * dpr, px.y * 4 * dpr);

    ctx.setTransform(k * dpr, 0, 0, k * dpr, ox * dpr, oy * dpr);
    ctx.globalCompositeOperation = 'lighter';

    // ---- core bloom: cool while waking, warm ember after ignition
    const wake = animate ? clamp01((t - P2) / 1.2) : 1;
    const ign = animate ? clamp01((t - P3) / 0.6) : 1;
    const beat = animate && t >= P4 ? 0.5 + 0.5 * Math.sin(t * 1.8) : 0.5;
    const bloom = 0.18 + 0.35 * wake + 0.3 * ign + 0.35 * coreFlash.current + 0.08 * beat;
    const R = L.coreR * 5.2;
    let g = ctx.createRadialGradient(C.x, C.y, L.coreR * 0.6, C.x, C.y, R);
    g.addColorStop(0, `rgba(223,235,246,${(0.2 * bloom).toFixed(3)})`);
    g.addColorStop(0.35, `rgba(223,235,246,${(0.07 * bloom).toFixed(3)})`);
    g.addColorStop(1, 'rgba(223,235,246,0)');
    ctx.fillStyle = g;
    ctx.fillRect(C.x - R, C.y - R, R * 2, R * 2);
    if (ign > 0) {
      const RW = L.coreR * 2.6;
      g = ctx.createRadialGradient(C.x, C.y, L.coreR * 0.8, C.x, C.y, RW);
      g.addColorStop(0, `rgba(217,107,67,${(0.22 * ign * (0.75 + 0.25 * beat + 0.4 * coreFlash.current)).toFixed(3)})`);
      g.addColorStop(1, 'rgba(217,107,67,0)');
      ctx.fillStyle = g;
      ctx.fillRect(C.x - RW, C.y - RW, RW * 2, RW * 2);
    }

    // ---- cursor light
    const pt = pointer.current;
    if (pt.on && animate) {
      const RC = L.kind === 'wide' ? 170 : 110;
      g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, RC);
      g.addColorStop(0, 'rgba(223,235,246,0.07)');
      g.addColorStop(1, 'rgba(223,235,246,0)');
      ctx.fillStyle = g;
      ctx.fillRect(pt.x - RC, pt.y - RC, RC * 2, RC * 2);
    }

    // ---- ignition shockwave + grid wave
    const age = t - P3;
    const maxR = Math.hypot(L.w, L.h) * 0.62;
    if (animate && age >= 0 && age < FLASH_DUR) {
      // ignition flash: a burst of light out of the core
      const f = age / FLASH_DUR;
      const RF = L.coreR * (1.6 + 4.5 * easeOut(f));
      g = ctx.createRadialGradient(C.x, C.y, 0, C.x, C.y, RF);
      g.addColorStop(0, `rgba(255,255,255,${(0.75 * (1 - f)).toFixed(3)})`);
      g.addColorStop(0.35, `rgba(236,160,128,${(0.35 * (1 - f)).toFixed(3)})`);
      g.addColorStop(1, 'rgba(223,235,246,0)');
      ctx.fillStyle = g;
      ctx.fillRect(C.x - RF, C.y - RF, RF * 2, RF * 2);
    }
    if (animate && age >= 0 && age < WAVE_DUR) {
      const q = age / WAVE_DUR;
      const r = easeOutQuad(q) * maxR;
      const a = Math.pow(1 - q, 1.4);
      ctx.beginPath();
      ctx.arc(C.x, C.y, r, 0, Math.PI * 2);
      ctx.lineWidth = 46;
      ctx.strokeStyle = `rgba(223,235,246,${(a * 0.07).toFixed(3)})`;
      ctx.stroke();
      ctx.lineWidth = 14;
      ctx.strokeStyle = `rgba(223,235,246,${(a * 0.16).toFixed(3)})`;
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(255,255,255,${(a * 0.95).toFixed(3)})`;
      ctx.stroke();
      ctx.lineWidth = 4;
      ctx.strokeStyle = `rgba(217,107,67,${(a * 0.45).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(C.x, C.y, Math.max(0, r - 14), 0, Math.PI * 2);
      ctx.stroke();
      // grid dots light up as the front passes
      ctx.fillStyle = `rgba(223,235,246,${(0.85 * a).toFixed(3)})`;
      const gx0 = Math.floor(-ox / k / 24) * 24;
      const gy0 = Math.floor(-oy / k / 24) * 24;
      for (let gx = gx0; gx < (cw - ox) / k; gx += 24) {
        for (let gy = gy0; gy < (ch - oy) / k; gy += 24) {
          const dd = Math.abs(Math.hypot(gx - C.x, gy - C.y) - r);
          if (dd < 44) {
            const s = 1.2 + 2.2 * (1 - dd / 44);
            ctx.fillRect(gx - s / 2, gy - s / 2, s, s);
          }
        }
      }
    }

    // ---- particle field: drift → orbit the core once it wakes; the cursor pushes them away
    const orbit = animate ? clamp01((t - P2) / 3) : 1;
    const x0 = -ox / k;
    const y0 = -oy / k;
    const x1 = (cw - ox) / k;
    const y1 = (ch - oy) / k;
    for (const p of particles.current) {
      if (simDt > 0) {
        p.vx += (Math.random() - 0.5) * 14 * simDt;
        p.vy += (Math.random() - 0.5) * 14 * simDt;
        if (orbit > 0) {
          const dx = p.x - C.x;
          const dy = p.y - C.y;
          const d = Math.hypot(dx, dy) || 1;
          const f = 9 * orbit * p.z;
          p.vx += (-dy / d) * f * simDt;
          p.vy += (dx / d) * f * simDt;
          const ideal = (L.kind === 'wide' ? 260 : 150) * (0.6 + p.z * 0.8);
          const pull = ((d - ideal) / ideal) * 6 * orbit;
          p.vx -= (dx / d) * pull * simDt;
          p.vy -= (dy / d) * pull * simDt;
        }
        if (pt.on) {
          const cx = p.x - pt.x;
          const cy = p.y - pt.y;
          const cd = Math.hypot(cx, cy);
          const RR = L.kind === 'wide' ? 120 : 80;
          if (cd < RR && cd > 0.01) {
            const push = (1 - cd / RR) * 220;
            p.vx += (cx / cd) * push * simDt;
            p.vy += (cy / cd) * push * simDt;
          }
        }
        p.vx *= 1 - 1.2 * simDt;
        p.vy *= 1 - 1.2 * simDt;
        p.x += p.vx * simDt;
        p.y += p.vy * simDt;
        if (p.x < x0) p.x = x1;
        else if (p.x > x1) p.x = x0;
        if (p.y < y0) p.y = y1;
        else if (p.y > y1) p.y = y0;
      }
      const s = 0.8 + p.z * 1.5;
      ctx.fillStyle = `rgba(223,235,246,${(0.1 + 0.32 * p.z).toFixed(3)})`;
      ctx.fillRect(p.x + px.x * p.z * 14 - s / 2, p.y + px.y * p.z * 10 - s / 2, s, s);
    }

    // ---- connection sparks: a bright point leads each connection as it reaches out
    if (animate) {
      DEPTS.forEach((_, i) => {
        const q = (t - spokeStart(i)) / SPOKE_DUR;
        if (q <= 0 || q >= 1.08) return;
        const e = clamp01(q);
        const n = pos.current[i];
        const x = C.x + (n.x - C.x) * e;
        const y = C.y + (n.y - C.y) * e;
        const s = 34 * (q < 1 ? 1 : (1.08 - q) / 0.08);
        ctx.drawImage(spr.ice, x - s / 2, y - s / 2, s, s);
      });
    }

    // ---- data packets with comet trails
    const act = activeRef.current;
    for (const p of packets.current) {
      const raw = (t - p.t0) / p.dur;
      if (raw < 0 || raw >= 1) continue;
      const n = pos.current[p.node];
      let fx = p.ox;
      let fy = p.oy;
      let tx = p.ox + p.dx;
      let ty = p.oy + p.dy;
      if (p.kind === 'in') {
        fx = n.x;
        fy = n.y;
        tx = C.x;
        ty = C.y;
      } else if (p.kind === 'out' || p.kind === 'sync') {
        fx = C.x;
        fy = C.y;
        tx = n.x;
        ty = n.y;
      } else if (p.kind === 'peer') {
        const m = pos.current[p.peer];
        fx = n.x;
        fy = n.y;
        tx = m.x;
        ty = m.y;
      }
      const ease = p.kind === 'drift' ? easeOut : easeInOut;
      const eh = ease(raw);
      const et = ease(Math.max(0, raw - TRAIL[p.kind]));
      const hx = fx + (tx - fx) * eh;
      const hy = fy + (ty - fy) * eh;
      const sx = fx + (tx - fx) * et;
      const sy = fy + (ty - fy) * et;
      const fade = p.kind === 'drift' ? Math.sin(Math.PI * raw) : Math.min(1, raw * 7, (1 - raw) * 7);
      const dim = act !== null && act !== p.node && act !== p.peer ? 0.35 : 1;
      const alpha = fade * dim * (p.kind === 'drift' ? 0.55 : p.kind === 'peer' ? 0.6 : 1);
      if (Math.abs(hx - sx) + Math.abs(hy - sy) > 0.5) {
        const lg = ctx.createLinearGradient(sx, sy, hx, hy);
        lg.addColorStop(0, 'rgba(223,235,246,0)');
        lg.addColorStop(1, `rgba(223,235,246,${((p.kind === 'out' ? 0.95 : 0.75) * alpha).toFixed(3)})`);
        ctx.strokeStyle = lg;
        ctx.lineWidth = WIDTH[p.kind];
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(hx, hy);
        ctx.stroke();
      }
      const hs = HEAD[p.kind] * (L.kind === 'wide' ? 1 : 0.8);
      ctx.globalAlpha = alpha;
      ctx.drawImage(p.kind === 'out' && t < P4 ? spr.warm : spr.ice, hx - hs / 2, hy - hs / 2, hs, hs);
      ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  /** Write one frame: simulation, SVG attributes, canvas. */
  const renderFrame = useCallback(
    (simDt: number, uiDt: number) => {
      const L = layoutRef.current;
      const t = tRef.current;
      const animate = !reducedRef.current;
      const act = activeRef.current;
      const anyActive = act !== null;
      const C = L.core;

      // phase bookkeeping (React state only when it changes)
      let ph = 0;
      for (let k = 0; k < PHASES.length; k++) if (t >= PHASES[k].start) ph = k;
      if (ph !== phaseRef.current) {
        phaseRef.current = ph;
        setPhase(ph);
      }
      PHASES.forEach((p, k) => {
        const bar = barRefs.current[k];
        if (bar) bar.style.transform = `scaleX(${clamp01((t - p.start) / (p.end - p.start))})`;
      });

      // node positions: chaos → formation
      pos.current = L.nodes.map((n, i) => {
        if (!animate) return n.home;
        const s = easeInOut(clamp01((t - nodeSettle(i)) / SETTLE_DUR));
        const w = L.wander * (1 - s);
        const cx = n.chaos.x + Math.sin(t * 0.55 + i * 1.3) * w;
        const cy = n.chaos.y + Math.cos(t * 0.47 + i * 2.1) * w * 0.7;
        return { x: cx + (n.home.x - cx) * s, y: cy + (n.home.y - cy) * s };
      });

      // highlight smoothing & decays
      const km = uiDt > 0 ? Math.min(1, uiDt * 10) : 1;
      DEPTS.forEach((_, i) => {
        mix.current[i] += ((act === i ? 1 : 0) - mix.current[i]) * km;
        flash.current[i] = Math.max(0, flash.current[i] - simDt * 1.5);
      });
      coreFlash.current = Math.max(0, coreFlash.current - simDt * 1.8);

      // events & spawns
      if (simDt > 0) {
        DEPTS.forEach((_, i) => {
          const connected = t >= connectedAt(i);
          if (connected && !connectedDone.current[i]) {
            connectedDone.current[i] = true;
            lastHit.current[i] = t;
            flash.current[i] = 0.8;
          }
          if (t > 0.3 + i * 0.12 && !connected && Math.random() < 1.6 * simDt) spawn('drift', i, t);
          if (connected) {
            const rate = t < P3 ? 0.85 : t < P4 ? 0.5 : 0.6;
            if (Math.random() < rate * simDt) spawn('in', i, t);
          }
          if (!resultsDone.current[i] && t >= resultSpawn(i)) {
            resultsDone.current[i] = true;
            spawn('out', i, resultSpawn(i));
          }
        });
        if (!igniteDone.current && t >= P3) {
          igniteDone.current = true;
          coreFlash.current = 1;
          for (const p of particles.current) {
            const dx = p.x - C.x;
            const dy = p.y - C.y;
            const d = Math.hypot(dx, dy) || 1;
            const kick = (L.kind === 'wide' ? 260 : 160) * p.z;
            p.vx += (dx / d) * kick;
            p.vy += (dy / d) * kick;
          }
        }
        if (t >= P3 && t < P3 + WAVE_DUR) {
          const r = easeOutQuad((t - P3) / WAVE_DUR) * Math.hypot(L.w, L.h) * 0.62;
          DEPTS.forEach((_, i) => {
            const P = pos.current[i];
            if (!waveHit.current[i] && Math.hypot(P.x - C.x, P.y - C.y) <= r) {
              waveHit.current[i] = true;
              lastHit.current[i] = t;
              flash.current[i] = 1;
            }
          });
        }
        if (t >= P4) {
          if (Math.random() < 0.7 * simDt) spawn('out', Math.floor(Math.random() * DEPTS.length), t);
          L.links.forEach(([a, b]) => {
            if (Math.random() < 0.4 * simDt) {
              if (Math.random() < 0.5) spawn('peer', a, t, b);
              else spawn('peer', b, t, a);
            }
          });
          if (t >= nextSync.current) {
            nextSync.current = t + SYNC_EVERY;
            coreFlash.current = Math.min(1, coreFlash.current + 0.7);
            DEPTS.forEach((_, i) => spawn('sync', i, t));
          }
        }
      }

      // retire packets, apply arrivals
      const alive: Packet[] = [];
      for (const p of packets.current) {
        if ((t - p.t0) / p.dur >= 1) {
          if (p.kind === 'in') {
            coreFlash.current = Math.min(1, coreFlash.current + 0.22);
            if (t >= P4 && Math.random() < 0.3) {
              const other = (p.node + 1 + Math.floor(Math.random() * (DEPTS.length - 1))) % DEPTS.length;
              spawn('out', other, t);
            }
          } else if (p.kind === 'out' || p.kind === 'sync') {
            lastHit.current[p.node] = t;
            flash.current[p.node] = 1;
          } else if (p.kind === 'peer') {
            lastHit.current[p.peer] = t;
          }
          continue;
        }
        alive.push(p);
      }
      packets.current = alive;

      // ---- SVG: core wakes up (scale + opacity); rings spin up at ignition
      const wake = animate ? clamp01((t - P2) / 0.9) : 1;
      const scale = animate ? 0.72 + 0.28 * easeOutBack(wake) : 1;
      coreRef.current?.setAttribute('transform', `translate(${C.x} ${C.y}) scale(${scale.toFixed(4)}) translate(${-C.x} ${-C.y})`);
      coreRef.current?.setAttribute('opacity', (0.5 + 0.5 * wake).toFixed(3));
      coreDiscRef.current?.setAttribute('stroke-opacity', Math.min(1, 0.3 + 0.45 * coreFlash.current + (t >= P3 ? 0.15 : 0)).toFixed(3));
      if (animate) {
        const speed = 5 + 30 * clamp01((t - P3) / 1.2) * (t < P4 ? 1 : 0.5) + 6 * wake;
        ringAngle.current = (ringAngle.current + simDt * speed) % 360;
      }
      ringRefs.current.forEach((r, j) => {
        r?.setAttribute('transform', `rotate(${((j === 0 ? 1 : -0.6) * ringAngle.current).toFixed(2)} ${C.x} ${C.y})`);
        r?.setAttribute('opacity', (0.35 + 0.65 * wake).toFixed(3));
      });

      // ---- SVG: departments
      DEPTS.forEach((d, i) => {
        const P = pos.current[i];
        const m = mix.current[i];
        const dim = anyActive && act !== i ? 1 : 0;
        const appear = animate ? clamp01((t - 0.15 - i * 0.12) / 0.6) : 1;
        const node = nodeRefs.current[i];
        if (node) {
          node.setAttribute('transform', `translate(${P.x.toFixed(2)} ${P.y.toFixed(2)})`);
          node.setAttribute('opacity', appear.toFixed(3));
        }

        const spoke = spokeRefs.current[i];
        if (spoke) {
          spoke.setAttribute('d', `M${C.x} ${C.y}L${P.x.toFixed(2)} ${P.y.toFixed(2)}`);
          const prog = animate ? Math.max(clamp01((t - spokeStart(i)) / SPOKE_DUR), m) : 1;
          spoke.setAttribute('stroke-dashoffset', (1 - prog).toFixed(4));
          const alpha = (0.22 + 0.55 * m + (t >= P3 ? 0.1 : 0) + 0.25 * flash.current[i]) * (1 - 0.6 * dim);
          spoke.setAttribute('opacity', Math.min(1, alpha).toFixed(3));
        }

        // typewriter output
        const out = outputRefs.current[i];
        if (out) {
          const tp = animate ? clamp01((t - resultArrival(i)) / TYPE_DUR) : 1;
          const n = Math.max(m > 0.5 ? d.output.length : 0, Math.round(tp * d.output.length));
          if (n !== typed.current[i]) {
            typed.current[i] = n;
            out.textContent = d.output.slice(0, n);
          }
          const vis = Math.max(tp > 0 ? 1 : 0, m);
          out.setAttribute('opacity', (vis * (0.82 + 0.18 * Math.max(flash.current[i], m)) * (1 - 0.65 * dim)).toFixed(3));
        }
        labelRefs.current[i]?.setAttribute('opacity', ((0.6 + 0.4 * Math.max(m, flash.current[i] * 0.6)) * (1 - 0.5 * dim)).toFixed(3));
        dotRefs.current[i]?.setAttribute('r', ((L.kind === 'wide' ? 4.6 : 3.8) + 1.6 * m + 1.6 * flash.current[i]).toFixed(2));
        focusRefs.current[i]?.setAttribute('opacity', (m * 0.9).toFixed(3));

        const pulse = pulseRefs.current[i];
        if (pulse) {
          let r = L.nodeR;
          let o = 0;
          if (animate) {
            const period = 1.6 + (i % 3) * 0.3;
            const q = ((t + i * 0.47) % period) / period;
            const amp = t < P2 ? 0.5 : t < P3 ? 0.22 : 0.1;
            r = L.nodeR + (L.kind === 'wide' ? 12 : 9) * q;
            o = amp * (1 - q) * appear;
            const h = (t - lastHit.current[i]) / 0.9;
            if (h >= 0 && h < 1 && 0.75 * (1 - h) > o) {
              r = L.nodeR + (L.kind === 'wide' ? 20 : 13) * easeOut(h);
              o = 0.75 * (1 - h);
            }
          }
          pulse.setAttribute('r', r.toFixed(2));
          pulse.setAttribute('opacity', o.toFixed(3));
        }
      });

      // peripheral links (phase 4)
      L.links.forEach(([a, b], j) => {
        const l = linkRefs.current[j];
        if (!l) return;
        const A = pos.current[a];
        const B = pos.current[b];
        l.setAttribute('d', `M${A.x.toFixed(1)} ${A.y.toFixed(1)}L${B.x.toFixed(1)} ${B.y.toFixed(1)}`);
        l.setAttribute('opacity', (clamp01((t - P4) / 1.5) * 0.3 * (anyActive ? 0.5 : 1)).toFixed(3));
      });

      drawCanvas(t, simDt, uiDt, animate);
    },
    [spawn, drawCanvas],
  );

  /** Move the timeline to `t`, keeping one-shot events consistent. */
  const seek = useCallback(
    (t: number) => {
      tRef.current = t;
      packets.current = [];
      resultsDone.current = DEPTS.map((_, i) => t >= resultSpawn(i));
      connectedDone.current = DEPTS.map((_, i) => t >= connectedAt(i));
      igniteDone.current = t >= P3;
      waveHit.current = DEPTS.map(() => t >= P3 + WAVE_DUR);
      nextSync.current = Math.max(P4 + 1.5, t + 1.5);
      lastHit.current = DEPTS.map(() => -10);
      flash.current = DEPTS.map(() => 0);
      coreFlash.current = 0;
      renderFrame(0, 0);
    },
    [renderFrame],
  );

  /* ----------------------------- canvas geometry ----------------------------- */

  const fitCanvas = useCallback(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const L = layoutRef.current;
    const sw = stage.clientWidth;
    if (!sw) return;
    const sh = (sw * L.h) / L.w;
    const bx = Math.round(sw * (L.kind === 'wide' ? 0.07 : 0.05));
    const by = Math.round(sh * 0.07);
    const cw = sw + bx * 2;
    const ch = sh + by * 2;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.style.left = `${-bx}px`;
    canvas.style.top = `${-by}px`;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    const k = sw / L.w;
    geo.current = { k, ox: bx, oy: by, cw, ch, dpr };

    // pre-render the dot grid
    const grid = gridRef.current ?? document.createElement('canvas');
    gridRef.current = grid;
    grid.width = canvas.width;
    grid.height = canvas.height;
    const g = grid.getContext('2d');
    if (g) {
      g.setTransform(k * dpr, 0, 0, k * dpr, bx * dpr, by * dpr);
      g.fillStyle = 'rgba(255,255,255,0.08)';
      const x0 = Math.floor(-bx / k / 24) * 24;
      const y0 = Math.floor(-by / k / 24) * 24;
      for (let x = x0; x < (cw - bx) / k; x += 24) for (let y = y0; y < (ch - by) / k; y += 24) g.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
    }
    if (particles.current.length !== L.particles) seedParticles();
  }, [seedParticles]);

  /* ----------------------------- environment ----------------------------- */

  // Light sprites must exist before the first draw.
  useLayoutEffect(() => {
    sprites.current = { ice: makeSprite('223,235,246'), warm: makeSprite('236,160,128') };
  }, []);

  // Reduced motion: finished scene, static.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
      if (mq.matches) seek(STATIC_T);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [seek]);

  // Wide or tall scene, from the available width.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = entry.contentRect.width >= WIDE_MIN_WIDTH ? WIDE : TALL;
      setLayout((prev) => (prev.kind === next.kind ? prev : next));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    layoutRef.current = layout;
    packets.current = [];
    particles.current = [];
    typed.current = DEPTS.map(() => -1);
    fitCanvas();
    renderFrame(0, 0);
  }, [layout, fitCanvas, renderFrame]);

  // Keep the canvas matched to the stage size.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      fitCanvas();
      renderFrame(0, 0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fitCanvas, renderFrame]);

  // Start once the scene reaches the upper ~65% of the viewport; run the loop only while visible.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const uiDt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const running = startedRef.current && !pausedRef.current && !reducedRef.current;
      const simDt = running ? uiDt : 0;
      tRef.current += simDt;
      renderFrame(simDt, uiDt);
      raf = requestAnimationFrame(tick);
    };
    const starter = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startedRef.current = true;
          starter.disconnect();
        }
      },
      { rootMargin: '0px 0px -35% 0px' },
    );
    starter.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !raf && !reducedRef.current) {
          last = 0;
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => {
      starter.disconnect();
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [renderFrame, reduced]);

  // Reduced motion has no loop: redraw when the highlight changes.
  useEffect(() => {
    activeRef.current = active;
    if (reducedRef.current) renderFrame(0, 0);
  }, [active, renderFrame]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  /* ----------------------------- controls ----------------------------- */

  const jumpTo = (k: number) => {
    startedRef.current = true;
    seek(reducedRef.current ? (k === PHASES.length - 1 ? STATIC_T : PHASES[k].end - 0.01) : PHASES[k].start);
  };

  const restart = () => {
    setPaused(false);
    startedRef.current = true;
    seedParticles();
    seek(0);
  };

  const onStagePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage || e.pointerType === 'touch') return;
    const r = stage.getBoundingClientRect();
    const { k } = geo.current;
    pointer.current = { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k, on: true };
    parallax.current.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    parallax.current.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
  };

  const onStagePointerLeave = () => {
    pointer.current.on = false;
    parallax.current.tx = 0;
    parallax.current.ty = 0;
  };

  const onNodeKey = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      burst(i);
    }
  };

  const onNodePointerEnter = (i: number) => (e: ReactPointerEvent<SVGGElement>) => {
    if (e.pointerType === 'touch') return;
    setActive(i);
    burst(i);
  };

  const onNodeClick = (i: number) => () => {
    if (pointerType.current === 'touch') {
      setActive((cur) => (cur === i ? null : i));
      burst(i);
    }
  };

  /* ----------------------------- render ----------------------------- */

  const L = layout;
  const markW = (L.markH * 331) / 424;
  const controlClasses =
    'inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 font-sans text-xs font-medium text-white/75 transition-colors hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70';

  return (
    <section id="cervello" aria-labelledby="cervello-title" className="relative overflow-hidden bg-ink-900 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-white/50">
            <span aria-hidden="true" className="h-px w-6 bg-white/25" />
            Business Second Brain
          </p>
          <h2
            id="cervello-title"
            className="mt-5 text-balance font-sans text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl"
          >
            <span className="text-white/40">Non un’intelligenza artificiale che pensa.</span> Un’azienda che diventa
            intelligente.
          </h2>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-white/60">
            L’AI collega persone, informazioni, applicazioni e processi aziendali, trasformando attività frammentate in
            un sistema intelligente.
          </p>
        </div>

        {/* Phase stepper + controls */}
        <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <ol className="grid flex-1 grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4" aria-label="Fasi dell’animazione">
            {PHASES.map((p, k) => (
              <li key={p.number}>
                <button
                  type="button"
                  onClick={() => jumpTo(k)}
                  aria-current={phase === k ? 'step' : undefined}
                  className="group block w-full rounded-sm text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
                >
                  <span className="block h-px w-full overflow-hidden bg-white/15">
                    <span
                      ref={(el) => {
                        barRefs.current[k] = el;
                      }}
                      className="block h-full w-full origin-left bg-white/80"
                      style={{ transform: 'scaleX(0)' }}
                    />
                  </span>
                  <span
                    className={`mt-3 flex items-baseline gap-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                      phase === k ? 'text-white' : 'text-white/40 group-hover:text-white/75'
                    }`}
                  >
                    <span>{p.number}</span>
                    {p.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          {!reduced && (
            <div className="flex gap-2">
              <button type="button" onClick={() => setPaused((v) => !v)} aria-pressed={paused} className={controlClasses}>
                {paused ? (
                  <Play className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Pause className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                )}
                {paused ? 'Riprendi' : 'Pausa'}
              </button>
              <button type="button" onClick={restart} className={controlClasses}>
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                Ricomincia
              </button>
            </div>
          )}
        </div>

        <p aria-live="polite" className="mt-5 min-h-[3rem] max-w-2xl font-body text-sm leading-relaxed text-white/60">
          {PHASES[phase].caption}
        </p>
      </div>

      {/* Scene: wider than the text column, borderless, edges dissolve into the band */}
      <div ref={wrapRef} className="mx-auto mt-2 w-full max-w-[1280px] px-4 sm:px-6">
        <div
          ref={stageRef}
          className={`relative ${L.kind === 'tall' ? 'mx-auto max-w-[520px]' : ''}`}
          onPointerMove={onStagePointerMove}
          onPointerLeave={onStagePointerLeave}
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              maskImage: 'radial-gradient(ellipse closest-side at center, #000 68%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse closest-side at center, #000 68%, transparent 100%)',
            }}
          />
          <svg
            viewBox={`0 0 ${L.w} ${L.h}`}
            className="relative block h-auto w-full select-none"
            role="group"
            aria-label="Il cervello operativo di un’impresa: sei reparti collegati a un nucleo AI che restituisce un risultato a ciascuno."
            onPointerDown={(e) => {
              pointerType.current = e.pointerType;
            }}
          >
            <defs>
              <radialGradient id="bsb-core" cx="0.5" cy="0.38" r="0.7">
                <stop offset="0" stopColor="#24384D" />
                <stop offset="1" stopColor="#0D1720" />
              </radialGradient>
            </defs>

            <g pointerEvents="none">
              {L.links.map(([a, b], j) => (
                <path
                  key={`${a}-${b}`}
                  ref={(el) => {
                    linkRefs.current[j] = el;
                  }}
                  stroke={ICE}
                  strokeWidth={1}
                  strokeDasharray="3 6"
                  fill="none"
                  opacity="0"
                />
              ))}
              {L.nodes.map((_, i) => (
                <path
                  key={DEPTS[i].label}
                  ref={(el) => {
                    spokeRefs.current[i] = el;
                  }}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1}
                  stroke={ICE}
                  strokeWidth={L.kind === 'wide' ? 1.2 : 1}
                  fill="none"
                  opacity="0.2"
                />
              ))}
            </g>

            {/* AI core */}
            <g ref={coreRef}>
              {L.rings.map((r, j) => (
                <circle
                  key={r}
                  ref={(el) => {
                    ringRefs.current[j] = el;
                  }}
                  pointerEvents="none"
                  cx={L.core.x}
                  cy={L.core.y}
                  r={r}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity={j === 0 ? 0.24 : 0.13}
                  strokeWidth={1}
                  strokeDasharray={j === 0 ? '2 6' : '1 9'}
                />
              ))}
              <g
                role="button"
                tabIndex={0}
                aria-label="AI core: invia un risultato a tutti i reparti"
                onClick={burstAll}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    burstAll();
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <circle
                  ref={coreDiscRef}
                  cx={L.core.x}
                  cy={L.core.y}
                  r={L.coreR}
                  fill="url(#bsb-core)"
                  stroke={ICE}
                  strokeOpacity={0.35}
                  strokeWidth={1}
                />
                <LogoMark
                  tone="inverse"
                  x={L.core.x - markW / 2}
                  y={L.core.y - L.markH / 2 - L.coreR * 0.16}
                  width={markW}
                  height={L.markH}
                />
                <text
                  x={L.core.x}
                  y={L.core.y + L.coreR * 0.62}
                  textAnchor="middle"
                  fontSize={L.kind === 'wide' ? 9 : 7}
                  letterSpacing={L.kind === 'wide' ? 1.7 : 1.2}
                  fill="#FFFFFF"
                  opacity={0.6}
                  className="font-mono"
                >
                  AI CORE
                </text>
              </g>
            </g>

            {/* Departments — positioned per frame via transform; children use local coordinates */}
            {L.nodes.map((n, i) => (
              <g
                key={DEPTS[i].label}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                role="button"
                tabIndex={0}
                aria-label={`${DEPTS[i].label}: ${DEPTS[i].output}`}
                onPointerEnter={onNodePointerEnter(i)}
                onPointerLeave={(e) => {
                  if (e.pointerType !== 'touch') setActive(null);
                }}
                onFocus={(e) => {
                  // Keyboard focus highlights; pointer focus is handled by hover (mouse) or tap (touch).
                  if (e.currentTarget.matches(':focus-visible')) setActive(i);
                }}
                onBlur={() => setActive(null)}
                onClick={onNodeClick(i)}
                onKeyDown={onNodeKey(i)}
                className="cursor-pointer outline-none"
                opacity="0"
              >
                <circle r={L.nodeR + 24} fill="transparent" />
                <circle
                  ref={(el) => {
                    pulseRefs.current[i] = el;
                  }}
                  r={L.nodeR}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={1}
                  opacity="0"
                />
                <circle
                  ref={(el) => {
                    focusRefs.current[i] = el;
                  }}
                  r={L.nodeR + 6}
                  fill="none"
                  stroke={ICE}
                  strokeWidth={1}
                  strokeDasharray="2 3"
                  opacity="0"
                />
                <circle r={L.nodeR} fill="#0A1118" stroke="#FFFFFF" strokeOpacity={0.3} strokeWidth={1} />
                <circle
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  r={4.6}
                  fill="#FFFFFF"
                />
                <text
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  x={n.label.x}
                  y={n.label.y}
                  textAnchor={n.anchor}
                  fontSize={L.labelSize}
                  letterSpacing={L.kind === 'wide' ? 1.9 : 1.4}
                  fill="#FFFFFF"
                  className="font-mono"
                >
                  {DEPTS[i].label}
                </text>
                <text
                  ref={(el) => {
                    outputRefs.current[i] = el;
                  }}
                  x={n.output.x}
                  y={n.output.y}
                  textAnchor={n.anchor}
                  fontSize={L.outputSize}
                  fill={ICE}
                  opacity="0"
                  className="font-body"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-white/35">
          <span className="[@media(hover:none)]:hidden">
            Muovi il cursore sulla scena e passa sopra un reparto. Clicca il nucleo per un impulso.
          </span>
          <span className="hidden [@media(hover:none)]:inline">
            Tocca un reparto per vedere cosa gli restituisce il nucleo. Tocca il nucleo per un impulso.
          </span>
        </p>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { LogoMark } from './Logo';

/* ------------------------------------------------------------------------------------------------
 * Business Second Brain — an interactive SVG animation of a company's operating "brain".
 * Six departments, an AI core, four phases: fragmentation → connection → intelligence → automation.
 *
 * React renders the static scene once per layout; a requestAnimationFrame loop then writes SVG
 * attributes directly (fixed element pools, no per-frame React renders). The loop only runs while
 * the section is on screen; with prefers-reduced-motion the scene is drawn statically.
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
    end: 4.5,
    caption: 'I reparti lavorano separati: ogni nodo pulsa per conto suo e produce piccoli pacchetti di dati.',
  },
  {
    number: '02',
    name: 'Connessione',
    start: 4.5,
    end: 9.5,
    caption: 'Linee sottili collegano progressivamente i reparti al nucleo AI. I pacchetti iniziano a viaggiare lungo le connessioni.',
  },
  {
    number: '03',
    name: 'Intelligenza',
    start: 9.5,
    end: 14.5,
    caption: 'Il nucleo elabora le informazioni e restituisce a ogni reparto un risultato concreto.',
  },
  {
    number: '04',
    name: 'Automazione',
    start: 14.5,
    end: 17.5,
    caption: 'Ciclo continuo: i dati attraversano la rete e il nucleo AI coordina i processi.',
  },
] as const;

const P2 = PHASES[1].start;
const P3 = PHASES[2].start;
const P4 = PHASES[3].start;
const STATIC_T = PHASES[3].end; // fully built scene (reduced motion)

const IN_DUR = 1.35; // department → core
const OUT_DUR = 1.1; // core → department (results)
const DRIFT_DUR = 1.6; // fragmented data, going nowhere
const PEER_DUR = 2.2; // department ↔ department (phase 4)
const SMALL_POOL = 90;
const RESULT_POOL = 24;

// Scheduled phase-3 results: one per department, clockwise.
const resultSpawn = (i: number) => P3 + 0.3 + i * 0.55;
const resultArrival = (i: number) => resultSpawn(i) + OUT_DUR;
const spokeStart = (i: number) => P2 + 0.25 + i * 0.35;

/* ---------------------------------------- layouts ---------------------------------------- */

type Pt = { x: number; y: number };
type NodeLayout = { p: Pt; label: Pt; output: Pt; anchor: 'start' | 'middle' | 'end' };
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
  nodes: NodeLayout[];
  links: [number, number][]; // peripheral department links (phase 4)
};

const WIDE: Layout = {
  kind: 'wide',
  w: 1000,
  h: 620,
  core: { x: 500, y: 310 },
  coreR: 50,
  rings: [70, 90],
  markH: 34,
  nodeR: 14,
  labelSize: 11.5,
  outputSize: 15,
  nodes: [
    { p: { x: 500, y: 96 }, label: { x: 500, y: 40 }, output: { x: 500, y: 62 }, anchor: 'middle' },
    { p: { x: 770, y: 200 }, label: { x: 812, y: 195 }, output: { x: 812, y: 217 }, anchor: 'start' },
    { p: { x: 770, y: 430 }, label: { x: 812, y: 425 }, output: { x: 812, y: 447 }, anchor: 'start' },
    { p: { x: 500, y: 524 }, label: { x: 500, y: 568 }, output: { x: 500, y: 590 }, anchor: 'middle' },
    { p: { x: 230, y: 430 }, label: { x: 188, y: 425 }, output: { x: 188, y: 447 }, anchor: 'end' },
    { p: { x: 230, y: 200 }, label: { x: 188, y: 195 }, output: { x: 188, y: 217 }, anchor: 'end' },
  ],
  links: [
    [5, 1],
    [4, 2],
  ],
};

const TALL: Layout = {
  kind: 'tall',
  w: 400,
  h: 650,
  core: { x: 200, y: 330 },
  coreR: 38,
  rings: [52, 66],
  markH: 26,
  nodeR: 12,
  labelSize: 10.5,
  outputSize: 12.5,
  nodes: [
    { p: { x: 200, y: 104 }, label: { x: 200, y: 46 }, output: { x: 200, y: 68 }, anchor: 'middle' },
    { p: { x: 318, y: 212 }, label: { x: 318, y: 164 }, output: { x: 318, y: 185 }, anchor: 'middle' },
    { p: { x: 318, y: 452 }, label: { x: 318, y: 497 }, output: { x: 318, y: 518 }, anchor: 'middle' },
    { p: { x: 200, y: 556 }, label: { x: 200, y: 600 }, output: { x: 200, y: 621 }, anchor: 'middle' },
    { p: { x: 82, y: 452 }, label: { x: 82, y: 497 }, output: { x: 82, y: 518 }, anchor: 'middle' },
    { p: { x: 82, y: 212 }, label: { x: 82, y: 164 }, output: { x: 82, y: 185 }, anchor: 'middle' },
  ],
  links: [
    [5, 1],
    [4, 2],
  ],
};

const WIDE_MIN_WIDTH = 860;

/* ---------------------------------------- helpers ---------------------------------------- */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

type PacketKind = 'drift' | 'in' | 'out' | 'peer';
type Packet = { kind: PacketKind; from: Pt; to: Pt; t0: number; dur: number; node: number };

const ICE = '#DFEBF6';

/* ---------------------------------------- component ---------------------------------------- */

export default function BrainSection() {
  const [layout, setLayout] = useState<Layout>(WIDE);
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  // Simulation state lives in refs: the animation loop must not trigger React renders.
  const tRef = useRef(0);
  const startedRef = useRef(false);
  const visibleRef = useRef(false);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);
  const activeRef = useRef<number | null>(null);
  const layoutRef = useRef<Layout>(WIDE);
  const phaseRef = useRef(0);
  const packets = useRef<Packet[]>([]);
  const resultsDone = useRef<boolean[]>(DEPTS.map(() => false));
  const mix = useRef<number[]>(DEPTS.map(() => 0)); // hover/focus highlight, smoothed
  const flash = useRef<number[]>(DEPTS.map(() => 0)); // result arrival glow per department
  const lastHit = useRef<number[]>(DEPTS.map(() => -10)); // timeline time of last arrival
  const coreFlash = useRef(0);
  const ringAngle = useRef(0);
  const pointerType = useRef<string>('mouse');

  // Element refs.
  const stageRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const spokeRefs = useRef<(SVGPathElement | null)[]>([]);
  const linkRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const focusRefs = useRef<(SVGCircleElement | null)[]>([]);
  const labelRefs = useRef<(SVGTextElement | null)[]>([]);
  const outputRefs = useRef<(SVGTextElement | null)[]>([]);
  const smallRefs = useRef<(SVGCircleElement | null)[]>([]);
  const resultRefs = useRef<(SVGGElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* ----------------------------- simulation ----------------------------- */

  const spawn = useCallback((kind: PacketKind, node: number, t0: number, peer?: number) => {
    const L = layoutRef.current;
    const isResult = kind === 'out';
    const capacity = isResult ? RESULT_POOL : SMALL_POOL;
    const used = packets.current.filter((p) => (p.kind === 'out') === isResult).length;
    if (used >= capacity) return;

    const n = L.nodes[node].p;
    let from = n;
    let to = L.core;
    let dur = IN_DUR;
    if (kind === 'out') {
      from = L.core;
      to = n;
      dur = OUT_DUR;
    } else if (kind === 'drift') {
      const a = Math.random() * Math.PI * 2;
      const d = (L.kind === 'wide' ? 26 : 18) + Math.random() * (L.kind === 'wide' ? 26 : 16);
      to = { x: n.x + Math.cos(a) * d, y: n.y + Math.sin(a) * d };
      dur = DRIFT_DUR;
    } else if (kind === 'peer' && peer !== undefined) {
      to = L.nodes[peer].p;
      dur = PEER_DUR;
    }
    packets.current.push({ kind, from, to, t0, dur, node: kind === 'peer' && peer !== undefined ? peer : node });
  }, []);

  const burst = useCallback(
    (i: number) => {
      if (reducedRef.current) return;
      startedRef.current = true;
      const t = tRef.current;
      spawn('in', i, t);
      spawn('in', i, t + 0.22);
      spawn('out', i, t + IN_DUR + 0.1);
    },
    [spawn],
  );

  const burstAll = useCallback(() => {
    if (reducedRef.current) return;
    startedRef.current = true;
    const t = tRef.current;
    coreFlash.current = 1;
    DEPTS.forEach((_, i) => spawn('out', i, t + i * 0.08));
  }, [spawn]);

  /** Write one frame. `simDt` advances the simulation; `uiDt` smooths hover highlights. */
  const renderFrame = useCallback(
    (simDt: number, uiDt: number) => {
      const L = layoutRef.current;
      const t = tRef.current;
      const animate = !reducedRef.current;
      const act = activeRef.current;
      const anyActive = act !== null;

      // -- phase bookkeeping (React state only when it changes)
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

      // -- highlight smoothing
      const k = uiDt > 0 ? Math.min(1, uiDt * 10) : 1;
      DEPTS.forEach((_, i) => {
        const target = act === i ? 1 : 0;
        mix.current[i] += (target - mix.current[i]) * k;
        flash.current[i] = Math.max(0, flash.current[i] - simDt * 1.6);
      });
      coreFlash.current = Math.max(0, coreFlash.current - simDt * 2.2);

      // -- stochastic spawns
      if (simDt > 0) {
        DEPTS.forEach((_, i) => {
          const appeared = t > 0.3 + i * 0.12;
          const connected = t >= spokeStart(i) + 1;
          if (appeared && !connected && Math.random() < 1.3 * simDt) spawn('drift', i, t);
          if (connected) {
            const rate = t < P3 ? 0.75 : t < P4 ? 0.45 : 0.55;
            if (Math.random() < rate * simDt) spawn('in', i, t);
          }
          if (!resultsDone.current[i] && t >= resultSpawn(i)) {
            resultsDone.current[i] = true;
            spawn('out', i, resultSpawn(i));
          }
        });
        if (t >= P4) {
          if (Math.random() < 0.6 * simDt) spawn('out', Math.floor(Math.random() * DEPTS.length), t);
          L.links.forEach(([a, b]) => {
            if (Math.random() < 0.35 * simDt) {
              if (Math.random() < 0.5) spawn('peer', a, t, b);
              else spawn('peer', b, t, a);
            }
          });
        }
      }

      // -- advance packets
      const alive: Packet[] = [];
      for (const p of packets.current) {
        const prog = (t - p.t0) / p.dur;
        if (prog >= 1) {
          if (p.kind === 'in') {
            coreFlash.current = Math.min(1, coreFlash.current + 0.3);
            // The core coordinates: some inputs trigger a result for another department.
            if (t >= P4 && Math.random() < 0.3) {
              const other = (p.node + 1 + Math.floor(Math.random() * (DEPTS.length - 1))) % DEPTS.length;
              spawn('out', other, t);
            }
          } else if (p.kind === 'out' || p.kind === 'peer') {
            lastHit.current[p.node] = t;
            if (p.kind === 'out') flash.current[p.node] = 1;
          }
          continue;
        }
        alive.push(p);
      }
      packets.current = alive;

      let si = 0;
      let ri = 0;
      for (const p of alive) {
        const raw = (t - p.t0) / p.dur;
        if (raw < 0) continue; // scheduled for later
        const e = p.kind === 'drift' ? easeOut(raw) : easeInOut(raw);
        const x = p.from.x + (p.to.x - p.from.x) * e;
        const y = p.from.y + (p.to.y - p.from.y) * e;
        if (p.kind === 'out') {
          const g = resultRefs.current[ri++];
          if (g) {
            g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
            g.setAttribute('opacity', (Math.min(1, raw * 6) * (anyActive && act !== p.node ? 0.45 : 1)).toFixed(3));
          }
        } else {
          const c = smallRefs.current[si++];
          if (c) {
            const fade = p.kind === 'drift' ? Math.sin(Math.PI * raw) * 0.55 : Math.min(1, raw * 8, (1 - raw) * 8);
            const base = p.kind === 'peer' ? 0.5 : p.kind === 'in' ? 0.8 : 1;
            const dim = anyActive && act !== p.node && p.kind === 'in' ? 0.4 : 1;
            c.setAttribute('cx', x.toFixed(1));
            c.setAttribute('cy', y.toFixed(1));
            c.setAttribute('opacity', (fade * base * dim).toFixed(3));
          }
        }
      }
      for (; si < SMALL_POOL; si++) smallRefs.current[si]?.setAttribute('opacity', '0');
      for (; ri < RESULT_POOL; ri++) resultRefs.current[ri]?.setAttribute('opacity', '0');

      // -- departments
      DEPTS.forEach((_, i) => {
        const m = mix.current[i];
        const dim = anyActive && act !== i ? 1 : 0;
        const appear = animate ? clamp01((t - 0.15 - i * 0.12) / 0.6) : 1;

        nodeRefs.current[i]?.setAttribute('opacity', appear.toFixed(3));

        const spoke = spokeRefs.current[i];
        if (spoke) {
          const prog = Math.max(clamp01((t - spokeStart(i)) / 1.0), m);
          spoke.setAttribute('stroke-dashoffset', (1 - prog).toFixed(4));
          const alpha = (0.2 + 0.55 * m + (t >= P3 ? 0.08 : 0)) * (1 - 0.6 * dim);
          spoke.setAttribute('opacity', alpha.toFixed(3));
        }

        const out = outputRefs.current[i];
        if (out) {
          const vis = Math.max(clamp01((t - resultArrival(i)) / 0.5), m);
          out.setAttribute('opacity', (vis * (0.82 + 0.18 * Math.max(flash.current[i], m)) * (1 - 0.65 * dim)).toFixed(3));
        }
        labelRefs.current[i]?.setAttribute('opacity', ((0.6 + 0.4 * m) * (1 - 0.5 * dim)).toFixed(3));
        dotRefs.current[i]?.setAttribute('r', (L.kind === 'wide' ? 4.5 : 3.8) + 1.6 * m + 1.4 * flash.current[i] + '');
        focusRefs.current[i]?.setAttribute('opacity', (m * 0.9).toFixed(3));

        // Pulse ring: autonomous heartbeat (strong while fragmented), plus a ripple on each arrival.
        const pulse = pulseRefs.current[i];
        if (pulse) {
          let r = L.nodeR;
          let o = 0;
          if (animate) {
            const period = 1.9 + (i % 3) * 0.35;
            const q = ((t + i * 0.47) % period) / period;
            const amp = t < P2 ? 0.45 : t < P3 ? 0.25 : 0.12;
            r = L.nodeR + (L.kind === 'wide' ? 12 : 9) * q;
            o = amp * (1 - q) * appear;
            const h = (t - lastHit.current[i]) / 0.9;
            if (h >= 0 && h < 1 && 0.7 * (1 - h) > o) {
              r = L.nodeR + (L.kind === 'wide' ? 18 : 12) * easeOut(h);
              o = 0.7 * (1 - h);
            }
          }
          pulse.setAttribute('r', r.toFixed(2));
          pulse.setAttribute('opacity', o.toFixed(3));
        }
      });

      // -- peripheral links (phase 4: the network beyond the core)
      linkRefs.current.forEach((l) => l?.setAttribute('opacity', (clamp01((t - P4) / 1.5) * 0.28 * (anyActive ? 0.5 : 1)).toFixed(3)));

      // -- core
      const glow = clamp01(
        0.14 +
          0.3 * clamp01((t - P2) / 4) +
          0.32 * clamp01((t - P3) / 2.5) +
          (t >= P4 && animate ? 0.07 * Math.sin(t * 1.7) : 0) +
          0.22 * coreFlash.current,
      );
      haloRef.current?.setAttribute('opacity', glow.toFixed(3));
      if (animate) {
        const speed = 7 + 26 * clamp01((t - P3) / 1.5) * (t < P4 ? 1 : 0.45);
        ringAngle.current = (ringAngle.current + simDt * speed) % 360;
      }
      ringRefs.current.forEach((r, j) => {
        r?.setAttribute('transform', `rotate(${(j === 0 ? 1 : -0.6) * ringAngle.current} ${L.core.x} ${L.core.y})`);
        r?.setAttribute('opacity', (0.5 + 0.5 * clamp01((t - P2) / 4)).toFixed(3));
      });
    },
    [spawn],
  );

  /** Move the timeline to `t`, keeping the scheduled phase-3 results consistent. */
  const seek = useCallback(
    (t: number) => {
      tRef.current = t;
      packets.current = [];
      resultsDone.current = DEPTS.map((_, i) => t >= resultSpawn(i));
      lastHit.current = DEPTS.map(() => -10);
      flash.current = DEPTS.map(() => 0);
      coreFlash.current = 0;
      renderFrame(0, 0);
    },
    [renderFrame],
  );

  /* ----------------------------- environment ----------------------------- */

  // Reduced motion: draw the finished scene, no loop.
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
    const el = stageRef.current;
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
    renderFrame(0, 0);
  }, [layout, renderFrame]);

  // Start when the scene is in view; run the loop only while it is visible.
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
    // Start once the scene's top edge reaches the upper ~65% of the viewport (robust for tall scenes).
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
    // Run the loop only while any part of the scene is on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
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
    seek(0);
  };

  const onNodeKey = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      burst(i);
    }
  };

  const onNodePointerEnter = (i: number) => (e: PointerEvent<SVGGElement>) => {
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
            className="mt-5 text-balance font-sans text-3xl font-semibold leading-[1.2] tracking-tight sm:text-4xl"
          >
            <span className="text-white/45">Non un’intelligenza artificiale che pensa.</span> Un’azienda che diventa
            intelligente.
          </h2>
          <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-white/60">
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
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                aria-pressed={paused}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 font-sans text-xs font-medium text-white/75 transition-colors hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                {paused ? (
                  <Play className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Pause className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                )}
                {paused ? 'Riprendi' : 'Pausa'}
              </button>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 font-sans text-xs font-medium text-white/75 transition-colors hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                Ricomincia
              </button>
            </div>
          )}
        </div>

        <p aria-live="polite" className="mt-5 min-h-[3rem] max-w-2xl font-body text-sm leading-relaxed text-white/60">
          {PHASES[phase].caption}
        </p>

        {/* Scene */}
        <div
          ref={stageRef}
          className="relative mt-4 overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(223,235,246,0.07),transparent_65%)]"
        >
          <div className={L.kind === 'tall' ? 'mx-auto max-w-[480px]' : ''}>
            <svg
              viewBox={`0 0 ${L.w} ${L.h}`}
              className="block h-auto w-full select-none"
              role="group"
              aria-label="Il cervello operativo di un’impresa: sei reparti collegati a un nucleo AI che restituisce un risultato a ciascuno."
              onPointerDown={(e) => {
                pointerType.current = e.pointerType;
              }}
            >
              <defs>
                <pattern id="bsb-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.9" fill="#FFFFFF" opacity="0.07" />
                </pattern>
                <radialGradient id="bsb-halo">
                  <stop offset="0" stopColor={ICE} stopOpacity="0.55" />
                  <stop offset="0.4" stopColor={ICE} stopOpacity="0.14" />
                  <stop offset="1" stopColor={ICE} stopOpacity="0" />
                </radialGradient>
                <radialGradient id="bsb-core" cx="0.5" cy="0.38" r="0.7">
                  <stop offset="0" stopColor="#22344A" />
                  <stop offset="1" stopColor="#0D1720" />
                </radialGradient>
              </defs>

              <rect width={L.w} height={L.h} fill="url(#bsb-grid)" pointerEvents="none" />
              <circle ref={haloRef} cx={L.core.x} cy={L.core.y} r={L.coreR * 3.4} fill="url(#bsb-halo)" opacity="0" pointerEvents="none" />

              <g pointerEvents="none">
              {/* Peripheral links */}
              {L.links.map(([a, b], j) => (
                <path
                  key={`${a}-${b}`}
                  ref={(el) => {
                    linkRefs.current[j] = el;
                  }}
                  d={`M${L.nodes[a].p.x} ${L.nodes[a].p.y}L${L.nodes[b].p.x} ${L.nodes[b].p.y}`}
                  stroke={ICE}
                  strokeWidth={1}
                  strokeDasharray="3 5"
                  fill="none"
                  opacity="0"
                />
              ))}

              {/* Spokes: department → core */}
              {L.nodes.map((n, i) => (
                <path
                  key={DEPTS[i].label}
                  ref={(el) => {
                    spokeRefs.current[i] = el;
                  }}
                  d={`M${n.p.x} ${n.p.y}L${L.core.x} ${L.core.y}`}
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

              {/* Data packets */}
              <g aria-hidden="true" pointerEvents="none">
                {Array.from({ length: SMALL_POOL }, (_, j) => (
                  <circle
                    key={j}
                    ref={(el) => {
                      smallRefs.current[j] = el;
                    }}
                    r={L.kind === 'wide' ? 2.2 : 1.9}
                    fill="#FFFFFF"
                    opacity="0"
                  />
                ))}
                {Array.from({ length: RESULT_POOL }, (_, j) => (
                  <g
                    key={j}
                    ref={(el) => {
                      resultRefs.current[j] = el;
                    }}
                    opacity="0"
                  >
                    <circle r={L.kind === 'wide' ? 11 : 9} fill="url(#bsb-halo)" />
                    <circle r={L.kind === 'wide' ? 3 : 2.6} fill={ICE} />
                  </g>
                ))}
              </g>

              {/* AI core */}
              <g>
                {L.rings.map((r, j) => (
                  <circle
                    pointerEvents="none"
                    key={r}
                    ref={(el) => {
                      ringRefs.current[j] = el;
                    }}
                    cx={L.core.x}
                    cy={L.core.y}
                    r={r}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeOpacity={j === 0 ? 0.22 : 0.12}
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
                    fontSize={L.kind === 'wide' ? 8.5 : 7}
                    letterSpacing={L.kind === 'wide' ? 1.6 : 1.2}
                    fill="#FFFFFF"
                    opacity={0.6}
                    className="font-mono"
                  >
                    AI CORE
                  </text>
                </g>
              </g>

              {/* Departments */}
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
                  <circle cx={n.p.x} cy={n.p.y} r={L.nodeR + 22} fill="transparent" />
                  <circle
                    ref={(el) => {
                      pulseRefs.current[i] = el;
                    }}
                    cx={n.p.x}
                    cy={n.p.y}
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
                    cx={n.p.x}
                    cy={n.p.y}
                    r={L.nodeR + 6}
                    fill="none"
                    stroke={ICE}
                    strokeWidth={1}
                    strokeDasharray="2 3"
                    opacity="0"
                  />
                  <circle
                    cx={n.p.x}
                    cy={n.p.y}
                    r={L.nodeR}
                    fill="#0A1118"
                    stroke="#FFFFFF"
                    strokeOpacity={0.28}
                    strokeWidth={1}
                  />
                  <circle
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    cx={n.p.x}
                    cy={n.p.y}
                    r={4.5}
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
                    letterSpacing={L.kind === 'wide' ? 1.8 : 1.4}
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
                  >
                    {DEPTS[i].output}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-white/35">
          Passa sopra un reparto, o toccalo, per vedere cosa gli restituisce il nucleo.
        </p>
      </div>
    </section>
  );
}

/* @ds-bundle: {"format":4,"namespace":"SamaritanDesignSystem_bd654b","components":[{"name":"BootSequence","sourcePath":"components/boot/BootSequence.jsx"},{"name":"ProgressLine","sourcePath":"components/boot/ProgressLine.jsx"},{"name":"BrandMark","sourcePath":"components/brand/BrandMark.jsx"},{"name":"CornerBrackets","sourcePath":"components/chrome/CornerBrackets.jsx"},{"name":"Shell","sourcePath":"components/chrome/Shell.jsx"},{"name":"Stage","sourcePath":"components/chrome/Stage.jsx"},{"name":"StatusBar","sourcePath":"components/chrome/StatusBar.jsx"},{"name":"StatusDot","sourcePath":"components/chrome/StatusDot.jsx"},{"name":"StatusFooter","sourcePath":"components/chrome/StatusFooter.jsx"},{"name":"GhostButton","sourcePath":"components/controls/GhostButton.jsx"},{"name":"ClassificationTag","sourcePath":"components/data/ClassificationTag.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"InfoField","sourcePath":"components/data/InfoField.jsx"},{"name":"MapFrame","sourcePath":"components/data/MapFrame.jsx"},{"name":"PersonCard","sourcePath":"components/data/PersonCard.jsx"},{"name":"SectionHeader","sourcePath":"components/data/SectionHeader.jsx"},{"name":"OptionButton","sourcePath":"components/query/OptionButton.jsx"},{"name":"QueryLine","sourcePath":"components/query/QueryLine.jsx"}],"sourceHashes":{"components/boot/BootSequence.jsx":"3fc261312b72","components/boot/ProgressLine.jsx":"bc6d666a319e","components/brand/BrandMark.jsx":"7e13b5ea09b4","components/chrome/CornerBrackets.jsx":"0e08b394d35a","components/chrome/Shell.jsx":"c8864d047b2c","components/chrome/Stage.jsx":"6e29152bb875","components/chrome/StatusBar.jsx":"fb80090a6145","components/chrome/StatusDot.jsx":"88f6ac923c1e","components/chrome/StatusFooter.jsx":"b46d9ce97e34","components/controls/GhostButton.jsx":"02d2f506ff85","components/data/ClassificationTag.jsx":"8763dadab22e","components/data/DataTable.jsx":"99f4b5c01c48","components/data/InfoField.jsx":"016492d8dc63","components/data/MapFrame.jsx":"a60617795757","components/data/PersonCard.jsx":"d2f5a9768e66","components/data/SectionHeader.jsx":"53559a5ec9f1","components/query/OptionButton.jsx":"9ca934bf9cc6","components/query/QueryLine.jsx":"fa394a91dcc3","ui_kits/samaritan-console/App.jsx":"e5e38051cf18","ui_kits/samaritan-console/panels.jsx":"0e65cdae45da"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SamaritanDesignSystem_bd654b = window.SamaritanDesignSystem_bd654b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/boot/ProgressLine.jsx
try { (() => {
const {
  useEffect,
  useState
} = React;
/* A 220px, 1px-tall red fill. The only progress indicator in the system:
   no percentage, no label, no rounding. */
function ProgressLine({
  running = true,
  value,
  duration = '1.6s',
  width,
  className = ''
}) {
  const [w, setW] = useState('0');
  useEffect(() => {
    if (value != null) {
      setW(value + '%');
      return;
    }
    if (!running) {
      setW('0');
      return;
    }
    const id = setTimeout(() => setW('100%'), 80);
    return () => clearTimeout(id);
  }, [running, value]);
  return /*#__PURE__*/React.createElement("div", {
    className: ['sam-pbar', className].filter(Boolean).join(' '),
    style: width ? {
      width
    } : null
  }, /*#__PURE__*/React.createElement("div", {
    className: "sam-pfill",
    style: {
      width: w,
      transitionDuration: duration
    }
  }));
}
Object.assign(__ds_scope, { ProgressLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/boot/ProgressLine.jsx", error: String((e && e.message) || e) }); }

// components/boot/BootSequence.jsx
try { (() => {
const {
  useEffect,
  useRef,
  useState
} = React;
/* Reproduces the boot choreography from j/contatti.js:
   log lines reveal one at a time (380ms + up to 200ms jitter), the progress
   line appears and fills over 1.6s, then the grant line lands, then onDone
   fires 900ms later. */
function BootSequence({
  lines = [],
  grant,
  onDone,
  running = true,
  lineDelay = 380,
  jitter = 200,
  className = ''
}) {
  const [shown, setShown] = useState(0);
  const [bar, setBar] = useState(false);
  const [granted, setGranted] = useState(false);
  const timers = useRef([]);
  useEffect(() => {
    if (!running) return;
    const t = timers.current;
    const push = (fn, ms) => t.push(setTimeout(fn, ms));
    let at = 700;
    lines.forEach((_, i) => {
      at += lineDelay + Math.random() * jitter;
      push(() => setShown(i + 1), at);
    });
    push(() => setBar(true), at);
    push(() => setGranted(true), at + 1800);
    if (onDone) push(onDone, at + 1800 + 900);
    return () => {
      t.forEach(clearTimeout);
      timers.current = [];
    };
  }, [running]);
  const tone = l => 'sam-bl' + (l.tone ? ' ' + l.tone : '');
  return /*#__PURE__*/React.createElement("div", {
    className: ['sam-boot', className].filter(Boolean).join(' ')
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: tone(l) + (i < shown ? ' show' : '')
  }, l.text)), bar && /*#__PURE__*/React.createElement(__ds_scope.ProgressLine, {
    running: true
  }), grant && /*#__PURE__*/React.createElement("span", {
    className: tone(grant) + (granted ? ' show' : '')
  }, grant.text));
}
Object.assign(__ds_scope, { BootSequence });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/boot/BootSequence.jsx", error: String((e && e.message) || e) }); }

// components/brand/BrandMark.jsx
try { (() => {
const {
  useEffect,
  useRef
} = React;
/* The wordmark. No logo file exists in the source — the mark IS the type:
   Rajdhani 700, uppercase, 0.35em tracking, a hairline rule that fades out
   at both ends, and the red triangle glowing beneath it.
   glitch={true} skews it briefly every 9 seconds, as the live site does. */
function BrandMark({
  name = 'Helio',
  suffix = 'H',
  subscript = '2',
  rule = true,
  triangle = true,
  glitch = false,
  period = 9000,
  className = '',
  style
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!glitch) return;
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      el.classList.add('glitching');
      setTimeout(() => el.classList.remove('glitching'), 2900);
    }, period);
    return () => clearInterval(id);
  }, [glitch, period]);
  return /*#__PURE__*/React.createElement("div", {
    className: ['sam-brand', className].filter(Boolean).join(' '),
    style: style
  }, /*#__PURE__*/React.createElement("h1", {
    className: "sam-brand-name",
    ref: ref
  }, name, suffix, subscript && /*#__PURE__*/React.createElement("sub", null, subscript)), rule && /*#__PURE__*/React.createElement("span", {
    className: "sam-brand-line"
  }), triangle && /*#__PURE__*/React.createElement("div", {
    className: "sam-brand-tri"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 17",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "10,0 20,17 0,17"
  }))));
}
Object.assign(__ds_scope, { BrandMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BrandMark.jsx", error: String((e && e.message) || e) }); }

// components/chrome/CornerBrackets.jsx
try { (() => {
/* Four 28px red L-brackets inset 32px from the stage corners at 50% opacity.
   Reticle furniture: they frame the view, they never contain content. */
function CornerBrackets({
  corners = ['tl', 'tr', 'bl', 'br'],
  className = ''
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, corners.map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    className: ['sam-brk', c, className].filter(Boolean).join(' '),
    "aria-hidden": "true"
  })));
}
Object.assign(__ds_scope, { CornerBrackets });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/CornerBrackets.jsx", error: String((e && e.message) || e) }); }

// components/chrome/Shell.jsx
try { (() => {
/* The full Samaritan page frame: dark scrim over an optional photographic
   plate, with the CRT scanline + vignette overlays stacked on top.
   Pass contained={true} to render inside a fixed-height box instead of
   filling the viewport. */
function Shell({
  children,
  plate,
  contained = false,
  crt = true,
  className = '',
  style
}) {
  const cls = ['sam-shell', contained ? 'contained' : '', className].filter(Boolean).join(' ');
  const bg = plate ? {
    backgroundImage: 'url(' + plate + ')'
  } : null;
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: {
      ...bg,
      ...style
    }
  }, children, crt && /*#__PURE__*/React.createElement("div", {
    className: "sam-crt",
    "aria-hidden": "true"
  }), crt && /*#__PURE__*/React.createElement("div", {
    className: "sam-crt-vignette",
    "aria-hidden": "true"
  }));
}
Object.assign(__ds_scope, { Shell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/Shell.jsx", error: String((e && e.message) || e) }); }

// components/chrome/Stage.jsx
try { (() => {
/* The centred content stage: flex-centred, clipped, with the 60px ambient
   grid at 3% opacity and (optionally) the four red corner brackets. */
function Stage({
  children,
  brackets = true,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("main", {
    className: ['sam-stage', className].filter(Boolean).join(' '),
    style: style
  }, brackets && /*#__PURE__*/React.createElement(__ds_scope.CornerBrackets, null), children);
}
Object.assign(__ds_scope, { Stage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/Stage.jsx", error: String((e && e.message) || e) }); }

// components/chrome/StatusDot.jsx
try { (() => {
/* The 6px pulsing indicator — the only round element in the system. */
function StatusDot({
  color,
  size,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: ['sam-dot', className].filter(Boolean).join(' '),
    "aria-hidden": "true",
    style: {
      ...(color ? {
        background: color
      } : null),
      ...(size ? {
        width: size,
        height: size
      } : null),
      ...style
    }
  });
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/chrome/StatusBar.jsx
try { (() => {
const {
  useEffect,
  useState
} = React;
function useClock(on) {
  const [t, setT] = useState(() => new Date().toTimeString().slice(0, 8));
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setT(new Date().toTimeString().slice(0, 8)), 1000);
    return () => clearInterval(id);
  }, [on]);
  return t;
}

/* Sticky top bar: two groups of 11px muted mono, 0.1em tracking, hairline
   underneath. The left group opens with the live pulse dot. */
function StatusBar({
  label = 'SISTEMA ATTIVO',
  live = true,
  clock = true,
  left = [],
  right = [],
  className = ''
}) {
  const time = useClock(clock);
  return /*#__PURE__*/React.createElement("header", {
    className: ['sam-topbar', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "sam-bar-group"
  }, label && /*#__PURE__*/React.createElement("span", null, live && /*#__PURE__*/React.createElement(__ds_scope.StatusDot, null), live && '\u00a0 ', label), clock && /*#__PURE__*/React.createElement("span", null, time), left.map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, n))), /*#__PURE__*/React.createElement("div", {
    className: "sam-bar-group"
  }, right.map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, n))));
}
Object.assign(__ds_scope, { StatusBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/StatusBar.jsx", error: String((e && e.message) || e) }); }

// components/chrome/StatusFooter.jsx
try { (() => {
const {
  useEffect,
  useState
} = React;
/* Footer bar: three 10px slots, faintest text in the system. A null slot is
   filled with the current date (it holds the locale clock in the source). */
function StatusFooter({
  items = [],
  date = true,
  locale = 'it-IT',
  className = ''
}) {
  const [d, setD] = useState(() => new Date().toLocaleDateString(locale));
  useEffect(() => {
    if (!date) return;
    const id = setInterval(() => setD(new Date().toLocaleDateString(locale)), 60000);
    return () => clearInterval(id);
  }, [date, locale]);
  return /*#__PURE__*/React.createElement("footer", {
    className: ['sam-footbar', className].filter(Boolean).join(' ')
  }, items.map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, n === null && date ? d : n)));
}
Object.assign(__ds_scope, { StatusFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chrome/StatusFooter.jsx", error: String((e && e.message) || e) }); }

// components/controls/GhostButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The secondary control: hairline box, 11px tracked mono, transparent until
   hovered, when the border goes red and the label goes white. Used for
   "back" in the source. */
function GhostButton({
  children,
  onClick,
  className = '',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: ['sam-ghost', className].filter(Boolean).join(' '),
    onClick: onClick,
    style: style
  }, rest), children);
}
Object.assign(__ds_scope, { GhostButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/GhostButton.jsx", error: String((e && e.message) || e) }); }

// components/data/ClassificationTag.jsx
try { (() => {
/* Solid red chip, 10px, 0.14em tracking, type in the page background colour.
   In the source it carries a classification word: Classificato / Verificato /
   Riservato. It is a label, never a control. */
function ClassificationTag({
  children,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: ['sam-tag', className].filter(Boolean).join(' '),
    style: style
  }, children);
}
Object.assign(__ds_scope, { ClassificationTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ClassificationTag.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
/* Key/value readout. Uppercase tracked keys in the muted grey at 14px, values
   in near-white at 16px, hairline between every row, whole row tints to the
   card surface on hover. Stacks to two lines below 520px. */
function DataTable({
  rows = [],
  label,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("table", {
    className: ['sam-table', className].filter(Boolean).join(' '),
    "aria-label": label
  }, /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, r.label), /*#__PURE__*/React.createElement("td", {
    className: r.highlight ? 'sam-hi' : undefined
  }, r.value)))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/InfoField.jsx
try { (() => {
/* A labelled fact in a vertical stack: 14px uppercase tracked label at a fixed
   72px minimum, value in near-white beside it. */
function InfoField({
  label,
  children,
  value,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ['sam-field', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("span", {
    className: "sam-field-label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "sam-field-value"
  }, children != null ? children : value));
}
Object.assign(__ds_scope, { InfoField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/InfoField.jsx", error: String((e && e.message) || e) }); }

// components/data/MapFrame.jsx
try { (() => {
/* An embed pushed into the palette: inverted and desaturated, boxed in a
   hairline, with a red crosshair over the centre and an inner red frame.
   Reads as a targeting view rather than a map. */
function MapFrame({
  src,
  title = 'Mappa',
  height,
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ['sam-embed', className].filter(Boolean).join(' '),
    style: height ? {
      height
    } : null
  }, src ? /*#__PURE__*/React.createElement("iframe", {
    src: src,
    title: title,
    allowFullScreen: true,
    loading: "lazy",
    referrerPolicy: "no-referrer-when-downgrade"
  }) : children, /*#__PURE__*/React.createElement("div", {
    className: "sam-embed-frame"
  }));
}
Object.assign(__ds_scope, { MapFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MapFrame.jsx", error: String((e && e.message) || e) }); }

// components/data/PersonCard.jsx
try { (() => {
/* Personnel record: 4:3 portrait well under its own denser scanlines, red role
   line, Rajdhani name, then labelled contact rows. Hovering lifts the
   grayscale off the photo and reveals a 2px red rail down the left edge.

   No portraits shipped with the source, so a missing photo falls back to a
   dark well printing the initials and record id. */
function PersonCard({
  role,
  name,
  photo,
  alt,
  initials,
  recordId,
  contacts = [],
  className = ''
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: ['sam-person', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "sam-photo"
  }, photo ? /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: alt || name,
    loading: "lazy"
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--sp-2)',
      background: 'var(--sam-void)',
      border: '1px solid var(--sam-border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '28px',
      fontWeight: 600,
      letterSpacing: 'var(--track-wider)',
      color: 'var(--sam-text-muted)'
    }
  }, initials), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-micro)',
      letterSpacing: 'var(--track-wide)',
      color: 'var(--sam-text-faint)'
    }
  }, recordId))), /*#__PURE__*/React.createElement("div", {
    className: "sam-person-body"
  }, role && /*#__PURE__*/React.createElement("div", {
    className: "sam-role"
  }, role), /*#__PURE__*/React.createElement("div", {
    className: "sam-name"
  }, name), contacts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sam-contacts"
  }, contacts.map((c, i) => /*#__PURE__*/React.createElement("div", {
    className: "sam-contact",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "sam-contact-key"
  }, c.kind), c.href ? /*#__PURE__*/React.createElement("a", {
    href: c.href
  }, c.value) : /*#__PURE__*/React.createElement("span", null, c.value))))));
}
Object.assign(__ds_scope, { PersonCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/PersonCard.jsx", error: String((e && e.message) || e) }); }

// components/data/SectionHeader.jsx
try { (() => {
/* Panel header: classification chip, Rajdhani title at 0.18em tracking, and a
   right-aligned back control, over a hairline. */
function SectionHeader({
  tag,
  title,
  onBack,
  backLabel = '\u2190 Indietro',
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ['sam-section-head', className].filter(Boolean).join(' ')
  }, tag && /*#__PURE__*/React.createElement(__ds_scope.ClassificationTag, null, tag), /*#__PURE__*/React.createElement("span", {
    className: "sam-section-title"
  }, title), onBack && /*#__PURE__*/React.createElement(__ds_scope.GhostButton, {
    onClick: onBack
  }, backLabel));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/query/OptionButton.jsx
try { (() => {
/* A menu choice: bracketed index, uppercase label, arrow that steps right on
   hover while a 12% red wash sweeps across the button from the left. */
function OptionButton({
  index,
  label,
  onClick,
  arrow = '\u2192',
  width,
  disabled,
  className = ''
}) {
  const n = typeof index === 'number' ? String(index).padStart(2, '0') : index;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: ['sam-opt', className].filter(Boolean).join(' '),
    onClick: onClick,
    disabled: disabled,
    style: {
      ...(width ? {
        width
      } : null),
      ...(disabled ? {
        opacity: .45,
        cursor: 'default'
      } : null)
    }
  }, n != null && /*#__PURE__*/React.createElement("span", {
    className: "sam-opt-n"
  }, "[ ", n, " ]"), /*#__PURE__*/React.createElement("span", {
    className: "sam-opt-l"
  }, label), arrow && /*#__PURE__*/React.createElement("span", {
    className: "sam-opt-a"
  }, arrow));
}
Object.assign(__ds_scope, { OptionButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/query/OptionButton.jsx", error: String((e && e.message) || e) }); }

// components/query/QueryLine.jsx
try { (() => {
const {
  useEffect,
  useState
} = React;
/* The system's question, typed one character at a time (48ms + up to 28ms
   jitter), preceded by a red prompt and trailed by a blinking block cursor
   that disappears once typing finishes. */
function QueryLine({
  text = '',
  typing = true,
  speed = 48,
  jitter = 28,
  label = '\u25b8 INTERFACCIA UTENTE ATTIVA \u25c2',
  prompt = '>',
  onDone,
  className = ''
}) {
  const [out, setOut] = useState(typing ? '' : text);
  const [done, setDone] = useState(!typing);
  useEffect(() => {
    if (!typing) {
      setOut(text);
      setDone(true);
      return;
    }
    let i = 0,
      id;
    const step = () => {
      if (i < text.length) {
        i += 1;
        setOut(text.slice(0, i));
        id = setTimeout(step, speed + Math.random() * jitter);
      } else {
        id = setTimeout(() => {
          setDone(true);
          if (onDone) onDone();
        }, 280);
      }
    };
    id = setTimeout(step, 0);
    return () => clearTimeout(id);
  }, [text, typing]);
  return /*#__PURE__*/React.createElement("div", {
    className: ['sam-query', className].filter(Boolean).join(' ')
  }, label && /*#__PURE__*/React.createElement("div", {
    className: "sam-query-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "sam-query-line"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sam-query-prompt"
  }, prompt), /*#__PURE__*/React.createElement("span", {
    className: "sam-query-text"
  }, out), !done && /*#__PURE__*/React.createElement("span", {
    className: "sam-cursor"
  })));
}
Object.assign(__ds_scope, { QueryLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/query/QueryLine.jsx", error: String((e && e.message) || e) }); }

// ui_kits/samaritan-console/App.jsx
try { (() => {
/* Interactive recreation of contatti/index.html.
   Phase machine and every timing taken from j/contatti.js:

     boot   staggered log (380ms + rnd 200), progress fill (1.6s linear),
            ACCESSO CONCESSO at +1800ms, hand-off at +900ms
     ->     boot fades out over .4s, query mounts 420ms later
     query  question typed at 48ms + rnd 28 per char, then the option
            stack fades in over .6s
     ->     query fades out over .25s, panel mounts 260ms later
     result one panel at a time, rising 14px over .38s

   window.__SAM_START = { phase, panel } opens a screen on a specific state
   without replaying the intro. */
const {
  Shell,
  Stage,
  StatusBar,
  StatusFooter,
  BrandMark,
  BootSequence,
  QueryLine,
  OptionButton
} = window.SamaritanDesignSystem_bd654b;
const {
  BillingPanel,
  ContactsPanel,
  OrgPanel,
  PLATE
} = window;
const BOOT_LINES = [{
  text: /*#__PURE__*/React.createElement(React.Fragment, null, "INIZIALIZZAZIONE SISTEMA HELIOH", /*#__PURE__*/React.createElement("sub", null, "2"))
}, {
  text: /*#__PURE__*/React.createElement(React.Fragment, null, "PROTOCOLLI DI SICUREZZA: ", /*#__PURE__*/React.createElement("span", {
    className: "g"
  }, "ATTIVI"))
}, {
  text: /*#__PURE__*/React.createElement(React.Fragment, null, "CONNESSIONE CRITTOGRAFATA: ", /*#__PURE__*/React.createElement("span", {
    className: "g"
  }, "VERIFICATA"))
}, {
  text: 'AUTENTICAZIONE UTENTE IN CORSO'
}];
const PANELS = {
  fatturazione: BillingPanel,
  contatti: ContactsPanel,
  org: OrgPanel
};
function Console() {
  const start = window.__SAM_START || {};
  const [phase, setPhase] = React.useState(start.phase || 'boot');
  const [panel, setPanel] = React.useState(start.panel || null);
  const [optsIn, setOptsIn] = React.useState((start.phase || 'boot') !== 'boot');
  const [fx, setFx] = React.useState({
    o: 1,
    d: '.4s'
  });

  /* fade the stage out, swap, fade back in — the source does this by
     setting style.opacity and style.transition directly */
  const swap = (dur, hold, fn) => {
    setFx({
      o: 0,
      d: dur
    });
    setTimeout(() => {
      fn();
      setFx({
        o: 1,
        d: dur
      });
    }, hold);
  };
  const toQuery = () => swap('.4s', 420, () => setPhase('query'));
  const open = id => swap('.25s', 260, () => {
    setPanel(id);
    setPhase('result');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  const back = () => swap('.3s', 260, () => {
    setPanel(null);
    setPhase('query');
    setOptsIn(true);
  });
  const Panel = panel ? PANELS[panel] : null;
  return /*#__PURE__*/React.createElement(Shell, {
    contained: true,
    plate: PLATE
  }, /*#__PURE__*/React.createElement(StatusBar, {
    right: [/*#__PURE__*/React.createElement(React.Fragment, null, "HELIOH", /*#__PURE__*/React.createElement("sub", null, "2"), " SYSTEM v2.0"), 'CONNESSIONE SICURA']
  }), /*#__PURE__*/React.createElement(Stage, null, /*#__PURE__*/React.createElement(BrandMark, {
    glitch: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity: fx.o,
      transition: 'opacity ' + fx.d
    }
  }, phase === 'boot' && /*#__PURE__*/React.createElement(BootSequence, {
    lines: BOOT_LINES,
    grant: {
      text: 'ACCESSO CONCESSO',
      tone: 'w'
    },
    onDone: toQuery
  }), phase === 'query' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(QueryLine, {
    text: "BENVENUTO, COSA STAI CERCANDO?",
    typing: !optsIn,
    onDone: () => setOptsIn(true)
  }), /*#__PURE__*/React.createElement("div", {
    className: 'sam-opts' + (optsIn ? ' show' : '')
  }, /*#__PURE__*/React.createElement(OptionButton, {
    index: 1,
    label: "Dati di Fatturazione",
    onClick: () => open('fatturazione')
  }), /*#__PURE__*/React.createElement(OptionButton, {
    index: 2,
    label: "Contatti Aziendali",
    onClick: () => open('contatti')
  }), /*#__PURE__*/React.createElement(OptionButton, {
    index: 3,
    label: "Organizzazione",
    onClick: () => open('org')
  }))), phase === 'result' && Panel && /*#__PURE__*/React.createElement("div", {
    className: "sam-result anim",
    key: panel
  }, /*#__PURE__*/React.createElement(Panel, {
    onBack: back
  })))), /*#__PURE__*/React.createElement(StatusFooter, {
    items: [/*#__PURE__*/React.createElement(React.Fragment, null, "HELIOH", /*#__PURE__*/React.createElement("sub", null, "2"), " - SISTEMA SICURO"), null, 'SESSION ENCRYPTED']
  }));
}
Object.assign(window, {
  Console,
  BOOT_LINES,
  PANELS
});
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(Console, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/samaritan-console/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/samaritan-console/panels.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Panel content for the HelioH2 Samaritan console.
   Copy is verbatim from contatti/index.html — nothing rewritten, nothing
   translated. Portraits are absent from the attached source, so PersonCard
   falls back to its initials well. */
const {
  SectionHeader,
  DataTable,
  InfoField,
  PersonCard,
  MapFrame
} = window.SamaritanDesignSystem_bd654b;
const BILLING = [{
  label: 'Ragione Sociale',
  value: /*#__PURE__*/React.createElement(React.Fragment, null, "HelioH", /*#__PURE__*/React.createElement("sub", null, "2"), " S.r.l."),
  highlight: true
}, {
  label: 'Forma Giuridica',
  value: 'Società a Responsabilità Limitata'
}, {
  label: 'Partita IVA',
  value: 'IT13333950015'
}, {
  label: 'PEC',
  value: /*#__PURE__*/React.createElement("a", {
    href: "mailto:helioh2@pec.it"
  }, "helioh2@pec.it")
}, {
  label: 'IBAN',
  value: 'IT43Q0326822300052916125810'
}, {
  label: 'Banca',
  value: 'Banca Sella S.p.A.'
}];
const MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d974.6676063771146!2d7.663885254699164!3d45.00029868139517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sit!4v1775521068384!5m2!1sen!2sit';

/* Imagery lives on the live site; the s/ folder was not mounted, so these are
   absolute URLs rather than local copies. Swap to assets/ paths once the files
   are added to the project. */
const S = 'https://www.helioh2.com/s/images/';
const PLATE = S + 'Helioh2.png';
const PEOPLE = [{
  role: 'Direttore Esecutivo',
  name: 'Gabriel Occhino',
  initials: 'GO',
  recordId: 'ID-001',
  photo: S + 'soci/gabriel.jpeg',
  contacts: [{
    kind: 'TEL',
    value: '+39 393 158 0197',
    href: 'tel:+393931580197'
  }, {
    kind: 'MAIL',
    value: 'gabriel@helioh2.com',
    href: 'mailto:gabriel@helioh2.com'
  }]
}, {
  role: 'Direttore Operativo',
  name: 'Davide Occhino',
  initials: 'DO',
  recordId: 'ID-002',
  photo: S + 'soci/davide.jpeg',
  contacts: [{
    kind: 'MAIL',
    value: 'davide@helioh2.com',
    href: 'mailto:davide@helioh2.com'
  }]
}, {
  role: 'Direttrice Innovazione',
  name: 'Paola Francone',
  initials: 'PF',
  recordId: 'ID-003',
  photo: S + 'soci/paola.jpeg',
  contacts: [{
    kind: 'MAIL',
    value: 'paola@helioh2.com',
    href: 'mailto:paola@helioh2.com'
  }]
}, {
  role: 'Direttore Tecnico',
  name: 'Federico Genesio',
  initials: 'FG',
  recordId: 'ID-004',
  photo: S + 'soci/federico.jpeg',
  contacts: [{
    kind: 'MAIL',
    value: 'federico@helioh2.com',
    href: 'mailto:federico@helioh2.com'
  }]
}];
function BillingPanel({
  onBack
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionHeader, {
    tag: "Classificato",
    title: "Dati di Fatturazione",
    onBack: onBack
  }), /*#__PURE__*/React.createElement(DataTable, {
    label: "Dati di fatturazione",
    rows: BILLING
  }));
}
function ContactsPanel({
  onBack
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionHeader, {
    tag: "Verificato",
    title: "Contatti Aziendali",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    className: "sam-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sam-fields"
  }, /*#__PURE__*/React.createElement(InfoField, {
    label: "Codice Fiscale / Partita IVA"
  }, "IT13333950015"), /*#__PURE__*/React.createElement(InfoField, {
    label: "Codice REA"
  }, "TO-1355800"), /*#__PURE__*/React.createElement(InfoField, {
    label: "Capitale Sociale"
  }, "35.000\u20AC"), /*#__PURE__*/React.createElement(InfoField, {
    label: "Indirizzo"
  }, "strada delle Finanze 19 bis", /*#__PURE__*/React.createElement("br", null), "10024 Moncalieri (TO), Italia"), /*#__PURE__*/React.createElement(InfoField, {
    label: "Telefono"
  }, /*#__PURE__*/React.createElement("a", {
    href: "tel:+393755853424"
  }, "+393755853424")), /*#__PURE__*/React.createElement(InfoField, {
    label: "Email"
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:info@helioh2.com"
  }, "info@helioh2.com")), /*#__PURE__*/React.createElement(InfoField, {
    label: "Web"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.helioh2.com",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "www.helioh2.com")), /*#__PURE__*/React.createElement(InfoField, {
    label: "Settore"
  }, "Energia Rinnovabile - Solare & Idrogeno")), /*#__PURE__*/React.createElement(MapFrame, {
    src: MAP_SRC,
    title: "Mappa sede HelioH2"
  })));
}
function OrgPanel({
  onBack
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionHeader, {
    tag: "Riservato",
    title: "Organizzazione",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    className: "sam-grid"
  }, PEOPLE.map(p => /*#__PURE__*/React.createElement(PersonCard, _extends({
    key: p.recordId
  }, p)))));
}
Object.assign(window, {
  BillingPanel,
  ContactsPanel,
  OrgPanel,
  BILLING,
  PEOPLE,
  MAP_SRC,
  PLATE,
  S
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/samaritan-console/panels.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BootSequence = __ds_scope.BootSequence;

__ds_ns.ProgressLine = __ds_scope.ProgressLine;

__ds_ns.BrandMark = __ds_scope.BrandMark;

__ds_ns.CornerBrackets = __ds_scope.CornerBrackets;

__ds_ns.Shell = __ds_scope.Shell;

__ds_ns.Stage = __ds_scope.Stage;

__ds_ns.StatusBar = __ds_scope.StatusBar;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.StatusFooter = __ds_scope.StatusFooter;

__ds_ns.GhostButton = __ds_scope.GhostButton;

__ds_ns.ClassificationTag = __ds_scope.ClassificationTag;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.InfoField = __ds_scope.InfoField;

__ds_ns.MapFrame = __ds_scope.MapFrame;

__ds_ns.PersonCard = __ds_scope.PersonCard;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.OptionButton = __ds_scope.OptionButton;

__ds_ns.QueryLine = __ds_scope.QueryLine;

})();

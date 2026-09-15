/* Sheet-to-sheet navigation for the Bisplot brand system.
 *
 * Hand-written and must survive a canvas re-export. The `.dc.html` artboards are
 * generated output, so the <script> tag that loads this file is stamped into them
 * by apply-nav.py — re-run that after every export (see README).
 *
 * Renders into a shadow root so neither design system in _ds/ can reach its styles,
 * and appends to <body> after <x-dc>, which support.js never replaces.
 */
(function () {
  'use strict';

  var SHEETS = [
    ['index.html', 'Index', 'Brand system'],
    ['1_Brand_Whole_System.dc.html', '01', 'One company, four brands'],
    ['2_Business_Model.html', '02', 'How the group earns'],
    ['3_Funnels.html', '03', 'How people move'],
    ['4_Brand_Bisplot.dc.html', '04', 'The holding, applied'],
    ['5_Brand_SmartAI.dc.html', '05', 'SAI.wiki'],
    ['6_Brand_BusinessAI.dc.html', '06', 'BusinessAI.academy'],
    ['7_Brand_HouseOfVibes.dc.html', '07', 'HouseOfVibes'],
    ['7b_Brand_HouseOfVibes_Samaritan.dc.html', '07b', 'HouseOfVibes \u00D7 Samaritan'],
    ['8_Mascotte.dc.html', '08', 'Three characters, two brands']
  ];

  function basename(path) {
    var clean = path.split('?')[0].split('#')[0];
    var name = clean.substring(clean.lastIndexOf('/') + 1);
    return name === '' ? 'index.html' : decodeURIComponent(name);
  }

  var here = basename(location.pathname);
  var i = -1;
  for (var n = 0; n < SHEETS.length; n++) {
    if (SHEETS[n][0] === here) { i = n; break; }
  }
  if (i === -1) return; // not one of the sheets — render nothing

  var prev = i > 0 ? SHEETS[i - 1] : null;
  var next = i < SHEETS.length - 1 ? SHEETS[i + 1] : null;

  var CSS = [
    ':host { all: initial; }',
    '.bar {',
    '  position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);',
    '  z-index: 2147483000;',
    '  display: flex; align-items: stretch; gap: 2px;',
    '  padding: 4px; border-radius: 999px;',
    '  background: rgba(255,255,255,.93); border: 1px solid rgba(0,0,0,.13);',
    '  box-shadow: 0 2px 10px rgba(0,0,0,.13), 0 0 0 .5px rgba(255,255,255,.6) inset;',
    '  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);',
    '  font-family: ui-sans-serif, -apple-system, "Segoe UI", Inter, system-ui, sans-serif;',
    '  opacity: .78; transition: opacity .18s ease;',
    '  max-width: calc(100vw - 24px);',
    '}',
    '.bar:hover, .bar:focus-within { opacity: 1; }',
    'a {',
    '  display: flex; align-items: center; gap: 7px;',
    '  padding: 7px 13px; border-radius: 999px;',
    '  text-decoration: none; color: #16170F;',
    '  font-size: 13px; line-height: 1; white-space: nowrap;',
    '  min-width: 0;',
    '}',
    'a:hover { background: rgba(0,0,0,.055); }',
    'a:focus-visible { outline: 2px solid #5A6650; outline-offset: -2px; }',
    '.chev { color: #6B675E; font-size: 15px; line-height: 1; flex: none; }',
    '.lab { overflow: hidden; text-overflow: ellipsis; max-width: 22ch; }',
    '.num {',
    '  font-family: ui-monospace, "IBM Plex Mono", SFMono-Regular, Menlo, monospace;',
    '  font-size: 11px; letter-spacing: .1em; color: #5A6650; flex: none;',
    '}',
    '.hub {',
    '  display: flex; align-items: center; padding: 7px 12px;',
    '  border-radius: 999px; text-decoration: none;',
    '  font-family: ui-monospace, "IBM Plex Mono", SFMono-Regular, Menlo, monospace;',
    '  font-size: 11px; letter-spacing: .08em; color: #6B675E;',
    '}',
    '.hub:hover { background: rgba(0,0,0,.055); color: #16170F; }',
    '.sep { width: 1px; background: rgba(0,0,0,.11); margin: 6px 1px; flex: none; }',
    '@media (max-width: 620px) { .lab { display: none; } a { padding: 8px 12px; } }',
    '@media print { .bar { display: none !important; } }'
  ].join('\n');

  function link(sheet, dir) {
    var a = document.createElement('a');
    a.href = sheet[0];
    a.rel = dir === 'prev' ? 'prev' : 'next';
    a.title = (dir === 'prev' ? 'Previous: ' : 'Next: ') + sheet[2];
    a.setAttribute('aria-label', a.title);

    var chev = document.createElement('span');
    chev.className = 'chev';
    chev.textContent = dir === 'prev' ? '‹' : '›';

    var num = document.createElement('span');
    num.className = 'num';
    num.textContent = sheet[1];

    var lab = document.createElement('span');
    lab.className = 'lab';
    lab.textContent = sheet[2];

    if (dir === 'prev') { a.append(chev, num, lab); }
    else { a.append(num, lab, chev); }
    return a;
  }

  function build() {
    if (document.getElementById('bisplot-nav')) return;

    var host = document.createElement('div');
    host.id = 'bisplot-nav';
    var root = host.attachShadow({ mode: 'open' });

    var style = document.createElement('style');
    style.textContent = CSS;

    var bar = document.createElement('nav');
    bar.className = 'bar';
    bar.setAttribute('aria-label', 'Sheet navigation');

    if (prev) { bar.appendChild(link(prev, 'prev')); }

    var hub = document.createElement('a');
    hub.className = 'hub';
    hub.href = 'index.html';
    hub.textContent = i === 0 ? '10 sheets' : i + ' / ' + (SHEETS.length - 1);
    hub.title = 'All sheets';
    if (prev) { var s1 = document.createElement('span'); s1.className = 'sep'; bar.appendChild(s1); }
    bar.appendChild(hub);
    if (next) { var s2 = document.createElement('span'); s2.className = 'sep'; bar.appendChild(s2); }

    if (next) { bar.appendChild(link(next, 'next')); }

    root.append(style, bar);
    document.body.appendChild(host);
  }

  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
    if (e.key === 'ArrowLeft' && prev) { location.href = prev[0]; }
    else if (e.key === 'ArrowRight' && next) { location.href = next[0]; }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

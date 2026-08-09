const body = document.body;
const toggle = document.querySelector('.menu-toggle');
const routeInput = document.querySelector('#route-input');
const routeStatus = document.querySelector('#route-status');
const detailLabel = document.querySelector('#detail-label');
const detailInput = document.querySelector('[name="detail"]');

toggle.addEventListener('click', () => {
  const open = body.classList.toggle('menu-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  body.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
}));

function setRoute(route) {
  if (!routeInput || !routeStatus || !detailLabel || !detailInput) return;
  const founder = route === 'founder';
  routeInput.value = route;
  detailLabel.firstChild.textContent = founder ? 'What makes you want to build?' : 'What opportunity are you seeing?';
  detailInput.placeholder = founder
    ? 'What kind of founder you want to become, what you have already built or run, and where you think your opportunity sits. Rough is fine — vague is not.'
    : 'Who has the problem, how you know it is real, and what you would do first. Rough is fine — vague is not. We cannot work on an idea with no evidence behind it.';
  // Both route labels are now permanent buttons inside #route-status, so the
  // selection is shown by the active class rather than by rewriting the text.
  document.querySelectorAll('[data-route-link]').forEach((link) => {
    const on = link.dataset.routeLink === route;
    link.classList.toggle('active', on);
    if (link.tagName === 'BUTTON') link.setAttribute('aria-pressed', String(on));
  });
}

document.querySelectorAll('[data-set-route], [data-route-link]').forEach((element) => {
  element.addEventListener('click', () => setRoute(element.dataset.setRoute || element.dataset.routeLink));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.addEventListener('pointermove', (event) => {
  document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
});

document.querySelector('#year').textContent = new Date().getFullYear();

// Contact roulette. Each page load picks a contraption — the mill's wheel or
// the well's bucket. Working it for five seconds turns up one of the three
// familiars, and with it that partner's address.
const spinRoot = document.querySelector('[data-spin-root]');
if (spinRoot) {
  const PARTNERS = [
    { face: 'davide', name: 'Davide', mail: 'davide@tenm.studio' },
    { face: 'matteo', name: 'Matteo', mail: 'matteo@tenm.studio' },
    { face: 'gabriel', name: 'Gabriel', mail: 'gabriel@tenm.studio' },
  ];
  const DURATION = 5000;
  const WHEEL_TURNS = 4.5; // rotations of the mill wheel over the run
  const PAIL_BOTTOM = 140; // pail sunk in the water
  const PAIL_TOP = 44; // pail drawn up under the beam

  const RIGS = {
    mill: { verb: 'Spin the wheel', again: 'Spin again', busy: 'Spinning…' },
    well: { verb: 'Pull the bucket', again: 'Pull again', busy: 'Pulling…' },
  };

  const button = spinRoot.querySelector('[data-spin]');
  const label = spinRoot.querySelector('[data-spin-label]');
  const verb = spinRoot.querySelector('[data-spin-verb]');
  const result = spinRoot.querySelector('[data-spin-result]');
  const wheel = spinRoot.querySelector('[data-spin-wheel]');
  const rope = spinRoot.querySelector('[data-well-rope]');
  const pail = spinRoot.querySelector('[data-well-pail]');
  const ripple = spinRoot.querySelector('[data-well-ripple]');
  const faces = PARTNERS.map((partner) => spinRoot.querySelector(`[data-face="${partner.face}"]`));
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Which contraption the visitor gets is decided once, on load.
  const names = Object.keys(RIGS);
  const rig = names[Math.floor(Math.random() * names.length)];
  spinRoot.dataset.rig = rig;
  label.textContent = RIGS[rig].verb;
  verb.textContent = RIGS[rig].verb;

  const drive = (eased, t) => {
    if (rig === 'mill') {
      wheel.style.transform = `rotate(${eased * WHEEL_TURNS * 360}deg)`;
      return;
    }
    const y = PAIL_BOTTOM + (PAIL_TOP - PAIL_BOTTOM) * eased;
    const sway = Math.sin(t * Math.PI * 5) * 7 * (1 - eased); // settles as it rises
    rope.setAttribute('y2', y.toFixed(1));
    pail.setAttribute('transform', `translate(0 ${y.toFixed(1)}) rotate(${sway.toFixed(2)} 100 0)`);
    // The surface keeps rippling where the pail broke through.
    ripple.setAttribute('rx', (20 + eased * 34).toFixed(1));
    ripple.setAttribute('ry', (4 + eased * 7).toFixed(1));
    ripple.style.opacity = String(1 - eased);
  };

  const show = (index) => faces.forEach((face, i) => face.classList.toggle('is-active', i === index));

  const settle = (index) => {
    const partner = PARTNERS[index];
    show(index);
    spinRoot.removeAttribute('data-spinning');
    spinRoot.setAttribute('data-picked', '');
    button.disabled = false;
    label.textContent = RIGS[rig].again;
    result.innerHTML = `<b>You got ${partner.name}</b><a class="contact-mail" href="mailto:${partner.mail}">${partner.mail} <span>↗</span></a>`;
  };

  button.addEventListener('click', () => {
    if (spinRoot.hasAttribute('data-spinning')) return;
    const winner = Math.floor(Math.random() * PARTNERS.length);

    if (calm.matches) { settle(winner); return; }

    spinRoot.removeAttribute('data-picked');
    spinRoot.setAttribute('data-spinning', '');
    button.disabled = true;
    label.textContent = RIGS[rig].busy;
    result.textContent = '';

    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 2); // fast off the mark, slow into the stop
      drive(eased, t);
      if (t < 1) requestAnimationFrame(step);
      else settle(winner);
    };
    requestAnimationFrame(step);
  });
}

// Word floor on the long-answer field. HTML only offers minlength (characters),
// so the count and the block on submit are done here.
document.querySelectorAll('textarea[data-min-words]').forEach((field) => {
  const min = Number(field.dataset.minWords);
  const readout = field.parentElement.querySelector('[data-word-count]');
  const count = () => field.value.trim().split(/\s+/).filter(Boolean).length;

  const sync = () => {
    const words = count();
    const short = words < min;
    field.setCustomValidity(short ? `Please write at least ${min} words — ${words} so far.` : '');
    if (readout) {
      readout.textContent = `${words} / ${min} words minimum`;
      readout.classList.toggle('is-short', short);
    }
  };

  field.addEventListener('input', sync);
  sync();
});

// Optional: the landing and who-we-are pages carry no form.
document.querySelector('#idea-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.innerHTML = document.body.classList.contains('business-page') ? 'Opportunity received <b>✓</b>' : 'First signal received <b>✓</b>';
  button.disabled = true;
});

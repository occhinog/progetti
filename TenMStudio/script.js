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

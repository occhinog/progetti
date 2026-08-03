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
  routeStatus.innerHTML = founder ? '<span>02</span> I want to become a founder' : '<span>01</span> I have an idea';
  detailLabel.firstChild.textContent = founder ? 'What makes you want to build?' : 'What opportunity are you seeing?';
  detailInput.placeholder = founder ? 'Tell us what kind of founder you want to become.' : 'A rough idea is enough.';
  document.querySelectorAll('[data-route-link]').forEach((link) => link.classList.toggle('active', link.dataset.routeLink === route));
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

document.querySelector('#idea-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.innerHTML = document.body.classList.contains('business-page') ? 'Opportunity received <b>✓</b>' : 'First signal received <b>✓</b>';
  button.disabled = true;
});

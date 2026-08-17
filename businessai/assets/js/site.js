(function () {
  "use strict";

  const body = document.body;
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const siteHeader = toggle ? toggle.closest(".site-header") : null;
  const backgroundNodes = Array.from(body.children).filter(function (node) {
    return node !== siteHeader && node.tagName !== "SCRIPT";
  });

  function setBackgroundInert(isInert) {
    backgroundNodes.forEach(function (node) {
      if (isInert) node.setAttribute("inert", "");
      else node.removeAttribute("inert");
    });
  }

  function closeMenu(restoreFocus) {
    body.classList.remove("nav-open");
    setBackgroundInert(false);
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Apri il menu");
      if (restoreFocus) toggle.focus();
    }
  }

  function openMenu() {
    body.classList.add("nav-open");
    setBackgroundInert(true);
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Chiudi il menu");
    const firstLink = nav.querySelector("a[href]");
    if (firstLink) firstLink.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (body.classList.contains("nav-open")) closeMenu(false);
      else openMenu();
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      const isOpen = body.classList.contains("nav-open");
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }

      if (event.key === "Tab") {
        const focusable = [toggle].concat(Array.from(nav.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeMenu(false);
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  const isLocal = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
  if (isLocal) {
    document.querySelectorAll("[data-local-href]").forEach(function (link) {
      link.setAttribute("href", link.getAttribute("data-local-href"));
    });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      reveals.forEach(function (node) { node.classList.add("is-visible"); });
    } else {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (node) { observer.observe(node); });
    }
  }
})();

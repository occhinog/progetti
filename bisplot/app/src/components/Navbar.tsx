import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'Problema', href: '#problema' },
  { label: 'Cosa Facciamo', href: '#soluzioni' },
  { label: 'Controllo Umano', href: '#metodo' },
  { label: 'Percorso', href: '#fasi' },
] as const;

const ctaClasses =
  'bg-terracotta text-white hover:bg-terracotta-hover text-sm font-medium px-4 py-2 rounded-md transition-colors font-sans focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the mobile panel on Escape and when the viewport grows past `md`.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const mq = window.matchMedia('(min-width: 768px)');
    const onResize = () => {
      if (mq.matches) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-light bg-[rgba(255,255,255,0.85)] backdrop-blur-md">
      {/* md+: three-column grid so the links sit on the true centre axis. */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr] lg:px-8">
        <a
          href="#inizio"
          onClick={close}
          aria-label="Bisplot — torna all’inizio"
          className="justify-self-start rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
        >
          <Logo />
        </a>

        <nav aria-label="Navigazione principale" className="hidden md:flex">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-body text-sm text-ink-500 transition-colors hover:text-ink-900 focus-visible:text-ink-900 focus-visible:outline-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <a href="#contatto" onClick={close} className={`hidden min-[360px]:inline-flex ${ctaClasses}`}>
            Richiedi Diagnosi
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-900 transition-colors hover:bg-canvas-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink-900 md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div id="menu-mobile" hidden={!open} className="border-t border-light bg-white md:hidden">
        <nav aria-label="Navigazione mobile" className="mx-auto max-w-6xl px-4 pb-6 pt-2 sm:px-6">
          <ul className="divide-y divide-border-light">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={close}
                  className="flex items-center justify-between py-4 font-sans text-base font-medium text-ink-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Only needed below 360px, where the header CTA is hidden. */}
          <a href="#contatto" onClick={close} className={`mt-4 flex w-full justify-center py-3 min-[360px]:hidden ${ctaClasses}`}>
            Richiedi Diagnosi
          </a>
        </nav>
      </div>
    </header>
  );
}

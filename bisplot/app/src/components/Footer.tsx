import Logo from './Logo';
import { siteConfig } from '../config';

const linkClasses =
  'underline decoration-border-focus underline-offset-4 transition-colors hover:text-ink-900 hover:decoration-ink-900';

export default function Footer() {
  return (
    <footer className="bg-canvas-white border-t border-border-light">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-10 font-body text-xs text-ink-500 sm:px-6 md:flex-row lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <Logo size="sm" />
          <span className="hidden h-4 w-px bg-border-focus sm:block" aria-hidden="true" />
          <p>Procedure operative &amp; automazione silenziosa per le PMI</p>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
          <p>© 2026 Bisplot. Tutti i diritti riservati.</p>
          <nav aria-label="Note legali e privacy" className="flex items-center gap-5">
            <a href={siteConfig.legalNotesUrl} className={linkClasses}>
              Note legali
            </a>
            <a href={siteConfig.privacyUrl} className={linkClasses}>
              Privacy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

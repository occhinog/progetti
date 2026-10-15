import Logo from './Logo';
import { siteConfig } from '../config';

export default function Footer() {
  return (
    <footer className="bg-canvas-white border-t border-border-light">
      <div className="text-xs text-ink-500 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 font-body">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Logo size="sm" />
          <span className="hidden h-4 w-px bg-border-focus sm:block" aria-hidden="true" />
          <p>Sistemi dati &amp; AI per il lavoro umano.</p>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
          <p>© 2026 Bisplot. Tutti i diritti riservati.</p>
          <a
            href={siteConfig.privacyUrl}
            className="underline decoration-border-focus underline-offset-4 transition-colors hover:text-ink-900 hover:decoration-ink-900"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}

import { ArrowRight, FileText, Layers, Users, type LucideIcon } from 'lucide-react';

type Point = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const POINTS: Point[] = [
  {
    icon: FileText,
    title: 'Zero nuove schermate:',
    text: 'il personale continua a usare le email e i gestionali di sempre.',
  },
  {
    icon: Layers,
    title: 'Tecnologia sotto il cofano:',
    text: "i dati si muovono da soli, verificati e pronti all'uso.",
  },
  {
    icon: Users,
    title: 'Affiancamento continuo:',
    text: 'siamo al fianco delle tue persone, prima, durante e dopo.',
  },
];

export default function Hero() {
  return (
    <section
      id="inizio"
      aria-labelledby="hero-title"
      className="border-b border-border-light bg-gradient-to-b from-white to-canvas-subtle"
    >
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-wider text-ink-500 bg-canvas-subtle border border-border-light px-3 py-1 rounded-sm inline-block mb-6 text-balance">
          ORGANIZZAZIONE DEI PROCESSI &amp; TECNOLOGIA INVISIBILE PER LE PMI
        </p>

        <h1
          id="hero-title"
          className="mx-auto max-w-5xl text-balance font-sans text-4xl font-semibold leading-[1.12] tracking-tight text-ink-900 sm:text-5xl lg:text-[3.25rem]"
        >
          Nessun nuovo software da imparare.
          <br />
          <span className="text-ink-500">Solo procedure più veloci e persone libere di lavorare.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-ink-500 sm:text-xl">
          Non ti vendiamo un'altra piattaforma da aprire la mattina. Entriamo nei tuoi flussi aziendali, eliminiamo le
          ore perse tra documenti e fogli di calcolo, e facciamo lavorare l'automazione in background, mentre il tuo
          team fa il suo lavoro.
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
          <a
            href="#contatto"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-terracotta px-6 py-3.5 font-sans text-base font-medium text-white shadow-sm transition-colors hover:bg-terracotta-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
          >
            Richiedi una diagnosi operativa
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
          </a>
          <a
            href="#casi-studio"
            className="rounded-md px-5 py-3.5 font-sans text-base font-medium text-ink-900 transition-colors hover:text-ink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink-900"
          >
            Guarda come cambia la giornata in azienda <span aria-hidden="true">↓</span>
          </a>
        </div>

        <ul className="mt-16 grid gap-6 border-t border-border-light pt-10 text-left sm:grid-cols-3 sm:gap-8">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ink-500" strokeWidth={1.5} aria-hidden="true" />
              <p className="font-body text-sm leading-relaxed text-ink-500">
                <strong className="font-sans font-semibold text-ink-900">{title}</strong> {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

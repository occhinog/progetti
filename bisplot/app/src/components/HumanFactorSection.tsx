import { CircleAlert, FileSearch, ShieldCheck, type LucideIcon } from 'lucide-react';

type Principle = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const PRINCIPLES: Principle[] = [
  {
    icon: FileSearch,
    title: 'Tracciabilità totale',
    text: 'Per ogni dato estratto o suggerimento fornito, il sistema mostra esattamente la pagina, la riga o il documento di provenienza.',
  },
  {
    icon: CircleAlert,
    title: 'Segnalazione dei dubbi',
    text: "Se una scansione è illeggibile o un dato è ambiguo, l'AI non tenta di indovinare: segnala l'anomalia all'operatore per la revisione manuale.",
  },
  {
    icon: ShieldCheck,
    title: 'Nessun invio non autorizzato',
    text: 'Nessun ordine parte, nessuna fattura viene emessa e nessuna comunicazione viene spedita senza una conferma esplicita del personale.',
  },
];

export default function HumanFactorSection() {
  return (
    <section
      id="metodo"
      aria-labelledby="metodo-title"
      className="border-t border-border-light bg-canvas-white py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-ink-500">
            <span aria-hidden="true" className="h-px w-6 bg-border-focus" />
            IL CRITERIO NON NEGOZIABILE
          </p>
          <h2
            id="metodo-title"
            className="mt-5 text-balance font-sans text-3xl font-semibold leading-[1.2] tracking-tight text-ink-900 sm:text-4xl"
          >
            L’AI prepara il lavoro. La persona convalida.
          </h2>
          <p className="mt-5 font-body text-lg leading-relaxed text-ink-500">
            Non crediamo nei sistemi opachi né nell'automazione incontrollata. Progettiamo strumenti che aumentano la
            velocità delle persone garantendo piena trasparenza e responsabilità.
          </p>
        </div>

        <ol className="divide-y divide-border-light border-y border-border-light lg:col-span-7">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-5 py-8 sm:gap-6 sm:py-10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-light bg-canvas-subtle">
                <Icon className="h-5 w-5 text-ink-900" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-sans text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
                <p className="mt-2 font-body text-base leading-relaxed text-ink-500">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

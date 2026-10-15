import { Clock, RefreshCw, UserRound, type LucideIcon } from 'lucide-react';

type Guarantee = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const GUARANTEES: Guarantee[] = [
  {
    icon: RefreshCw,
    title: 'Adattamento costante',
    text: 'Se un fornitore cambia formato di fattura o se acquisite una nuova linea di prodotto, aggiorniamo noi la procedura.',
  },
  {
    icon: UserRound,
    title: 'Interlocutore dedicato',
    text: 'Parli direttamente con chi ha progettato il flusso della tua azienda, non con un call center o un ticket bot.',
  },
  {
    icon: Clock,
    title: 'Misurazione periodica',
    text: 'Monitoriamo i tempi di elaborazione e il tasso di errore per mostrarti esattamente come sta evolvendo il tuo organico di lavoro.',
  },
];

export default function SupportSection() {
  return (
    <section
      id="affiancamento"
      aria-labelledby="affiancamento-title"
      className="border-t border-border-light bg-canvas-subtle py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-ink-500">
            <span aria-hidden="true" className="h-px w-6 bg-ink-900/20" />
            Affiancamento
          </p>
          <h2
            id="affiancamento-title"
            className="mt-5 text-balance font-sans text-3xl font-semibold leading-[1.2] tracking-tight text-ink-900 sm:text-4xl"
          >
            Non consegniamo una scatola per poi sparire.
          </h2>
          <p className="mt-5 font-body text-lg leading-relaxed text-ink-500">
            I software tradizionali lasciano l'azienda da sola davanti a un manuale di istruzioni. Noi restiamo il tuo
            reparto operativo di fiducia.
          </p>
        </div>

        <ul className="divide-y divide-border-light border-y border-border-light lg:col-span-7">
          {GUARANTEES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-5 py-8 sm:gap-6 sm:py-10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-light bg-white">
                <Icon className="h-5 w-5 text-ink-900" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-sans text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
                <p className="mt-2 font-body text-base leading-relaxed text-ink-500">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

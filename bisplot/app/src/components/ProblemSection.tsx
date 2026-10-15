import { Database, FileText, Keyboard, Search, type LucideIcon } from 'lucide-react';
import SectionHeader from './SectionHeader';

type Problem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const PROBLEMS: Problem[] = [
  {
    icon: FileText,
    title: 'Informazioni intrappolate nei documenti',
    text: 'Ordini, preventivi, schede fornitore e contratti arrivano via email o PDF e devono essere letti e ricopiati a mano riga per riga.',
  },
  {
    icon: Database,
    title: 'Archivi non allineati',
    text: "Il gestionale dice una cosa, il foglio Excel del responsabile ne dice un'altra, la casella di posta un'altra ancora.",
  },
  {
    icon: Search,
    title: 'Ricerche estenuanti',
    text: 'Trovare un precedente storico, una specifica o un listino concordato richiede decine di minuti tra cartelle di rete e chat interne.',
  },
  {
    icon: Keyboard,
    title: 'Errori di digitazione',
    text: 'Basta un codice articolo o un prezzo errato per generare contestazioni, ritardi e ore di chiarimenti.',
  },
];

export default function ProblemSection() {
  return (
    <section id="problema" aria-labelledby="problema-title" className="bg-canvas-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="LA REALTÀ OPERATIVA"
          title="La crescita aziendale non dovrebbe significare più burocrazia interna."
          subtitle="Quando i clienti aumentano, spesso il lavoro amministrativo cresce più in fretta del fatturato."
          titleId="problema-title"
        />

        <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2">
          {PROBLEMS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-lg border border-border-light bg-white p-7 sm:p-10">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border-light bg-canvas-subtle">
                <Icon className="h-5 w-5 text-ink-500" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-sans text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
              <p className="mt-2 font-body text-[15px] leading-relaxed text-ink-500">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

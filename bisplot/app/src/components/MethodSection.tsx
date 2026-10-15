import { Clock } from 'lucide-react';
import SectionHeader from './SectionHeader';

type Step = {
  number: string;
  title: string;
  duration?: string;
  text: string;
};

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Mappatura dei colli di bottiglia',
    duration: '1 settimana',
    text: 'Individuiamo dove si concentrano le perdite di tempo più costose e quali passaggi manuali causano il maggior numero di errori.',
  },
  {
    number: '02',
    title: 'Prototipo su un singolo flusso',
    duration: '2–3 settimane',
    text: 'Costruiamo una soluzione funzionante su un solo processo circoscritto, per misurare il risparmio effettivo sul campo prima di espandere.',
  },
  {
    number: '03',
    title: 'Messa in produzione e integrazione',
    text: 'Colleghiamo lo strumento ai sistemi aziendali correnti. Nessuna interruzione delle attività ordinarie.',
  },
  {
    number: '04',
    title: 'Formazione pratica',
    text: "Sessioni dirette con chi userà lo strumento ogni giorno, con interfaccia ridotta all'essenziale per azzerare la curva di apprendimento.",
  },
];

export default function MethodSection() {
  return (
    <section id="fasi" aria-labelledby="fasi-title" className="bg-canvas-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="IL PERCORSO D'INTERVENTO"
          title="Un metodo a tappe fisse, a basso rischio operativo."
          titleId="fasi-title"
        />

        <ol className="mt-14 grid gap-10 sm:mt-16 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, index) => {
            const isLast = index === STEPS.length - 1;
            return (
              <li key={step.number} className="relative pl-9 lg:pl-0 lg:pt-10">
                {/* Node on the timeline */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[5px] h-[11px] w-[11px] rounded-full border border-ink-900 bg-white lg:top-0"
                />
                {/* Connector to the next node: vertical on mobile, horizontal on desktop */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-[2.5rem] left-[5px] top-[22px] w-px bg-border-focus lg:-right-[27px] lg:bottom-auto lg:left-[16px] lg:top-[5px] lg:h-px lg:w-auto"
                  />
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-ink-900">{step.number}</span>
                  {step.duration && (
                    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border-light bg-white px-2 py-0.5 font-mono text-[11px] text-ink-500">
                      <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                      {step.duration}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-sans text-lg font-semibold leading-snug tracking-tight text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-ink-500">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

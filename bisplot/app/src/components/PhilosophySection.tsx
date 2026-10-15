import { Check, Minus } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { LogoMark } from './Logo';

const USUAL = [
  'Si acquista una nuova piattaforma o un tool AI sperando risolva tutto.',
  'Il personale è costretto a fare corsi di formazione, cambiare abitudini e riempire doppie schermate.',
  'Dopo tre mesi il nuovo programma viene abbandonato o usato solo a metà, e i file Excel continuano a moltiplicarsi.',
];

const BISPLOT = [
  'Mappiamo come lavorano davvero le persone: chi parla con chi, quali documenti arrivano, dove si perde tempo.',
  'Semplifichiamo la regola operativa prima di toccare qualsiasi riga di codice.',
  "Colleghiamo l'AI e i dati in background: le informazioni compaiono già trascritte e pronte dove servono, senza costringere nessuno ad aprire un nuovo portale.",
];

export default function PhilosophySection() {
  return (
    <section id="visione" aria-labelledby="visione-title" className="bg-canvas-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="IL NOSTRO APPROCCIO"
          title="Perché le aziende non hanno bisogno di un altro software."
          titleId="visione-title"
        />

        <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-6 lg:grid-cols-2">
          {/* What usually happens */}
          <article aria-labelledby="visione-solito" className="rounded-lg border border-border-light bg-white p-7 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-500">Cosa succede di solito</p>
            <h3
              id="visione-solito"
              className="mt-4 text-balance font-sans text-xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-2xl"
            >
              Comprare software per risolvere disordine
            </h3>
            <ul className="mt-8 space-y-5">
              {USUAL.map((item) => (
                <li key={item} className="flex gap-3">
                  <Minus className="mt-1 h-4 w-4 shrink-0 text-ink-500" strokeWidth={1.75} aria-hidden="true" />
                  <span className="font-body text-base leading-relaxed text-ink-500">{item}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* How Bisplot intervenes — highlighted */}
          <article
            aria-labelledby="visione-bisplot"
            className="rounded-lg border border-ink-900/25 bg-canvas-subtle p-7 sm:p-10"
          >
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-900">
              <LogoMark className="h-3.5 w-[11px]" />
              Come interviene Bisplot
            </p>
            <h3
              id="visione-bisplot"
              className="mt-4 text-balance font-sans text-xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-2xl"
            >
              Riorganizzare le procedure e automatizzare il silenzio
            </h3>
            <ul className="mt-8 space-y-5">
              {BISPLOT.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-ink-900" strokeWidth={2} aria-hidden="true" />
                  <span className="font-body text-base leading-relaxed text-ink-900">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

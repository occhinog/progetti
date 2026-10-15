import { Check } from 'lucide-react';
import SectionHeader from './SectionHeader';

type Solution = {
  number: string;
  title: string;
  tool: string;
  changes: string[];
};

const SOLUTIONS: Solution[] = [
  {
    number: '01',
    title: 'Estrazione e inserimento automatico dei documenti',
    tool: 'Legge documenti in ingresso (PDF, fatture, ordini fornitore, bolle, modulistica), estrae codici, quantità, date e importi, e prepara la registrazione nel gestionale aziendale.',
    changes: [
      'Il personale non digita più i dati manualmente.',
      "L'operatore visualizza il documento originale accanto ai campi precompilati dall'AI, verifica la correttezza con un colpo d'occhio e approva con un clic.",
      'Il tempo di elaborazione per singolo documento passa da 10–15 minuti a pochi secondi.',
    ],
  },
  {
    number: '02',
    title: 'Sincronizzazione e pulizia continua dei dati',
    tool: 'Mette in comunicazione software che non si parlavano (gestionale, CRM, fogli di calcolo, archivi ordini), correggendo automaticamente duplicati, formati non uniformi e incongruenze.',
    changes: [
      'Scompaiono i file Excel paralleli tenuti per "sicurezza" da singoli reparti.',
      "Chi deve prendere una decisione (un acquisto, una pianificazione, un'offerta commerciale) vede cifre aggiornate e univoche, senza dover attendere il ricalcolo manuale.",
    ],
  },
  {
    number: '03',
    title: 'Assistenti operativi su documentazione interna',
    tool: "Un motore di ricerca semantica privato, accessibile solo al team, addestrato sull'archivio storico dell'azienda: procedure, cataloghi, preventivi storici, contratti e documentazione tecnica.",
    changes: [
      'Trovare una risposta complessa richiede 5 secondi invece di una telefonata o una catena di email.',
      'I nuovi inseriti in azienda diventano operativi in una frazione del tempo, senza dipendere costantemente dai colleghi senior.',
    ],
  },
];

export default function SolutionsSection() {
  return (
    <section id="soluzioni" aria-labelledby="soluzioni-title" className="bg-canvas-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="COSA REALIZZIAMO"
          title="Benefici concreti, misurabili sulla giornata di lavoro."
          titleId="soluzioni-title"
        />

        <div className="mt-12 sm:mt-16">
          {SOLUTIONS.map((solution) => (
            <article
              key={solution.number}
              aria-labelledby={`soluzione-${solution.number}`}
              className="bg-white rounded-lg border border-border-light p-8 sm:p-10 mb-6 last:mb-0"
            >
              <header className="flex items-baseline gap-4 border-b border-border-light pb-6 sm:gap-6 sm:pb-8">
                <span className="font-mono text-sm text-terracotta">{solution.number}</span>
                <h3
                  id={`soluzione-${solution.number}`}
                  className="font-sans text-xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-2xl"
                >
                  {solution.title}
                </h3>
              </header>

              <div className="grid gap-8 pt-6 sm:pt-8 lg:grid-cols-2 lg:gap-0">
                <div className="lg:pr-10">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-ink-500">Cosa fa lo strumento</h4>
                  <p className="mt-4 font-body text-base leading-relaxed text-ink-800">{solution.tool}</p>
                </div>

                <div className="border-t border-border-light pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-ink-500">Cosa cambia in ufficio</h4>
                  <ul className="mt-4 space-y-3">
                    {solution.changes.map((change) => (
                      <li key={change} className="flex gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-ink-500" strokeWidth={1.75} aria-hidden="true" />
                        <span className="font-body text-base leading-relaxed text-ink-800">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

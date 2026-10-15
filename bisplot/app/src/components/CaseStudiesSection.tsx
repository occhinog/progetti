import SectionHeader from './SectionHeader';

type CaseStudy = {
  number: string;
  company: string;
  scenario: string;
  before: string;
  intervention: string;
  result: string;
};

const CASES: CaseStudy[] = [
  {
    number: '01',
    company: 'Azienda di fornitura tecnica e ricambistica',
    scenario: 'Gestione di 80+ ordini fornitore e bolle al giorno via PDF.',
    before:
      'Due impiegate amministrative passavano l\'intera mattinata ad aprire allegati email, leggere codici articolo e ricopiarli manualmente riga per riga nel gestionale. Errori frequenti sui codici a 12 cifre.',
    intervention:
      "Nessun gestionale sostituito. Abbiamo impostato un lettore intelligente in background: appena arriva l'email del fornitore, i dati vengono estratti, verificati con il listino e precaricati nel sistema esistente.",
    result:
      'L\'impiegata riceve una notifica sul suo schermo abituale, verifica la corrispondenza in 10 secondi con un colpo d\'occhio e preme "Conferma". Risparmiate 3 ore al giorno a persona, dedicate al servizio clienti.',
  },
  {
    number: '02',
    company: 'Società di servizi e consulenza aziendale',
    scenario: 'Fascicoli commessa dispersi tra email, cartelle server e chat.',
    before:
      'Per ogni nuova richiesta, il responsabile doveva rintracciare preventivi storici, clausole contrattuali concordate in passato e allegati tecnici sparsi tra 5 persone diverse.',
    intervention:
      'Abbiamo unificato la procedura di archiviazione senza cambiare le cartelle preferite dai collaboratori. Un sistema semantico interno indicizza i documenti storici in modo invisibile e sicuro.',
    result:
      'Una ricerca che richiedeva 40 minuti di messaggi interni ora restituisce il precedente contrattuale esatto in 5 secondi. I nuovi assunti sono autonomi fin dalla prima settimana.',
  },
  {
    number: '03',
    company: 'Piccola azienda manifatturiera su commessa',
    scenario: 'Preventivazione tecnica e passaggio dati tra commerciale e produzione.',
    before:
      "Le richieste clienti arrivavano con formati e note differenti; il commerciale doveva attendere giorni che l'ufficio tecnico decifrasse le misure e verificasse i materiali disponibili.",
    intervention:
      'Abbiamo creato una procedura standard assistita: una volta inserita la richiesta via email, il sistema verifica in background le compatibilità dei materiali sui cataloghi interni e suggerisce la base del preventivo.',
    result:
      "Il tempo di risposta al cliente è sceso da 4 giorni a 4 ore lavorative. La decisione finale sui margini e sui tempi di consegna resta al 100% nelle mani dell'ufficio tecnico.",
  },
];

const STAGES = [
  { key: 'before', label: 'Prima' },
  { key: 'intervention', label: "L'intervento Bisplot" },
  { key: 'result', label: 'Il risultato oggi' },
] as const;

export default function CaseStudiesSection() {
  return (
    <section id="casi-studio" aria-labelledby="casi-title" className="bg-canvas-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="SUL CAMPO"
          title="Tre storie di routine aziendale trasformata."
          subtitle="Cosa succede quando la tecnologia lavora in silenzio a supporto delle persone."
          titleId="casi-title"
        />

        <div className="mt-12 space-y-6 sm:mt-16">
          {CASES.map((item) => (
            <article
              key={item.number}
              aria-labelledby={`caso-${item.number}`}
              className="rounded-lg border border-border-light bg-white p-7 sm:p-10"
            >
              <header className="border-b border-border-light pb-6 sm:pb-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-500">Caso {item.number}</span>
                  <span className="rounded-sm border border-border-light bg-canvas-subtle px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-900">
                    {item.company}
                  </span>
                </div>
                <p className="mt-5 font-mono text-xs uppercase tracking-wider text-ink-500">Scenario</p>
                <h3
                  id={`caso-${item.number}`}
                  className="mt-2 text-balance font-sans text-xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-2xl"
                >
                  {item.scenario}
                </h3>
              </header>

              <ol className="grid gap-8 pt-6 sm:pt-8 lg:grid-cols-3 lg:gap-0">
                {STAGES.map((stage, index) => {
                  const isResult = stage.key === 'result';
                  return (
                    <li
                      key={stage.key}
                      className={
                        index === 0
                          ? 'lg:pr-8'
                          : 'border-t border-border-light pt-8 lg:border-l lg:border-t-0 lg:px-8 lg:pt-0 lg:last:pr-0'
                      }
                    >
                      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-500">
                        <span className="text-ink-900">{String(index + 1).padStart(2, '0')}</span>
                        {stage.label}
                      </p>
                      <p
                        className={`mt-3 font-body text-[15px] leading-relaxed ${
                          isResult ? 'text-ink-900' : 'text-ink-500'
                        }`}
                      >
                        {item[stage.key]}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

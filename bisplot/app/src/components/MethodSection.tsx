import SectionHeader from './SectionHeader';

type Phase = {
  number: string;
  title: string;
  text: string;
};

const PHASES: Phase[] = [
  {
    number: '01',
    title: 'Diagnosi sul campo',
    text: 'Ci sediamo accanto a chi fa il lavoro ogni giorno. Guardiamo quali email aprono, dove si interrompe il flusso e quali documenti creano ansia o rallentamento.',
  },
  {
    number: '02',
    title: 'Riscrittura della procedura',
    text: 'Prima di automatizzare, eliminiamo i passaggi inutili. Definiamo chi deve convalidare il dato, chi prende la decisione e cosa può essere svolto in background.',
  },
  {
    number: '03',
    title: 'Connessione invisibile',
    text: "Colleghiamo i sistemi esistenti tramite automazioni e modelli AI dedicati. L'infrastruttura lavora nel retrobottega digitale dell'azienda.",
  },
  {
    number: '04',
    title: 'Affiancamento e taratura',
    text: 'Seguiamo il team durante le prime settimane di utilizzo reale. Aggiustiamo i dettagli, raccogliamo il feedback di chi lavora e garantiamo che tutti si sentano sicuri.',
  },
];

export default function MethodSection() {
  return (
    <section id="metodo" aria-labelledby="metodo-title" className="bg-canvas-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="COME LAVORIAMO"
          title="Dall'ascolto alla routine quotidiana: 4 fasi chiare."
          titleId="metodo-title"
        />

        <ol className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
          {PHASES.map((phase) => (
            <li key={phase.number} className="border-t border-border-light pt-6">
              <span className="font-mono text-sm text-terracotta">{phase.number}</span>
              <h3 className="mt-4 font-sans text-lg font-semibold leading-snug tracking-tight text-ink-900">
                {phase.title}
              </h3>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-ink-500">{phase.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

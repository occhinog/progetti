import { ArrowRight, CircleCheck } from 'lucide-react';

const GUARANTEES = [
  {
    title: 'Zero sostituzioni',
    text: 'Lavoriamo sui gestionali e sui formati che già usi',
  },
  {
    title: 'Dati prima degli algoritmi',
    text: 'Pulizia e coerenza prima di qualsiasi automazione',
  },
  {
    title: 'Controllo umano',
    text: 'Nessun processo critico viene eseguito alla cieca',
  },
] as const;

export default function Hero() {
  return (
    <section
      id="inizio"
      aria-labelledby="hero-title"
      className="border-b border-border-light bg-gradient-to-b from-[#FFFFFF] to-[#F0F5FA]"
    >
      <div className="max-w-4xl mx-auto text-center pt-24 pb-20 px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-ink-500 bg-white border border-border-light px-3 py-1 rounded-sm inline-block mb-6 text-balance">
          SISTEMI DATI E STRUMENTI AI SU MISURA PER LE PMI
        </p>

        <h1
          id="hero-title"
          className="font-sans text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink-900 tracking-tight leading-[1.15] mb-6 text-balance"
        >
          L’intelligenza artificiale al&nbsp;servizio del lavoro umano.
          <br />
          Non il contrario.
        </h1>

        <p className="font-body text-lg sm:text-xl text-ink-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Eliminiamo il tempo sprecato a ricopiare dati, rincorrere documenti e riconciliare file. Sviluppiamo
          strumenti che velocizzano i compiti ripetitivi e lasciano alle persone il controllo e la decisione.
        </p>

        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <a
            href="#contatto"
            className="bg-terracotta text-white hover:bg-terracotta-hover px-6 py-3.5 rounded-md font-medium shadow-sm transition-all text-base inline-flex items-center gap-2 font-sans focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
          >
            Richiedi una diagnosi operativa
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
          </a>
          <a
            href="#metodo"
            className="text-ink-900 hover:text-ink-500 font-medium px-5 py-3.5 transition-colors text-base font-sans rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink-900"
          >
            Il nostro metodo <span aria-hidden="true">↓</span>
          </a>
        </div>

        <ul className="mt-16 grid gap-8 border-t border-border-light pt-10 text-left sm:grid-cols-3 sm:gap-6">
          {GUARANTEES.map((item) => (
            <li key={item.title} className="flex gap-3">
              <CircleCheck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ink-500" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className="font-sans text-sm font-semibold text-ink-900">{item.title}</p>
                <p className="mt-1 font-body text-sm leading-relaxed text-ink-500">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

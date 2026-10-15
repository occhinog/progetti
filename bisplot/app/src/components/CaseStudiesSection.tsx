import { Fragment } from 'react';
import { Check } from 'lucide-react';
import SectionHeader from './SectionHeader';
import sailGroupLogo from '../assets/clients/sail-group.jpg';
import centroServiziNegriLogo from '../assets/clients/centro-servizi-negri.svg';
import helioH2Logo from '../assets/clients/helio-h2.png';
import pintoreLogo from '../assets/clients/pietro-pintore-editore.png';

/*
 * Real clients only. Integrity rule: each card states what is VERIFIED (client, sector, services
 * actually delivered) and DESCRIPTIVE context — never a measured result. Result metrics stay out of
 * the copy until the client validates them (see the DA CONFERMARE markers).
 *
 * Logos are the clients' own files (src/assets/clients/, untouched originals in originals/), never
 * redrawn. The logo slot is optional: a card without `logo` simply omits it.
 */

type ClientLogo = {
  src: string;
  /** Intrinsic size of the file, so the browser reserves the right box. */
  width: number;
  height: number;
  /** Rendered height, tuned per mark so wide wordmarks and compact monograms read at the same weight. */
  heightClass: string;
};

type CaseStudy = {
  client: string;
  sector: string;
  url: string;
  logo?: ClientLogo;
  scope: string;
  /** Services actually delivered, one activity per entry. */
  intervention: string[];
};

const CASES: CaseStudy[] = [
  {
    client: 'SAIL Group',
    sector: 'Costruzioni e gestione cantieri',
    url: 'https://www.sailgroup.eu',
    logo: { src: sailGroupLogo, width: 456, height: 78, heightClass: 'h-9' },
    scope: 'Coordinare la comunicazione tra ufficio e cantieri attivi, con documentazione e offerte da gestire su più fronti.',
    intervention: [
      'Organizzazione della comunicazione tra ufficio e cantieri.',
      'Ottimizzazione del processo di predisposizione delle offerte.',
      'Posizionamento digitale SEO e GEO.',
    ],
    // [DA CONFERMARE: eventuale metrica di risultato — in attesa di validazione cliente]
  },
  {
    client: 'Centro Servizi Negri',
    sector: 'Studio commercialista · finanza agevolata e bandi',
    url: 'https://nuovo-sito-rhkm20ixt-hg-matts-projects.vercel.app',
    logo: { src: centroServiziNegriLogo, width: 1017, height: 910, heightClass: 'h-12' },
    scope:
      'Uno studio commercialista che, oltre ai servizi contabili e fiscali, segue per i clienti finanza agevolata e bandi: pratiche e richieste da gestire su più fronti, con processi interni da strutturare e valutazioni da rendere più efficienti.',
    intervention: [
      "Organizzazione dell'ufficio e strutturazione dei processi interni.",
      'Realizzazione di un assistente personale per la gestione delle richieste.',
      'Creazione di una dashboard per la valutazione dei clienti.',
    ],
    // [DA CONFERMARE: eventuale metrica di risultato — in attesa di validazione cliente]
  },
  {
    client: 'Helio H2',
    sector: "Soluzioni per l'idrogeno e l'energia",
    url: 'https://www.helioh2.com',
    logo: { src: helioH2Logo, width: 226, height: 192, heightClass: 'h-14' },
    scope:
      'Gestire il flusso di richieste e offerte in un settore tecnico altamente specializzato, con bisogno di visibilità digitale.',
    intervention: [
      'Ottimizzazione dei processi di predisposizione delle offerte.',
      'Supporto alla lead generation.',
      'Posizionamento digitale SEO e GEO.',
    ],
    // [DA CONFERMARE: eventuale metrica di risultato — in attesa di validazione cliente]
  },
  {
    client: 'Pintore',
    sector: 'Editoria e gestione manoscritti',
    url: 'https://www.pintore.com',
    logo: { src: pintoreLogo, width: 717, height: 128, heightClass: 'h-9' },
    scope:
      "Un flusso editoriale con manoscritti da valutare, riassumere e promuovere, dove l'organizzazione del lavoro di revisione incide direttamente sui tempi.",
    intervention: [
      'Efficientamento del workflow di gestione dei manoscritti.',
      'Supporto alla creazione di abstract e materiali di promozione.',
    ],
    // [DA CONFERMARE: eventuale metrica di risultato — in attesa di validazione cliente]
  },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function CaseStudiesSection() {
  return (
    <section id="casi-studio" aria-labelledby="casi-title" className="bg-canvas-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="SUL CAMPO"
          title="Quattro realtà che lavorano con procedure più ordinate."
          subtitle="Interventi concreti su comunicazione, processi e visibilità digitale. Ogni caso riporta solo ciò che è stato effettivamente realizzato."
          titleId="casi-title"
        />

        <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2">
          {CASES.map((item) => {
            const id = `caso-${slug(item.client)}`;
            return (
              <article
                key={item.client}
                aria-labelledby={id}
                className="group flex flex-col rounded-lg border border-border-light bg-white p-7 sm:p-9"
              >
                {/* Intestazione: logo del cliente (se disponibile) + nome + settore */}
                <header>
                  {item.logo && (
                    // Decorative: the client's name is the heading right below.
                    <div className="mb-6 flex h-14 items-center">
                      <img
                        src={item.logo.src}
                        width={item.logo.width}
                        height={item.logo.height}
                        alt=""
                        decoding="async"
                        draggable={false}
                        className={`${item.logo.heightClass} w-auto max-w-full select-none opacity-80 mix-blend-multiply grayscale transition duration-300 group-focus-within:opacity-100 group-focus-within:grayscale-0 group-hover:opacity-100 group-hover:grayscale-0 motion-reduce:transition-none`}
                      />
                    </div>
                  )}
                  <h3 id={id} className="font-sans text-xl font-semibold tracking-tight text-ink-900 sm:text-2xl">
                    {item.client}
                  </h3>
                  <p className="mt-3 inline-block rounded-sm border border-border-light bg-canvas-subtle px-2.5 py-1 font-mono text-xs text-ink-500">
                    {/* Multi-part sectors ("A · B") wrap only at the separator on narrow cards. */}
                    {item.sector.split(' · ').map((part, i, parts) => (
                      <Fragment key={part}>
                        {i > 0 && ' '}
                        <span className="whitespace-nowrap">
                          {part}
                          {i < parts.length - 1 && ' ·'}
                        </span>
                      </Fragment>
                    ))}
                  </p>
                </header>

                {/* L'ambito — descrittivo */}
                <div className="mt-7 border-t border-border-light pt-6">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-ink-500">L'ambito</h4>
                  <p className="mt-3 font-body text-[15px] leading-relaxed text-ink-500">{item.scope}</p>
                </div>

                {/* L'intervento — attività svolte, nessun risultato misurato */}
                <div className="mt-6">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-ink-500">L'intervento</h4>
                  <ul className="mt-3 space-y-2.5">
                    {item.intervention.map((activity) => (
                      <li key={activity} className="flex gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-ink-900" strokeWidth={2} aria-hidden="true" />
                        <span className="font-body text-[15px] leading-relaxed text-ink-900">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-7">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-sm font-sans text-sm font-medium text-ink-900 underline decoration-border-focus underline-offset-4 transition-colors hover:decoration-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
                  >
                    Visita il sito →<span className="sr-only"> di {item.client} (si apre in una nuova scheda)</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 max-w-3xl font-body text-sm leading-relaxed text-ink-500">
          Le descrizioni riportano gli ambiti di intervento e i servizi forniti. I risultati operativi di ogni progetto
          vengono condivisi in sede di colloquio.
        </p>
      </div>
    </section>
  );
}

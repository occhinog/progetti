import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react';
import { siteConfig } from '../config';

type Fields = {
  name: string;
  email: string;
  message: string;
};

type FieldName = keyof Fields;
type FieldErrors = Partial<Record<FieldName, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY_FIELDS: Fields = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Fields): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Inserisci nome, cognome e azienda.';
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Inserisci l'email aziendale.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Inserisci un indirizzo email valido.';
  }

  return errors;
}

async function sendRequest(payload: Fields): Promise<void> {
  if (!siteConfig.contactEndpoint) {
    // Demo mode — see src/config.ts. Nothing leaves the browser.
    console.info('[Bisplot] contactEndpoint non configurato: invio dimostrativo, nessun dato è stato inviato.', payload);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return;
  }

  const response = await fetch(siteConfig.contactEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Richiesta rifiutata (HTTP ${response.status})`);
  }
}

const inputBase =
  'block w-full rounded-md border bg-white px-3.5 py-3 font-body text-base text-ink-900 placeholder:text-ink-500/60 transition-[border-color,box-shadow] focus:outline-none focus:ring-4 focus:ring-canvas-muted disabled:cursor-not-allowed disabled:bg-canvas-subtle';
const inputValid = 'border-border-light hover:border-border-focus focus:border-border-focus';
const inputInvalid = 'border-signal-error focus:border-signal-error';

export default function ContactSection() {
  const [values, setValues] = useState<Fields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const fieldRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };
  const successRef = useRef<HTMLDivElement>(null);

  const isSubmitting = status === 'submitting';

  // Move focus to the confirmation so screen-reader and keyboard users land on it.
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as FieldName;
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = (Object.keys(fieldRefs) as FieldName[]).find((field) => nextErrors[field]);
    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus();
      return;
    }

    setStatus('submitting');
    try {
      await sendRequest({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });
      setValues(EMPTY_FIELDS);
      setStatus('success');
    } catch (error) {
      console.error('[Bisplot] Invio del modulo non riuscito.', error);
      setStatus('error');
    }
  };

  const describedBy = (field: FieldName) => (errors[field] ? `${field}-errore` : undefined);
  const inputClasses = (field: FieldName) => `${inputBase} ${errors[field] ? inputInvalid : inputValid}`;

  return (
    <section id="contatto" aria-labelledby="contatto-title" className="bg-canvas-white px-4 py-20 sm:px-6 sm:py-28">
      <div className="max-w-2xl mx-auto bg-white border border-border-light rounded-lg p-8 sm:p-12 shadow-sm">
        {status === 'success' ? (
          <div ref={successRef} tabIndex={-1} role="status" className="py-6 text-center focus:outline-none sm:py-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-border-light bg-canvas-subtle">
              <CircleCheck className="h-6 w-6 text-ink-900" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h2 id="contatto-title" className="mt-6 font-sans text-2xl font-semibold tracking-tight text-ink-900">
              Richiesta ricevuta.
            </h2>
            <p className="mx-auto mt-3 max-w-md font-body text-base leading-relaxed text-ink-500">
              Esamineremo le informazioni e ti risponderemo entro 24 ore.
            </p>
          </div>
        ) : (
          <>
            <h2
              id="contatto-title"
              className="text-balance font-sans text-2xl font-semibold leading-[1.25] tracking-tight text-ink-900 sm:text-3xl"
            >
              Un’analisi chiara dei tuoi processi, senza impegno.
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-ink-500 sm:text-lg">
              In 45 minuti esaminiamo insieme il flusso di lavoro più critico della tua azienda. Ti diremo apertamente
              se l'intervento ha un ritorno economico misurabile o se è sufficiente riorganizzare gli strumenti che già
              possiedi.
            </p>

            <form className="mt-8 space-y-6 sm:mt-10" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
              <div>
                <label htmlFor="name" className="mb-2 block font-body text-sm font-medium text-ink-900">
                  Nome, Cognome e Azienda
                </label>
                <input
                  ref={fieldRefs.name}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="es. Marco Rossi — Meccanica SpA"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={describedBy('name')}
                  className={inputClasses('name')}
                />
                {errors.name && <FieldError id="name-errore" message={errors.name} />}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block font-body text-sm font-medium text-ink-900">
                  Email aziendale
                </label>
                <input
                  ref={fieldRefs.email}
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="m.rossi@azienda.it"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={describedBy('email')}
                  className={inputClasses('email')}
                />
                {errors.email && <FieldError id="email-errore" message={errors.email} />}
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block font-body text-sm font-medium text-ink-900">
                  Quale attività manuale oggi ruba più ore al tuo team ogni settimana?
                </label>
                <textarea
                  ref={fieldRefs.message}
                  id="message"
                  name="message"
                  rows={3}
                  value={values.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="es. Ricopiare i codici degli ordini fornitori dai PDF al gestionale..."
                  className={`${inputClasses('message')} resize-y`}
                />
              </div>

              {status === 'error' && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-md border border-border-light bg-canvas-subtle px-4 py-3 font-body text-sm text-ink-900"
                >
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-signal-error" strokeWidth={2} aria-hidden="true" />
                  Invio non riuscito. Controlla la connessione e riprova tra qualche istante.
                </p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-terracotta hover:bg-terracotta-hover text-white py-3.5 rounded-md font-medium transition-colors font-sans inline-flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
                      Invio in corso…
                    </>
                  ) : (
                    'Richiedi diagnosi operativa'
                  )}
                </button>
                <p className="mt-4 text-center font-body text-xs text-ink-500">
                  Rispondiamo entro 24 ore lavorative. Nessuna insistenza commerciale.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 font-body text-sm text-signal-error">
      <CircleAlert className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
      {message}
    </p>
  );
}

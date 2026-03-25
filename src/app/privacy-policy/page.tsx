import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
        Privacy Policy
      </h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base">
        <p>
          Questa informativa descrive le modalità di trattamento dei dati
          personali raccolti tramite il sito della Comunità Parrocchiale.
        </p>
        <p>
          I dati inseriti nel modulo di richiesta certificati (nome e cognome,
          luogo e data di nascita, parrocchia, telefono, email) sono trattati
          esclusivamente per rispondere alla richiesta dell’utente.
        </p>
        <p>
          I dati non sono diffusi e sono conservati per il tempo strettamente
          necessario alla gestione amministrativa della richiesta, nel rispetto
          della normativa applicabile.
        </p>
        <p>
          L’utente può chiedere accesso, rettifica, cancellazione o limitazione
          del trattamento dei propri dati contattando la parrocchia tramite i
          recapiti ufficiali pubblicati sul sito.
        </p>
        <p>
          Questo testo è una base informativa generale e può essere integrato
          con i riferimenti completi del titolare del trattamento.
        </p>
      </div>
    </main>
  );
}


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
};

export default function CookiePolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
        Cookie Policy
      </h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base">
        <p>
          Questo sito utilizza cookie tecnici necessari al corretto
          funzionamento delle pagine e dei servizi essenziali.
        </p>
        <p>
          Possono inoltre essere presenti contenuti di terze parti (ad esempio
          Facebook, Google Maps, widget esterni) che possono installare cookie
          secondo le rispettive policy.
        </p>
        <p>
          L’utente può gestire o disabilitare i cookie dalle impostazioni del
          proprio browser. La disattivazione dei cookie tecnici potrebbe
          compromettere alcune funzionalità del sito.
        </p>
        <p>
          Per maggiori informazioni sui cookie di terze parti, si invita a
          consultare le informative ufficiali dei rispettivi provider.
        </p>
      </div>
    </main>
  );
}


import type { Metadata } from "next";
import Link from "next/link";
import { ProgrammiFlyer } from "@/components/ProgrammiFlyer";

export const metadata: Metadata = {
  title: "Orari e programmi",
  description:
    "Orari delle messe, catechesi, ufficio e visite delle tre parrocchie: Sant’Arcangelo agli Armieri, San Giovanni a Mare e Sant’Eligio Maggiore.",
  alternates: {
    canonical: "/orari",
  },
};

export default function OrariPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 md:pt-14">
      <section className="rounded-2xl border border-(--nav-border) bg-(--paper)/85 p-5 text-center shadow-sm sm:p-7">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-(--accent)">
          Comunità parrocchiale
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-foreground sm:text-5xl">
          Orari e programmi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-(--ink-muted) sm:text-lg">
          Orari, incontri e servizi delle tre parrocchie per camminare insieme:
          accoglienza, preghiera e comunità.
        </p>
      </section>

      <ProgrammiFlyer />

      <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-(--nav-border) bg-(--paper)/80 p-5 shadow-sm sm:p-6">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Contatti utili
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-(--ink-muted) sm:text-base">
          <li>
            <strong className="text-foreground">Telefono / WhatsApp:</strong>{" "}
            <a href="tel:+39081204154" className="text-(--accent) underline-offset-2 hover:underline">
              081 204154
            </a>
            {" · "}
            <a href="tel:+393459829839" className="text-(--accent) underline-offset-2 hover:underline">
              345 982 9839
            </a>
            <span className="block text-xs sm:inline sm:ml-1">
              (urgenze e funerali; preferibile SMS o WhatsApp)
            </span>
          </li>
          <li>
            <strong className="text-foreground">Email:</strong>{" "}
            <a
              href="mailto:parrocchias.eligio@gmail.com"
              className="text-(--accent) underline-offset-2 hover:underline"
            >
              parrocchias.eligio@gmail.com
            </a>
          </li>
        </ul>
        <p className="mt-5 text-sm text-(--ink-muted)">
          Preferisci la scheda della singola chiesa?{" "}
          <Link href="/chiese/sant-arcangelo-armieri" className="text-(--accent) underline-offset-2 hover:underline">
            Sant’Arcangelo
          </Link>
          {", "}
          <Link href="/chiese/san-giovanni-a-mare" className="text-(--accent) underline-offset-2 hover:underline">
            San Giovanni a Mare
          </Link>
          {" o "}
          <Link href="/chiese/sant-eligio-maggiore" className="text-(--accent) underline-offset-2 hover:underline">
            Sant’Eligio Maggiore
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

import Link from "next/link";
import { listEventi } from "@/lib/eventi-store";
import { EventiCarousel } from "@/components/EventiCarousel";

export const dynamic = "force-dynamic";

export default async function EventiPage() {
  const eventi = await listEventi();
  const prossimi = eventi.filter((e) => e.isUpcoming);
  const passati = eventi.filter((e) => e.isPast);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10">
      <section className="mx-auto max-w-3xl text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
          Comunità parrocchiale
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
          Eventi
        </h1>
        <p className="mt-3 text-[var(--ink-muted)]">
          Appuntamenti, celebrazioni e attività della comunità.
        </p>
      </section>

      {eventi.length === 0 ? (
        <p className="mx-auto mt-10 max-w-2xl rounded-xl border border-[var(--nav-border)] bg-[var(--paper)]/70 px-5 py-4 text-center text-sm text-[var(--ink-muted)]">
          Nessun evento pubblicato al momento.
        </p>
      ) : (
        <section className="mt-10 space-y-10">
          {prossimi.length > 0 ? (
            <EventiCarousel titolo="Prossimi Eventi" eventi={prossimi} />
          ) : null}
          {passati.length > 0 ? (
            <EventiCarousel titolo="Eventi passati" eventi={passati} />
          ) : null}
        </section>
      )}

      <p className="mt-10 text-center">
        <Link
          href="/"
          className="font-display text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          ← Torna alla comunità
        </Link>
      </p>
    </main>
  );
}


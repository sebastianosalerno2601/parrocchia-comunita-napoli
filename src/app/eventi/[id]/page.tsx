import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventoById } from "@/lib/eventi-store";
import { EventiGalleryLightbox } from "@/components/EventiGalleryLightbox";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventoDettaglioPage({ params }: PageProps) {
  const { id } = await params;
  const evento = await getEventoById(id);
  if (!evento) notFound();

  const images = evento.imageUrls?.length ? evento.imageUrls : [evento.imageUrl];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10">
      <section className="mx-auto max-w-3xl text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
          Evento
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
          {evento.titolo}
        </h1>
        <p className="mt-3 text-sm font-semibold text-[var(--accent)]">
          {formatDate(evento.dataIso)}
        </p>
        {evento.luogo ? (
          <p className="mt-2 text-[var(--ink-muted)]">{evento.luogo}</p>
        ) : null}
      </section>

      <article className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)]/80 p-6 shadow-sm">
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
          Descrizione
        </h2>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-[var(--ink-muted)]">
          {evento.descrizione}
        </p>
      </article>

      <EventiGalleryLightbox images={images} title={evento.titolo} />

      <p className="mt-10 text-center">
        <Link
          href="/eventi"
          className="font-display text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          ← Torna agli eventi
        </Link>
      </p>
    </main>
  );
}


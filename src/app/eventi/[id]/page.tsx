import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventoById } from "@/lib/eventi-store";
import { EventiGalleryLightbox } from "@/components/EventiGalleryLightbox";

export const dynamic = "force-dynamic";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://santeligiomaggiore.it";
const baseUrl = siteUrl.replace(/\/$/, "");

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const evento = await getEventoById(id);
  if (!evento) {
    return { title: "Evento non trovato" };
  }
  const canonical = `/eventi/${evento.id}`;
  const image = evento.imageUrls?.[0] ?? evento.imageUrl;
  return {
    title: evento.titolo,
    description: evento.descrizione.slice(0, 160),
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      locale: "it_IT",
      url: `${baseUrl}${canonical}`,
      title: evento.titolo,
      description: evento.descrizione.slice(0, 160),
      images: image
        ? [
            {
              url: image,
              alt: evento.titolo,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: evento.titolo,
      description: evento.descrizione.slice(0, 160),
      images: image ? [image] : undefined,
    },
  };
}

export default async function EventoDettaglioPage({ params }: PageProps) {
  const { id } = await params;
  const evento = await getEventoById(id);
  if (!evento) notFound();

  const images = evento.imageUrls?.length ? evento.imageUrls : [evento.imageUrl];
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evento.titolo,
    startDate: evento.dataIso,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: evento.luogo
      ? {
          "@type": "Place",
          name: evento.luogo,
        }
      : undefined,
    image: images.filter(Boolean),
    description: evento.descrizione,
    organizer: {
      "@type": "Organization",
      name: "Comunità parrocchiale Napoli",
      url: baseUrl,
    },
    url: `${baseUrl}/eventi/${evento.id}`,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Eventi",
        item: `${baseUrl}/eventi`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: evento.titolo,
        item: `${baseUrl}/eventi/${evento.id}`,
      },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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


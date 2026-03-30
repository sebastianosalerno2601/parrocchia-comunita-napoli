import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParrocchiaStoria } from "@/components/ParrocchiaStoria";
import { VangeloDelGiornoSection } from "@/components/VangeloDelGiorno";
import IntroPopup from "@/components/IntroPopup";
import { OrariChiese } from "@/components/OrariChiese";
import {
  getParrocchiaBySlug,
  parrocchie,
} from "@/lib/parrocchie";
import { getStoriaParrocchia } from "@/lib/storia-parrocchie";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return parrocchie.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = getParrocchiaBySlug(slug);
  if (!p) return { title: "Chiesa" };
  return {
    title: p.nomeCompleto,
    description: p.descrizione,
    openGraph: {
      images: [
        {
          url: p.bannerRow[0].src,
          alt: p.bannerRow[0].alt,
        },
      ],
    },
  };
}

function TemaDecor({ tema }: { tema: string }) {
  if (tema === "gotico") {
    return <div className="gothic-ornament" aria-hidden />;
  }
  return null;
}

export default async function ChiesaPage({ params }: PageProps) {
  const { slug } = await params;
  const p = getParrocchiaBySlug(slug);
  if (!p) notFound();

  const storia = getStoriaParrocchia(p.slug);
  const bannerItems = [...p.bannerRow, ...p.bannerRow];
  const facebookHrefForEmbed = p.facebookPageEmbedHref ?? p.facebookPageUrl;
  const facebookFeedSrc = facebookHrefForEmbed
    ? `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
        facebookHrefForEmbed,
      )}&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`
    : null;

  const cardClass =
    p.tema === "barocco"
      ? "baroque-frame"
      : p.tema === "normanno"
        ? "norman-band rounded-2xl border border-[var(--nav-border)]"
        : "rounded-2xl border border-[var(--nav-border)]";

  return (
    <main className="flex flex-1 flex-col">
      <IntroPopup />
      <figure className="relative isolate mt-4 w-full overflow-hidden bg-gradient-to-b from-[var(--paper-deep)] via-[var(--paper)] to-[var(--paper)] px-3 pt-5 pb-1 sm:mt-5 sm:px-6 sm:pt-6 md:mt-0">
        <div className="relative mx-auto max-w-6xl">
          <div className="banner-marquee-track">
            {bannerItems.map((img, i) => (
              <div
                key={`${p.slug}-banner-${i}`}
                className="relative h-[clamp(11rem,31vw,19rem)] w-[clamp(8.25rem,20vw,14.5rem)] flex-none overflow-hidden rounded-lg border border-[var(--nav-border)] bg-[var(--paper-deep)] shadow-sm"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i < 2}
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[var(--paper)]/12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--paper)] to-transparent sm:h-28"
          aria-hidden
        />
      </figure>

      <section className="-mt-8 relative z-10 church-hero-bg rounded-t-3xl px-4 pb-10 pt-8 shadow-[0_-12px_40px_rgba(0,0,0,0.06)] sm:-mt-10 md:-mt-11 md:pb-14 md:pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <TemaDecor tema={p.tema} />
          <p className="mt-4 font-display text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            {p.stile}
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
            {p.nomeCompleto}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[var(--ink-muted)]">
            {p.colori}
          </p>
          <address className="mt-6 text-sm not-italic leading-relaxed text-[var(--ink-muted)]">
            {p.indirizzo}
          </address>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20">
        <article
          className={`${cardClass} mx-auto max-w-3xl bg-[var(--paper)]/80 p-8 backdrop-blur-sm md:p-10`}
        >
          <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
            La chiesa
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[var(--ink-muted)]">
            {p.descrizione}
          </p>
          <OrariChiese slug={p.slug} tema={p.tema} />
        </article>

        {storia ? (
          <div className="mt-10">
            <ParrocchiaStoria data={storia} tema={p.tema} />
          </div>
        ) : null}

        <div className="mx-auto mt-10 grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="w-full max-w-[500px] justify-self-center">
            <VangeloDelGiornoSection
              className="mt-0 h-full"
              iframeClassName="h-[700px]"
            />
          </div>

          {facebookFeedSrc ? (
            <div className="w-full max-w-[500px] justify-self-center">
              <h2 className="font-display text-center text-xl font-semibold text-[var(--ink)]">
                Pagina Facebook ufficiale
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-[var(--nav-border)] bg-[var(--paper-deep)] shadow-sm">
                <div className="mx-auto w-full">
                  <iframe
                    title={`Facebook — ${p.nomeCompleto}`}
                    src={facebookFeedSrc}
                    className="h-[685px] w-full border-0"
                    loading="lazy"
                    allow="encrypted-media; clipboard-write; web-share"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {p.mappaEmbedSrc ? (
          <div className="mx-auto mt-10 max-w-3xl">
            <h2 className="font-display text-center text-xl font-semibold text-[var(--ink)]">
              Come raggiungerci
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--nav-border)] bg-[var(--paper-deep)] shadow-sm">
              <div className="relative aspect-[4/3] w-full sm:aspect-video">
                <iframe
                  title={`Mappa — ${p.nomeCompleto}`}
                  src={p.mappaEmbedSrc}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        ) : null}

        <p className="mx-auto mt-10 max-w-3xl text-center">
          <Link
            href="/"
            className="font-display text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            ← Torna alla comunità
          </Link>
        </p>
      </section>
    </main>
  );
}

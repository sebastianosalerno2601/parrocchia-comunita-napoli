import Link from "next/link";
import Image from "next/image";
import { parrocchie } from "@/lib/parrocchie";
import IntroPopup from "@/components/IntroPopup";

const temaEtichetta: Record<string, string> = {
  barocco: "Barocco — oro e marmi",
  gotico: "Gotico — tufo e piperno",
  normanno: "Normanno — tufo e marmo",
};

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://santeligiomaggiore.it";
  const base = siteUrl.replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sant'Eligio Maggiore — Comunità parrocchiale Napoli",
    alternateName: [
      "Comunità parrocchiale Napoli",
      "Chiesa di Sant'Eligio Maggiore Napoli",
      "Parrocchia Sant'Eligio Maggiore",
    ],
    url: base,
    inLanguage: "it-IT",
    publisher: {
      "@type": "Organization",
      name: "Sant'Eligio Maggiore — Comunità parrocchiale Napoli",
      logo: {
        "@type": "ImageObject",
        url: `${base}/Logo-comunita.png`,
      },
    },
  };

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        // JSON-LD aiuta Google a comprendere meglio entità e sito.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IntroPopup />
      <section className="relative overflow-hidden px-4 pb-16 pt-14 md:pb-24 md:pt-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            Napoli, centro storico
          </p>
          <div className="mx-auto mt-5 relative inline-flex items-center justify-center rounded-full">
            {/* Glow esterno per dare contrasto senza essere troppo invasivo */}
            <div
              aria-hidden
              className="absolute -inset-4 rounded-full bg-[var(--accent-soft)] blur-xl opacity-80"
            />
            <div className="relative inline-flex items-center justify-center rounded-full border border-[var(--accent)]/20 bg-[var(--paper)]/80 px-16 py-12 shadow-[0_32px_110px_rgba(139,105,20,0.38)] ring-1 ring-[var(--accent)]/30 backdrop-blur">
              <Image
                src="/Logo-comunita.png"
                alt="Comunità parrocchiale"
                width={1040}
                height={600}
                priority
                className="h-32 w-auto opacity-100"
                sizes="(max-width: 640px) 220px, 320px"
                quality={100}
              />
            </div>
          </div>
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-5xl lg:text-6xl">
            Una comunità,
            <span className="block text-[var(--ink-muted)]">tre volti di pietra e preghiera</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
            Sant’Arcangelo agli Armieri, Sant’Eligio Maggiore e San Giovanni a
            mare: chiese diverse per storia e architettura, unite nella stessa
            missione.
          </p>
        </div>
      </section>

      {/* Dopo Pasqua: rimuovere questa section e la cartella public/video-pasqua */}
      <section
        className="mx-auto w-full max-w-4xl px-4 pb-12"
        aria-labelledby="messaggio-pasqua-titolo"
      >
        <div className="rounded-2xl border border-[var(--nav-border)] bg-gradient-to-b from-[#fffefb] to-[var(--paper-deep)] p-6 shadow-sm md:p-8">
          <p className="font-display text-center text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Pasqua
          </p>
          <h2
            id="messaggio-pasqua-titolo"
            className="font-display mt-3 text-center text-2xl font-semibold text-[var(--ink)] md:text-3xl"
          >
            Messaggio di Pasqua del parroco
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[var(--ink-muted)]">
            Auguri di buona Pasqua alla comunità dalle nostre parrocchie.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--nav-border)] bg-black shadow-md">
            <video
              className="aspect-video w-full object-contain"
              controls
              playsInline
              preload="metadata"
              title="Messaggio di Pasqua del parroco — auguri alla comunità"
            >
              <source src="/video-pasqua/messaggio-pasqua.mp4" type="video/mp4" />
              Il tuo browser non supporta la riproduzione video; puoi scaricare il file dalla stessa pagina se il browser lo consente.
            </video>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {parrocchie.map((p) => (
            <Link
              key={p.slug}
              href={`/chiese/${p.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--nav-border)] bg-gradient-to-b from-[#fffefb] to-[var(--paper-deep)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_20px_50px_rgba(28,25,23,0.08)]"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {temaEtichetta[p.tema]}
              </span>
              <h2 className="font-display mt-3 text-2xl font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">
                {p.nomeCompleto}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                {p.descrizione}
              </p>
              <p className="mt-4 border-t border-[var(--nav-border)] pt-4 text-xs leading-relaxed text-[var(--ink-muted)]">
                {p.indirizzo}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                Scopri la chiesa
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { parrocchie } from "@/lib/parrocchie";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--nav-border)] bg-[var(--footer-bg)] px-4 py-10 text-[var(--ink-muted)]">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <p className="font-display text-base font-semibold text-[var(--ink)]">
            Comunità parrocchiale
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            Tre chiese nel cuore di Napoli: un solo popolo di Dio, molteplici
            radici architettoniche e spirituali.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ink)]">
            Le chiese
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {parrocchie.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/chiese/${p.slug}`}
                  className="transition-colors hover:text-[var(--accent)]"
                >
                  {p.nomeCompleto}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:col-span-2 md:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ink)]">
            Note
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Sito in allestimento. Contenuti, orari e gallerie fotografiche
            saranno aggiunti con il parroco e la comunità.
          </p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-center text-xs opacity-80">
        © {new Date().getFullYear()} Comunità parrocchiale — Napoli
      </p>
      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-center gap-4 text-xs">
        <Link
          href="/privacy-policy"
          className="underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
        >
          Privacy Policy
        </Link>
        <span aria-hidden>•</span>
        <Link
          href="/cookie-policy"
          className="underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
        >
          Cookie Policy
        </Link>
      </div>
    </footer>
  );
}

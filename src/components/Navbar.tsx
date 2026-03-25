"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  CertificatiPrenotazione,
  type CertificatiPrenotazioneHandle,
} from "@/components/CertificatiPrenotazione";
import { parrocchie } from "@/lib/parrocchie";

/** Voci extra del menu mobile (drawer). Esempio: `{ href: "/orari", label: "Orari Messe" }`. */
const MENU_EXTRA: { href: string; label: string }[] = [
  { href: "/caritas", label: "Caritas" },
];

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-[var(--ink)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const certificatiRef = useRef<CertificatiPrenotazioneHandle>(null);
  const titleId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      drawerRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      menuBtnRef.current?.focus();
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  const drawerLinkClass =
    "nav-pill font-display text-lg font-medium w-full justify-start rounded-xl text-left";

  return (
    <header className="navbar-surface fixed inset-x-0 top-0 z-50 border-b border-[var(--nav-border)] md:sticky md:top-0 md:backdrop-blur-md">
      {/* Mobile: barra compatta + drawer */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:hidden">
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-2"
          onClick={close}
        >
          <Image
            src="/Logo-comunita.png"
            alt="Parrocchie di Sant’Eligio Maggiore — Sant’Arcangelo agli Armieri, Sant’Eligio Maggiore, San Giovanni a mare, Napoli"
            width={280}
            height={140}
            priority
            className="h-auto max-h-11 w-auto max-w-[min(100%,200px)] object-contain object-left opacity-95 transition-opacity group-hover:opacity-100"
          />
        </Link>
        <button
          ref={menuBtnRef}
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--nav-border)] bg-gradient-to-b from-[#fffefb] to-[var(--paper-deep)] text-[var(--ink)] shadow-sm transition-colors hover:border-[var(--accent)]"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-drawer"
          aria-haspopup="dialog"
          aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <MenuGlyph open={menuOpen} />
        </button>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden max-w-6xl flex-col gap-4 px-4 py-4 md:flex md:flex-row md:items-center md:justify-between md:gap-6 md:py-3">
        <Link
          href="/"
          className="group flex shrink-0 flex-col items-center gap-1.5 sm:flex-row sm:items-center sm:gap-3 sm:text-left"
        >
          <Image
            src="/Logo-comunita.png"
            alt="Parrocchie di Sant’Eligio Maggiore — Sant’Arcangelo agli Armieri, Sant’Eligio Maggiore, San Giovanni a mare, Napoli"
            width={280}
            height={140}
            className="h-auto w-full max-h-[4.5rem] max-w-[min(100%,260px)] object-contain object-center opacity-95 transition-opacity group-hover:opacity-100 sm:max-h-[3.75rem] sm:max-w-[220px] sm:object-left md:max-h-[4.25rem] md:max-w-[248px]"
          />
        </Link>

        <nav
          className="flex flex-wrap items-center justify-center gap-3 sm:flex-1 sm:justify-center sm:gap-3.5"
          aria-label="Parrocchie"
        >
          <Link href="/caritas" className="nav-pill font-display text-lg font-medium">
            Caritas
          </Link>
          {parrocchie.map((p) => (
            <Link
              key={p.slug}
              href={`/chiese/${p.slug}`}
              className="nav-pill font-display text-lg font-medium"
            >
              {p.nomeBreve}
            </Link>
          ))}
          <CertificatiPrenotazione ref={certificatiRef} />
        </nav>

        <div className="hidden text-right text-xs text-[var(--ink-muted)] sm:block sm:max-w-[10rem] sm:shrink-0">
          Centro storico
        </div>
      </div>

      {/* Drawer mobile */}
      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[130] bg-[var(--ink)]/35 backdrop-blur-[2px] md:hidden"
            aria-label="Chiudi menu"
            onClick={close}
          />
          <div
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="navbar-surface fixed inset-y-0 right-0 z-[140] flex w-[min(20rem,calc(100vw-2.5rem))] flex-col border-l border-[var(--nav-border)] shadow-[-8px_0_32px_rgba(28,25,23,0.12)] md:hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--nav-border)] px-4 py-3">
              <p
                id={titleId}
                className="font-display text-base font-semibold text-[var(--ink)]"
              >
                Menu
              </p>
              <button
                type="button"
                className="rounded-full p-2 text-[var(--ink-muted)] hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
                aria-label="Chiudi"
                onClick={close}
              >
                <MenuGlyph open />
              </button>
            </div>
            <nav
              className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
              aria-label="Navigazione principale"
            >
              <Link href="/" className={drawerLinkClass} onClick={close}>
                Homepage
              </Link>
              {parrocchie.map((p) => (
                <Link
                  key={p.slug}
                  href={`/chiese/${p.slug}`}
                  className={drawerLinkClass}
                  onClick={close}
                >
                  {p.nomeBreve}
                </Link>
              ))}
              {MENU_EXTRA.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={drawerLinkClass}
                  onClick={close}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-1">
                <button
                  type="button"
                  className={drawerLinkClass}
                  onClick={() => {
                    close();
                    certificatiRef.current?.open();
                  }}
                >
                  Certificati
                </button>
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}

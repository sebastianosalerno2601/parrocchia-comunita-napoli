"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "festa-purita-2026-popup-dismissed";
const FLYER_SRC = "/popup/Festa-della-purita.jpeg";

export function FestaPuritaPopup() {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* storage non disponibile */
    }
    const t = window.setTimeout(() => setOpen(true), 650);
    return () => window.clearTimeout(t);
  }, []);

  const close = useCallback((persist = false) => {
    setOpen(false);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* storage non disponibile */
      }
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const focusT = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("button")
        ?.focus();
    }, 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusT);
    };
  }, [close, open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="festa-purita-popup fixed inset-0 z-210 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Chiudi popup"
        className="festa-purita-popup-backdrop absolute inset-0 bg-[#1c1917]/55 backdrop-blur-[3px]"
        onClick={() => close()}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="festa-purita-popup-panel relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-(--nav-border) bg-background shadow-[0_28px_90px_rgba(28,25,23,0.28)] max-sm:max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)))] sm:max-h-[min(90dvh,900px)] sm:rounded-3xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-(--nav-border) bg-(--paper)/95 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-(--accent)">
              3 – 11 ottobre 2026
            </p>
            <h2
              id={titleId}
              className="font-display mt-0.5 text-lg font-semibold leading-snug text-foreground sm:text-xl"
            >
              Festa di Maria Santissima della Purità
            </h2>
          </div>
          <button
            type="button"
            onClick={() => close()}
            className="shrink-0 rounded-full border border-(--nav-border) bg-white/90 px-3 py-1.5 text-sm font-medium text-(--ink-muted) transition hover:border-(--accent) hover:text-(--accent)"
          >
            Chiudi
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4 sm:py-4">
          <div className="overflow-hidden rounded-xl border border-(--nav-border) bg-white shadow-sm">
            <Image
              src={FLYER_SRC}
              alt="Locandina Festa di Maria Santissima della Purità — 3–11 ottobre 2026: concerti, catechesi, adorazione, teatro e solenne Eucaristia"
              width={1200}
              height={1700}
              priority
              className="h-auto w-full"
              sizes="(max-width: 640px) 100vw, 576px"
            />
          </div>
          <p className="mt-3 px-1 text-center text-xs leading-relaxed text-(--ink-muted)">
            Settimana di celebrazioni, cultura, preghiera e fraternità. Scorri
            per leggere tutto il programma.
          </p>
        </div>

        <footer className="shrink-0 border-t border-(--nav-border) bg-(--paper)/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:px-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href={FLYER_SRC}
              download="Festa-della-purita-2026.jpeg"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-(--accent) bg-(--accent) px-5 py-2 text-sm font-semibold text-background transition hover:opacity-95"
            >
              Scarica la locandina
            </a>
            <button
              type="button"
              onClick={() => close()}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-(--nav-border) bg-white/90 px-5 py-2 text-sm font-semibold text-foreground transition hover:border-(--accent) hover:text-(--accent)"
            >
              Continua sul sito
            </button>
          </div>
          <button
            type="button"
            onClick={() => close(true)}
            className="mt-3 w-full text-center text-xs font-medium text-(--ink-muted) underline decoration-(--nav-border) underline-offset-2 transition hover:text-foreground"
          >
            Non mostrare più
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

const FLYER_SRC = "/popup/programmi-3comunita.jpeg";
const FLYER_DOWNLOAD_NAME = "programmi-tre-parrocchie.jpeg";

export function ProgrammiFlyer() {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-(--accent) bg-(--paper)/90 px-5 py-2.5 text-sm font-semibold text-(--accent) shadow-sm transition hover:bg-(--accent) hover:text-background"
        >
          Ingrandisci
        </button>
        <a
          href={FLYER_SRC}
          download={FLYER_DOWNLOAD_NAME}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-(--nav-border) bg-white/80 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-(--accent) hover:text-(--accent)"
        >
          Scarica il volantino
        </a>
      </div>

      <figure className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl border border-(--nav-border) bg-white shadow-[0_20px_50px_rgba(28,25,23,0.1)]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full text-left"
          title="Ingrandisci il volantino"
        >
          <Image
            src={FLYER_SRC}
            alt="Le nostre parrocchie — orari, incontri e servizi di Sant’Arcangelo agli Armieri, San Giovanni a Mare e Sant’Eligio Maggiore"
            width={1200}
            height={1700}
            priority
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </button>
        <figcaption className="border-t border-(--nav-border) bg-(--paper)/80 px-4 py-3 text-center text-xs text-(--ink-muted)">
          Tocca l&apos;immagine per ingrandirla. Su mobile puoi zoomare anche
          nella vista a schermo intero.
        </figcaption>
      </figure>

      {open ? (
        <div
          className="fixed inset-0 z-[280] flex items-center justify-center bg-black/85 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-out"
            aria-label="Chiudi anteprima"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex max-h-[min(94dvh,1100px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-(--nav-border) px-4 py-3">
              <h2
                id={titleId}
                className="font-display text-base font-semibold text-foreground sm:text-lg"
              >
                Orari e programmi
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-(--nav-border) px-3 py-1.5 text-sm text-(--ink-muted) hover:bg-(--paper-deep) hover:text-foreground"
              >
                Chiudi
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-stone-100/80 p-2 sm:p-4">
              <Image
                src={FLYER_SRC}
                alt="Volantino orari delle tre parrocchie a schermo intero"
                width={1600}
                height={2260}
                className="mx-auto h-auto w-full max-w-none"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SESSION_KEY = "intro-popup-handled";

type IntroPopupImage = { src: string; alt: string };

export default function IntroPopup({
  triggerLabel = "Lettera di Pasqua",
  triggerClassName =
    "nav-pill font-display text-lg font-medium self-center w-fit",
}: {
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const images = useMemo<IntroPopupImage[]>(
    () => [
      { src: "/pagina1.png", alt: "Pagina 1" },
      { src: "/pagina2.png", alt: "Pagina 2" },
      { src: "/pagina3.png", alt: "Pagina 3" },
      { src: "/pagina4.png", alt: "Pagina 4" },
    ],
    [],
  );

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [askContinue, setAskContinue] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [imagesKey, setImagesKey] = useState(0);
  const [hasAskedOnce, setHasAskedOnce] = useState(false);

  useEffect(() => {
    // Evita mismatch di hydration: al primo render (server + client) non mostriamo nulla.
    const shouldShow = (() => {
      try {
        return !window.sessionStorage.getItem(SESSION_KEY);
      } catch {
        return true;
      }
    })();

    const t = window.setTimeout(() => {
      setMounted(true);
      setOpen(shouldShow);
    }, 0);

    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open || askContinue || hasAskedOnce) return;

    timerRef.current = window.setTimeout(() => {
      setAskContinue(true);
      setHasAskedOnce(true);
    }, 20_000);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [open, askContinue, hasAskedOnce]);

  const closeAndHandle = (handled: boolean) => {
    setOpen(false);
    setAskContinue(false);
    // Quando il popup viene chiuso, blocchiamo eventuali nuovi countdown finché resta comunque off.
    setHasAskedOnce(true);

    if (!handled) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // No-op: senza sessionStorage il comportamento resta “best effort”.
    }
  };

  const openManual = () => {
    setOpen(true);
    setAskContinue(false);
    setHasAskedOnce(false);
    setImagesKey((k) => k + 1);
  };

  if (!mounted) return null;

  if (!open) {
    return (
      <button type="button" className={triggerClassName} onClick={openManual}>
        {triggerLabel}
      </button>
    );
  }

  const onContinue = () => {
    // Ritorna alle immagini senza chiudere e senza chiedere di nuovo.
    setAskContinue(false);
    setImagesKey((k) => k + 1);
  };

  return (
    <div
      className="fixed inset-0 z-[250] flex max-h-[100dvh] items-end justify-center overflow-hidden bg-black/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Intro"
    >
      <div
        className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-[var(--nav-border)] bg-[var(--paper)] shadow-2xl max-sm:max-h-[min(88dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-0.75rem))] sm:max-h-[min(92dvh,900px)] sm:rounded-2xl"
      >
        <header className="sticky top-0 z-20 flex shrink-0 items-start justify-between gap-3 border-b border-[var(--nav-border)] bg-[var(--paper)] px-4 py-3 pt-[max(1rem,env(safe-area-inset-top,0px))] sm:pt-4">
          <div>
            <h2 className="font-display text-base font-semibold text-[var(--ink)]">
              Lettera di Pasqua 2026
            </h2>
          </div>

          <button
            type="button"
            className="rounded-lg border border-[var(--nav-border)] px-3 py-1.5 text-sm text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
            onClick={() => closeAndHandle(true)}
          >
            Chiudi
          </button>
        </header>

        {!askContinue ? (
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"
            key={imagesKey}
          >
            <div className="space-y-4">
              {images.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className="w-full rounded-xl border border-[var(--nav-border)] bg-white"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="rounded-xl border border-[var(--nav-border)] bg-[var(--paper-deep)]/50 p-5">
              <p className="font-display text-lg font-semibold text-[var(--ink)]">
                Vuoi continuare a leggere?
              </p>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Puoi scegliere “Si” per proseguire oppure “No” per chiudere.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--paper)] transition-opacity hover:opacity-90"
                  onClick={onContinue}
                >
                  Si
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper-deep)]"
                  onClick={() => closeAndHandle(true)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


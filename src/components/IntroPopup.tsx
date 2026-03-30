"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SESSION_KEY = "intro-popup-handled";

type IntroPopupImage = { src: string; alt: string };

export default function IntroPopup() {
  const images = useMemo<IntroPopupImage[]>(
    () => [
      { src: "/pagina1.png", alt: "Pagina 1" },
      { src: "/pagina2.png", alt: "Pagina 2" },
      { src: "/pagina3.png", alt: "Pagina 3" },
      { src: "/pagina4.png", alt: "Pagina 4" },
    ],
    [],
  );

  const [open, setOpen] = useState(() => {
    // `sessionStorage` non esiste in SSR: apriamo il popup solo sul client.
    if (typeof window === "undefined") return false;
    try {
      return !window.sessionStorage.getItem(SESSION_KEY);
    } catch {
      // Se sessionStorage non è disponibile, preferiamo mostrare comunque il popup.
      return true;
    }
  });
  const [askContinue, setAskContinue] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open || askContinue) return;

    timerRef.current = window.setTimeout(() => {
      setAskContinue(true);
    }, 20_000);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [open, askContinue]);

  const closeAndHandle = (handled: boolean) => {
    setOpen(false);
    setAskContinue(false);

    if (!handled) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // No-op: senza sessionStorage il comportamento resta “best effort”.
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Intro"
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)] shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--nav-border)] px-4 py-3">
          <div>
            <h2 className="font-display text-base font-semibold text-[var(--ink)]">
              Napoli, centro storico
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              Una breve lettura introduttiva.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg border border-[var(--nav-border)] px-3 py-1.5 text-sm text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
            onClick={() => closeAndHandle(true)}
          >
            Chiudi
          </button>
        </div>

        {!askContinue ? (
          <div className="max-h-[80vh] overflow-y-auto p-4">
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
                  onClick={() => closeAndHandle(true)}
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


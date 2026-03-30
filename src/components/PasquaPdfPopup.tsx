"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PDF_SRC = "/Lettera-Pasqua-2026-SANT-ELIGIO.pdf";
const SESSION_NO_KEY = "pasqua_pdf_no_v1";
const SESSION_ASKED_KEY = "pasqua_pdf_asked_v1";

export function PasquaPdfPopup() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [ask, setAsk] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setReady(true);

    try {
      const storedNo = sessionStorage.getItem(SESSION_NO_KEY);
      if (storedNo === "1") {
        setOpen(false);
        return;
      }
    } catch {
      // Se sessionStorage non è disponibile, mostriamo comunque il popup.
    }

    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    timerRef.current = window.setTimeout(() => {
      try {
        const alreadyAsked = sessionStorage.getItem(SESSION_ASKED_KEY) === "1";
        if (alreadyAsked) return;
        sessionStorage.setItem(SESSION_ASKED_KEY, "1");
      } catch {
        // Se sessionStorage non è disponibile, chiediamo comunque alla prima apertura.
      }

      setAsk(true);
    }, 20000);

    return () => {
      document.body.style.overflow = prevOverflow;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (!ready || !ask) return;
    const t = window.setTimeout(() => {
      document.getElementById("pasqua-pdf-no-btn")?.focus?.();
    }, 50);
    return () => window.clearTimeout(t);
  }, [ready, ask]);

  const storeNo = () => {
    try {
      sessionStorage.setItem(SESSION_NO_KEY, "1");
    } catch {
      // no-op
    }
  };

  const close = () => {
    setAsk(false);
    // "Chiudi" equivale a non continuare (quindi niente riapertura su altre pagine).
    storeNo();
    setOpen(false);
  };

  if (!ready || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[240] flex max-h-[100dvh] flex-col bg-black/45"
      role="presentation"
    >
      <div
        className="relative z-10 flex max-h-[100dvh] flex-1 flex-col overflow-hidden bg-[var(--paper)] pb-[env(safe-area-inset-bottom,0px)]"
        role="dialog"
        aria-modal="true"
        aria-label="Lettera di Pasqua"
      >
        <header className="sticky top-0 z-20 flex shrink-0 items-start justify-between gap-3 border-b border-[var(--nav-border)] bg-[var(--paper)] px-4 py-4 pt-[max(1rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pt-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
              Lettera di Pasqua
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              Stai leggendo il PDF completo.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--paper-deep)]"
          >
            Chiudi
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          <iframe
            src={PDF_SRC}
            title="Lettera di Pasqua - PDF"
            className="h-full w-full border-0"
          />
        </div>

        {ask ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 p-4">
            <div className="w-full max-w-md rounded-xl border border-[var(--nav-border)] bg-[var(--paper)] p-5 shadow-2xl">
              <p className="font-display text-lg font-semibold text-[var(--ink)]">
                Vuoi continuare a leggere?
              </p>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Seleziona un’opzione per continuare o interrompere.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAsk(false);
                  }}
                  className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-soft)]"
                >
                  Si
                </button>
                <button
                  id="pasqua-pdf-no-btn"
                  type="button"
                  onClick={() => {
                    storeNo();
                    setAsk(false);
                    setOpen(false);
                  }}
                  className="flex-1 rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--paper-deep)]"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}


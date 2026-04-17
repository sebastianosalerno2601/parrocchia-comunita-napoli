"use client";

import { useEffect, useRef, useState } from "react";

const IMAGE_SRC = "/messa-da-sua-eminenza.webp";

export default function MessaCardBattagliaPopup({
  triggerLabel = "Papa Leone XIV a Napoli",
  triggerClassName = "nav-pill font-display text-lg font-medium self-center w-fit",
}: {
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [askContinue, setAskContinue] = useState(false);
  const [hasAskedOnce, setHasAskedOnce] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setMounted(true);
      setOpen(true);
    }, 0);

    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open || askContinue || hasAskedOnce) return;

    timerRef.current = window.setTimeout(() => {
      setAskContinue(true);
      setHasAskedOnce(true);
    }, 15_000);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [open, askContinue, hasAskedOnce]);

  const closeAndHandle = (handled: boolean) => {
    setOpen(false);
    setAskContinue(false);
    setHasAskedOnce(true);
    if (!handled) return;
  };

  const openManual = () => {
    setOpen(true);
    setAskContinue(false);
    setHasAskedOnce(false);
  };

  if (!mounted) return null;

  if (!open) {
    return (
      <button type="button" className={triggerClassName} onClick={openManual}>
        {triggerLabel}
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[250] flex max-h-[100dvh] items-center justify-center overflow-hidden bg-black/60 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Papa Leone XIV a Napoli"
    >
      <div className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)] shadow-2xl max-h-[min(92dvh,900px)]">
        <header className="sticky top-0 z-20 flex shrink-0 items-start justify-between gap-3 border-b border-[var(--nav-border)] bg-[var(--paper)] px-4 py-3 pt-[max(1rem,env(safe-area-inset-top,0px))] sm:pt-4">
          <h2 className="font-display text-base font-semibold text-[var(--ink)]">
            Papa Leone XIV a Napoli
          </h2>
          <button
            type="button"
            className="rounded-lg border border-[var(--nav-border)] px-3 py-1.5 text-sm text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
            onClick={() => closeAndHandle(true)}
          >
            Chiudi
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          {!askContinue ? (
            <img
              src={IMAGE_SRC}
              alt="Papa Leone XIV a Napoli"
              className="mx-auto w-full max-w-2xl rounded-xl border border-[var(--nav-border)] bg-white"
            />
          ) : (
            <div className="rounded-xl border border-[var(--nav-border)] bg-[var(--paper-deep)]/50 p-5">
              <p className="font-display text-lg font-semibold text-[var(--ink)]">
                Vuoi continuare a leggere?
              </p>
              <p className="mt-2 text-sm text-[var(--ink-muted)]">
                Puoi scegliere "Si" per proseguire oppure "No" per chiudere.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--paper)] transition-opacity hover:opacity-90"
                  onClick={() => setAskContinue(false)}
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
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "campo-estivo-smak-2026-popup-dismissed";
const PHONE_ISCRIZIONI = "0816129420";

const IMG_LOCANDINA =
  "/Pop-Up/ChatGPT Image 12 giu 2026, 21_54_54.png";
const IMG_GRESTATE = "/Pop-Up/867eb3d5-b063-48b8-b4ff-0205c405ff94.png";
const IMG_PAPPAGALLO =
  "/Pop-Up/WhatsApp Image 2026-06-12 at 20.35.47.jpeg";

const IBAN = "IT03M0103003402000000917294";

const HIGHLIGHTS = [
  { label: "Periodo", value: "Dal 29 giugno al 31 luglio" },
  { label: "Orario", value: "09:00 – 17:00" },
  { label: "Pranzo", value: "Incluso" },
  { label: "Costo", value: "Gratuito" },
  { label: "Età", value: "5–12 anni" },
  {
    label: "Luogo",
    value: "Complesso di Sant'Eligio Maggiore",
  },
] as const;

const SLIDE_COUNT = 3;

function HighlightCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/85 px-2.5 py-2 shadow-sm backdrop-blur-sm">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#be185d]">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-semibold leading-snug text-[#831843] sm:text-sm">
        {value}
      </p>
    </div>
  );
}

export function CampoEstivoPopup() {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* storage non disponibile */
    }
    const t = window.setTimeout(() => setOpen(true), 700);
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

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setSlide((s) => (s + 1) % SLIDE_COUNT);
      if (e.key === "ArrowLeft") setSlide((s) => (s - 1 + SLIDE_COUNT) % SLIDE_COUNT);
    },
    [close, open],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    }, 80);
    return () => window.clearTimeout(t);
  }, [open, slide]);

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(IBAN);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="campo-estivo-popup fixed inset-0 z-[210] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Chiudi popup"
        className="campo-estivo-popup-backdrop absolute inset-0 bg-[#4a044e]/55 backdrop-blur-[3px]"
        onClick={() => close()}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="campo-estivo-popup-panel relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.75rem] border border-[#fbcfe8]/80 bg-[#fff7fb] shadow-[0_28px_90px_rgba(190,24,93,0.28)] max-sm:max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)))] sm:max-h-[min(90dvh,820px)] sm:rounded-[1.75rem]"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#fde047]/35 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-[#f472b6]/30 blur-2xl" />

        <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-[#fbcfe8]/90 bg-gradient-to-r from-[#fff1f8] via-[#fff7fb] to-[#fffbeb] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#db2777]">
              GrEstate 2026
            </p>
            <h2
              id={titleId}
              className="font-display truncate text-lg font-semibold text-[#831843] sm:text-xl"
            >
              Campo Estivo SMAK
            </h2>
          </div>
          <button
            type="button"
            onClick={() => close()}
            className="shrink-0 rounded-full border border-[#fbcfe8] bg-white/90 px-3 py-1.5 text-sm font-medium text-[#9d174d] transition hover:border-[#f472b6] hover:bg-[#fdf2f8]"
          >
            Chiudi
          </button>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            className="campo-estivo-popup-track flex h-full min-h-0 items-stretch transition-transform duration-500 ease-out"
            style={{
              width: `${SLIDE_COUNT * 100}%`,
              transform: `translateX(-${(slide * 100) / SLIDE_COUNT}%)`,
            }}
          >
            {/* Slide 1 — Presentazione */}
            <section
              className="campo-estivo-popup-slide h-full max-h-full shrink-0 overflow-y-auto overscroll-contain px-4 py-4 pb-5 sm:px-6 sm:py-5"
              style={{ width: `${100 / SLIDE_COUNT}%` }}
              aria-hidden={slide !== 0}
            >
              <div className="mx-auto w-[90%] overflow-hidden rounded-2xl border-2 border-[#f9a8d4] shadow-[0_16px_40px_rgba(219,39,119,0.18)] sm:w-[88%]">
                <Image
                  src={IMG_LOCANDINA}
                  alt="Locandina Campo Estivo SMAK 2026 — Un campus al Mercato"
                  width={1600}
                  height={900}
                  className="h-auto w-full"
                  sizes="(max-width: 768px) 90vw, 680px"
                  priority
                />
              </div>

              <div className="mt-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#db2777]">
                  Un campus al Mercato
                </p>
                <h3 className="font-display mt-1.5 text-2xl font-bold leading-tight text-[#9d174d] sm:text-3xl">
                  CAMPO ESTIVO SMAK 2026
                </h3>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {HIGHLIGHTS.map((item) => (
                  <HighlightCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>

              <div className="mt-4 flex justify-center pb-6">
                <button
                  type="button"
                  onClick={() => setSlide(1)}
                  className="campo-estivo-popup-cta inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#db2777] to-[#be185d] px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(219,39,119,0.35)] transition hover:scale-[1.02] hover:shadow-[0_14px_34px_rgba(219,39,119,0.42)]"
                >
                  <span aria-hidden>👉</span>
                  Scopri di più
                </button>
              </div>
            </section>

            {/* Slide 2 — Progetto educativo */}
            <section
              className="campo-estivo-popup-slide h-full max-h-full shrink-0 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6"
              style={{ width: `${100 / SLIDE_COUNT}%` }}
              aria-hidden={slide !== 1}
            >
              <div className="grid gap-5 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] sm:items-center">
                <div className="relative mx-auto w-full max-w-sm sm:max-w-none">
                  <div
                    aria-hidden
                    className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#fde047] via-[#f472b6] to-[#38bdf8] opacity-70 blur-xl"
                  />
                  <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-white bg-white shadow-[0_18px_44px_rgba(190,24,93,0.22)]">
                    <Image
                      src={IMG_PAPPAGALLO}
                      alt="Pappagalli SMAK — GrEstate 2026, educare alla pace"
                      width={1200}
                      height={900}
                      className="h-auto w-full object-contain"
                      sizes="(max-width: 640px) 80vw, 360px"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#db2777]">
                    Il progetto educativo
                  </p>
                  <h3 className="font-display mt-2 text-3xl font-bold leading-tight text-[#9d174d] sm:text-[2rem]">
                    EDUCARE ALLA PACE
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#701a40] sm:text-base">
                    Il Campus Smak non è soltanto divertimento. Attraverso
                    giochi, laboratori, sport e momenti di condivisione,
                    accompagniamo i ragazzi in un percorso di crescita ispirato
                    ai valori della pace, della fraternità e del bene comune.
                  </p>
                  <p className="mt-4 rounded-xl border border-[#fbcfe8] bg-white/80 px-4 py-3 text-sm leading-relaxed text-[#831843]">
                    <strong>Iscrizioni:</strong> Asso.Gio.Ca. dal lunedì al
                    venerdì, ore 9:00–18:00.
                    <br />
                    <strong>Telefono:</strong>{" "}
                    <a
                      href={`tel:${PHONE_ISCRIZIONI}`}
                      className="font-semibold text-[#db2777] underline decoration-[#f9a8d4] underline-offset-2"
                    >
                      {PHONE_ISCRIZIONI}
                    </a>
                  </p>

                  <div className="mt-6">
                    <a
                      href={`tel:${PHONE_ISCRIZIONI}`}
                      className="campo-estivo-popup-cta inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(234,88,12,0.32)] transition hover:scale-[1.02]"
                    >
                      <span aria-hidden>👉</span>
                      Come partecipare
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Slide 3 — Raccolta fondi */}
            <section
              className="campo-estivo-popup-slide relative h-full max-h-full shrink-0 overflow-y-auto overscroll-contain px-4 py-4 pb-5 sm:px-6 sm:py-5"
              style={{ width: `${100 / SLIDE_COUNT}%` }}
              aria-hidden={slide !== 2}
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <Image
                  src={IMG_GRESTATE}
                  alt=""
                  aria-hidden
                  fill
                  className="object-cover object-[72%_center] scale-105"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#fff7fb]/96 via-[#fdf2f8]/88 to-[#fff7fb]/94" />
              </div>

              <div className="relative z-10">
                <div className="mx-auto max-w-xl rounded-2xl border border-[#f9a8d4]/80 bg-white/96 px-4 py-3 shadow-[0_12px_32px_rgba(190,24,93,0.12)] backdrop-blur-md sm:px-5 sm:py-4">
                  <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-[#be185d]">
                    Benvenuti nel GrEstate 2026
                  </p>
                  <h3 className="font-display mt-2 text-center text-2xl font-bold leading-tight text-[#9d174d] sm:text-3xl">
                    <span aria-hidden className="mr-1">
                      ❤️
                    </span>
                    AIUTATECI AD AIUTARE!
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[#701a40] sm:text-[15px]">
                    Un piccolo contributo ci permetterà di mantenere gratuito il
                    Campo Estivo per oltre 100 ragazzi.
                  </p>
                </div>

                <div className="mx-auto mt-4 max-w-lg rounded-2xl border border-[#f9a8d4] bg-white/92 p-4 shadow-[0_16px_40px_rgba(190,24,93,0.16)] backdrop-blur-sm sm:p-5">
                  <p className="font-display text-lg font-semibold text-[#9d174d]">
                    Modalità per contribuire
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#701a40] sm:text-[15px]">
                    <li className="flex gap-3 rounded-xl bg-[#fdf2f8] px-3 py-2.5">
                      <span aria-hidden className="text-lg">
                        🏛️
                      </span>
                      <span>
                        <strong>Parrocchia Sant&apos;Eligio Maggiore</strong>
                      </span>
                    </li>
                    <li className="flex gap-3 rounded-xl bg-[#fdf2f8] px-3 py-2.5">
                      <span aria-hidden className="text-lg">
                        💳
                      </span>
                      <span>
                        <strong>IBAN</strong>
                        <br />
                        <span className="font-mono text-[13px] tracking-wide sm:text-sm">
                          {IBAN}
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-3 rounded-xl bg-[#fdf2f8] px-3 py-2.5">
                      <span aria-hidden className="text-lg">
                        📝
                      </span>
                      <span>
                        <strong>Causale</strong>
                        <br />
                        Campo Estivo 2026
                      </span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={copyIban}
                    className="mt-4 w-full rounded-full border border-[#f9a8d4] bg-white px-4 py-2.5 text-sm font-semibold text-[#9d174d] transition hover:bg-[#fdf2f8]"
                  >
                    {copied ? "IBAN copiato!" : "Copia IBAN"}
                  </button>

                  <div className="mt-4 border-t border-[#fbcfe8] pt-4 text-center">
                    <p className="text-sm leading-relaxed text-[#831843]">
                      Con profonda gratitudine a tutti i volontari e ai
                      donatori.
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold text-[#9d174d]">
                      Don Alessandro Overa
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer className="relative z-10 shrink-0 border-t border-[#fbcfe8]/90 bg-[#fff7fb]/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                setSlide((s) => (s - 1 + SLIDE_COUNT) % SLIDE_COUNT)
              }
              className="rounded-full border border-[#fbcfe8] bg-white px-3 py-1.5 text-sm font-medium text-[#9d174d] transition hover:border-[#f472b6]"
              aria-label="Slide precedente"
            >
              ←
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Slide popup">
              {Array.from({ length: SLIDE_COUNT }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={slide === i}
                  aria-label={`Vai alla slide ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className={[
                    "h-2.5 rounded-full transition-all duration-300",
                    slide === i
                      ? "w-7 bg-gradient-to-r from-[#db2777] to-[#f59e0b]"
                      : "w-2.5 bg-[#fbcfe8] hover:bg-[#f9a8d4]",
                  ].join(" ")}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSlide((s) => (s + 1) % SLIDE_COUNT)}
              className="rounded-full border border-[#fbcfe8] bg-white px-3 py-1.5 text-sm font-medium text-[#9d174d] transition hover:border-[#f472b6]"
              aria-label="Slide successiva"
            >
              →
            </button>
          </div>

          <button
            type="button"
            onClick={() => close(true)}
            className="mt-3 w-full text-center text-xs font-medium text-[#9d174d]/80 underline decoration-[#fbcfe8] underline-offset-2 transition hover:text-[#9d174d]"
          >
            Non mostrare più
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

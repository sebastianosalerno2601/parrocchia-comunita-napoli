"use client";

import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { forwardRef, useId, useRef, useState } from "react";

const PAGES = [
  {
    src: "/popup/Pagina1.png",
    alt: "Lettera pastorale 2026/27 — pagina 1",
  },
  {
    src: "/popup/Pagina2.png",
    alt: "Lettera pastorale 2026/27 — pagina 2",
  },
  {
    src: "/popup/Pagina3.png",
    alt: "Lettera pastorale 2026/27 — pagina 3",
  },
  {
    src: "/popup/Pagina4.png",
    alt: "Lettera pastorale 2026/27 — pagina 4",
  },
] as const;

type FlipBookApi = {
  flipNext: (corner?: "top" | "bottom") => void;
  flipPrev: (corner?: "top" | "bottom") => void;
  flip: (page: number, corner?: "top" | "bottom") => void;
};

type FlipBookHandle = {
  pageFlip: () => FlipBookApi;
};

type LetterPageProps = (typeof PAGES)[number];

const LetterPage = forwardRef<HTMLDivElement, LetterPageProps>(
  function LetterPage({ src, alt }, ref) {
    return (
      <article ref={ref} className="letter-flipbook-page">
        <Image
          src={src}
          alt={alt}
          width={662}
          height={907}
          sizes="(max-width: 640px) calc(100vw - 2rem), 50vw"
          className="h-full w-full object-cover"
          priority={src === PAGES[0].src}
        />
      </article>
    );
  },
);

export function LetteraPastoraleFlipBook() {
  const titleId = useId();
  const bookRef = useRef<FlipBookHandle | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "landscape",
  );

  const visiblePageEnd =
    orientation === "landscape"
      ? Math.min(currentPage + 2, PAGES.length)
      : currentPage + 1;
  const canGoPrevious = currentPage > 0;
  const canGoNext =
    currentPage < PAGES.length - (orientation === "landscape" ? 2 : 1);

  const flipTo = (page: number) => {
    if (page === currentPage) return;
    bookRef.current?.pageFlip().flip(page, "top");
  };

  return (
    <section
      id="lettera-pastorale"
      className="relative scroll-mt-[calc(5rem+env(safe-area-inset-top,0px))] overflow-hidden border-y border-(--nav-border) bg-(--paper-deep)/45 px-4 py-14 sm:scroll-mt-6 sm:py-18"
      aria-labelledby={titleId}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.92),transparent_58%),radial-gradient(ellipse_at_50%_100%,rgba(139,105,20,0.11),transparent_68%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-(--accent)">
            Comunità parrocchiale
          </p>
          <h2
            id={titleId}
            className="font-display mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Lettera pastorale 2026/27
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-(--ink-muted)">
            “Prendere il largo sulla Parola di Cristo”, facendolo insieme, in
            cordata.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-6xl sm:mt-10">
          <div className="letter-flipbook-stage">
            <HTMLFlipBook
              ref={bookRef}
              startPage={0}
              width={430}
              height={589}
              size="stretch"
              minWidth={270}
              maxWidth={520}
              minHeight={370}
              maxHeight={713}
              drawShadow
              flippingTime={900}
              usePortrait
              startZIndex={0}
              autoSize
              maxShadowOpacity={0.52}
              showCover={false}
              mobileScrollSupport
              clickEventForward
              useMouseEvents
              swipeDistance={30}
              showPageCorners
              disableFlipByClick={false}
              className="letter-flipbook"
              style={{}}
              onFlip={(event: { data: number }) => setCurrentPage(event.data)}
              onChangeOrientation={(event: {
                data: "portrait" | "landscape";
              }) => setOrientation(event.data)}
            >
              {PAGES.map((page) => (
                <LetterPage key={page.src} {...page} />
              ))}
            </HTMLFlipBook>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={() => bookRef.current?.pageFlip().flipPrev("top")}
              className="letter-carousel-mobile-arrow"
              aria-label="Pagina precedente"
              disabled={!canGoPrevious}
            >
              <ArrowLeft />
            </button>

            <p
              className="min-w-28 text-center text-xs font-semibold uppercase tracking-[0.18em] text-(--ink-muted)"
              aria-live="polite"
            >
              Pagine {currentPage + 1}–{visiblePageEnd} di {PAGES.length}
            </p>

            <button
              type="button"
              onClick={() => bookRef.current?.pageFlip().flipNext("top")}
              className="letter-carousel-mobile-arrow"
              aria-label="Pagina successiva"
              disabled={!canGoNext}
            >
              <ArrowRight />
            </button>
          </div>

          <div
            className="mt-5 flex items-center justify-center gap-2 sm:hidden"
            role="tablist"
            aria-label="Pagine della lettera pastorale"
          >
            {PAGES.map((page, index) => (
              <button
                key={page.src}
                type="button"
                role="tab"
                aria-selected={index === currentPage}
                aria-label={`Vai a pagina ${index + 1}`}
                onClick={() => flipTo(index)}
                className={[
                  "flex h-9 min-w-9 items-center justify-center rounded-full border text-xs font-semibold transition duration-300",
                  index === currentPage
                    ? "border-(--accent) bg-(--accent) px-3 text-background shadow-sm"
                    : "border-(--nav-border) bg-white/70 text-(--ink-muted) hover:border-(--accent) hover:text-(--accent)",
                ].join(" ")}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-(--ink-muted)">
            Trascina un angolo o scorri lateralmente per sfogliare la lettera.
          </p>
        </div>
      </div>
    </section>
  );
}

function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5 fill-none stroke-current stroke-2"
    >
      <path d="m14.5 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5 fill-none stroke-current stroke-2"
    >
      <path d="m9.5 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type EventoPreview = {
  id: string;
  titolo: string;
  descrizione: string;
  dataIso: string;
  luogo?: string;
  imageUrl: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function excerpt(text: string, max = 160) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function withCloudinaryAuto(url: string, width = 1200) {
  if (!url.includes("res.cloudinary.com")) return url;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const prefix = url.slice(0, idx + marker.length);
  const rest = url.slice(idx + marker.length);
  if (rest.startsWith("f_auto")) return url;
  return `${prefix}f_auto,q_auto,w_${width}/${rest}`;
}

function cloudinarySrcSet(url: string) {
  if (!url.includes("res.cloudinary.com")) return undefined;
  return [
    `${withCloudinaryAuto(url, 480)} 480w`,
    `${withCloudinaryAuto(url, 800)} 800w`,
    `${withCloudinaryAuto(url, 1200)} 1200w`,
  ].join(", ");
}

export function EventiCarousel({
  titolo,
  eventi,
}: {
  titolo: string;
  eventi: EventoPreview[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  /** Su mobile lo swipe orizzontale è incompatibile con lo scroll automatico continuo. */
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setAutoScrollEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || eventi.length <= 1 || !autoScrollEnabled) return;

    let userInteracting = false;
    let resumeTimer: number | undefined;

    const pause = () => {
      userInteracting = true;
      window.clearTimeout(resumeTimer);
    };

    const scheduleResume = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        userInteracting = false;
      }, 2500);
    };

    node.addEventListener("pointerdown", pause);
    node.addEventListener("pointerup", scheduleResume);
    node.addEventListener("pointercancel", scheduleResume);
    node.addEventListener("pointerleave", scheduleResume);

    const interval = window.setInterval(() => {
      if (!node || userInteracting) return;
      const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 2;
      node.scrollTo({
        left: atEnd ? 0 : node.scrollLeft + 1,
        behavior: "auto",
      });
    }, 20);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(resumeTimer);
      node.removeEventListener("pointerdown", pause);
      node.removeEventListener("pointerup", scheduleResume);
      node.removeEventListener("pointercancel", scheduleResume);
      node.removeEventListener("pointerleave", scheduleResume);
    };
  }, [eventi.length, autoScrollEnabled]);

  const cardWidth = useMemo(() => 360, []);

  const slide = (dir: "left" | "right") => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">{titolo}</h2>
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            aria-label={`Scorri ${titolo} a sinistra`}
            onClick={() => slide("left")}
            className="rounded-full border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-1 text-sm text-[var(--ink)] hover:border-[var(--accent)]"
          >
            ←
          </button>
          <button
            type="button"
            aria-label={`Scorri ${titolo} a destra`}
            onClick={() => slide("right")}
            className="rounded-full border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-1 text-sm text-[var(--ink)] hover:border-[var(--accent)]"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]"
      >
        {eventi.map((ev) => (
          <Link
            key={ev.id}
            href={`/eventi/${ev.id}`}
            className="w-[min(86vw,22rem)] shrink-0 snap-start overflow-hidden rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)]/80 shadow-sm transition-colors hover:border-[var(--accent)]"
          >
            <img
              src={withCloudinaryAuto(ev.imageUrl)}
              srcSet={cloudinarySrcSet(ev.imageUrl)}
              sizes="(max-width: 640px) 86vw, 352px"
              alt={ev.titolo}
              className="h-52 w-full object-cover object-center"
            />
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                {formatDate(ev.dataIso)}
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--ink)]">
                {ev.titolo}
              </h3>
              {ev.luogo ? (
                <p className="mt-2 text-sm text-[var(--ink-muted)]">{ev.luogo}</p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                {excerpt(ev.descrizione)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}


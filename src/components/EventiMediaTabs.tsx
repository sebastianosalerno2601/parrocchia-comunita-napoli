"use client";

import { useMemo, useState } from "react";
import { EventiGalleryLightbox } from "@/components/EventiGalleryLightbox";

type MediaTab = "images" | "videos";

export function EventiMediaTabs({
  images,
  videos,
  title,
}: {
  images: string[];
  videos: string[];
  title: string;
}) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const safeVideos = useMemo(() => videos.filter(Boolean), [videos]);
  const hasImages = safeImages.length > 0;
  const hasVideos = safeVideos.length > 0;

  const [tab, setTab] = useState<MediaTab>(hasImages ? "images" : "videos");

  if (!hasImages && !hasVideos) return null;

  const showTabs = hasImages && hasVideos;

  return (
    <section className="mx-auto mt-10 w-full max-w-5xl">
      {showTabs ? (
        <div
          className="flex justify-center gap-2"
          role="tablist"
          aria-label="Galleria evento"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "images"}
            onClick={() => setTab("images")}
            className={[
              "rounded-full border px-5 py-2 text-sm font-semibold transition",
              tab === "images"
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--paper)] shadow-sm"
                : "border-[var(--nav-border)] bg-[var(--paper)] text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
            ].join(" ")}
          >
            Immagini
            <span className="ml-1.5 text-xs font-medium opacity-80">
              ({safeImages.length})
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "videos"}
            onClick={() => setTab("videos")}
            className={[
              "rounded-full border px-5 py-2 text-sm font-semibold transition",
              tab === "videos"
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--paper)] shadow-sm"
                : "border-[var(--nav-border)] bg-[var(--paper)] text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
            ].join(" ")}
          >
            Video
            <span className="ml-1.5 text-xs font-medium opacity-80">
              ({safeVideos.length})
            </span>
          </button>
        </div>
      ) : null}

      {(!showTabs || tab === "images") && hasImages ? (
        <div role="tabpanel" aria-label="Immagini">
          <EventiGalleryLightbox images={safeImages} title={title} />
        </div>
      ) : null}

      {(!showTabs || tab === "videos") && hasVideos ? (
        <div role="tabpanel" aria-label="Video" className={showTabs ? "mt-2" : ""}>
          {!showTabs ? (
            <h2 className="font-display text-center text-2xl font-semibold text-[var(--ink)]">
              Video dell&apos;evento
            </h2>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {safeVideos.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="overflow-hidden rounded-xl border border-[var(--nav-border)] bg-black shadow-sm"
              >
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full object-contain"
                >
                  <source src={src} />
                </video>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

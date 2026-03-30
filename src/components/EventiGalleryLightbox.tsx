"use client";

import { useMemo, useState } from "react";

function withCloudinaryAuto(url: string, width = 1600) {
  if (!url.includes("res.cloudinary.com")) return url;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const prefix = url.slice(0, idx + marker.length);
  const rest = url.slice(idx + marker.length);
  if (rest.startsWith("f_auto")) return url;
  return `${prefix}f_auto,q_auto,w_${width}/${rest}`;
}

export function EventiGalleryLightbox({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const hasSingleImage = images.length === 1;

  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  if (safeImages.length === 0) return null;

  const current = activeIdx !== null ? safeImages[activeIdx] : null;

  const downloadHref = (img: string, idx: number) =>
    `/api/download-image?url=${encodeURIComponent(img)}&name=${encodeURIComponent(
      `${title}-foto-${idx + 1}`,
    )}`;

  const prev = () => {
    if (activeIdx === null) return;
    setActiveIdx((activeIdx - 1 + safeImages.length) % safeImages.length);
  };
  const next = () => {
    if (activeIdx === null) return;
    setActiveIdx((activeIdx + 1) % safeImages.length);
  };

  return (
    <>
      <section
        className={[
          "mt-8 grid gap-4",
          hasSingleImage ? "mx-auto max-w-3xl grid-cols-1" : "sm:grid-cols-2",
        ].join(" ")}
      >
        {safeImages.map((img, idx) => (
          <figure key={`${img}-${idx}`} className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveIdx(idx)}
              className="block w-full text-left"
              title="Apri immagine"
            >
              <img
                src={withCloudinaryAuto(img)}
                alt={`${title} - immagine ${idx + 1}`}
                className={[
                  "rounded-xl border border-[var(--nav-border)] object-cover object-center shadow-sm transition-opacity hover:opacity-95",
                  hasSingleImage
                    ? "mx-auto h-[26rem] w-full max-w-3xl"
                    : "h-72 w-full",
                ].join(" ")}
              />
            </button>
            <div className="flex justify-end">
              <a
                href={downloadHref(img, idx)}
                download
                className="rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
              >
                Download
              </a>
            </div>
          </figure>
        ))}
      </section>

      {current ? (
        <div
          className="fixed inset-0 z-[280] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10"
            onClick={() => setActiveIdx(null)}
          >
            Chiudi
          </button>
          {safeImages.length > 1 ? (
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-3 py-2 text-white hover:bg-white/10"
              onClick={prev}
              aria-label="Immagine precedente"
            >
              ←
            </button>
          ) : null}

          <img
            src={withCloudinaryAuto(current, 2200)}
            alt={title}
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain"
          />

          {safeImages.length > 1 ? (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-3 py-2 text-white hover:bg-white/10"
              onClick={next}
              aria-label="Immagine successiva"
            >
              →
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}


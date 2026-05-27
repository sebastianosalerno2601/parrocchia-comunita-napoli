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
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);
  const hasSingleImage = images.length === 1;

  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  if (safeImages.length === 0) return null;

  const current = activeIdx !== null ? safeImages[activeIdx] : null;

  const downloadHref = (img: string, idx: number) =>
    `/api/download-image?url=${encodeURIComponent(img)}&name=${encodeURIComponent(
      `${title}-foto-${idx + 1}`,
    )}`;

  const downloadAll = async () => {
    if (downloadingAll) return;
    setDownloadingAll(true);
    try {
      const res = await fetch("/api/download-images-zip", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ urls: safeImages, title }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${title}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloadingAll(false);
    }
  };

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
      <div className="mt-8 flex w-full justify-center">
        <button
          type="button"
          onClick={downloadAll}
          disabled={downloadingAll}
          className="w-full max-w-md rounded-2xl bg-[var(--accent)] px-6 py-4 text-lg font-semibold text-[var(--paper)] shadow-sm transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-7"
        >
          {downloadingAll ? "Preparazione download..." : "Scarica tutte le foto"}
        </button>
      </div>

      <section
        className={[
          "mt-6 grid gap-4",
          hasSingleImage ? "mx-auto max-w-3xl grid-cols-1" : "sm:grid-cols-2",
        ].join(" ")}
      >
        {safeImages.map((img, idx) => (
          <figure key={`${img}-${idx}`} className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setLightboxLoaded(false);
                setActiveIdx(idx);
              }}
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

          <div className="relative">
            {!lightboxLoaded ? (
              <div className="absolute inset-0 z-10 flex min-h-[12rem] items-center justify-center rounded-xl bg-black/30 backdrop-blur-[1px]">
                <div className="flex flex-col items-center gap-3 px-4 text-center text-white">
                  <span
                    aria-hidden
                    className="h-8 w-8 animate-spin rounded-full border-2 border-white/70 border-r-transparent"
                  />
                  <p className="text-sm font-medium">Caricamento immagine…</p>
                </div>
              </div>
            ) : null}
            <img
              src={withCloudinaryAuto(current, 2200)}
              alt={title}
              onLoad={() => setLightboxLoaded(true)}
              className={[
                "max-h-[90vh] max-w-[95vw] rounded-xl object-contain",
                lightboxLoaded ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          </div>

          {activeIdx !== null ? (
            <a
              href={downloadHref(current, activeIdx)}
              download
              className="absolute bottom-4 right-4 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-white/10"
            >
              Scarica
            </a>
          ) : null}

          {safeImages.length > 1 ? (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-3 py-2 text-white hover:bg-white/10"
              onClick={() => {
                setLightboxLoaded(false);
                next();
              }}
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


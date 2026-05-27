"use client";

import { FormEvent, useMemo, useState } from "react";
import { orderEventiForAdminList } from "@/lib/eventi-sort";

type AdminEvento = {
  id: string;
  titolo: string;
  descrizione: string;
  dataIso: string;
  luogo?: string;
  isUpcoming: boolean;
  isPast: boolean;
  imageUrl: string;
  imageUrls?: string[];
  imagePublicIds?: string[];
  videoUrls?: string[];
  videoPublicIds?: string[];
};

function cloudinaryThumb(url: string, size = 120) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("res.cloudinary.com")) return url;
    const parts = u.pathname.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return url;
    const transform = `f_auto,q_auto,w_${size},h_${size},c_fill`;
    const nextPath = [
      ...parts.slice(0, uploadIdx + 1),
      transform,
      ...parts.slice(uploadIdx + 1),
    ].join("/");
    u.pathname = nextPath;
    return u.toString();
  } catch {
    return url;
  }
}

export default function AdminEventiPage() {
  const [token, setToken] = useState("");
  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [dataIso, setDataIso] = useState("");
  const [luogo, setLuogo] = useState("");
  const [categoria, setCategoria] = useState<"upcoming" | "past">("upcoming");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverInputKey, setCoverInputKey] = useState(0);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryInputKey, setGalleryInputKey] = useState(0);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoInputKey, setVideoInputKey] = useState(0);
  const [removedExistingIndices, setRemovedExistingIndices] = useState<number[]>([]);
  const [removedExistingVideoIndices, setRemovedExistingVideoIndices] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [eventi, setEventi] = useState<AdminEvento[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => {
      if (!token || !titolo || !descrizione || !dataIso) return false;
      if (editingId) return true;
      return !!coverFile;
    },
    [token, titolo, descrizione, dataIso, coverFile, editingId],
  );

  const existingGalleryOrdered = useMemo(() => {
    if (!editingId) return [];
    const ev = eventi.find((e) => e.id === editingId);
    if (!ev) return [];
    const list = ev.imageUrls?.length
      ? ev.imageUrls
      : ev.imageUrl
        ? [ev.imageUrl]
        : [];
    return list.filter(Boolean);
  }, [editingId, eventi]);

  const existingVideosOrdered = useMemo(() => {
    if (!editingId) return [];
    const ev = eventi.find((e) => e.id === editingId);
    if (!ev) return [];
    const list = ev.videoUrls?.length ? ev.videoUrls : [];
    return list.filter(Boolean);
  }, [editingId, eventi]);

  function isExistingIndexRemoved(i: number) {
    return removedExistingIndices.includes(i);
  }

  function toggleExistingRemoval(i: number) {
    setRemovedExistingIndices((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  function isExistingVideoIndexRemoved(i: number) {
    return removedExistingVideoIndices.includes(i);
  }

  function toggleExistingVideoRemoval(i: number) {
    setRemovedExistingVideoIndices((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  const toIsoFromLocalInput = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toISOString();
  };

  const toLocalInputFromIso = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso.slice(0, 16);
    const tzOffsetMin = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffsetMin * 60_000);
    return local.toISOString().slice(0, 16);
  };

  async function loadEventi() {
    setLoadingList(true);
    setMsg(null);
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Caricamento eventi fallito.");
      const raw = (data.eventi as AdminEvento[]) ?? [];
      setEventi(orderEventiForAdminList(raw));
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Errore imprevisto.");
    } finally {
      setLoadingList(false);
    }
  }

  async function uploadFilesWithCloudinary(
    files: File[],
  ): Promise<
    Array<{ secure_url: string; public_id: string }>
  > {
    if (files.length === 0) throw new Error("Seleziona almeno un'immagine.");

    const uploadedAll: Array<{ secure_url: string; public_id: string }> = [];
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);

      const uploadRes = await fetch("/api/admin/upload-cloudinary", {
        method: "POST",
        headers: { "x-admin-token": token.trim() },
        body: form,
        cache: "no-store",
      });
      const uploaded = (await uploadRes.json()) as {
        secure_url?: string;
        public_id?: string;
        error?: string;
      };
      if (!uploadRes.ok) {
        throw new Error(uploaded.error ?? "Upload Cloudinary fallito.");
      }
      if (!uploaded.secure_url || !uploaded.public_id) {
        throw new Error("Upload Cloudinary fallito.");
      }
      uploadedAll.push({
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id,
      });
    }

    return uploadedAll;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setMsg(null);
    try {
      const current = editingId ? eventi.find((e) => e.id === editingId) : undefined;
      const existingUrls = current?.imageUrls?.length
        ? current.imageUrls
        : current?.imageUrl
          ? [current.imageUrl]
          : [];
      const existingPublicIds = current?.imagePublicIds ?? [];
      const keptPairs = existingUrls
        .map((url, i) => ({
          secure_url: url,
          public_id: existingPublicIds[i] ?? "",
        }))
        .filter((_, i) => !removedExistingIndices.includes(i));

      const existingVideoUrls = current?.videoUrls?.length ? current.videoUrls : [];
      const existingVideoPublicIds = current?.videoPublicIds ?? [];
      const keptVideoPairs = existingVideoUrls
        .map((url, i) => ({
          secure_url: url,
          public_id: existingVideoPublicIds[i] ?? "",
        }))
        .filter((_, i) => !removedExistingVideoIndices.includes(i));

      const uploadedCover = coverFile
        ? await uploadFilesWithCloudinary([coverFile])
        : [];
      const uploadedGallery =
        galleryFiles.length > 0 ? await uploadFilesWithCloudinary(galleryFiles) : [];
      const uploadedVideos =
        videoFiles.length > 0 ? await uploadFilesWithCloudinary(videoFiles) : [];

      let coverUrl: string;
      let coverPublicId: string;
      let remainder: Array<{ secure_url: string; public_id: string }>;

      if (uploadedCover[0]) {
        coverUrl = uploadedCover[0].secure_url;
        coverPublicId = uploadedCover[0].public_id;
        remainder = [
          ...keptPairs,
          ...uploadedGallery.map((u) => ({
            secure_url: u.secure_url,
            public_id: u.public_id,
          })),
        ];
      } else {
        const first = keptPairs[0];
        if (!first) throw new Error("Serve almeno un’immagine: carica una copertina o ripristinane una.");
        coverUrl = first.secure_url;
        coverPublicId = first.public_id;
        remainder = [
          ...keptPairs.slice(1).map((p) => ({
            secure_url: p.secure_url,
            public_id: p.public_id,
          })),
          ...uploadedGallery.map((u) => ({
            secure_url: u.secure_url,
            public_id: u.public_id,
          })),
        ];
      }

      const allImages = [{ secure_url: coverUrl, public_id: coverPublicId }, ...remainder];
      const allVideos = [
        ...keptVideoPairs,
        ...uploadedVideos.map((u) => ({ secure_url: u.secure_url, public_id: u.public_id })),
      ];

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: JSON.stringify({
          id: editingId ?? undefined,
          titolo,
          descrizione,
          dataIso: toIsoFromLocalInput(dataIso),
          luogo,
          isUpcoming: categoria === "upcoming",
          isPast: categoria === "past",
          imageUrl: coverUrl,
          imagePublicId: coverPublicId || undefined,
          imageUrls: allImages.map((u) => u.secure_url as string),
          imagePublicIds: allImages
            .map((u) => u.public_id as string)
            .filter(Boolean),
          videoUrls: allVideos.map((u) => u.secure_url as string),
          videoPublicIds: allVideos.map((u) => u.public_id as string).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Salvataggio evento fallito.");

      const wasEditing = !!editingId;
      const savedVideoCount = allVideos.length;

      setTitolo("");
      setDescrizione("");
      setDataIso("");
      setLuogo("");
      setCategoria("upcoming");
      setCoverFile(null);
      setCoverInputKey((k) => k + 1);
      setGalleryFiles([]);
      setGalleryInputKey((k) => k + 1);
      setRemovedExistingIndices([]);
      setVideoFiles([]);
      setVideoInputKey((k) => k + 1);
      setRemovedExistingVideoIndices([]);
      setEditingId(null);
      setMsg(
        wasEditing
          ? savedVideoCount > 0
            ? `Evento aggiornato con successo (${savedVideoCount} video).`
            : "Evento aggiornato con successo."
          : savedVideoCount > 0
            ? `Evento creato con successo (${savedVideoCount} video).`
            : "Evento creato con successo.",
      );
      await loadEventi();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Errore imprevisto.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(ev: AdminEvento) {
    setEditingId(ev.id);
    setTitolo(ev.titolo);
    setDescrizione(ev.descrizione);
    setDataIso(toLocalInputFromIso(ev.dataIso));
    setLuogo(ev.luogo ?? "");
    setCategoria(ev.isPast ? "past" : "upcoming");
    setCoverFile(null);
    setCoverInputKey((k) => k + 1);
    setGalleryFiles([]);
    setGalleryInputKey((k) => k + 1);
    setRemovedExistingIndices([]);
    setVideoFiles([]);
    setVideoInputKey((k) => k + 1);
    setRemovedExistingVideoIndices([]);
    setMsg(`Stai modificando: ${ev.titolo}`);
  }

  function cancelEdit() {
    setEditingId(null);
    setTitolo("");
    setDescrizione("");
    setDataIso("");
    setLuogo("");
    setCategoria("upcoming");
    setCoverFile(null);
    setCoverInputKey((k) => k + 1);
    setGalleryFiles([]);
    setGalleryInputKey((k) => k + 1);
    setRemovedExistingIndices([]);
    setVideoFiles([]);
    setVideoInputKey((k) => k + 1);
    setRemovedExistingVideoIndices([]);
    setMsg("Modifica annullata.");
  }

  async function removeEvento(id: string) {
    setDeletingId(id);
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-admin-token": token.trim() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Eliminazione fallita.");
      await loadEventi();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Errore imprevisto.");
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8">
      <h1 className="font-display text-4xl font-semibold text-[var(--ink)]">
        Admin Eventi
      </h1>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">
        Crea o modifica eventi e gestisci le immagini.
      </p>

      <section className="mt-6 rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)]/80 p-5 shadow-sm">
        <label className="text-sm font-medium text-[var(--ink)]" htmlFor="adminToken">
          Password
        </label>
        <input
          id="adminToken"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-2 w-full rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
          placeholder="Inserisci la password"
        />

        <button
          type="button"
          onClick={() => loadEventi()}
          className="nav-pill mt-4 inline-flex items-center justify-center gap-2 text-base font-medium"
          disabled={!token || loading || loadingList}
        >
          {loadingList ? (
            <>
              <span
                aria-hidden
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              />
              Caricamento elenco...
            </>
          ) : (
            "Carica elenco eventi"
          )}
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)]/80 p-5 shadow-sm">
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
          {editingId ? "Modifica evento" : "Nuovo evento"}
        </h2>
        <form className="mt-4 grid gap-4" onSubmit={onSubmit}>
          <input
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            className="rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
            placeholder="Titolo"
          />
          <textarea
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            className="min-h-24 rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
            placeholder="Descrizione"
          />
          <input
            value={luogo}
            onChange={(e) => setLuogo(e.target.value)}
            className="rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
            placeholder="Luogo (opzionale)"
          />
          <div className="rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-3">
            <p className="text-sm font-medium text-[var(--ink)]">Categoria evento</p>
            <div className="mt-2 flex flex-wrap gap-5">
              <label className="inline-flex items-center gap-2 text-sm text-[var(--ink)]">
                <input
                  type="radio"
                  name="categoriaEvento"
                  checked={categoria === "upcoming"}
                  onChange={() => setCategoria("upcoming")}
                />
                Prossimi eventi
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-[var(--ink)]">
                <input
                  type="radio"
                  name="categoriaEvento"
                  checked={categoria === "past"}
                  onChange={() => setCategoria("past")}
                />
                Eventi passati
              </label>
            </div>
          </div>
          <input
            type="datetime-local"
            value={dataIso}
            onChange={(e) => setDataIso(e.target.value)}
            className="rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
          />

          {editingId && existingGalleryOrdered.length > 0 ? (
            <div className="rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-3">
              <p className="text-sm font-medium text-[var(--ink)]">
                Immagini già caricate ({existingGalleryOrdered.length})
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                La prima è la copertina. &quot;Rimuovi&quot; toglie la foto solo da questo
                evento (non da Cloudinary). Puoi ripristinarla prima di salvare.
              </p>
              <ul className="mt-3 flex flex-wrap gap-3" aria-label="Anteprime immagini evento">
                {existingGalleryOrdered.map((url, i) => {
                  const removed = isExistingIndexRemoved(i);
                  const isCover = i === 0;
                  return (
                    <li key={`${url}-${i}`} className="flex shrink-0 flex-col items-center gap-1.5">
                      <div
                        className={[
                          "relative overflow-hidden rounded-md border border-[var(--nav-border)] bg-[var(--paper-deep)] shadow-sm ring-1 ring-black/5",
                          removed ? "opacity-45" : "",
                        ].join(" ")}
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                          aria-label={`Apri immagine ${i + 1} a dimensione piena`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- thumbs Cloudinary da URL esterno */}
                          <img
                            src={cloudinaryThumb(url, 100)}
                            alt=""
                            width={72}
                            height={72}
                            className="h-[4.5rem] w-[4.5rem] object-cover"
                          />
                        </a>
                        {isCover ? (
                          <span className="absolute left-1 top-1 rounded bg-[var(--ink)]/85 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--paper)]">
                            Copertina
                          </span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExistingRemoval(i)}
                        className={[
                          "max-w-[5.5rem] text-center text-[10px] font-medium leading-tight underline-offset-2 hover:underline",
                          removed
                            ? "text-[var(--accent)]"
                            : "text-[var(--ink-muted)]",
                        ].join(" ")}
                      >
                        {removed ? "Ripristina" : "Rimuovi"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ink)]">
              Carica copertina
            </label>
            <input
              key={coverInputKey}
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
            />
            {coverFile ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-xs text-[var(--ink-muted)]">
                  Copertina: {coverFile.name}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCoverFile(null);
                    setCoverInputKey((k) => k + 1);
                  }}
                  className="rounded-md border border-[var(--nav-border)] px-2 py-1 text-xs text-[var(--ink-muted)] hover:bg-[var(--paper-deep)]"
                >
                  Annulla selezione
                </button>
              </div>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ink)]">
              Carica immagini
            </label>
            <input
              key={galleryInputKey}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))}
              className="w-full rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
            />
            {galleryFiles.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {galleryFiles.map((file, idx) => (
                  <li
                    key={`${file.name}-${idx}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--nav-border)] bg-[var(--paper-deep)] px-2 py-1.5"
                  >
                    <span className="min-w-0 truncate text-xs text-[var(--ink-muted)]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setGalleryFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="shrink-0 rounded border border-[var(--nav-border)] px-2 py-0.5 text-[10px] text-[var(--ink-muted)] hover:bg-[var(--paper)]"
                    >
                      Rimuovi
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryFiles([]);
                      setGalleryInputKey((k) => k + 1);
                    }}
                    className="text-xs font-medium text-[var(--ink-muted)] underline-offset-2 hover:underline"
                  >
                    Rimuovi tutte le immagini selezionate
                  </button>
                </li>
              </ul>
            ) : null}
          </div>

          {editingId && existingVideosOrdered.length > 0 ? (
            <div className="rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-3">
              <p className="text-sm font-medium text-[var(--ink)]">
                Video già caricati ({existingVideosOrdered.length})
              </p>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                “Rimuovi” toglie il video solo da questo evento (non da Cloudinary). Puoi
                ripristinarlo prima di salvare.
              </p>
              <ul className="mt-3 space-y-2">
                {existingVideosOrdered.map((url, i) => {
                  const removed = isExistingVideoIndexRemoved(i);
                  return (
                    <li
                      key={`${url}-${i}`}
                      className={[
                        "flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--nav-border)] bg-[var(--paper-deep)] px-2 py-2",
                        removed ? "opacity-50" : "",
                      ].join(" ")}
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 truncate text-xs text-[var(--ink)] underline-offset-2 hover:underline"
                      >
                        {url}
                      </a>
                      <button
                        type="button"
                        onClick={() => toggleExistingVideoRemoval(i)}
                        className={[
                          "shrink-0 rounded border border-[var(--nav-border)] px-2 py-1 text-[10px] font-medium",
                          removed
                            ? "text-[var(--accent)]"
                            : "text-[var(--ink-muted)] hover:bg-[var(--paper)]",
                        ].join(" ")}
                      >
                        {removed ? "Ripristina" : "Rimuovi"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ink)]">
              Carica video (opzionale)
            </label>
            <input
              key={videoInputKey}
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => setVideoFiles(Array.from(e.target.files ?? []))}
              className="w-full rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] outline-none"
            />
            {videoFiles.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {videoFiles.map((file, idx) => (
                  <li
                    key={`${file.name}-${idx}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--nav-border)] bg-[var(--paper-deep)] px-2 py-1.5"
                  >
                    <span className="min-w-0 truncate text-xs text-[var(--ink-muted)]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setVideoFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="shrink-0 rounded border border-[var(--nav-border)] px-2 py-0.5 text-[10px] text-[var(--ink-muted)] hover:bg-[var(--paper)]"
                    >
                      Rimuovi
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFiles([]);
                      setVideoInputKey((k) => k + 1);
                    }}
                    className="text-xs font-medium text-[var(--ink-muted)] underline-offset-2 hover:underline"
                  >
                    Rimuovi tutti i video selezionati
                  </button>
                </li>
              </ul>
            ) : null}
          </div>

          <button
            type="submit"
            className="nav-pill inline-flex items-center justify-center gap-2 text-base font-medium"
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <>
                <span
                  aria-hidden
                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                />
                Salvataggio...
              </>
            ) : (
              editingId
                ? "Salva modifiche"
                : "Pubblica evento"
            )}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-[var(--nav-border)] px-4 py-2 text-sm text-[var(--ink-muted)] hover:bg-[var(--paper-deep)]"
            >
              Annulla modifica
            </button>
          ) : null}
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)]/80 p-5 shadow-sm">
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
          Eventi pubblicati
        </h2>
        {eventi.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--ink-muted)]">Nessun evento.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {eventi.map((ev) => (
              <li
                key={ev.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--ink)]">{ev.titolo}</p>
                  <p className="text-xs text-[var(--ink-muted)]">{ev.dataIso}</p>
                  <p className="text-xs text-[var(--ink-muted)]">
                    {ev.isUpcoming ? "Prossimi" : ""}
                    {ev.isUpcoming && ev.isPast ? " · " : ""}
                    {ev.isPast ? "Passati" : ""}
                  </p>
                  {ev.imageUrls?.length ? (
                    <p className="text-xs text-[var(--ink-muted)]">
                      {ev.imageUrls.length} immagini
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(ev)}
                  className="rounded-lg border border-[var(--nav-border)] px-3 py-1.5 text-xs text-[var(--ink-muted)] hover:bg-[var(--paper-deep)]"
                  disabled={loading}
                >
                  Modifica
                </button>
                <button
                  type="button"
                  onClick={() => removeEvento(ev.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--nav-border)] px-3 py-1.5 text-xs text-[var(--ink-muted)] hover:bg-[var(--paper-deep)]"
                  disabled={loading || !token}
                >
                  {deletingId === ev.id ? (
                    <>
                      <span
                        aria-hidden
                        className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent"
                      />
                      Eliminazione...
                    </>
                  ) : (
                    "Elimina"
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {msg ? <p className="mt-4 text-sm text-[var(--ink-muted)]">{msg}</p> : null}
    </main>
  );
}


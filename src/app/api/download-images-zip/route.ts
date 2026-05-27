import * as archiver from "archiver";
import { NextResponse } from "next/server";
import { PassThrough, Readable } from "node:stream";

export const dynamic = "force-dynamic";

function safeFileBase(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "foto";
}

function extFromContentType(contentType: string | null) {
  const ct = (contentType ?? "").toLowerCase();
  if (ct.includes("png")) return "png";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  return "bin";
}

function isAllowedHost(u: URL) {
  // Coerente con /api/download-image: solo Cloudinary.
  return u.hostname === "res.cloudinary.com";
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON non valido." }, { status: 400 });
  }

  const { urls, title } = (body ?? {}) as { urls?: unknown; title?: unknown };
  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: "Lista URL mancante." }, { status: 400 });
  }

  const safeTitle = safeFileBase(typeof title === "string" ? title : "evento");

  const parsedUrls: URL[] = [];
  for (const u of urls) {
    if (typeof u !== "string") continue;
    try {
      const parsed = new URL(u);
      if (!isAllowedHost(parsed)) {
        return NextResponse.json(
          { error: "Host immagine non consentito." },
          { status: 400 },
        );
      }
      parsedUrls.push(parsed);
    } catch {
      return NextResponse.json({ error: "URL immagine non valido." }, { status: 400 });
    }
  }

  if (parsedUrls.length === 0) {
    return NextResponse.json({ error: "Nessuna URL valida." }, { status: 400 });
  }

  const archive = new (archiver as any).ZipArchive({ zlib: { level: 9 } });
  const out = new PassThrough();
  archive.pipe(out);

  // Start downloading/adding files asynchronously.
  (async () => {
    try {
      for (let i = 0; i < parsedUrls.length; i++) {
        const url = parsedUrls[i];
        const upstream = await fetch(url.toString(), { cache: "no-store" });
        if (!upstream.ok || !upstream.body) continue;
        const ext = extFromContentType(upstream.headers.get("content-type"));
        const name = `${safeTitle}-foto-${String(i + 1).padStart(2, "0")}.${ext}`;
        // Convert web stream to node stream for archiver
        const nodeStream = Readable.fromWeb(upstream.body as any);
        archive.append(nodeStream, { name });
      }
    } finally {
      await archive.finalize();
    }
  })().catch(() => {
    // Se qualcosa va storto, chiudiamo l'archivio comunque.
    try {
      archive.abort();
    } catch {
      // ignore
    }
  });

  return new NextResponse(out as any, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${safeTitle}.zip"`,
      "cache-control": "private, no-store",
    },
  });
}


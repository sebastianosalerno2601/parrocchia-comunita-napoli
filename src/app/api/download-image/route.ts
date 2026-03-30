import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");
  const fallbackName = searchParams.get("name") || "immagine";

  if (!imageUrl) {
    return NextResponse.json({ error: "URL immagine mancante." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return NextResponse.json({ error: "URL immagine non valido." }, { status: 400 });
  }

  // Evita uso arbitrario della route come proxy generico.
  if (parsed.hostname !== "res.cloudinary.com") {
    return NextResponse.json({ error: "Host immagine non consentito." }, { status: 400 });
  }

  const upstream = await fetch(parsed.toString(), { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Immagine non disponibile." }, { status: 404 });
  }

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : contentType.includes("jpeg") || contentType.includes("jpg")
        ? "jpg"
        : "bin";
  const fileName = `${safeFileName(fallbackName)}.${ext}`;

  return new NextResponse(upstream.body, {
    headers: {
      "content-type": contentType,
      "content-disposition": `attachment; filename="${fileName}"`,
      "cache-control": "private, no-store",
    },
  });
}


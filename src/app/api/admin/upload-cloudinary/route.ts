import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-token";

export const dynamic = "force-dynamic";

function trimEnv(s: string | undefined) {
  return s?.trim() ?? "";
}

/**
 * Carica un'immagine su Cloudinary dal server con Basic Auth (senza firma lato client).
 * Evita errori "Invalid Signature" dovuti a discrepanze nel calcolo della SHA1.
 */
export async function POST(req: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = trimEnv(process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey = trimEnv(process.env.CLOUDINARY_API_KEY);
  const apiSecret = trimEnv(process.env.CLOUDINARY_API_SECRET);
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "Cloudinary non configurato. Imposta CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
      },
      { status: 500 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Body non valido." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "File mancante." }, { status: 400 });
  }

  const out = new FormData();
  out.append(
    "file",
    file,
    file instanceof File ? file.name : "upload.jpg",
  );
  out.append("folder", "eventi");

  const basic = Buffer.from(`${apiKey}:${apiSecret}`, "utf8").toString("base64");
  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`;

  const cRes = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}` },
    body: out,
  });

  const data: { secure_url?: string; public_id?: string; error?: { message?: string } } =
    await cRes.json();

  if (!cRes.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? "Upload Cloudinary fallito." },
      { status: cRes.status >= 400 && cRes.status < 600 ? cRes.status : 502 },
    );
  }

  if (!data.secure_url || !data.public_id) {
    return NextResponse.json(
      { error: "Risposta Cloudinary inattesa." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    secure_url: data.secure_url,
    public_id: data.public_id,
  });
}

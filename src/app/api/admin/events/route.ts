import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-token";
import { deleteEvento, saveEvento } from "@/lib/eventi-store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      id?: string;
      titolo?: string;
      descrizione?: string;
      dataIso?: string;
      luogo?: string;
      isUpcoming?: boolean;
      isPast?: boolean;
      imageUrl?: string;
      imagePublicId?: string;
      imageUrls?: string[];
      imagePublicIds?: string[];
      videoUrls?: string[];
      videoPublicIds?: string[];
    };

    if (!body.titolo || !body.descrizione || !body.dataIso || !body.imageUrl) {
      return NextResponse.json(
        { error: "Campi obbligatori mancanti." },
        { status: 400 },
      );
    }
    if (!body.isUpcoming && !body.isPast) {
      return NextResponse.json(
        { error: "Seleziona almeno una categoria: prossimi o passati." },
        { status: 400 },
      );
    }
    if (body.isUpcoming && body.isPast) {
      return NextResponse.json(
        { error: "Seleziona una sola categoria evento." },
        { status: 400 },
      );
    }

    const saved = await saveEvento({
      id: body.id,
      titolo: body.titolo.trim(),
      descrizione: body.descrizione.trim(),
      dataIso: body.dataIso,
      luogo: body.luogo?.trim() || undefined,
      isUpcoming: !!body.isUpcoming,
      isPast: !!body.isPast,
      imageUrl: body.imageUrl,
      imagePublicId: body.imagePublicId,
      imageUrls: body.imageUrls?.filter(Boolean),
      imagePublicIds: body.imagePublicIds?.filter(Boolean),
      videoUrls: body.videoUrls?.filter(Boolean),
      videoPublicIds: body.videoPublicIds?.filter(Boolean),
    });

    return NextResponse.json({ ok: true, evento: saved });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Errore salvataggio evento.",
        detail: err instanceof Error ? err.message : "unknown_error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID mancante." }, { status: 400 });
  }

  try {
    await deleteEvento(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Errore eliminazione evento.",
        detail: err instanceof Error ? err.message : "unknown_error",
      },
      { status: 500 },
    );
  }
}


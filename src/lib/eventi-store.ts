import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type EventoItem = {
  id: string;
  titolo: string;
  descrizione: string;
  dataIso: string;
  luogo?: string;
  isUpcoming: boolean;
  isPast: boolean;
  imageUrl: string;
  imagePublicId?: string;
  imageUrls?: string[];
  imagePublicIds?: string[];
  createdAt: string;
};

export async function listEventi(): Promise<EventoItem[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("eventi")
    .select("*")
    .order("data_iso", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const imageUrls = Array.isArray(row.image_urls)
      ? (row.image_urls as string[]).filter(Boolean)
      : [];
    const imagePublicIds = Array.isArray(row.image_public_ids)
      ? (row.image_public_ids as string[]).filter(Boolean)
      : [];

    const imageUrlFallback = (row.image_url as string | null) ?? "";
    const cover = imageUrls[0] ?? imageUrlFallback;
    const dataTime = new Date(row.data_iso as string).getTime();
    const now = Date.now();
    const hasValidTime = Number.isFinite(dataTime);
    /** Data/ora già trascorsa → sempre "passato" in UI (senza attendere aggiornamenti in DB). */
    const autoPast = hasValidTime && dataTime < now;
    /** Data/ora ancora da venire → mai tra i passati solo per un flag salvato male. */
    const autoFuture = hasValidTime && dataTime >= now;

    const storedUpcoming =
      (row.is_upcoming as boolean | null) ??
      (hasValidTime ? dataTime >= now : true);
    const storedPast =
      (row.is_past as boolean | null) ?? (hasValidTime ? dataTime < now : false);

    let finalPast: boolean;
    let finalUpcoming: boolean;
    if (autoPast) {
      finalPast = true;
      finalUpcoming = false;
    } else if (autoFuture) {
      finalPast = false;
      finalUpcoming = storedUpcoming;
    } else {
      // data_iso non interpretabile come data: fallback sui flag in DB
      finalPast = storedPast;
      finalUpcoming = !finalPast && storedUpcoming;
    }

    return {
    id: row.id as string,
    titolo: row.titolo as string,
    descrizione: row.descrizione as string,
    dataIso: row.data_iso as string,
    luogo: (row.luogo as string | null) ?? undefined,
    isUpcoming: finalUpcoming,
    isPast: finalPast,
    imageUrl: cover,
    imagePublicId: (row.image_public_id as string | null) ?? undefined,
    imageUrls: imageUrls.length ? imageUrls : cover ? [cover] : [],
    imagePublicIds:
      imagePublicIds.length
        ? imagePublicIds
        : row.image_public_id
          ? [row.image_public_id as string]
          : [],
    createdAt: row.created_at as string,
    };
  });
}

export async function saveEvento(
  item: Omit<EventoItem, "id" | "createdAt"> & { id?: string },
): Promise<EventoItem> {
  if (!item.isUpcoming && !item.isPast) {
    throw new Error("Seleziona almeno una categoria: prossimi o passati.");
  }
  if (item.isUpcoming && item.isPast) {
    throw new Error("Seleziona una sola categoria evento.");
  }

  const id = item.id ?? crypto.randomUUID();
  const payload: EventoItem = {
    ...item,
    id,
    createdAt: new Date().toISOString(),
    imageUrls: item.imageUrls?.filter(Boolean) ?? [item.imageUrl],
    imagePublicIds: item.imagePublicIds?.filter(Boolean) ?? [],
  };

  const supabase = getSupabaseAdmin();
  const baseRow = {
    id: payload.id,
    titolo: payload.titolo,
    descrizione: payload.descrizione,
    data_iso: payload.dataIso,
    luogo: payload.luogo ?? null,
    image_url: payload.imageUrl,
    image_public_id: payload.imagePublicId ?? null,
    created_at: payload.createdAt,
  };

  const withFlagsRow = {
    ...baseRow,
    is_upcoming: payload.isUpcoming,
    is_past: payload.isPast,
  };

  const withGalleryRow = {
    ...withFlagsRow,
    image_urls: payload.imageUrls ?? [payload.imageUrl],
    image_public_ids: payload.imagePublicIds ?? [],
  };

  const firstTry = await supabase
    .from("eventi")
    .upsert(withGalleryRow, { onConflict: "id" });

  if (firstTry.error) {
    // Compatibilità con schema intermedio: ha is_upcoming/is_past ma non gallery json.
    const fallbackFlags = await supabase
      .from("eventi")
      .upsert(withFlagsRow, { onConflict: "id" });
    if (!fallbackFlags.error) return payload;

    // Compatibilità schema vecchio: solo campi base.
    const fallbackBase = await supabase
      .from("eventi")
      .upsert(baseRow, { onConflict: "id" });
    if (fallbackBase.error) throw new Error(fallbackBase.error.message);
  }

  return payload;
}

export async function getEventoById(id: string): Promise<EventoItem | null> {
  const eventi = await listEventi();
  return eventi.find((e) => e.id === id) ?? null;
}

export async function deleteEvento(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("eventi").delete().eq("id", id);
  if (error) throw new Error(error.message);
}


import { NextResponse } from "next/server";
import { listEventi } from "@/lib/eventi-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const eventi = await listEventi();
    return NextResponse.json({ eventi });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Impossibile caricare gli eventi.",
        detail: err instanceof Error ? err.message : "unknown_error",
      },
      { status: 500 },
    );
  }
}


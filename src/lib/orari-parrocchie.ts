import type { ParrocchiaSlug } from "@/lib/parrocchie";

export type OrariBlock = {
  titolo: string;
  items: string[];
};

export type OrariParrocchia = {
  apertura?: OrariBlock;
  messe: OrariBlock[];
  eventi?: OrariBlock[];
};

export const ORARI_PARROCCHIE: Partial<Record<ParrocchiaSlug, OrariParrocchia>> =
  {
    "sant-eligio-maggiore": {
      apertura: {
        titolo: "Apertura e visite guidate",
        items: [
          "Martedì–Sabato: 8:30–13:30 (visite guidate e non guidate)",
          "Domenica: 8:30–11:30",
        ],
      },
      messe: [
        {
          titolo: "Domenica",
          items: ["10:00 (Messa)"],
        },
      ],
      eventi: [
        {
          titolo: "Giorno eucaristico (Giovedì)",
          items: [
            "17:30–18:30 Adorazione eucaristica (personale)",
            "18:30–19:30 Adorazione eucaristica (comunitaria)",
            "19:30–20:30 Adorazione eucaristica (personale)",
            "20:30–21:30 Adorazione eucaristica (comunitaria)",
          ],
        },
      ],
    },
    "san-giovanni-a-mare": {
      messe: [
        {
          titolo: "Domenica",
          items: ["10:45 (Messa)"],
        },
      ],
      eventi: [
        {
          titolo: "Catechesi e catechismo (Martedì)",
          items: [
            "17:00–18:15 Catechismo bambini",
            "18:30–20:00 Catechismo adulti",
          ],
        },
      ],
    },
    "sant-arcangelo-armieri": {
      messe: [
        {
          titolo: "Sabato",
          items: ["18:30 (Messa)"],
        },
        {
          titolo: "Domenica",
          items: ["12:00 (Messa, sospesa nel mese di agosto)"],
        },
      ],
    },
  };


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
        titolo: "Apertura e visite",
        items: ["Martedì–Sabato: 8:30–13:00 (visite turistiche)"],
      },
      messe: [
        {
          titolo: "Domenica",
          items: ["9:00 (Santa Messa)"],
        },
      ],
    },
    "san-giovanni-a-mare": {
      apertura: {
        titolo: "Apertura e visite",
        items: ["Martedì–Sabato: 8:30–13:00 (visite turistiche)"],
      },
      messe: [
        {
          titolo: "Domenica",
          items: [
            "10:15 (Santa Messa per bambini e genitori, dal 18 ottobre 2026)",
          ],
        },
      ],
      eventi: [
        {
          titolo: "Catechismo bambini (Martedì e Giovedì)",
          items: ["16:45–18:15 (dal 13 ottobre 2026)"],
        },
      ],
    },
    "sant-arcangelo-armieri": {
      apertura: {
        titolo: "Ufficio e confessioni",
        items: [
          "Lunedì–Venerdì: 9:00–12:00",
          "Martedì e Giovedì: confessioni/ufficio su appuntamento (18:30–19:00 solo per trigesimi e anniversari)",
          "Sabato: 17:30–20:00",
        ],
      },
      messe: [
        {
          titolo: "Feriale",
          items: ["Lunedì–Venerdì: 9:30 (Santa Messa)"],
        },
        {
          titolo: "Sabato",
          items: ["18:30 (Santa Messa)"],
        },
        {
          titolo: "Domenica",
          items: ["12:00 (Santa Messa)"],
        },
      ],
      eventi: [
        {
          titolo: "Catechesi adulti (Martedì)",
          items: ["20:00 (dal 13 ottobre 2026)"],
        },
        {
          titolo: "Adorazione eucaristica (Giovedì)",
          items: ["20:00 (dal 15 ottobre 2026)"],
        },
        {
          titolo: "Visite alle famiglie",
          items: ["Lunedì, Mercoledì e Venerdì: 17:00–21:00"],
        },
      ],
    },
  };

export type ParrocchiaSlug =
  | "sant-arcangelo-armieri"
  | "sant-eligio-maggiore"
  | "san-giovanni-a-mare";

export type ParrocchiaTheme = "barocco" | "gotico" | "normanno";

/** Una cella del banner a 4 immagini affiancate */
export type BannerImmagine = {
  src: string;
  alt: string;
};

/** Elenco foto per il banner scorrevole */
export type BannerLista = readonly BannerImmagine[];

export type Parrocchia = {
  slug: ParrocchiaSlug;
  nomeBreve: string;
  nomeCompleto: string;
  indirizzo: string;
  tema: ParrocchiaTheme;
  stile: string;
  colori: string;
  descrizione: string;
  bannerRow: BannerLista;
  /** URL `src` dell’iframe Google Maps (incorpora mappa) */
  mappaEmbedSrc?: string;
  /** Pagina Facebook ufficiale per feed timeline */
  facebookPageUrl?: string;
  /** URL specifico per plugin Facebook (se diverso dalla pagina pubblica) */
  facebookPageEmbedHref?: string;
  /** Titolo scheda senza template layout (evita suffissi ridondanti) */
  metaTitleAbsolute?: string;
  /** Meta description dedicata (oltre al testo “La chiesa” in pagina) */
  metaDescription?: string;
  /** Per schema.org Church — varianti del nome */
  schemaAlternateNames?: string[];
  /** Parole chiave opzionali per la pagina chiesa */
  metaKeywords?: string[];
};

const arcangeloInterno = "/arcangelo-agli-armieri/Sant-Arcangelo-Armieri.jpg";
const arcangeloStoria = "/arcangelo-agli-armieri/Storia-Arcangelo-Armieri.jpg";
const arcangeloMaria = "/arcangelo-agli-armieri/Maria-arcangelo-agli-armieri.jpg";
const arcangeloStatua =
  "/arcangelo-agli-armieri/Arcangelo-agli-armieri-statua.jpg";
const arcangeloAltare =
  "/arcangelo-agli-armieri/altare-arcangelo-agli-armieri.jpg";
const arcangeloAltareMuro =
  "/arcangelo-agli-armieri/Altare-muro-arcangelo-agli-armieri.jpg";
const arcangeloGesu =
  "/arcangelo-agli-armieri/Gesù-Arcangelo-agli-armieri.jpg";
const arcangeloMariaGesu =
  "/arcangelo-agli-armieri/maria-gesù-arcangelo.jpg";
const eligioAltare = "/sant-eligio/Altare-Sant-eligio.jpg";
const eligioAltareVicino = "/sant-eligio/altare-sant-eligio-vicino.jpg";
const eligioArchi = "/sant-eligio/Archi-sant-eligio.jpg";
const eligioStatua = "/sant-eligio/statua-sant-eligio.jpg";
const eligioStatue = "/sant-eligio/statue-sant-eligio.jpg";
const eligioOrologio = "/sant-eligio/Orologio-sant-eligio.jpg";
const eligioAffresco = "/sant-eligio/affresco-sant-eligio.jpg";
const eligioCappellina = "/sant-eligio/cappellina-sant-eligio.jpg";
const eligioFinestra = "/sant-eligio/finestra-sant-eligio.jpg";
const eligioMarmoMuro = "/sant-eligio/Marmo-a-muro-sant-eligio.jpg";
const eligioTabernacolo = "/sant-eligio/tabernacolo-sant-eligio.jpg";
const eligioGesuCroce = "/sant-eligio/Gesù-in-croce-sant-eligio.jpg";
const gioNavata = "/giovanni-a-mare/San-Giovanni-a-mare.jpg";
const gioStatue = "/giovanni-a-mare/Statue-san-giovanni-a-mare.jpg";
const gioTabella = "/giovanni-a-mare/tabella-san-giovanni.jpg";
const gioDonnaMarianna = "/giovanni-a-mare/Donna-Marianna-san-giovanni.jpg";

export const parrocchie: Parrocchia[] = [
  {
    slug: "sant-arcangelo-armieri",
    nomeBreve: "Sant’Arcangelo",
    nomeCompleto: "Sant’Arcangelo agli Armieri",
    indirizzo: "Via S. Giovanni in Corte, 4 — 80133 Napoli NA",
    tema: "barocco",
    stile: "Barocco napoletano",
    colori: "Oro, marmi policromi, contrasti profondi",
    descrizione:
      "Una facciata e un interno che parlano il linguaggio del barocco: luce dorata, marmi colorati e un senso di solennità festosa tipico delle chiese del centro storico.",
    bannerRow: [
      {
        src: arcangeloInterno,
        alt: "Sant’Arcangelo agli Armieri — interno e altare",
      },
      {
        src: arcangeloMaria,
        alt: "Sant’Arcangelo agli Armieri — immagine mariana",
      },
      {
        src: arcangeloStatua,
        alt: "Sant’Arcangelo agli Armieri — statua di San Michele Arcangelo",
      },
      {
        src: arcangeloStoria,
        alt: "Sant’Arcangelo agli Armieri — scorcio storico della chiesa",
      },
      {
        src: arcangeloAltare,
        alt: "Sant’Arcangelo agli Armieri — altare laterale",
      },
      {
        src: arcangeloAltareMuro,
        alt: "Sant’Arcangelo agli Armieri — altare su parete storica",
      },
      {
        src: arcangeloGesu,
        alt: "Sant’Arcangelo agli Armieri — immagine del Cristo",
      },
      {
        src: arcangeloMariaGesu,
        alt: "Sant’Arcangelo agli Armieri — Maria e Gesù",
      },
    ],
    mappaEmbedSrc:
      "https://www.google.com/maps/embed?pb=!4v1774107019235!6m8!1m7!1s7V8At2svv2GSlK6M5FdXCw!2m2!1d40.84672403810365!2d14.2611231306793!3f239.67710799234487!4f19.808112643214855!5f0.4000000000000002",
    facebookPageUrl:
      "https://www.facebook.com/people/Chiesa-di-SantEligio/61587835687714/",
    facebookPageEmbedHref: "https://www.facebook.com/61587835687714",
  },
  {
    slug: "sant-eligio-maggiore",
    nomeBreve: "Sant’Eligio",
    nomeCompleto: "Sant’Eligio Maggiore",
    indirizzo: "Via S. Eligio, 1 — 80133 Napoli NA",
    tema: "gotico",
    stile: "Gotico",
    colori: "Tufo giallo, piperno grigio",
    descrizione:
      "Pietra gialla e piperno scuro disegnano archi e pareti in uno stile gotico che ricorda le origini medievali della città: verticalità, ombre nette, materia viva.",
    bannerRow: [
      {
        src: eligioAltare,
        alt: "Sant’Eligio Maggiore — altare e presbiterio",
      },
      {
        src: eligioAltareVicino,
        alt: "Sant’Eligio Maggiore — altare (dettaglio ravvicinato)",
      },
      {
        src: eligioArchi,
        alt: "Sant’Eligio Maggiore — archi e navata",
      },
      {
        src: eligioStatua,
        alt: "Sant’Eligio Maggiore — statua",
      },
      {
        src: eligioStatue,
        alt: "Sant’Eligio Maggiore — statue e arredo sacro",
      },
      {
        src: eligioOrologio,
        alt: "Sant’Eligio Maggiore — orologio in facciata",
      },
      {
        src: eligioAffresco,
        alt: "Sant’Eligio Maggiore — affresco",
      },
      {
        src: eligioCappellina,
        alt: "Sant’Eligio Maggiore — cappellina",
      },
      {
        src: eligioFinestra,
        alt: "Sant’Eligio Maggiore — finestra",
      },
      {
        src: eligioMarmoMuro,
        alt: "Sant’Eligio Maggiore — marmo a muro",
      },
      {
        src: eligioTabernacolo,
        alt: "Sant’Eligio Maggiore — tabernacolo",
      },
      {
        src: eligioGesuCroce,
        alt: "Sant’Eligio Maggiore — Gesù in croce",
      },
    ],
    mappaEmbedSrc:
      "https://www.google.com/maps/embed?pb=!4v1774106953898!6m8!1m7!1sKnYvsVxhvGLHEdHxkxWNwQ!2m2!1d40.84672974833791!2d14.26482651328897!3f286.64822186674365!4f13.84609289652174!5f0.7820865974627469",
    facebookPageUrl:
      "https://www.facebook.com/people/Chiesa-di-SantEligio/61587835687714/",
    facebookPageEmbedHref: "https://www.facebook.com/61587835687714",
    metaTitleAbsolute:
      "Sant'Eligio Maggiore — Chiesa e parrocchia Napoli centro storico",
    metaDescription:
      "Chiesa di Sant'Eligio Maggiore in Via S. Eligio, Napoli: architettura gotica medievale, comunità parrocchiale nel centro storico. Orari delle messe, storia e come arrivare.",
    schemaAlternateNames: [
      "Chiesa di Sant'Eligio Maggiore",
      "Parrocchia Sant'Eligio Maggiore Napoli",
      "Sant'Eligio Maggiore Napoli",
    ],
    metaKeywords: [
      "Sant'Eligio Maggiore",
      "Sant'Eligio Maggiore Napoli",
      "chiesa Sant'Eligio",
      "parrocchia Sant'Eligio Napoli",
      "chiesa gotica Napoli",
      "centro storico Napoli",
    ],
  },
  {
    slug: "san-giovanni-a-mare",
    nomeBreve: "San Giovanni",
    nomeCompleto: "San Giovanni a mare",
    indirizzo: "Via S. Giovanni a Mare, 9 — 80133 Napoli NA",
    tema: "normanno",
    stile: "Normanno",
    colori: "Tufo giallo, marmo bianco, piperno grigio",
    descrizione:
      "Il vocabolario normanno: massi di tufo, colonne e capitelli in marmo bianco, fasce di piperno — un equilibrio tra forza e luminosità.",
    bannerRow: [
      {
        src: gioNavata,
        alt: "San Giovanni a mare — interno della chiesa",
      },
      {
        src: gioStatue,
        alt: "San Giovanni a mare — statue e arredo sacro",
      },
      {
        src: gioTabella,
        alt: "San Giovanni a mare — tabella e iscrizione",
      },
      {
        src: gioDonnaMarianna,
        alt: "San Giovanni a mare — Donna Marianna",
      },
    ],
    mappaEmbedSrc:
      "https://www.google.com/maps/embed?pb=!4v1774107100714!6m8!1m7!1s60c5cJiHTKY1pmJfBG14cQ!2m2!1d40.84637499467355!2d14.26325243096368!3f347.8206780694114!4f-4.247552094771649!5f1.9310469813652729",
    facebookPageUrl:
      "https://www.facebook.com/people/Chiesa-di-SantEligio/61587835687714/",
    facebookPageEmbedHref: "https://www.facebook.com/61587835687714",
  },
];

export function getParrocchiaBySlug(slug: string): Parrocchia | undefined {
  return parrocchie.find((p) => p.slug === slug);
}

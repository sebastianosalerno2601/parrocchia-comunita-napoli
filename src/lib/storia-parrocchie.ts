import type { ParrocchiaSlug } from "@/lib/parrocchie";

export type StoriaBlocco =
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

export type StoriaImmagine = {
  src: string;
  alt: string;
};

export type ParrocchiaStoriaData = {
  didascalia?: string;
  titolo: string;
  sottotitolo?: string;
  blocchi: StoriaBlocco[];
  immagini: StoriaImmagine[];
  /** Su schermi larghi: colonna immagini a sinistra (default: a destra) */
  immaginiASinistra?: boolean;
};

const storie: Partial<Record<ParrocchiaSlug, ParrocchiaStoriaData>> = {
  "sant-arcangelo-armieri": {
    didascalia:
      "Parrocchia di Sant’Arcangelo agli Armieri in San Giovanni in Corte",
    titolo: "Cenni storici e artistici",
    immagini: [
      {
        src: "/arcangelo-agli-armieri/Storia-Arcangelo-Armieri.jpg",
        alt: "Sant’Arcangelo agli Armieri — scorcio storico della chiesa e del contesto urbano",
      },
      {
        src: "/arcangelo-agli-armieri/Arcangelo-agli-armieri-statua.jpg",
        alt: "Sant’Arcangelo agli Armieri — statua di San Michele Arcangelo",
      },
    ],
    blocchi: [
      { kind: "h3", text: "Le origini e il nome" },
      {
        kind: "p",
        text: "Sorge nel cuore dell’antica Curtis longobarda (VIII–IX sec.), centro amministrativo della Napoli altomedievale. Il titolo «agli Armieri» testimonia il legame indissolubile con la potente corporazione dei fabbricanti di armi, che scelse San Michele Arcangelo, il guerriero di Dio, come proprio protettore.",
      },
      { kind: "h3", text: "L’assetto barocco" },
      {
        kind: "p",
        text: "L’edificio attuale è il frutto di un radicale rifacimento del 1638. Nonostante i profondi mutamenti urbanistici del «Risanamento» ottocentesco, la chiesa resta una preziosa testimonianza della stratificazione storica del quartiere, incastonata tra le architetture moderne nei pressi del Rettifilo.",
      },
      { kind: "h3", text: "Il cuore della chiesa: la pala d’altare" },
      {
        kind: "p",
        text: "L’opera di maggiore rilievo è la tela seicentesca posta sull’altare maggiore, espressione della scuola napoletana (cerchia di Massimo Stanzione). Il dipinto raffigura:",
      },
      {
        kind: "ul",
        items: [
          "Al centro: la Madonna Assunta in cielo, colta nel mistero dell’ascesa alla gloria divina.",
          "Ai lati: le figure dei due San Giovanni, il Battista (il Precursore) e l’Evangelista (il Discepolo prediletto).",
        ],
      },
      {
        kind: "p",
        text: "L’accostamento dei due santi simboleggia l’unione tra l’Antica e la Nuova Alleanza, che trovano il loro punto di incontro e compimento nella figura della Vergine Maria.",
      },
    ],
  },
  "san-giovanni-a-mare": {
    titolo: "Chiesa di San Giovanni a mare",
    sottotitolo: "Un’oasi di romanico nel cuore di Napoli",
    immagini: [
      {
        src: "/giovanni-a-mare/San-Giovanni-a-mare.jpg",
        alt: "Interno di San Giovanni a mare: navate, colonne di spoglio e altare maggiore",
      },
      {
        src: "/giovanni-a-mare/Donna-Marianna-san-giovanni.jpg",
        alt: "La testa marmorea «Marianna ’a capa ’e Napule», all’ingresso della chiesa",
      },
    ],
    blocchi: [
      { kind: "h3", text: "Cenni storici e identità" },
      {
        kind: "p",
        text: "Fondata intorno alla metà del XII secolo dai Cavalieri Ospitalieri di San Giovanni di Gerusalemme (oggi Cavalieri di Malta), la chiesa nacque come luogo di culto e assistenza per i pellegrini diretti in Terrasanta. Il nome «a mare» ricorda l’antico profilo costiero della città, quando le onde del golfo lambivano quasi le soglie dell’edificio, prima delle trasformazioni urbanistiche moderne.",
      },
      { kind: "h3", text: "L’architettura: un viaggio nel tempo" },
      {
        kind: "p",
        text: "San Giovanni a mare rappresenta una rara e preziosa eccezione nel panorama barocco napoletano, conservando intatta la sua austera struttura romanica:",
      },
      {
        kind: "ul",
        items: [
          "L’interno: diviso in tre navate da colonne di spoglio (di epoca romana e paleocristiana) sormontate da capitelli tutti diversi tra loro, a testimonianza del riutilizzo di materiali antichi.",
          "Le cupole: il transetto è caratterizzato da piccole cupole e volte che rivelano influenze bizantine e arabo-normanne, creando un’atmosfera di raccoglimento e misticismo tipica del Medioevo mediterraneo.",
        ],
      },
      { kind: "h3", text: "Simboli e tradizioni popolari" },
      {
        kind: "p",
        text: "All’ingresso si trova la celebre testa marmorea nota come «Marianna ’a capa ’e Napule», antico frammento di statua greca o romana divenuto simbolo dell’identità e della libertà del popolo napoletano. La chiesa è inoltre custode della memoria dei riti legati alla notte di San Giovanni, un tempo cuore della vita devozionale della zona.",
      },
    ],
  },
  "sant-eligio-maggiore": {
    titolo: "Chiesa di Sant’Eligio Maggiore",
    sottotitolo: "Cenni storici e artistici",
    immagini: [
      {
        src: "/sant-eligio/Archi-sant-eligio.jpg",
        alt: "Sant’Eligio Maggiore — archi e navata in stile gotico",
      },
      {
        src: "/sant-eligio/Orologio-sant-eligio.jpg",
        alt: "Sant’Eligio Maggiore — arco con orologio quattrocentesco",
      },
    ],
    blocchi: [
      { kind: "h3", text: "Origini angioine" },
      {
        kind: "p",
        text: "La chiesa di Sant’Eligio Maggiore nasce nel 1270, per volontà di tre mercanti francesi e con concessione di Carlo I d’Angiò, nell’area del Campo Moricino (oggi zona Mercato). In origine fu dedicata ai santi Eligio, Dionigi e Martino; dal 1279 rimase il solo titolo di Sant’Eligio.",
      },
      {
        kind: "p",
        text: "Il complesso ebbe fin da subito una forte funzione sociale: accoglienza ospedaliera, assistenza e sepoltura dei forestieri (soprattutto francesi e provenzali) privi di legami familiari in città. L’impianto sorse appena fuori dalle mura medievali e fu protetto da privilegi reali sotto Angioini e Aragonesi.",
      },
      { kind: "h3", text: "Trasformazioni nei secoli" },
      {
        kind: "p",
        text: "Tra XVI e XVIII secolo l’area si arricchì dell’educandato femminile e di nuove attività benefiche. Nella chiesa si susseguirono interventi sul soffitto, sull’organo e sulle cappelle; nell’Ottocento Orazio Angelini modificò il soffitto quattrocentesco. Dopo i danni del bombardamento del 1943, un restauro novecentesco restituì al tempio la sua linea gotica essenziale.",
      },
      { kind: "h3", text: "Struttura, opere e memoria popolare" },
      {
        kind: "p",
        text: "L’ingresso attuale è laterale, attraverso un portale strombato di impronta gotico-francese. L’interno, in tufo giallo e piperno grigio, conserva un equilibrio austero e luminoso. Tra le opere storicamente documentate figurano dipinti legati alla scuola napoletana (tra cui Solimena e Stanzione), oggi in parte trasferiti.",
      },
      {
        kind: "p",
        text: "All’esterno spicca il celebre Arco di Sant’Eligio con l’orologio quattrocentesco, simbolo del complesso e custode di una nota leggenda cittadina, quella di Irene Malarbi e Antonello Caracciolo, entrata nella memoria storica e letteraria napoletana.",
      },
    ],
  },
};

export function getStoriaParrocchia(
  slug: ParrocchiaSlug,
): ParrocchiaStoriaData | undefined {
  return storie[slug];
}

"use server";

import nodemailer from "nodemailer";
import { tipiCertificato } from "@/lib/certificati-tipi";
import { parrocchie, type ParrocchiaSlug } from "@/lib/parrocchie";

const SLUGS = new Set<string>(parrocchie.map((p) => p.slug));

const TIPI_CERTIFICATO = new Set<string>(
  tipiCertificato.map((t) => t.value),
);

export type CertificatiFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
};

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** Solo cifre, lunghezza ragionevole (Italia + prefisso) */
function isValidPhone(s: string): boolean {
  const digits = s.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function getTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const secure =
    process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465;
  const allowSelfSigned = process.env.SMTP_ALLOW_SELF_SIGNED === "true";

  if (!host || !user || !pass || Number.isNaN(port)) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: !allowSelfSigned,
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function inviaRichiestaCertificato(
  _prev: CertificatiFormState,
  formData: FormData,
): Promise<CertificatiFormState> {
  const nomeCognome = String(formData.get("nomeCognome") ?? "").trim();
  const luogoNascita = String(formData.get("luogoNascita") ?? "").trim();
  const dataNascita = String(formData.get("dataNascita") ?? "").trim();
  const certificatoRichiesto = String(
    formData.get("certificatoRichiesto") ?? "",
  ).trim();
  const parrocchia = String(formData.get("parrocchia") ?? "").trim();
  const cellulare = String(formData.get("cellulare") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  const errors: Partial<Record<string, string>> = {};

  if (nomeCognome.length < 3) {
    errors.nomeCognome = "Inserisci nome e cognome.";
  }
  if (luogoNascita.length < 2) {
    errors.luogoNascita = "Inserisci il luogo di nascita.";
  }
  if (!dataNascita) {
    errors.dataNascita = "Seleziona la data di nascita.";
  } else {
    const d = new Date(dataNascita);
    if (Number.isNaN(d.getTime())) {
      errors.dataNascita = "Data non valida.";
    } else {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (d > today) {
        errors.dataNascita = "La data non può essere nel futuro.";
      }
    }
  }
  if (!TIPI_CERTIFICATO.has(certificatoRichiesto)) {
    errors.certificatoRichiesto = "Seleziona il certificato richiesto.";
  }
  if (!SLUGS.has(parrocchia)) {
    errors.parrocchia = "Seleziona la parrocchia.";
  }
  if (!isValidPhone(cellulare)) {
    errors.cellulare = "Inserisci un numero di cellulare valido.";
  }
  if (!email) {
    errors.email = "Inserisci l’email.";
  } else if (!isValidEmail(email)) {
    errors.email = "Inserisci un indirizzo email valido.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const parrocchiaNome =
    parrocchie.find((p) => p.slug === parrocchia)?.nomeCompleto ?? parrocchia;

  const certificatoLabel =
    tipiCertificato.find((t) => t.value === certificatoRichiesto)?.label ??
    certificatoRichiesto;

  const payload = {
    nomeCognome,
    luogoNascita,
    dataNascita,
    certificatoRichiesto,
    certificatoLabel,
    parrocchia: parrocchia as ParrocchiaSlug,
    parrocchiaNome,
    cellulare,
    email,
    ricevutoIl: new Date().toISOString(),
  };

  const dest = process.env.CERTIFICATI_EMAIL_TO?.trim();
  if (!dest) {
    return {
      ok: false,
      message:
        "Invio email non configurato: imposta CERTIFICATI_EMAIL_TO in .env.local.",
    };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return {
      ok: false,
      message:
        "Invio email non configurato: imposta SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS e SMTP_FROM in .env.local.",
    };
  }

  const from = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim();
  if (!from) {
    return {
      ok: false,
      message: "Invio email non configurato: manca SMTP_FROM.",
    };
  }

  const mailSubject = `Nuova richiesta certificato — ${certificatoLabel} (${parrocchiaNome})`;
  const formattedDate = new Date(payload.ricevutoIl).toLocaleString("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const fieldRows = [
    ["Nome e cognome", payload.nomeCognome],
    ["Luogo di nascita", payload.luogoNascita],
    ["Data di nascita", payload.dataNascita],
    ["Certificato richiesto", payload.certificatoLabel],
    ["Parrocchia sacramento", payload.parrocchiaNome],
    ["Cellulare", payload.cellulare],
    ["Email", payload.email],
  ] as const;

  const mailText = [
    "Nuova richiesta certificato",
    "",
    `Nome e cognome: ${payload.nomeCognome}`,
    `Luogo di nascita: ${payload.luogoNascita}`,
    `Data di nascita: ${payload.dataNascita}`,
    `Certificato richiesto: ${payload.certificatoLabel}`,
    `Parrocchia sacramento: ${payload.parrocchiaNome}`,
    `Cellulare: ${payload.cellulare}`,
    `Email: ${payload.email}`,
    "",
    `Ricevuto il: ${payload.ricevutoIl}`,
  ].join("\n");

  const mailHtml = `
  <div style="margin:0;padding:0;background:#f3eee4;font-family:Georgia,'Times New Roman',serif;color:#2f2a24;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#fffdf8;border:1px solid #d8ccb6;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#b8860b,#7b4f00);padding:22px 24px;">
                <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#f7ecd1;opacity:.95;">Comunità Parrocchiale Napoli</div>
                <div style="margin-top:8px;font-size:26px;line-height:1.2;color:#ffffff;font-weight:700;">Richiesta certificato</div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 24px 8px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#3a342d;">
                  È stata inviata una nuova richiesta dal modulo online.
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#fffcf5;border:1px solid #eadfcd;border-radius:10px;overflow:hidden;">
                  ${fieldRows
                    .map(
                      ([label, value]) => `
                    <tr>
                      <td style="padding:11px 12px;border-bottom:1px solid #efe4d3;width:42%;font-size:13px;color:#7a6245;font-weight:700;">${escapeHtml(label)}</td>
                      <td style="padding:11px 12px;border-bottom:1px solid #efe4d3;font-size:14px;color:#2f2a24;">${escapeHtml(value)}</td>
                    </tr>`,
                    )
                    .join("")}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 24px 22px;">
                <div style="padding:10px 12px;border-left:3px solid #b8860b;background:#f9f2e5;font-size:13px;line-height:1.45;color:#5e4f3a;">
                  Ricevuto il <strong>${escapeHtml(formattedDate)}</strong>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px;background:#f6efe4;border-top:1px solid #e7dcc8;font-size:12px;color:#6e5b42;">
                Messaggio automatico dal sito della Comunità Parrocchiale.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;

  try {
    await transporter.sendMail({
      from,
      to: dest,
      replyTo: payload.email,
      subject: mailSubject,
      text: mailText,
      html: mailHtml,
    });
  } catch (error) {
    console.error("[certificati] errore invio email:", error);
    return {
      ok: false,
      message:
        "Richiesta ricevuta ma invio email fallito. Controlla configurazione SMTP.",
    };
  }

  return {
    ok: true,
    message: "Richiesta inviata con successo via email.",
  };
}

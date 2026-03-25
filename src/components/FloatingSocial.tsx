const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_CERTIFICATI?.replace(
  /\D/g,
  "",
);
const PHONE_NUMBER_RAW = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "";
const PHONE_NUMBER = PHONE_NUMBER_RAW.replace(/\D/g, "");

const FACEBOOK_URL =
  process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL ??
  "https://www.facebook.com/people/Chiesa-di-SantEligio/61587835687714/";
const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
  "https://www.instagram.com/chiesasanteligio";

export function FloatingSocial() {
  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Buongiorno, desidero informazioni dalla comunità parrocchiale.",
      )}`
    : null;

  return (
    <aside
      className="fixed right-3 top-1/2 z-[120] -translate-y-1/2"
      aria-label="Contatti rapidi social"
    >
      <div className="flex flex-col items-center gap-3">
        {PHONE_NUMBER ? (
          <a
            href={`tel:+${PHONE_NUMBER}`}
            title={`Chiama ${PHONE_NUMBER_RAW}`}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-[#0ea5e9] text-white shadow-lg transition-transform hover:scale-105"
          >
            <PhoneIcon />
          </a>
        ) : (
          <span
            title="Numero di telefono in configurazione"
            className="flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-full border border-black/10 bg-[#0ea5e9]/70 text-white shadow-lg"
          >
            <PhoneIcon />
          </span>
        )}

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Contattaci su WhatsApp"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
          >
            <WhatsAppIcon />
          </a>
        ) : (
          <span
            title="Numero WhatsApp in configurazione"
            className="flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-full border border-black/10 bg-[#25D366]/70 text-white shadow-lg"
          >
            <WhatsAppIcon />
          </span>
        )}

        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Apri la pagina Facebook"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-[#1877F2] text-white shadow-lg transition-transform hover:scale-105"
        >
          <FacebookIcon />
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Apri la pagina Instagram"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white shadow-lg transition-transform hover:scale-105"
        >
          <InstagramIcon />
        </a>
      </div>
    </aside>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.03 0C5.41 0 .03 5.38.03 12c0 2.11.55 4.18 1.59 6.01L0 24l6.18-1.62a11.95 11.95 0 0 0 5.85 1.49h.01c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.52-8.39Zm-8.49 18.37h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.21-3.67.96.98-3.58-.24-.37a9.9 9.9 0 0 1-1.53-5.26c0-5.49 4.47-9.96 9.96-9.96 2.66 0 5.15 1.03 7.03 2.9a9.86 9.86 0 0 1 2.92 7.03c0 5.49-4.47 9.96-9.96 9.96Zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.46-.15-.66.15-.19.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.41-1.47-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.58-.9-2.17-.24-.57-.49-.49-.66-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.08 3.17 5.03 4.44.7.3 1.24.48 1.66.61.7.22 1.33.19 1.84.11.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.12 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.68 4.54-4.68 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
      <path d="M7.5 2C4.47 2 2 4.47 2 7.5v9C2 19.53 4.47 22 7.5 22h9c3.03 0 5.5-2.47 5.5-5.5v-9C22 4.47 19.53 2 16.5 2h-9Zm0 2h9C18.43 4 20 5.57 20 7.5v9c0 1.93-1.57 3.5-3.5 3.5h-9C5.57 20 4 18.43 4 16.5v-9C4 5.57 5.57 4 7.5 4Zm9.75 1.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}


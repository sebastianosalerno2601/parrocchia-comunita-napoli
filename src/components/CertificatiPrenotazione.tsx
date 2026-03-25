"use client";

import {
  inviaRichiestaCertificato,
  type CertificatiFormState,
} from "@/app/actions/certificati";
import { tipiCertificato } from "@/lib/certificati-tipi";
import { parrocchie } from "@/lib/parrocchie";
import { createPortal, useFormStatus } from "react-dom";
import {
  forwardRef,
  useActionState,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_CERTIFICATI?.replace(
  /\D/g,
  "",
);
const CERTIFICATI_FORM_INITIAL_STATE: CertificatiFormState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-[var(--ink)] px-4 py-3 font-display text-sm font-semibold text-[var(--paper)] transition-opacity disabled:opacity-60 sm:w-auto sm:min-w-[12rem]"
    >
      {pending ? "Invio in corso…" : "Invia richiesta"}
    </button>
  );
}

function WhatsAppLink() {
  const href = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Buongiorno, vorrei informazioni su altri certificati parrocchiali.",
      )}`
    : undefined;

  if (!href) {
    return (
      <span
        className="certificati-whatsapp-btn cursor-not-allowed opacity-60"
        title="Numero WhatsApp in configurazione"
      >
        WhatsApp
        <WhatsAppGlyph />
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="certificati-whatsapp-btn no-underline"
    >
      WhatsApp
      <WhatsAppGlyph />
    </a>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
        fill="#fff"
      />
      <path
        d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
        fill="#40c351"
      />
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
        fill="#fff"
      />
    </svg>
  );
}

function fieldClass(err?: string) {
  return [
    "mt-1 w-full min-w-0 max-w-full rounded-lg border bg-[var(--paper)] px-3 py-2 text-[var(--ink)] shadow-sm outline-none transition-colors",
    err
      ? "border-red-600/70 focus:border-red-600"
      : "border-[var(--nav-border)] focus:border-[var(--accent)]",
  ].join(" ");
}

type FormSelectOption = { value: string; label: string; description?: string };

/** Menu a tendina che rispetta la larghezza del campo (evita bug delle `<select>` native su mobile). */
function FormSelect({
  id,
  name,
  required: isRequired,
  error,
  options,
  placeholder = "Seleziona…",
}: {
  id: string;
  name: string;
  required?: boolean;
  error?: string;
  options: FormSelectOption[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [menuRect, setMenuRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const syncMenuPosition = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 8;
    const w = Math.min(r.width, window.innerWidth - pad * 2);
    const left = Math.min(
      Math.max(r.left, pad),
      window.innerWidth - pad - w,
    );
    setMenuRect({
      top: r.bottom + 4,
      left,
      width: w,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuRect(null);
      return;
    }
    syncMenuPosition();
    const onScrollOrResize = () => syncMenuPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, syncMenuPosition]);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onReset = () => setSelected("");
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open]);

  const selectedLabel =
    options.find((o) => o.value === selected)?.label ?? placeholder;

  const btnClass = [
    "mt-1 flex w-full min-w-0 max-w-full items-center justify-between gap-2 rounded-lg border bg-[var(--paper)] px-3 py-2 text-left text-sm text-[var(--ink)] shadow-sm outline-none transition-colors",
    error
      ? "border-red-600/70 focus-visible:border-red-600"
      : "border-[var(--nav-border)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent-soft)]",
    !selected ? "text-[var(--ink-muted)]" : "",
  ].join(" ");

  const list =
    open && menuRect ? (
      <ul
        ref={listRef}
        role="listbox"
        id={`${id}-listbox`}
        className="fixed z-[260] max-h-[min(14rem,45vh)] overflow-y-auto rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] py-1 shadow-xl"
        style={{
          top: menuRect.top,
          left: menuRect.left,
          width: menuRect.width,
          maxWidth: "calc(100vw - 1rem)",
        }}
      >
        {options.map((o) => (
          <li
            key={o.value}
            role="option"
            aria-selected={selected === o.value}
            title={o.description}
            className={[
              "cursor-pointer px-3 py-2.5 text-sm text-[var(--ink)]",
              selected === o.value
                ? "bg-[var(--accent-soft)] font-medium"
                : "hover:bg-[var(--paper-deep)]",
            ].join(" ")}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setSelected(o.value);
              setOpen(false);
              btnRef.current?.focus();
            }}
          >
            {o.label}
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div ref={rootRef} className="relative min-w-0 max-w-full">
      <input type="hidden" name={name} value={selected} required={isRequired} />
      <button
        ref={btnRef}
        type="button"
        id={id}
        className={btnClass}
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        aria-haspopup="listbox"
        aria-invalid={!!error}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="min-w-0 flex-1 truncate">
          {selected ? selectedLabel : placeholder}
        </span>
        <span
          className="shrink-0 text-[var(--ink-muted)]"
          aria-hidden
        >
          {open ? "▴" : "▾"}
        </span>
      </button>
      {list ? createPortal(list, document.body) : null}
    </div>
  );
}

function CertificatiModalPanel({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(
    inviaRichiestaCertificato,
    CERTIFICATI_FORM_INITIAL_STATE,
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input,select,button")?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex max-h-[100dvh] items-end justify-center overflow-hidden p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Chiudi"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-[var(--nav-border)] bg-[var(--paper)] shadow-2xl max-sm:max-h-[min(88dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-0.75rem))] sm:max-h-[min(92dvh,900px)] sm:rounded-2xl"
      >
        <header className="sticky top-0 z-20 flex shrink-0 items-start justify-between gap-3 border-b border-[var(--nav-border)] bg-[var(--paper)] px-4 py-4 pt-[max(1rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pt-4">
          <div>
            <h2
              id={titleId}
              className="font-display text-xl font-semibold text-[var(--ink)] sm:text-2xl"
            >
              Prenotazione certificati
            </h2>
            <p className="mt-1 max-w-prose text-sm text-[var(--ink-muted)]">
              Compila tutti i campi. Per altre tipologie di certificato usa
              WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--nav-border)] px-3 py-1.5 text-sm text-[var(--ink-muted)] transition-colors hover:bg-[var(--paper-deep)] hover:text-[var(--ink)]"
          >
            Chiudi
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {state.ok && state.message ? (
            <p
              className="mb-6 rounded-lg border border-emerald-700/25 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900"
              role="status"
            >
              {state.message}
            </p>
          ) : null}

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <form
              ref={formRef}
              action={formAction}
              className="min-w-0 flex-1 space-y-4"
              noValidate
            >
              <div>
                <label
                  htmlFor="nomeCognome"
                  className="text-sm font-medium text-[var(--ink)]"
                >
                  Nome e cognome <span className="text-red-700">*</span>
                </label>
                <input
                  id="nomeCognome"
                  name="nomeCognome"
                  type="text"
                  required
                  autoComplete="name"
                  className={fieldClass(state.errors?.nomeCognome)}
                  aria-invalid={!!state.errors?.nomeCognome}
                />
                {state.errors?.nomeCognome ? (
                  <p className="mt-1 text-sm text-red-700">
                    {state.errors.nomeCognome}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="luogoNascita"
                  className="text-sm font-medium text-[var(--ink)]"
                >
                  Luogo di nascita <span className="text-red-700">*</span>
                </label>
                <input
                  id="luogoNascita"
                  name="luogoNascita"
                  type="text"
                  required
                  autoComplete="bday-location"
                  className={fieldClass(state.errors?.luogoNascita)}
                  aria-invalid={!!state.errors?.luogoNascita}
                />
                {state.errors?.luogoNascita ? (
                  <p className="mt-1 text-sm text-red-700">
                    {state.errors.luogoNascita}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="dataNascita"
                  className="text-sm font-medium text-[var(--ink)]"
                >
                  Data di nascita <span className="text-red-700">*</span>
                </label>
                <input
                  id="dataNascita"
                  name="dataNascita"
                  type="date"
                  required
                  max={new Date().toISOString().slice(0, 10)}
                  className={fieldClass(state.errors?.dataNascita)}
                  aria-invalid={!!state.errors?.dataNascita}
                />
                {state.errors?.dataNascita ? (
                  <p className="mt-1 text-sm text-red-700">
                    {state.errors.dataNascita}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="certificatoRichiesto"
                  className="text-sm font-medium text-[var(--ink)]"
                >
                  Certificato richiesto{" "}
                  <span className="text-red-700">*</span>
                </label>
                <FormSelect
                  id="certificatoRichiesto"
                  name="certificatoRichiesto"
                  required
                  error={state.errors?.certificatoRichiesto}
                  options={tipiCertificato.map((t) => ({
                    value: t.value,
                    label: t.label,
                  }))}
                />
                {state.errors?.certificatoRichiesto ? (
                  <p className="mt-1 text-sm text-red-700">
                    {state.errors.certificatoRichiesto}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="parrocchia"
                  className="text-sm font-medium text-[var(--ink)]"
                >
                  Parrocchia in cui hai ricevuto il sacramento{" "}
                  <span className="text-red-700">*</span>
                </label>
                <FormSelect
                  id="parrocchia"
                  name="parrocchia"
                  required
                  error={state.errors?.parrocchia}
                  options={parrocchie.map((p) => ({
                    value: p.slug,
                    label: p.nomeCompleto,
                  }))}
                />
                {state.errors?.parrocchia ? (
                  <p className="mt-1 text-sm text-red-700">
                    {state.errors.parrocchia}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="cellulare"
                  className="text-sm font-medium text-[var(--ink)]"
                >
                  Numero di cellulare <span className="text-red-700">*</span>
                </label>
                <input
                  id="cellulare"
                  name="cellulare"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Es. 333 1234567"
                  className={fieldClass(state.errors?.cellulare)}
                  aria-invalid={!!state.errors?.cellulare}
                />
                {state.errors?.cellulare ? (
                  <p className="mt-1 text-sm text-red-700">
                    {state.errors.cellulare}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[var(--ink)]"
                >
                  Email <span className="text-red-700">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass(state.errors?.email)}
                  aria-invalid={!!state.errors?.email}
                />
                {state.errors?.email ? (
                  <p className="mt-1 text-sm text-red-700">
                    {state.errors.email}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 border-t border-[var(--nav-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[var(--ink-muted)]">
                  * Tutti i campi sono obbligatori.
                </p>
                <SubmitButton />
              </div>
            </form>

            <aside className="shrink-0 rounded-xl border border-[var(--nav-border)] bg-[var(--paper-deep)]/80 p-4 shadow-sm lg:sticky lg:top-4 lg:w-72">
              <p className="font-display text-base font-semibold text-[var(--ink)]">
                Informazioni
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                Per altri certificati, scrivi al numero WhatsApp della
                comunità.
              </p>
              <div className="mt-4 flex justify-center lg:justify-start">
                <WhatsAppLink />
              </div>
              {!WHATSAPP_NUMBER ? (
                <p className="mt-3 text-xs text-[var(--ink-muted)]">
                  Imposta{" "}
                  <code className="rounded bg-[var(--paper)] px-1">
                    NEXT_PUBLIC_WHATSAPP_CERTIFICATI
                  </code>{" "}
                  in <code className="rounded bg-[var(--paper)] px-1">.env.local</code>{" "}
                  (solo cifre, prefisso internazionale, es. 39333…).
                </p>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export type CertificatiPrenotazioneHandle = {
  open: () => void;
};

export const CertificatiPrenotazione = forwardRef<
  CertificatiPrenotazioneHandle,
  { buttonClassName?: string }
>(function CertificatiPrenotazione({ buttonClassName }, ref) {
  const [open, setOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const apri = useCallback(() => {
    setDialogKey((k) => k + 1);
    setOpen(true);
  }, []);

  useImperativeHandle(ref, () => ({ open: apri }), [apri]);

  return (
    <>
      <button
        type="button"
        onClick={apri}
        className={[
          "nav-pill font-display text-lg font-medium",
          buttonClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        Certificati
      </button>
      {mounted && open
        ? createPortal(
            <CertificatiModalPanel
              key={dialogKey}
              onClose={() => setOpen(false)}
            />,
            document.body,
          )
        : null}
    </>
  );
});

CertificatiPrenotazione.displayName = "CertificatiPrenotazione";

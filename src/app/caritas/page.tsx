import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caritas",
  description:
    "Informazioni Caritas: accesso al pacco alimentare, percorso di ascolto e modalità di donazione.",
};

export default function CaritasPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 md:pt-14">
      <section className="rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)]/85 p-5 shadow-sm sm:p-7">
        <h1 className="font-display text-4xl font-semibold text-[var(--ink)] sm:text-5xl">
          Caritas Parrocchiale
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
          La Caritas e il volto concreto della comunita che si prende cura delle
          famiglie in difficolta, con ascolto, trasparenza e corresponsabilita.
        </p>
      </section>

      <section className="caritas-alert-move mt-6 rounded-xl border-2 border-red-700/70 bg-red-600 px-4 py-4 text-center text-white shadow-lg">
        <p className="font-display text-lg font-semibold tracking-wide sm:text-2xl">
          NESSUNO È AUTORIZZATO DALLA PARROCCHIA A RACCOGLIERE OFFERTE A
          DOMICILIO!
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)] p-5 shadow-sm sm:p-7">
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
          Come ricevere il pacco alimentare
        </h2>
        <h3 className="mt-5 font-display text-xl font-semibold text-[var(--ink)]">
          L&apos;Accoglienza: Un Percorso di Ascolto e Trasparenza
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          Per le famiglie residenti nel nostro territorio parrocchiale che si
          trovano in difficolta, la Caritas e un punto di riferimento e di
          ascolto. L&apos;accesso al servizio non e automatico: ogni aiuto e
          accompagnato da una conoscenza diretta e dignitosa della situazione.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          Chiunque abbia necessita di ricevere il pacco alimentare deve fissare
          un appuntamento direttamente con il Parroco per un colloquio
          conoscitivo. In tale occasione, e indispensabile presentare la
          documentazione essenziale che attesti la composizione e la situazione
          economica del nucleo familiare, in particolare:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          <li>Lo Stato di Famiglia;</li>
          <li>Il certificato ISEE in corso di validita.</li>
        </ul>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          Questo momento di verifica e fondamentale per permettere ai
          responsabili della Caritas di comprendere le reali esigenze e
          stabilire, con giustizia e trasparenza, come la comunita possa venire
          incontro nel modo migliore a ogni singola richiesta.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)] p-5 shadow-sm sm:p-7">
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
          Come sostenere la Caritas (donazioni)
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          La Caritas non e un ufficio, ne un semplice centro di smistamento di
          pacchi. E, prima di tutto, il braccio teso della nostra comunita e
          l&apos;espressione concreta di un amore che si trasforma in gesti
          quotidiani e strutturati. Il nostro obiettivo e promuovere la dignita
          di ogni persona, riconoscendo il volto dell&apos;altro come un
          fratello da sostenere.
        </p>

        <h3 className="mt-6 font-display text-xl font-semibold text-[var(--ink)]">
          Una Macchina di Carita: Il Volto dei Nostri Volontari
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          Dietro ogni pacco consegnato c&apos;e un movimento invisibile di
          persone che donano gratuitamente tempo ed energie, con immenso amore.
        </p>
        <ul className="mt-4 list-disc space-y-3 pl-6 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          <li>
            <strong>Il Viaggio del Rifornimento:</strong> una volta al mese una
            squadra di volontari raggiunge il Banco Alimentare a Caserta per
            caricare e trasportare i beni.
          </li>
          <li>
            <strong>La Cura degli Spazi:</strong> al rientro, i volontari
            scaricano e sistemano il materiale, organizzando scaffali e
            scadenze con attenzione.
          </li>
          <li>
            <strong>L&apos;Organizzazione e la Logistica:</strong> c&apos;e chi
            prepara documenti e pratiche burocratiche per garantire
            trasparenza, equita e correttezza.
          </li>
          <li>
            <strong>La Preparazione dei Pacchi:</strong> ogni kit viene
            composto con cura, cercando di rispondere alle necessita specifiche
            delle famiglie, soprattutto dove ci sono bambini o anziani.
          </li>
        </ul>

        <h3 className="mt-6 font-display text-xl font-semibold text-[var(--ink)]">
          La Sfida delle 100 Famiglie: Perche il Banco Alimentare non Basta
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          Oggi la nostra realta segue abitualmente circa 100 famiglie: cento
          storie di vita, fatiche e speranze. Il solo materiale del Banco
          Alimentare, pur prezioso, non basta a coprire il fabbisogno completo
          di un mese. Spesso mancano prodotti freschi, articoli per l&apos;infanzia
          e beni di prima necessita che dobbiamo acquistare direttamente.
        </p>

        <h3 className="mt-6 font-display text-xl font-semibold text-[var(--ink)]">
          L&apos;Invito alla Corresponsabilita: Il Senso del Nostro IBAN
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          Condividere l&apos;IBAN non e una semplice richiesta di fondi, ma un
          invito a partecipare alla stessa missione in forme diverse: chi puo
          dona tempo e lavoro, chi non puo farlo materialmente puo sostenere con
          un contributo economico.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          Ogni donazione, piccola o grande, si trasforma direttamente in latte,
          olio, prodotti per l&apos;igiene e pasta che mancano negli scaffali.
        </p>

        <h3 className="mt-6 font-display text-xl font-semibold text-[var(--ink)]">
          Conclusione: Un Fuoco che Scalda Tutti
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          La solidarieta e un fuoco che scalda sia chi riceve sia chi dona.
          Essere comunita responsabile significa capire che il bisogno del
          vicino riguarda tutti noi. La Caritas e una porta sempre aperta, e
          sono le vostre mani a permetterci di non chiuderla mai.
        </p>

        <div className="mt-6 rounded-xl border border-[var(--nav-border)] bg-[var(--paper-deep)]/70 p-4 sm:p-5">
          <p className="font-display text-lg font-semibold text-[var(--ink)]">
            Modalita per contribuire
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-[var(--ink-muted)] sm:text-base">
            <li>Una sottoscrizione di 10EUR direttamente al parroco;</li>
            <li>
              Un bonifico intestato a: <strong>Parrocchia Sant&apos;Eligio Maggiore</strong>
            </li>
          </ul>
          <div className="mt-4 rounded-lg border border-[var(--nav-border)] bg-[var(--paper)] px-4 py-3 text-[15px] leading-relaxed text-[var(--ink)] sm:text-base">
            <p>
              <strong>IBAN:</strong> IT03M0103003402000000917294
            </p>
            <p>
              <strong>Causale:</strong> Caritas
            </p>
          </div>
          <p className="mt-4 text-[15px] text-[var(--ink-muted)] sm:text-base">
            Con profonda gratitudine a tutti i volontari e ai donatori.
          </p>
          <p className="mt-2 font-display text-lg text-[var(--ink)]">
            Don Alessandro Overa
          </p>
        </div>
      </section>
    </main>
  );
}

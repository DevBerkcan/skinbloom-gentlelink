// app/datenschutz/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Datenschutzerklärung - Skinbloom Aesthetics",
  description: "Datenschutzerklärung von Skinbloom Aesthetics",
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#8A8A8A] hover:text-[#E8C7C3] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Zurück zur Startseite
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-[#E8C7C3]/20">
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-8">Datenschutzerklärung</h1>

          <div className="space-y-8 text-[#8A8A8A]">
            <section>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">1. Datenschutz auf einen Blick</h2>

              <h3 className="text-xl font-semibold text-[#1E1E1E] mt-4 mb-2">Allgemeine Hinweise</h3>
              <p className="mb-4">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten
                sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>

              <h3 className="text-xl font-semibold text-[#1E1E1E] mt-4 mb-2">
                Datenerfassung auf dieser Website
              </h3>
              <p className="mb-2"><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
              <p className="mb-4">
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
                Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
              </p>

              <p className="mb-2"><strong>Wie erfassen wir Ihre Daten?</strong></p>
              <p className="mb-4">
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es
                sich z.B. um Daten handeln, die Sie in ein Kontaktformular oder bei einer Terminbuchung eingeben.
              </p>
              <p className="mb-4">
                Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
                Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des
                Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
              </p>

              <p className="mb-2"><strong>Wofür nutzen wir Ihre Daten?</strong></p>
              <p className="mb-4">
                Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
                gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden
                sowie zur Durchführung und Verwaltung Ihrer Terminbuchungen.
              </p>

              <p className="mb-2"><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong></p>
              <p>
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck
                Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die
                Berichtigung oder Löschung dieser Daten zu verlangen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">
                2. Hosting und Content Delivery Networks (CDN)
              </h2>

              <h3 className="text-xl font-semibold text-[#1E1E1E] mt-4 mb-2">Vercel</h3>
              <p className="mb-2">
                Wir hosten unsere Website bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
              </p>
              <p className="mb-4">
                Vercel ist ein Service für das Hosting und die Bereitstellung von Webseiten. Details
                entnehmen Sie der Datenschutzerklärung von Vercel:{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8C7C3] hover:underline"
                >
                  https://vercel.com/legal/privacy-policy
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">
                3. Allgemeine Hinweise und Pflichtinformationen
              </h2>

              <h3 className="text-xl font-semibold text-[#1E1E1E] mt-4 mb-2">Datenschutz</h3>
              <p className="mb-4">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
                behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
                Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>

              <h3 className="text-xl font-semibold text-[#1E1E1E] mt-4 mb-2">
                Widerruf Ihrer Einwilligung zur Datenverarbeitung
              </h3>
              <p className="mb-4">
                Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich.
                Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der
                bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">
                4. Datenerfassung auf dieser Website
              </h2>

              <h3 className="text-xl font-semibold text-[#1E1E1E] mt-4 mb-2">Server-Log-Dateien</h3>
              <p className="mb-4">
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
                Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
            </section>

            <section className="bg-[#F5EDEB] p-6 rounded-xl border border-[#E8C7C3]/30">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">Kontakt bei Datenschutzfragen</h2>
              <p className="mb-2 text-[#8A8A8A]">
                Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:
              </p>
              <p className="mb-2">
                <strong className="text-[#1E1E1E]">E-Mail:</strong>{" "}
                <a href="mailto:info@skinbloom-aesthetics.ch" className="text-[#E8C7C3] hover:underline">
                  info@skinbloom-aesthetics.ch
                </a>
              </p>
              <p>
                <strong className="text-[#1E1E1E]">Telefon:</strong> <span className="text-[#8A8A8A]">+41 78 241 87 04</span>
              </p>
            </section>

            <p className="text-sm text-[#8A8A8A] italic mt-8">
              Stand: Februar 2026
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-[#E8C7C3]/20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#E8C7C3] hover:text-[#D8B0AC] font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
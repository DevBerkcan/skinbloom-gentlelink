import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Datenschutzerklärung - Skinbloom Aesthetics",
  description: "Datenschutzerklärung von Skinbloom Aesthetics",
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-barber-grey-600 hover:text-barber-red transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Zurück zur Startseite
        </Link>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 ring-1 ring-barber-grey-100">
          <h1 className="text-4xl font-bold text-barber-black mb-8">Datenschutzerklärung</h1>

          <div className="space-y-8 text-barber-grey-700">
            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">1. Datenschutz auf einen Blick</h2>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Allgemeine Hinweise</h3>
              <p className="mb-4">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten
                sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">
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
                (Google Analytics) sowie zur Durchführung und Verwaltung Ihrer Terminbuchungen.
              </p>

              <p className="mb-2"><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong></p>
              <p>
                Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck
                Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die
                Berichtigung oder Löschung dieser Daten zu verlangen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">
                2. Hosting und Content Delivery Networks (CDN)
              </h2>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Vercel</h3>
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
                  className="text-barber-red hover:underline"
                >
                  https://vercel.com/legal/privacy-policy
                </a>
              </p>
              <p>
                Die Verwendung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben
                ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">
                3. Allgemeine Hinweise und Pflichtinformationen
              </h2>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Datenschutz</h3>
              <p className="mb-4">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
                behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
                Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">
                Widerruf Ihrer Einwilligung zur Datenverarbeitung
              </h3>
              <p className="mb-4">
                Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich.
                Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der
                bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
              </p>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">
                Recht auf Datenübertragbarkeit
              </h3>
              <p className="mb-4">
                Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung
                eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen,
                maschinenlesbaren Format aushändigen zu lassen.
              </p>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">
                Auskunft, Löschung und Berichtigung
              </h3>
              <p className="mb-4">
                Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf
                unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und
                Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder
                Löschung dieser Daten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">
                4. Datenerfassung auf dieser Website
              </h2>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Server-Log-Dateien</h3>
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
              <p>
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die
                Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
              </p>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Kontaktformular & Buchungssystem</h3>
              <p className="mb-4">
                Wenn Sie unser Buchungssystem nutzen oder uns per E-Mail kontaktieren, werden Ihre Angaben
                (Name, E-Mail-Adresse, Telefonnummer, gewünschter Termin) zur Bearbeitung der Anfrage und
                für den Fall von Anschlussfragen bei uns gespeichert.
              </p>
              <p className="mb-4">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern
                Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung
                vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die
                Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns
                gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
              <p className="mb-4">
                Die von Ihnen eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern,
                Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung
                entfällt (z.B. nach abgeschlossener Bearbeitung Ihrer Anfrage).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">
                5. Analyse-Tools und Werbung
              </h2>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Google Analytics</h3>
              <p className="mb-4">
                Diese Website nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die
                Google Ireland Limited („Google"), Gordon House, Barrow Street, Dublin 4, Irland.
              </p>
              <p className="mb-4">
                Google Analytics verwendet so genannte „Cookies". Das sind Textdateien, die auf Ihrem
                Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie
                ermöglichen.
              </p>
              <p className="mb-4">
                Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in
                der Regel an einen Server von Google in den USA übertragen und dort gespeichert.
              </p>
              <p className="mb-4">
                Die Speicherung von Google-Analytics-Cookies und die Nutzung dieses Analyse-Tools erfolgen
                auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes
                Interesse an der Analyse des Nutzerverhaltens, um sowohl sein Webangebot als auch seine
                Werbung zu optimieren.
              </p>
              <p className="mb-4">
                Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer
                Browser-Software verhindern. Sie können darüber hinaus die Erfassung der durch den Cookie
                erzeugten und auf Ihre Nutzung der Website bezogenen Daten an Google sowie die Verarbeitung
                dieser Daten durch Google verhindern, indem Sie das unter dem folgenden Link verfügbare
                Browser-Plugin herunterladen und installieren:{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-barber-red hover:underline"
                >
                  https://tools.google.com/dlpage/gaoptout
                </a>
              </p>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">UTM-Parameter & Tracking</h3>
              <p className="mb-4">
                Diese Website verwendet UTM-Parameter zur Analyse der Herkunft von Website-Besuchern. Diese
                Daten werden gespeichert, um nachzuvollziehen, über welche Marketingkanäle (z.B. Instagram,
                Google, Facebook) Besucher auf unsere Website gelangen.
              </p>
              <p>
                Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                Interesse an der Verbesserung unserer Marketingmaßnahmen).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">6. Newsletter (optional)</h2>
              <p className="mb-4">
                Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von
                Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass
                Sie der Inhaber der angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters
                einverstanden sind.
              </p>
              <p>
                Sie können Ihre Einwilligung zum Empfang des Newsletters jederzeit widerrufen. Die
                Rechtmäßigkeit der bereits erfolgten Datenverarbeitungsvorgänge bleibt vom Widerruf
                unberührt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">7. Plugins und Tools</h2>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Google Maps</h3>
              <p className="mb-4">
                Diese Seite nutzt über eine API den Kartendienst Google Maps. Anbieter ist die Google
                Ireland Limited („Google"), Gordon House, Barrow Street, Dublin 4, Irland.
              </p>
              <p className="mb-4">
                Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP Adresse zu speichern.
                Diese Informationen werden in der Regel an einen Server von Google in den USA übertragen
                und dort gespeichert.
              </p>
              <p>
                Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer
                Online-Angebote und an einer leichten Auffindbarkeit der von uns auf der Website
                angegebenen Orte. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f
                DSGVO dar.
              </p>
            </section>

            <section className="bg-barber-cream p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-barber-black mb-4">Kontakt bei Datenschutzfragen</h2>
              <p className="mb-2">
                Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:
              </p>
              <p className="mb-2">
                <strong>E-Mail:</strong>{" "}
                <a href="mailto:info@skinbloom-aesthetics.ch" className="text-barber-red hover:underline">
                  info@skinbloom-aesthetics.ch
                </a>
              </p>
              <p>
                <strong>Telefon:</strong> +41 78 241 87 04
              </p>
            </section>

            <p className="text-sm text-barber-grey-600 italic mt-8">
              Stand: Februar 2026
            </p>
          </div>

          {/* Back Button Bottom */}
          <div className="mt-12 pt-8 border-t border-barber-grey-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-barber-red hover:text-barber-darkRed font-semibold transition-colors"
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

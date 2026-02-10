import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Impressum - Skinbloom Aesthetics",
  description: "Impressum und Kontaktdaten von Skinbloom Aesthetics",
};

export default function ImpressumPage() {
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
          <h1 className="text-4xl font-bold text-barber-black mb-8">Impressum</h1>

          <div className="space-y-8 text-barber-grey-700">
            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">Angaben gemäß § 5 TMG</h2>
              <p className="mb-2">
                <strong>Skinbloom Aesthetics</strong>
              </p>
              <p>Elisabethenstrasse 41</p>
              <p>4051 Basel, Schweiz</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">Kontakt</h2>
              <p className="mb-2">
                <strong>Telefon:</strong> +49 157 35985449
              </p>
              <p className="mb-2">
                <strong>E-Mail:</strong>{" "}
                <a href="mailto:info@skinbloom-aesthetics.ch" className="text-barber-red hover:underline">
                  info@skinbloom-aesthetics.ch
                </a>
              </p>
              <p className="mb-2">
                <strong>Website:</strong>{" "}
                <a href="https://skinbloom-aesthetics.ch" className="text-barber-red hover:underline">
                  https://skinbloom-aesthetics.ch
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">
                Umsatzsteuer-ID
              </h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              </p>
              <p className="text-sm text-barber-grey-600 italic mt-2">
                [Bitte USt-IdNr. eintragen, falls vorhanden]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>Inhaber: Marianna Topchanali</p>
              <p>Elisabethenstrasse 41</p>
              <p>4051 Basel, Schweiz</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">
                EU-Streitschlichtung
              </h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-barber-red hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="mt-2">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-barber-black mb-4">Haftungsausschluss</h2>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Haftung für Inhalte</h3>
              <p className="mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                Tätigkeit hinweisen.
              </p>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Haftung für Links</h3>
              <p className="mb-4">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
                übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
                Betreiber der Seiten verantwortlich.
              </p>

              <h3 className="text-xl font-semibold text-barber-black mt-4 mb-2">Urheberrecht</h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>
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

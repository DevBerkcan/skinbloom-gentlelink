"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock, MapPin, Scissors, ArrowLeft } from "lucide-react";
import { Button } from "@nextui-org/button";
import Link from "next/link";

interface BookingDetails {
  id: string;
  bookingNumber: string;
  status: string;
  booking: {
    serviceName: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    price: number;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooking() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5067/api";
        const response = await fetch(`${API_URL}/bookings/${params.id}`);

        if (!response.ok) {
          throw new Error("Buchung nicht gefunden");
        }

        const data = await response.json();
        setBooking(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-barber-red" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-barber-black mb-2">
            Fehler
          </h1>
          <p className="text-barber-grey-600 mb-6">
            {error || "Buchung konnte nicht geladen werden"}
          </p>
          <Link href="/">
            <Button className="bg-barber-red text-white">
              Zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-barber-grey-100"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-barber-red to-barber-darkRed text-white p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="text-barber-red" size={48} />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">
              Termin bestätigt!
            </h1>
            <p className="text-barber-cream">
              Buchungsnummer: {booking.bookingNumber}
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-8 space-y-6">
            <div className="bg-barber-cream rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-barber-red/10 rounded-lg flex items-center justify-center">
                  <Calendar className="text-barber-red" size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-barber-grey-600 mb-1">Datum & Uhrzeit</div>
                  <div className="font-semibold text-barber-black">
                    {formatDate(booking.booking.bookingDate)}
                  </div>
                  <div className="text-barber-grey-700">
                    {booking.booking.startTime} - {booking.booking.endTime} Uhr
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-barber-red/10 rounded-lg flex items-center justify-center">
                  <Scissors className="text-barber-red" size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-barber-grey-600 mb-1">Leistung</div>
                  <div className="font-semibold text-barber-black">
                    {booking.booking.serviceName}
                  </div>
                  <div className="text-barber-grey-700">
                    ab {booking.booking.price.toFixed(2)} EUR
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-barber-red/10 rounded-lg flex items-center justify-center">
                  <MapPin className="text-barber-red" size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-barber-grey-600 mb-1">Standort</div>
                  <div className="font-semibold text-barber-black">
                    Barber Dario
                  </div>
                  <div className="text-barber-grey-700">
                    Berliner Allee 43, 40212 Düsseldorf
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Email Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                📧 Eine Terminbestätigung wurde an <strong>{booking.customer.email}</strong> gesendet.
              </p>
            </div>

            {/* What's Next */}
            <div className="space-y-3">
              <h2 className="font-semibold text-barber-black">Nächste Schritte:</h2>
              <ul className="space-y-2 text-sm text-barber-grey-700">
                <li className="flex gap-2">
                  <span className="text-barber-red">✓</span>
                  <span>Du erhältst 24 Stunden vor deinem Termin eine Erinnerung per Email</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-barber-red">✓</span>
                  <span>Falls du den Termin nicht wahrnehmen kannst, storniere ihn bitte rechtzeitig</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-barber-red">✓</span>
                  <span>Wir freuen uns auf deinen Besuch!</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 pt-0 flex gap-4">
            <Link href="/" className="flex-1">
              <Button
                variant="flat"
                className="w-full bg-barber-grey-100 font-semibold"
                startContent={<ArrowLeft size={20} />}
              >
                Zur Startseite
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

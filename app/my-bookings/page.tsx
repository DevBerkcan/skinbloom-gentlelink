"use client";

import { useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Calendar, Mail, AlertCircle, X } from "lucide-react";
import { getBookingsByEmail, cancelBooking, type BookingResponse } from "@/lib/api/booking";

export default function MyBookingsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await getBookingsByEmail(email);
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openCancelModal(booking: BookingResponse) {
    setSelectedBooking(booking);
    onOpen();
  }

  async function handleCancel() {
    if (!selectedBooking) return;

    setCancelling(true);
    try {
      await cancelBooking(selectedBooking.id);

      // Remove cancelled booking from list or reload
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id ? { ...b, status: "Cancelled" } : b
        )
      );

      onClose();
    } catch (err: any) {
      alert("Fehler beim Stornieren: " + err.message);
    } finally {
      setCancelling(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "success";
      case "Pending": return "warning";
      case "Completed": return "primary";
      case "Cancelled": return "danger";
      case "NoShow": return "default";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Confirmed": return "Bestätigt";
      case "Pending": return "Ausstehend";
      case "Completed": return "Abgeschlossen";
      case "Cancelled": return "Storniert";
      case "NoShow": return "Nicht erschienen";
      default: return status;
    }
  };

  const canCancel = (booking: BookingResponse) => {
    return booking.status === "Pending" || booking.status === "Confirmed";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-barber-black mb-3">Meine Buchungen</h1>
          <p className="text-barber-grey-600">
            Gib deine E-Mail-Adresse ein, um deine Termine zu sehen
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardBody className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                type="email"
                placeholder="deine-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail size={18} className="text-barber-grey-400" />}
                isRequired
                classNames={{
                  input: "text-barber-black",
                  inputWrapper: "bg-white",
                }}
                size="lg"
              />
              <Button
                type="submit"
                className="bg-barber-red text-white font-semibold px-8"
                size="lg"
                isLoading={loading}
              >
                Suchen
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-2 border-red-200">
            <CardBody className="p-6 bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                <div>
                  <div className="font-semibold text-red-900 mb-1">Fehler</div>
                  <div className="text-red-700">{error}</div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Bookings List */}
        {searched && !loading && (
          <>
            {bookings.length === 0 ? (
              <Card>
                <CardBody className="p-12 text-center">
                  <Calendar className="mx-auto mb-4 text-barber-grey-400" size={48} />
                  <h3 className="text-xl font-semibold text-barber-black mb-2">
                    Keine Buchungen gefunden
                  </h3>
                  <p className="text-barber-grey-600">
                    Für diese E-Mail-Adresse wurden keine Termine gefunden.
                  </p>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-barber-black">
                    Deine Termine ({bookings.length})
                  </h2>
                </div>

                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardBody className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-barber-black">
                              {booking.booking.serviceName}
                            </h3>
                            <Chip color={getStatusColor(booking.status)} size="sm" variant="flat">
                              {getStatusLabel(booking.status)}
                            </Chip>
                          </div>
                          <div className="text-sm text-barber-grey-600">
                            Buchungsnummer: {booking.bookingNumber}
                          </div>
                        </div>

                        {canCancel(booking) && (
                          <Button
                            color="danger"
                            variant="flat"
                            size="sm"
                            startContent={<X size={16} />}
                            onPress={() => openCancelModal(booking)}
                          >
                            Stornieren
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-barber-cream p-4 rounded-lg">
                        <div>
                          <div className="text-sm text-barber-grey-600 mb-1">Datum</div>
                          <div className="font-semibold text-barber-black">
                            {new Date(booking.booking.bookingDate).toLocaleDateString('de-DE', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-barber-grey-600 mb-1">Uhrzeit</div>
                          <div className="font-semibold text-barber-black">
                            {booking.booking.startTime} - {booking.booking.endTime} Uhr
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-barber-grey-600 mb-1">Preis</div>
                          <div className="font-semibold text-barber-black">
                            ab {booking.booking.price.toFixed(2)} EUR
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-barber-grey-600 mb-1">Standort</div>
                          <div className="font-semibold text-barber-black">
                            Berliner Allee 43, Düsseldorf
                          </div>
                        </div>
                      </div>

                      {booking.confirmationSent && (
                        <div className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                          📧 Bestätigungsemail wurde an {booking.customer.email} gesendet
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-barber-red" />
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Termin stornieren
          </ModalHeader>
          <ModalBody>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
                  <div>
                    <div className="font-semibold text-yellow-900 mb-1">
                      Möchtest du diesen Termin wirklich stornieren?
                    </div>
                    <div className="text-sm text-yellow-800">
                      Diese Aktion kann nicht rückgängig gemacht werden.
                    </div>
                  </div>
                </div>

                <div className="bg-barber-cream p-4 rounded-lg">
                  <div className="font-semibold text-barber-black mb-2">
                    {selectedBooking.booking.serviceName}
                  </div>
                  <div className="text-sm text-barber-grey-700">
                    {new Date(selectedBooking.booking.bookingDate).toLocaleDateString('de-DE')} •{' '}
                    {selectedBooking.booking.startTime} - {selectedBooking.booking.endTime}
                  </div>
                  <div className="text-sm text-barber-grey-700 mt-2">
                    Buchungsnummer: {selectedBooking.bookingNumber}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
              Abbrechen
            </Button>
            <Button
              color="danger"
              onPress={handleCancel}
              isLoading={cancelling}
            >
              Termin stornieren
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

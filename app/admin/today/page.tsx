"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Spinner } from "@nextui-org/spinner";
import { Calendar, Clock, User, Phone, Mail, Scissors } from "lucide-react";
import { getDashboard, type BookingListItem } from "@/lib/api/admin";

export default function TodayTimelinePage() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadTodayBookings();

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  async function loadTodayBookings() {
    try {
      const dashboard = await getDashboard();
      setBookings(dashboard.today.bookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  // Timeline helper functions
  const TIMELINE_START = 8; // 8:00 AM
  const TIMELINE_END = 20; // 8:00 PM
  const TIMELINE_HOURS = TIMELINE_END - TIMELINE_START;

  function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function getCurrentTimePosition(): number {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const timelineStartMinutes = TIMELINE_START * 60;
    const timelineEndMinutes = TIMELINE_END * 60;

    if (currentMinutes < timelineStartMinutes) return 0;
    if (currentMinutes > timelineEndMinutes) return 100;

    const position = ((currentMinutes - timelineStartMinutes) / (timelineEndMinutes - timelineStartMinutes)) * 100;
    return position;
  }

  function getBookingPosition(startTime: string): number {
    const bookingMinutes = timeToMinutes(startTime);
    const timelineStartMinutes = TIMELINE_START * 60;
    const timelineEndMinutes = TIMELINE_END * 60;

    const position = ((bookingMinutes - timelineStartMinutes) / (timelineEndMinutes - timelineStartMinutes)) * 100;
    return Math.max(0, Math.min(100, position));
  }

  function isBookingNow(startTime: string, endTime: string): boolean {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  function isUpcoming(startTime: string): boolean {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = timeToMinutes(startTime);

    return startMinutes > currentMinutes;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const currentTimePos = getCurrentTimePosition();
  const now = currentTime;
  const isWithinBusinessHours = now.getHours() >= TIMELINE_START && now.getHours() < TIMELINE_END;

  return (
    <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-barber-black mb-2">
            Heutige Termine
          </h1>
          <div className="flex items-center gap-4 text-barber-grey-600">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{new Date().toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{now.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              })} Uhr</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody className="p-4">
              <div className="text-sm text-barber-grey-600 mb-1">Gesamt heute</div>
              <div className="text-3xl font-bold text-barber-black">{bookings.length}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="text-sm text-barber-grey-600 mb-1">Abgeschlossen</div>
              <div className="text-3xl font-bold text-green-600">
                {bookings.filter(b => b.status === "Completed").length}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="text-sm text-barber-grey-600 mb-1">Anstehend</div>
              <div className="text-3xl font-bold text-blue-600">
                {bookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="text-sm text-barber-grey-600 mb-1">Storniert</div>
              <div className="text-3xl font-bold text-red-600">
                {bookings.filter(b => b.status === "Cancelled").length}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="mb-8">
          <CardBody className="p-6">
            <h2 className="text-2xl font-bold text-barber-black mb-6">
              Timeline (8:00 - 20:00 Uhr)
            </h2>

            {/* Timeline Container */}
            <div className="relative">
              {/* Hour markers */}
              <div className="flex justify-between mb-2 text-sm text-barber-grey-600">
                {Array.from({ length: TIMELINE_HOURS + 1 }, (_, i) => {
                  const hour = TIMELINE_START + i;
                  return (
                    <div key={hour} className="flex-1 text-center">
                      {hour}:00
                    </div>
                  );
                })}
              </div>

              {/* Timeline bar */}
              <div className="relative h-4 bg-barber-grey-100 rounded-full mb-6">
                {/* Current time indicator */}
                {isWithinBusinessHours && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-barber-red z-20 transition-all duration-1000"
                    style={{ left: `${currentTimePos}%` }}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                      <div className="bg-barber-red text-white text-xs px-2 py-1 rounded font-semibold whitespace-nowrap">
                        JETZT {now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-3 h-3 bg-barber-red rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bookings List */}
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-barber-grey-600">
                    <Calendar className="mx-auto mb-4" size={48} />
                    <p className="text-lg">Keine Termine heute</p>
                  </div>
                ) : (
                  bookings.map((booking) => {
                    const position = getBookingPosition(booking.startTime);
                    const isNow = isBookingNow(booking.startTime, booking.endTime);
                    const isNext = isUpcoming(booking.startTime);

                    return (
                      <div key={booking.id} className="relative">
                        {/* Timeline position indicator */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                          style={{
                            left: `${position}%`,
                            backgroundColor: isNow ? '#dc2626' : isNext ? '#2563eb' : '#6b7280'
                          }}
                        />

                        {/* Booking Card */}
                        <Card
                          className={`ml-4 ${
                            isNow
                              ? 'border-2 border-barber-red shadow-lg bg-red-50'
                              : isNext
                              ? 'border-2 border-blue-500 bg-blue-50'
                              : ''
                          }`}
                        >
                          <CardBody className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Clock size={20} className={isNow ? "text-barber-red" : "text-barber-grey-600"} />
                                    <span className={`text-lg font-bold ${isNow ? 'text-barber-red' : 'text-barber-black'}`}>
                                      {booking.startTime} - {booking.endTime}
                                    </span>
                                  </div>
                                  {isNow && (
                                    <Chip color="danger" size="sm" variant="flat">
                                      LÄUFT GERADE
                                    </Chip>
                                  )}
                                  {isNext && !isNow && (
                                    <Chip color="primary" size="sm" variant="flat">
                                      NÄCHSTER TERMIN
                                    </Chip>
                                  )}
                                  <Chip color={getStatusColor(booking.status)} size="sm" variant="flat">
                                    {getStatusLabel(booking.status)}
                                  </Chip>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 text-barber-grey-700 mb-2">
                                      <Scissors size={18} />
                                      <span className="font-semibold">{booking.serviceName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-barber-grey-700 mb-2">
                                      <User size={18} />
                                      <span>{booking.customerName}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 text-barber-grey-700 mb-2">
                                      <Phone size={18} />
                                      <span>{booking.customerPhone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-barber-grey-700">
                                      <Mail size={18} />
                                      <span className="text-sm">{booking.customerEmail}</span>
                                    </div>
                                  </div>
                                </div>

                                {booking.customerNotes && (
                                  <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                    <div className="text-sm font-semibold text-yellow-800 mb-1">Notizen:</div>
                                    <div className="text-sm text-yellow-700">{booking.customerNotes}</div>
                                  </div>
                                )}
                              </div>

                              <div className="text-right">
                                <div className="text-2xl font-bold text-barber-black">
                                  {booking.price.toFixed(2)} €
                                </div>
                                <div className="text-xs text-barber-grey-600">
                                  {booking.bookingNumber}
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Legend */}
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-barber-red rounded"></div>
                <span>Aktiver Termin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Nächster Termin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span>Vergangener Termin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-barber-red"></div>
                <span>Aktuelle Uhrzeit</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

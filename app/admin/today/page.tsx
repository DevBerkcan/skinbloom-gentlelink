// app/admin/today/page.tsx
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

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

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

  const TIMELINE_START = 8;
  const TIMELINE_END = 20;
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
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white flex items-center justify-center">
        <Spinner size="lg" className="text-[#E8C7C3]" />
      </div>
    );
  }

  const currentTimePos = getCurrentTimePosition();
  const now = currentTime;
  const isWithinBusinessHours = now.getHours() >= TIMELINE_START && now.getHours() < TIMELINE_END;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">
            Heutige Termine
          </h1>
          <div className="flex items-center gap-4 text-[#8A8A8A]">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[#E8C7C3]" />
              <span>{new Date().toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-[#E8C7C3]" />
              <span>{now.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
              })} Uhr</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4">
              <div className="text-sm text-[#8A8A8A] mb-1">Gesamt heute</div>
              <div className="text-3xl font-bold text-[#1E1E1E]">{bookings.length}</div>
            </CardBody>
          </Card>
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4">
              <div className="text-sm text-[#8A8A8A] mb-1">Abgeschlossen</div>
              <div className="text-3xl font-bold text-[#C09995]">
                {bookings.filter(b => b.status === "Completed").length}
              </div>
            </CardBody>
          </Card>
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4">
              <div className="text-sm text-[#8A8A8A] mb-1">Anstehend</div>
              <div className="text-3xl font-bold text-[#D8B0AC]">
                {bookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length}
              </div>
            </CardBody>
          </Card>
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4">
              <div className="text-sm text-[#8A8A8A] mb-1">Storniert</div>
              <div className="text-3xl font-bold text-[#8A8A8A]">
                {bookings.filter(b => b.status === "Cancelled").length}
              </div>
            </CardBody>
          </Card>
        </div>

        <Card className="mb-8 border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-6">
            <h2 className="text-2xl font-bold text-[#1E1E1E] mb-6">
              Timeline (8:00 - 20:00 Uhr)
            </h2>

            <div className="relative">
              <div className="flex justify-between mb-2 text-sm text-[#8A8A8A]">
                {Array.from({ length: TIMELINE_HOURS + 1 }, (_, i) => {
                  const hour = TIMELINE_START + i;
                  return (
                    <div key={hour} className="flex-1 text-center">
                      {hour}:00
                    </div>
                  );
                })}
              </div>

              <div className="relative h-4 bg-[#F5EDEB] rounded-full mb-6 border border-[#E8C7C3]/30">
                {isWithinBusinessHours && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-[#E8C7C3] z-20 transition-all duration-1000"
                    style={{ left: `${currentTimePos}%` }}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                      <div className="bg-[#E8C7C3] text-white text-xs px-2 py-1 rounded font-semibold whitespace-nowrap">
                        JETZT {now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-3 h-3 bg-[#E8C7C3] rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-[#8A8A8A]">
                    <Calendar className="mx-auto mb-4 text-[#E8C7C3]" size={48} />
                    <p className="text-lg">Keine Termine heute</p>
                  </div>
                ) : (
                  bookings.map((booking) => {
                    const position = getBookingPosition(booking.startTime);
                    const isNow = isBookingNow(booking.startTime, booking.endTime);
                    const isNext = isUpcoming(booking.startTime);

                    return (
                      <div key={booking.id} className="relative">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                          style={{
                            left: `${position}%`,
                            backgroundColor: isNow ? '#E8C7C3' : isNext ? '#D8B0AC' : '#8A8A8A'
                          }}
                        />

                        <Card
                          className={`ml-4 border-2 ${
                            isNow
                              ? 'border-[#E8C7C3] bg-[#F5EDEB] shadow-lg'
                              : isNext
                              ? 'border-[#D8B0AC] bg-[#F5EDEB]'
                              : 'border-[#E8C7C3]/20'
                          }`}
                        >
                          <CardBody className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Clock size={20} className={isNow ? "text-[#E8C7C3]" : "text-[#8A8A8A]"} />
                                    <span className={`text-lg font-bold ${isNow ? 'text-[#E8C7C3]' : 'text-[#1E1E1E]'}`}>
                                      {booking.startTime} - {booking.endTime}
                                    </span>
                                  </div>
                                  {isNow && (
                                    <Chip color="danger" size="sm" variant="flat" className="bg-[#E8C7C3] text-white">
                                      LÄUFT GERADE
                                    </Chip>
                                  )}
                                  {isNext && !isNow && (
                                    <Chip color="primary" size="sm" variant="flat" className="bg-[#D8B0AC] text-white">
                                      NÄCHSTER TERMIN
                                    </Chip>
                                  )}
                                  <Chip color={getStatusColor(booking.status)} size="sm" variant="flat">
                                    {getStatusLabel(booking.status)}
                                  </Chip>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 text-[#8A8A8A] mb-2">
                                      <Scissors size={18} className="text-[#E8C7C3]" />
                                      <span className="font-semibold text-[#1E1E1E]">{booking.serviceName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#8A8A8A] mb-2">
                                      <User size={18} className="text-[#E8C7C3]" />
                                      <span className="text-[#1E1E1E]">{booking.customerName}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 text-[#8A8A8A] mb-2">
                                      <Phone size={18} className="text-[#E8C7C3]" />
                                      <span className="text-[#1E1E1E]">{booking.customerPhone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#8A8A8A]">
                                      <Mail size={18} className="text-[#E8C7C3]" />
                                      <span className="text-sm text-[#1E1E1E]">{booking.customerEmail}</span>
                                    </div>
                                  </div>
                                </div>

                                {booking.customerNotes && (
                                  <div className="mt-3 p-3 bg-[#F5EDEB] border-l-4 border-[#E8C7C3] rounded">
                                    <div className="text-sm font-semibold text-[#1E1E1E] mb-1">Notizen:</div>
                                    <div className="text-sm text-[#8A8A8A]">{booking.customerNotes}</div>
                                  </div>
                                )}
                              </div>

                              <div className="text-right">
                                <div className="text-2xl font-bold text-[#E8C7C3]">
                                  {booking.price.toFixed(2)} CHF
                                </div>
                                <div className="text-xs text-[#8A8A8A]">
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

        <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#E8C7C3] rounded"></div>
                <span className="text-[#1E1E1E]">Aktiver Termin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#D8B0AC] rounded"></div>
                <span className="text-[#1E1E1E]">Nächster Termin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#8A8A8A] rounded"></div>
                <span className="text-[#1E1E1E]">Vergangener Termin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-[#E8C7C3]"></div>
                <span className="text-[#1E1E1E]">Aktuelle Uhrzeit</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
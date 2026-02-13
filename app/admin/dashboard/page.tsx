// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Calendar, Clock, TrendingUp, TrendingDown, Users, Sparkles, Euro } from "lucide-react";
import { getDashboard, type DashboardOverview } from "@/lib/api/admin";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E8C7C3]" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border-2 border-[#E8C7C3]/20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Fehler</h1>
          <p className="text-[#8A8A8A] mb-6">
            {error || "Dashboard konnte nicht geladen werden"}
          </p>
        </div>
      </div>
    );
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

  const formatTime = (minutesUntil: number) => {
    if (minutesUntil < 60) return `${minutesUntil} Min`;
    if (minutesUntil < 1440) return `${Math.floor(minutesUntil / 60)} Std`;
    return `${Math.floor(minutesUntil / 1440)} Tag${Math.floor(minutesUntil / 1440) > 1 ? 'e' : ''}`;
  };

  const { today, nextBooking, statistics } = dashboard;

  const monthGrowth = statistics.totalBookingsLastMonth > 0
    ? ((statistics.totalBookingsThisMonth - statistics.totalBookingsLastMonth) / statistics.totalBookingsLastMonth) * 100
    : 0;

  const revenueGrowth = statistics.revenueLastMonth > 0
    ? ((statistics.revenueThisMonth - statistics.revenueLastMonth) / statistics.revenueLastMonth) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1E1E] mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[#8A8A8A]">
            Übersicht und Statistiken
          </p>
        </div>

        {/* Statistics Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#E8C7C3]/20 rounded-lg">
                  <Calendar className="text-[#E8C7C3]" size={20} />
                </div>
                {monthGrowth !== 0 && (
                  <div className={`flex items-center gap-1 text-xs sm:text-sm ${monthGrowth > 0 ? 'text-[#C09995]' : 'text-[#D8B0AC]'}`}>
                    {monthGrowth > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span className="font-semibold">{Math.abs(monthGrowth).toFixed(0)}%</span>
                  </div>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-1">
                {statistics.totalBookingsThisMonth}
              </div>
              <div className="text-xs sm:text-sm text-[#8A8A8A]">Buchungen diesen Monat</div>
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#E8C7C3]/20 rounded-lg">
                  <Euro className="text-[#E8C7C3]" size={20} />
                </div>
                {revenueGrowth !== 0 && (
                  <div className={`flex items-center gap-1 text-xs sm:text-sm ${revenueGrowth > 0 ? 'text-[#C09995]' : 'text-[#D8B0AC]'}`}>
                    {revenueGrowth > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span className="font-semibold">{Math.abs(revenueGrowth).toFixed(0)}%</span>
                  </div>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-1">
                {statistics.revenueThisMonth.toFixed(2)} CHF
              </div>
              <div className="text-xs sm:text-sm text-[#8A8A8A]">Umsatz diesen Monat</div>
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#E8C7C3]/20 rounded-lg">
                  <Users className="text-[#E8C7C3]" size={20} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-1">
                {statistics.totalCustomers}
              </div>
              <div className="text-xs sm:text-sm text-[#8A8A8A]">
                Gesamt Kunden ({statistics.newCustomersThisMonth} neu)
              </div>
            </CardBody>
          </Card>

          <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#E8C7C3]/20 rounded-lg">
                  <Sparkles className="text-[#E8C7C3]" size={20} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-1">
                {statistics.averageBookingValue.toFixed(2)} CHF
              </div>
              <div className="text-xs sm:text-sm text-[#8A8A8A]">Durchschnittswert</div>
            </CardBody>
          </Card>
        </div>

        {/* Main Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Overview - Full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-[#E8C7C3]/20 shadow-xl h-full">
              <CardBody className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-4 sm:mb-6">Heute</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-3 sm:p-4 bg-[#F5EDEB] rounded-lg border border-[#E8C7C3]/30">
                    <div className="text-xl sm:text-2xl font-bold text-[#1E1E1E]">{today.totalBookings}</div>
                    <div className="text-xs sm:text-sm text-[#8A8A8A]">Gesamt</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-[#F5EDEB] rounded-lg border border-[#C09995]/30">
                    <div className="text-xl sm:text-2xl font-bold text-[#C09995]">{today.completedBookings}</div>
                    <div className="text-xs sm:text-sm text-[#8A8A8A]">Erledigt</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-[#F5EDEB] rounded-lg border border-[#D8B0AC]/30">
                    <div className="text-xl sm:text-2xl font-bold text-[#D8B0AC]">{today.pendingBookings}</div>
                    <div className="text-xs sm:text-sm text-[#8A8A8A]">Ausstehend</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-[#F5EDEB] rounded-lg border border-[#E8C7C3]/30">
                    <div className="text-xl sm:text-2xl font-bold text-[#8A8A8A]">{today.cancelledBookings}</div>
                    <div className="text-xs sm:text-sm text-[#8A8A8A]">Storniert</div>
                  </div>
                </div>

                {/* Today's Appointments */}
                {today.bookings.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#1E1E1E] text-sm sm:text-base mb-2 sm:mb-3">
                      Heutige Termine
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {today.bookings.map((booking) => (
                        <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#F5EDEB] rounded-lg border border-[#E8C7C3]/30 hover:border-[#E8C7C3] transition-colors gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-semibold text-[#1E1E1E] text-sm sm:text-base">
                                {booking.startTime}
                              </span>
                              <span className="text-[#8A8A8A] text-xs sm:text-sm">-</span>
                              <span className="text-[#8A8A8A] text-xs sm:text-sm">{booking.endTime}</span>
                              <Chip color={getStatusColor(booking.status)} size="sm" variant="flat" className="ml-0 sm:ml-2">
                                {getStatusLabel(booking.status)}
                              </Chip>
                            </div>
                            <div className="text-[#1E1E1E] font-medium text-sm sm:text-base break-words">
                              {booking.customerName}
                            </div>
                            <div className="text-xs sm:text-sm text-[#8A8A8A] break-words">
                              {booking.serviceName}
                            </div>
                          </div>
                          <div className="text-right flex sm:block justify-between items-center">
                            <div className="font-semibold text-[#E8C7C3] text-base sm:text-lg">
                              {booking.price.toFixed(2)} CHF
                            </div>
                            <div className="text-xs text-[#8A8A8A] font-mono">
                              {booking.bookingNumber.slice(-6)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 text-[#8A8A8A]">
                    <Calendar className="mx-auto mb-4 text-[#E8C7C3]" size={40} />
                    <p className="text-sm sm:text-base">Keine Termine für heute</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Next Booking & Popular Services */}
          <div className="space-y-6">
            {/* Next Booking */}
            {nextBooking && (
              <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
                <CardBody className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Clock className="text-[#E8C7C3]" size={20} />
                    <h3 className="font-bold text-[#1E1E1E] text-base sm:text-lg">Nächster Termin</h3>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <div className="text-2xl sm:text-3xl font-bold text-[#E8C7C3] mb-1">
                      {formatTime(nextBooking.minutesUntil)}
                    </div>
                    <div className="text-xs sm:text-sm text-[#8A8A8A]">bis zum nächsten Termin</div>
                  </div>
                  <div className="space-y-2 bg-[#F5EDEB] p-3 sm:p-4 rounded-lg border border-[#E8C7C3]/30">
                    <div className="flex justify-between gap-2">
                      <span className="text-xs sm:text-sm text-[#8A8A8A]">Service:</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1E1E1E] text-right break-words">
                        {nextBooking.serviceName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-xs sm:text-sm text-[#8A8A8A]">Kunde:</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1E1E1E] text-right break-words">
                        {nextBooking.customerName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-xs sm:text-sm text-[#8A8A8A]">Zeit:</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1E1E1E] whitespace-nowrap">
                        {nextBooking.startTime} - {nextBooking.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-xs sm:text-sm text-[#8A8A8A]">Datum:</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1E1E1E] whitespace-nowrap">
                        {new Date(nextBooking.date).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Popular Services */}
            {statistics.popularServices.length > 0 && (
              <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
                <CardBody className="p-4 sm:p-6">
                  <h3 className="font-bold text-[#1E1E1E] text-base sm:text-lg mb-3 sm:mb-4">
                    Beliebte Services
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {statistics.popularServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-[#F5EDEB] rounded-lg border border-[#E8C7C3]/30 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#1E1E1E] text-sm sm:text-base break-words">
                            {service.serviceName}
                          </div>
                          <div className="text-xs sm:text-sm text-[#8A8A8A]">
                            {service.bookingCount} Buchungen
                          </div>
                        </div>
                        <div className="font-semibold text-[#E8C7C3] text-sm sm:text-base whitespace-nowrap">
                          {service.revenue.toFixed(2)} CHF
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Calendar, Clock, TrendingUp, TrendingDown, Users, Euro, Scissors } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-barber-red" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-barber-black mb-2">Fehler</h1>
          <p className="text-barber-grey-600 mb-6">
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
    <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-barber-black mb-2">Admin Dashboard</h1>
          <p className="text-barber-grey-600">Übersicht und Statistiken</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                {monthGrowth !== 0 && (
                  <div className={`flex items-center gap-1 ${monthGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {monthGrowth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="text-sm font-semibold">{Math.abs(monthGrowth).toFixed(0)}%</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-barber-black mb-1">
                {statistics.totalBookingsThisMonth}
              </div>
              <div className="text-sm text-barber-grey-600">Buchungen diesen Monat</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Euro className="text-green-600" size={24} />
                </div>
                {revenueGrowth !== 0 && (
                  <div className={`flex items-center gap-1 ${revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {revenueGrowth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="text-sm font-semibold">{Math.abs(revenueGrowth).toFixed(0)}%</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-barber-black mb-1">
                {statistics.revenueThisMonth.toFixed(2)} €
              </div>
              <div className="text-sm text-barber-grey-600">Umsatz diesen Monat</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-barber-black mb-1">
                {statistics.totalCustomers}
              </div>
              <div className="text-sm text-barber-grey-600">
                Gesamt Kunden ({statistics.newCustomersThisMonth} neu)
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Scissors className="text-orange-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-barber-black mb-1">
                {statistics.averageBookingValue.toFixed(2)} €
              </div>
              <div className="text-sm text-barber-grey-600">Durchschnittswert</div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody className="p-6">
                <h2 className="text-2xl font-bold text-barber-black mb-6">Heute</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-barber-cream rounded-lg">
                    <div className="text-2xl font-bold text-barber-black">{today.totalBookings}</div>
                    <div className="text-sm text-barber-grey-600">Gesamt</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{today.completedBookings}</div>
                    <div className="text-sm text-barber-grey-600">Erledigt</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{today.pendingBookings}</div>
                    <div className="text-sm text-barber-grey-600">Ausstehend</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{today.cancelledBookings}</div>
                    <div className="text-sm text-barber-grey-600">Storniert</div>
                  </div>
                </div>

                {today.bookings.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-barber-black mb-3">Heutige Termine</h3>
                    {today.bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-barber-cream rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-barber-black">{booking.startTime}</span>
                            <span className="text-barber-grey-600">-</span>
                            <span className="text-barber-grey-600">{booking.endTime}</span>
                            <Chip color={getStatusColor(booking.status)} size="sm" variant="flat">
                              {getStatusLabel(booking.status)}
                            </Chip>
                          </div>
                          <div className="text-barber-black">{booking.customerName}</div>
                          <div className="text-sm text-barber-grey-600">{booking.serviceName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-barber-black">{booking.price.toFixed(2)} €</div>
                          <div className="text-sm text-barber-grey-600">{booking.bookingNumber}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-barber-grey-600">
                    Keine Termine für heute
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Next Booking & Popular Services */}
          <div className="space-y-6">
            {/* Next Booking */}
            {nextBooking && (
              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-barber-red" size={20} />
                    <h3 className="font-bold text-barber-black">Nächster Termin</h3>
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-barber-red mb-1">
                      {formatTime(nextBooking.minutesUntil)}
                    </div>
                    <div className="text-sm text-barber-grey-600">bis zum nächsten Termin</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-barber-grey-600">Service:</span>
                      <span className="font-semibold text-barber-black">{nextBooking.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-barber-grey-600">Kunde:</span>
                      <span className="font-semibold text-barber-black">{nextBooking.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-barber-grey-600">Zeit:</span>
                      <span className="font-semibold text-barber-black">
                        {nextBooking.startTime} - {nextBooking.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-barber-grey-600">Datum:</span>
                      <span className="font-semibold text-barber-black">
                        {new Date(nextBooking.date).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Popular Services */}
            {statistics.popularServices.length > 0 && (
              <Card>
                <CardBody className="p-6">
                  <h3 className="font-bold text-barber-black mb-4">Beliebte Services</h3>
                  <div className="space-y-3">
                    {statistics.popularServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-barber-black">{service.serviceName}</div>
                          <div className="text-sm text-barber-grey-600">{service.bookingCount} Buchungen</div>
                        </div>
                        <div className="font-semibold text-barber-red">{service.revenue.toFixed(2)} €</div>
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

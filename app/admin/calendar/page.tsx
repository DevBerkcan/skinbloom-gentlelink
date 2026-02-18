// app/admin/calendar/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Spinner } from "@nextui-org/spinner";
import { Select, SelectItem } from "@nextui-org/select";
import { Input, Textarea } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Ban,
  Scissors,
  MessageCircle,
  Hash,
  CreditCard,
  CalendarDays,
  ChevronRight
} from "lucide-react";
import { 
  getBookings, 
  getServices,
  getBlockedSlots,
  createManualBooking,
  updateBookingStatus,
  type BookingListItem,
  type Service,
  type CreateManualBookingDto,
  type ManualBookingResponse,
  type BlockedTimeSlot
} from "@/lib/api/admin";
import { getAvailability, type TimeSlot } from "@/lib/api/booking";

// Setup moment with German locale
moment.locale('de');
const localizer = momentLocalizer(moment);

// Custom event types for calendar
interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: BookingListItem;
  type: 'booking';
  status: string;
}

interface BlockedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: BlockedTimeSlot;
  type: 'blocked';
}

type CalendarEvent = BookingEvent | BlockedEvent;

const statusColors = {
  Confirmed: "#10b981", // Green
  Pending: "#f59e0b",   // Amber
  Completed: "#3b82f6",  // Blue
  Cancelled: "#ef4444",  // Red
  NoShow: "#6b7280"      // Gray
};

const statusLabels = {
  Confirmed: "Bestätigt",
  Pending: "Ausstehend",
  Completed: "Abgeschlossen",
  Cancelled: "Storniert",
  NoShow: "Nicht erschienen"
};

const statusIcons = {
  Confirmed: CheckCircle,
  Pending: Clock,
  Completed: CheckCircle,
  Cancelled: XCircle,
  NoShow: XCircle
};

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isManualBookingModalOpen, setIsManualBookingModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updating, setUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<ManualBookingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  // Available time slots
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Manual booking form state
  const [bookingForm, setBookingForm] = useState<CreateManualBookingDto>({
    serviceId: '',
    bookingDate: moment().format('YYYY-MM-DD'),
    startTime: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    customerNotes: ''
  });

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Load available slots when service or date changes
  useEffect(() => {
    if (bookingForm.serviceId && bookingForm.bookingDate) {
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [bookingForm.serviceId, bookingForm.bookingDate]);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get date range for current view
      const startOfMonth = moment(date).startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment(date).endOf('month').format('YYYY-MM-DD');
      
      // Load bookings
      const bookingsResponse = await getBookings({
        fromDate: startOfMonth,
        toDate: endOfMonth,
        pageSize: 100
      });
      
      // Load blocked slots
      const blockedSlots = await getBlockedSlots(startOfMonth, endOfMonth);
      
      // Convert bookings to calendar events
      const bookingEvents: BookingEvent[] = bookingsResponse.items.map((booking: BookingListItem) => ({
        id: booking.id,
        title: `${booking.customerName} - ${booking.serviceName}`,
        start: new Date(`${booking.bookingDate}T${booking.startTime}`),
        end: new Date(`${booking.bookingDate}T${booking.endTime}`),
        resource: booking,
        type: 'booking',
        status: booking.status
      }));
      
      // Convert blocked slots to calendar events
      const blockedEvents: BlockedEvent[] = blockedSlots.map((slot: BlockedTimeSlot) => ({
        id: `blocked-${slot.id}`,
        title: `🚫 Blockiert${slot.reason ? `: ${slot.reason}` : ''}`,
        start: new Date(`${slot.blockDate}T${slot.startTime}`),
        end: new Date(`${slot.blockDate}T${slot.endTime}`),
        resource: slot,
        type: 'blocked'
      }));
      
      setEvents([...bookingEvents, ...blockedEvents]);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  async function loadServices() {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
      setError("Fehler beim Laden der Services");
    }
  }

  async function loadAvailableSlots() {
    if (!bookingForm.serviceId || !bookingForm.bookingDate) return;
    
    try {
      setLoadingSlots(true);
      const selectedService = services.find(s => s.id === bookingForm.serviceId);
      
      if (!selectedService) return;
      
      const data = await getAvailability(bookingForm.serviceId, bookingForm.bookingDate);
      
      // Filter only available slots
      const available = data.availableSlots?.filter(slot => slot.isAvailable) || [];
      setAvailableSlots(available);
      
      // Clear selected time if it's no longer available
      if (bookingForm.startTime) {
        const isStillAvailable = available.some(slot => slot.startTime === bookingForm.startTime);
        if (!isStillAvailable) {
          setBookingForm(prev => ({ ...prev, startTime: '' }));
        }
      }
    } catch (error) {
      console.error("Error loading available slots:", error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedEvent || selectedEvent.type !== 'booking') return;
    
    try {
      setUpdating(true);
      await updateBookingStatus(selectedEvent.resource.id, { status: newStatus });
      
      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id && event.type === 'booking'
          ? { ...event, status: newStatus, resource: { ...event.resource, status: newStatus } as BookingListItem }
          : event
      ));
      
      setIsBookingModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateManualBooking = async () => {
    setError(null);
    setSubmitting(true);

    try {
      // Double-check availability before creating
      const selectedService = services.find(s => s.id === bookingForm.serviceId);
      if (!selectedService) {
        throw new Error("Service nicht gefunden");
      }

      const availabilityCheck = await getAvailability(bookingForm.serviceId, bookingForm.bookingDate);
      const isSlotAvailable = availabilityCheck.availableSlots?.some(
        slot => slot.startTime === bookingForm.startTime && slot.isAvailable
      );

      if (!isSlotAvailable) {
        throw new Error("Dieser Zeitslot ist nicht mehr verfügbar. Bitte wählen Sie einen anderen Termin.");
      }

      const booking = await createManualBooking(bookingForm);
      setCreatedBooking(booking);
      setSuccess(true);
      
      // Reload events to show new booking
      await loadEvents();
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setCreatedBooking(null);
        setIsManualBookingModalOpen(false);
        setSelectedSlot(null);
        setBookingForm({
          serviceId: '',
          bookingDate: moment().format('YYYY-MM-DD'),
          startTime: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          customerNotes: ''
        });
        setAvailableSlots([]);
      }, 3000);
    } catch (error: any) {
      console.error("Error creating booking:", error);
      setError(error.message || "Fehler beim Erstellen der Buchung");
    } finally {
      setSubmitting(false);
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    if (event.type === 'blocked') {
      return {
        style: {
          backgroundColor: '#6b7280',
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)',
          borderRadius: "4px",
          opacity: 0.8,
          color: "white",
          border: "2px dashed #9ca3af",
          display: "block"
        }
      };
    } else {
      const status = event.status as keyof typeof statusColors;
      const backgroundColor = statusColors[status] || "#3b82f6";
      
      return {
        style: {
          backgroundColor,
          borderRadius: "4px",
          opacity: 0.9,
          color: "white",
          border: "none",
          display: "block",
          fontWeight: 500,
          fontSize: '0.85rem'
        }
      };
    }
  };

  const filteredEvents = filterStatus === "all" 
    ? events 
    : filterStatus === "blocked"
    ? events.filter(event => event.type === 'blocked')
    : events.filter(event => event.type === 'booking' && event.status === filterStatus);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsBookingModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    
    // Pre-fill the manual booking form with selected date
    setBookingForm({
      ...bookingForm,
      bookingDate: moment(slotInfo.start).format('YYYY-MM-DD'),
      startTime: '',
      serviceId: '' // Reset service selection
    });
    
    // Reset available slots for new date
    setAvailableSlots([]);
    
    // Open the manual booking modal
    setIsManualBookingModalOpen(true);
  };

  const handleOpenManualBooking = () => {
    setSelectedSlot(null);
    setBookingForm({
      ...bookingForm,
      bookingDate: moment().format('YYYY-MM-DD'),
      startTime: '',
      serviceId: ''
    });
    setAvailableSlots([]);
    setIsManualBookingModalOpen(true);
  };

  const selectedService = services.find(s => s.id === bookingForm.serviceId);

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="text-[#E8C7C3]" />
          <p className="mt-4 text-[#8A8A8A]">Kalender wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-2">
              Kalender
            </h1>
            <p className="text-[#8A8A8A] flex items-center gap-2">
              <CalendarDays size={18} />
              Verwalten Sie Termine und blockierte Zeiten
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              color="primary"
              className="bg-[#E8C7C3] text-white"
              startContent={<Plus size={18} />}
              onPress={handleOpenManualBooking}
            >
              Buchung tätigen
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4 border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                label="Filter"
                placeholder="Alle anzeigen"
                className="max-w-xs"
                selectedKeys={filterStatus ? [filterStatus] : []}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <SelectItem key="all" value="all">Alle Termine</SelectItem>
                <SelectItem key="blocked" value="blocked">Blockierte Zeiten</SelectItem>
                <SelectItem key="Confirmed" value="Confirmed">Bestätigt</SelectItem>
                <SelectItem key="Pending" value="Pending">Ausstehend</SelectItem>
                <SelectItem key="Completed" value="Completed">Abgeschlossen</SelectItem>
                <SelectItem key="Cancelled" value="Cancelled">Storniert</SelectItem>
                <SelectItem key="NoShow" value="NoShow">Nicht erschienen</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Calendar Card */}
        <Card className="border-2 border-[#E8C7C3]/20 shadow-xl overflow-hidden">
          <CardBody className="p-0">
            <div className="h-[600px] lg:h-[700px]">
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                defaultView={Views.MONTH}
                view={view}
                onView={(newView) => setView(newView as typeof view)}
                date={date}
                onNavigate={setDate}
                messages={{
                  next: "Nächster",
                  previous: "Vorheriger",
                  today: "Heute",
                  month: "Monat",
                  week: "Woche",
                  day: "Tag",
                  agenda: "Liste",
                  date: "Datum",
                  time: "Zeit",
                  event: "Termin",
                  noEventsInRange: "Keine Termine in diesem Zeitraum"
                }}
                formats={{
                  dateFormat: 'DD',
                  dayFormat: 'ddd DD.MM',
                  dayHeaderFormat: 'dddd DD.MM.YYYY',
                  dayRangeHeaderFormat: ({ start, end }) => 
                    `${moment(start).format('DD.MM.YYYY')} - ${moment(end).format('DD.MM.YYYY')}`,
                  monthHeaderFormat: 'MMMM YYYY',
                  agendaHeaderFormat: ({ start, end }) => 
                    `${moment(start).format('DD.MM.YYYY')} - ${moment(end).format('DD.MM.YYYY')}`
                }}
                culture="de"
                tooltipAccessor={(event) => {
                  if (event.type === 'blocked') {
                    return `Blockiert: ${event.resource.reason || 'Kein Grund'}`;
                  }
                  return `${event.resource.customerName} - ${event.resource.serviceName}`;
                }}
              />
            </div>
          </CardBody>
        </Card>

        {/* Legend */}
        <Card className="mt-4 border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {Object.entries(statusLabels).map(([status, label]) => {
                const Icon = statusIcons[status as keyof typeof statusIcons];
                return (
                  <div key={status} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                    />
                    <span className="text-[#1E1E1E] flex items-center gap-1">
                      {Icon && <Icon size={14} className="text-[#8A8A8A]" />}
                      {label}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#6b7280]" 
                     style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)' }} />
                <span className="text-[#1E1E1E] flex items-center gap-1">
                  <Ban size={14} className="text-[#8A8A8A]" />
                  Blockierte Zeit
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Booking Details Modal - Improved Design */}
        <Modal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)}
          size="2xl"
          scrollBehavior="inside"
          classNames={{
            base: "bg-gradient-to-br from-white to-[#F5EDEB]",
            header: "border-b border-[#E8C7C3]/20",
            footer: "border-t border-[#E8C7C3]/20"
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedEvent?.type === 'booking' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            icon={<User size={20} />}
                            className="bg-[#E8C7C3] text-white"
                          />
                          <div>
                            <h2 className="text-xl font-bold text-[#1E1E1E]">
                              Termindetails
                            </h2>
                            <p className="text-sm text-[#8A8A8A] flex items-center gap-1">
                              <Hash size={14} />
                              {selectedEvent?.resource.bookingNumber}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          content=""
                          style={{
                            backgroundColor: statusColors[selectedEvent?.status as keyof typeof statusColors]
                          }}
                          className="text-white px-3 py-1 rounded-full text-sm"
                        >
                          {statusLabels[selectedEvent?.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Avatar 
                        icon={<Ban size={20} />}
                        className="bg-[#6b7280] text-white"
                      />
                      <div>
                        <h2 className="text-xl font-bold text-[#1E1E1E]">
                          Blockierte Zeit
                        </h2>
                      </div>
                    </div>
                  )}
                </ModalHeader>
                <ModalBody>
                  {selectedEvent?.type === 'booking' ? (
                    <div className="space-y-6 py-4">
                      {/* Service Card */}
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C7C3]/20">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-[#F5EDEB] rounded-lg">
                            <Scissors size={18} className="text-[#E8C7C3]" />
                          </div>
                          <h3 className="font-semibold text-[#1E1E1E]">Service</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-[#1E1E1E]">{selectedEvent.resource.serviceName}</p>
                              <p className="text-sm text-[#8A8A8A] flex items-center gap-1 mt-1">
                                <Clock size={14} />
                                {moment(selectedEvent.start).format('DD.MM.YYYY')} •{' '}
                                {moment(selectedEvent.start).format('HH:mm')} - {moment(selectedEvent.end).format('HH:mm')} Uhr
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#E8C7C3]">
                                {selectedEvent.resource.price.toFixed(2)} CHF
                              </p>
                              <p className="text-xs text-[#8A8A8A] flex items-center gap-1 justify-end mt-1">
                                <CreditCard size={12} />
                                inkl. MwSt
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer Card */}
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C7C3]/20">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-[#F5EDEB] rounded-lg">
                            <User size={18} className="text-[#E8C7C3]" />
                          </div>
                          <h3 className="font-semibold text-[#1E1E1E]">Kunde</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-[#F5EDEB] rounded-lg">
                            <Avatar 
                              name={selectedEvent.resource.customerName}
                              className="bg-[#E8C7C3] text-white"
                              size="sm"
                            />
                            <div>
                              <p className="font-medium text-[#1E1E1E]">{selectedEvent.resource.customerName}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <a href={`mailto:${selectedEvent.resource.customerEmail}`} 
                               className="flex items-center gap-2 p-3 bg-[#F5EDEB] rounded-lg hover:bg-[#E8C7C3]/10 transition-colors">
                              <Mail size={16} className="text-[#E8C7C3]" />
                              <span className="text-sm text-[#1E1E1E] truncate">{selectedEvent.resource.customerEmail}</span>
                            </a>
                            <a href={`tel:${selectedEvent.resource.customerPhone}`} 
                               className="flex items-center gap-2 p-3 bg-[#F5EDEB] rounded-lg hover:bg-[#E8C7C3]/10 transition-colors">
                              <Phone size={16} className="text-[#E8C7C3]" />
                              <span className="text-sm text-[#1E1E1E]">{selectedEvent.resource.customerPhone}</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {selectedEvent.resource.customerNotes && (
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C7C3]/20">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-[#F5EDEB] rounded-lg">
                              <MessageCircle size={18} className="text-[#E8C7C3]" />
                            </div>
                            <h3 className="font-semibold text-[#1E1E1E]">Notizen</h3>
                          </div>
                          <div className="bg-[#F5EDEB] p-4 rounded-lg italic text-[#1E1E1E]">
                            "{selectedEvent.resource.customerNotes}"
                          </div>
                        </div>
                      )}

                      {/* Status Update */}
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C7C3]/20">
                        <h3 className="font-semibold text-[#1E1E1E] mb-4">Status aktualisieren</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            style={{ backgroundColor: statusColors.Confirmed }}
                            className="text-white"
                            onPress={() => handleStatusUpdate("Confirmed")}
                            isLoading={updating}
                            isDisabled={selectedEvent.resource.status === "Confirmed"}
                            startContent={<CheckCircle size={16} />}
                          >
                            Bestätigt
                          </Button>
                          <Button
                            size="sm"
                            style={{ backgroundColor: statusColors.Completed }}
                            className="text-white"
                            onPress={() => handleStatusUpdate("Completed")}
                            isLoading={updating}
                            isDisabled={selectedEvent.resource.status === "Completed"}
                            startContent={<CheckCircle size={16} />}
                          >
                            Abgeschlossen
                          </Button>
                          <Button
                            size="sm"
                            style={{ backgroundColor: statusColors.Cancelled }}
                            className="text-white"
                            onPress={() => handleStatusUpdate("Cancelled")}
                            isLoading={updating}
                            isDisabled={selectedEvent.resource.status === "Cancelled"}
                            startContent={<XCircle size={16} />}
                          >
                            Stornieren
                          </Button>
                          <Button
                            size="sm"
                            style={{ backgroundColor: statusColors.NoShow }}
                            className="text-white"
                            onPress={() => handleStatusUpdate("NoShow")}
                            isLoading={updating}
                            isDisabled={selectedEvent.resource.status === "NoShow"}
                            startContent={<XCircle size={16} />}
                          >
                            Nicht erschienen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 py-4">
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C7C3]/20">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-[#6b7280]/10 rounded-lg">
                            <Ban size={18} className="text-[#6b7280]" />
                          </div>
                          <h3 className="font-semibold text-[#1E1E1E]">Blockierter Zeitraum</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 p-3 bg-[#F5EDEB] rounded-lg">
                            <Clock size={16} className="text-[#6b7280]" />
                            <span>
                              {moment(selectedEvent?.start).format('DD.MM.YYYY')} •{' '}
                              {moment(selectedEvent?.start).format('HH:mm')} - {moment(selectedEvent?.end).format('HH:mm')} Uhr
                            </span>
                          </div>
                          
                          {selectedEvent?.resource.reason && (
                            <div className="p-3 bg-[#F5EDEB] rounded-lg">
                              <p className="text-sm font-medium text-[#1E1E1E] mb-1">Grund:</p>
                              <p className="text-[#8A8A8A]">{selectedEvent.resource.reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button 
                    color="danger" 
                    variant="light" 
                    onPress={onClose}
                  >
                    Schließen
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Manual Booking Modal - Keep existing but improve styling */}
        <Modal 
          isOpen={isManualBookingModalOpen} 
          onClose={() => {
            setIsManualBookingModalOpen(false);
            setError(null);
            setSuccess(false);
            setCreatedBooking(null);
            setSelectedSlot(null);
          }}
          size="2xl"
          scrollBehavior="inside"
          classNames={{
            base: "bg-gradient-to-br from-white to-[#F5EDEB]",
            header: "border-b border-[#E8C7C3]/20",
            footer: "border-t border-[#E8C7C3]/20"
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <div className="flex items-center gap-3">
                    <Avatar 
                      icon={<Plus size={20} />}
                      className="bg-[#E8C7C3] text-white"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-[#1E1E1E]">
                        Manuelle Buchung erstellen
                      </h2>
                      {selectedSlot && (
                        <p className="text-sm text-[#8A8A8A] flex items-center gap-1">
                          <CalendarIcon size={14} />
                          {moment(selectedSlot.start).format('DD.MM.YYYY')}
                        </p>
                      )}
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  {success && createdBooking ? (
                    <Card className="border-2 border-green-500/20 bg-green-50">
                      <CardBody className="p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="text-green-500 shrink-0" size={24} />
                          <div>
                            <h3 className="font-semibold text-green-700 mb-1">
                              Buchung erfolgreich erstellt!
                            </h3>
                            <p className="text-green-600 text-sm mb-2">
                              Buchungsnummer: {createdBooking.bookingNumber}
                            </p>
                            <div className="bg-white p-3 rounded-lg text-sm">
                              <p><strong>Service:</strong> {createdBooking.booking.serviceName}</p>
                              <p><strong>Datum:</strong> {createdBooking.booking.bookingDate}</p>
                              <p><strong>Uhrzeit:</strong> {createdBooking.booking.startTime} - {createdBooking.booking.endTime}</p>
                              <p><strong>Kunde:</strong> {createdBooking.customer.firstName} {createdBooking.customer.lastName}</p>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ) : (
                    <div className="space-y-6 py-4">
                      {error && (
                        <Card className="border-2 border-red-500/20 bg-red-50">
                          <CardBody className="p-4">
                            <p className="text-red-600">{error}</p>
                          </CardBody>
                        </Card>
                      )}

                      <div className="space-y-4">
                        {/* Service Selection */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C7C3]/20">
                          <h3 className="font-semibold text-[#1E1E1E] mb-4">1. Service auswählen</h3>
                          <Select
                            placeholder="Service auswählen"
                            selectedKeys={bookingForm.serviceId ? [bookingForm.serviceId] : []}
                            onChange={(e) => setBookingForm({ ...bookingForm, serviceId: e.target.value })}
                            isRequired
                            isDisabled={submitting}
                            className="max-w-full"
                          >
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} - {service.price.toFixed(2)} CHF ({service.durationMinutes} Min)
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        {/* Date Selection */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C7C3]/20">
                          <h3 className="font-semibold text-[#1E1E1E] mb-4">2. Datum wählen</h3>
                          <Input
                            type="date"
                            value={bookingForm.bookingDate}
                            min={moment().format('YYYY-MM-DD')}
                            max={moment().add(60, 'days').format('YYYY-MM-DD')}
                            onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                            isRequired
                            isDisabled={submitting}
                            startContent={<CalendarIcon size={18} className="text-[#E8C7C3]" />}
                          />
                        </div>

                        {/* Time Selection */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C7C3]/20">
                          <h3 className="font-semibold text-[#1E1E1E] mb-4">3. Uhrzeit wählen</h3>
                          {loadingSlots ? (
                            <div className="flex items-center gap-2 p-4 bg-[#F5EDEB] rounded-lg">
                              <Spinner size="sm" className="text-[#E8C7C3]" />
                              <span className="text-sm text-[#8A8A8A]">Verfügbare Zeiten werden geladen...</span>
                            </div>
                          ) : availableSlots.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2">
                              {availableSlots.map((slot) => (
                                <Button
                                  key={slot.startTime}
                                  size="sm"
                                  className={`
                                    ${bookingForm.startTime === slot.startTime
                                      ? 'bg-[#E8C7C3] text-white'
                                      : 'bg-white border-2 border-[#E8C7C3] text-[#1E1E1E] hover:bg-[#F5EDEB]'
                                    }
                                  `}
                                  onPress={() => setBookingForm({ ...bookingForm, startTime: slot.startTime })}
                                  isDisabled={submitting}
                                >
                                  {slot.startTime}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 bg-[#F5EDEB] rounded-lg text-center">
                              <p className="text-[#8A8A8A] text-sm">
                                {bookingForm.serviceId 
                                  ? "Keine verfügbaren Zeiten an diesem Tag" 
                                  : "Bitte zuerst Service und Datum auswählen"}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8C7C3]/20">
                          <h3 className="font-semibold text-[#1E1E1E] mb-4">4. Kundendaten</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Vorname"
                              placeholder="Max"
                              value={bookingForm.firstName}
                              onChange={(e) => setBookingForm({ ...bookingForm, firstName: e.target.value })}
                              isRequired
                              isDisabled={submitting}
                              startContent={<User size={18} className="text-[#E8C7C3]" />}
                            />

                            <Input
                              label="Nachname"
                              placeholder="Mustermann"
                              value={bookingForm.lastName}
                              onChange={(e) => setBookingForm({ ...bookingForm, lastName: e.target.value })}
                              isRequired
                              isDisabled={submitting}
                              startContent={<User size={18} className="text-[#E8C7C3]" />}
                            />

                            <Input
                              label="E-Mail (optional)"
                              type="email"
                              placeholder="max@example.com"
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              isDisabled={submitting}
                              startContent={<Mail size={18} className="text-[#E8C7C3]" />}
                            />

                            <Input
                              label="Telefon (optional)"
                              type="tel"
                              placeholder="+41 123 456 789"
                              value={bookingForm.phone}
                              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                              isDisabled={submitting}
                              startContent={<Phone size={18} className="text-[#E8C7C3]" />}
                            />
                          </div>

                          {/* Notes */}
                          <div className="mt-4">
                            <Textarea
                              label="Notizen (optional)"
                              placeholder="Besondere Wünsche oder Anmerkungen des Kunden..."
                              value={bookingForm.customerNotes}
                              onChange={(e) => setBookingForm({ ...bookingForm, customerNotes: e.target.value })}
                              isDisabled={submitting}
                            />
                          </div>
                        </div>

                        {/* Service Summary */}
                        {selectedService && (
                          <div className="bg-[#F5EDEB] p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg">
                                <Scissors size={18} className="text-[#E8C7C3]" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#1E1E1E]">{selectedService.name}</p>
                                <p className="text-xs text-[#8A8A8A]">{selectedService.durationMinutes} Minuten</p>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-[#E8C7C3]">
                              {selectedService.price.toFixed(2)} CHF
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button 
                    color="danger" 
                    variant="light" 
                    onPress={onClose}
                    isDisabled={submitting}
                  >
                    {success ? "Schließen" : "Abbrechen"}
                  </Button>
                  {!success && !createdBooking && (
                    <Button 
                      color="primary" 
                      className="bg-[#E8C7C3] text-white"
                      onPress={handleCreateManualBooking}
                      isLoading={submitting}
                      isDisabled={!bookingForm.serviceId || !bookingForm.bookingDate || !bookingForm.startTime || !bookingForm.firstName || !bookingForm.lastName}
                      endContent={<ChevronRight size={18} />}
                    >
                      Buchung erstellen
                    </Button>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
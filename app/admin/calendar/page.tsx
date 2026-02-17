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
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Ban,
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import { 
  getBookings, 
  getBlockedSlots, 
  createBlockedSlot, 
  createBlockedDateRange,
  deleteBlockedSlot,
  updateBookingStatus,
  type BookingListItem,
  type BlockedTimeSlot,
  type CreateBlockedSlot,
  type CreateBlockedDateRange
} from "@/lib/api/admin";

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
  Confirmed: "#27ae60",
  Pending: "#f39c12",
  Completed: "#3498db",
  Cancelled: "#e74c3c",
  NoShow: "#95a5a6"
};

const statusLabels = {
  Confirmed: "Bestätigt",
  Pending: "Ausstehend",
  Completed: "Abgeschlossen",
  Cancelled: "Storniert",
  NoShow: "Nicht erschienen"
};

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updating, setUpdating] = useState(false);

  // Blocked slot form state
  const [blockForm, setBlockForm] = useState<CreateBlockedSlot>({
    blockDate: moment().format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '17:00',
    reason: ''
  });

  // Date range form state
  const [rangeForm, setRangeForm] = useState<CreateBlockedDateRange>({
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment().add(7, 'days').format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '17:00',
    reason: ''
  });

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
        title: `🚫 Blockiert: ${slot.reason || 'Kein Grund'}`,
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

  const handleCreateBlockedSlot = async () => {
    try {
      setUpdating(true);
      await createBlockedSlot(blockForm);
      await loadEvents();
      setIsBlockModalOpen(false);
      setBlockForm({
        blockDate: moment().format('YYYY-MM-DD'),
        startTime: '09:00',
        endTime: '17:00',
        reason: ''
      });
    } catch (error) {
      console.error("Error creating blocked slot:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateDateRange = async () => {
    try {
      setUpdating(true);
      await createBlockedDateRange(rangeForm);
      await loadEvents();
      setIsDateRangeModalOpen(false);
      setRangeForm({
        fromDate: moment().format('YYYY-MM-DD'),
        toDate: moment().add(7, 'days').format('YYYY-MM-DD'),
        startTime: '09:00',
        endTime: '17:00',
        reason: ''
      });
    } catch (error) {
      console.error("Error creating date range:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteBlockedSlot = async () => {
    if (!selectedEvent || selectedEvent.type !== 'blocked') return;
    
    try {
      setUpdating(true);
      await deleteBlockedSlot(selectedEvent.resource.id);
      await loadEvents();
      setIsBookingModalOpen(false);
    } catch (error) {
      console.error("Error deleting blocked slot:", error);
    } finally {
      setUpdating(false);
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    if (event.type === 'booking') {
      const status = event.status as keyof typeof statusColors;
      const backgroundColor = statusColors[status] || "#3498db";
      
      return {
        style: {
          backgroundColor,
          borderRadius: "4px",
          opacity: 0.8,
          color: "white",
          border: "none",
          display: "block"
        }
      };
    } else {
      return {
        style: {
          backgroundColor: "#7f8c8d",
          borderRadius: "4px",
          opacity: 0.6,
          color: "white",
          border: "2px dashed #95a5a6",
          display: "block"
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
    if (event.type === 'booking') {
      setIsBookingModalOpen(true);
    } else {
      setIsBookingModalOpen(true); // Reuse same modal for blocked slots
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setBlockForm({
      blockDate: moment(slotInfo.start).format('YYYY-MM-DD'),
      startTime: moment(slotInfo.start).format('HH:mm'),
      endTime: moment(slotInfo.end).format('HH:mm'),
      reason: ''
    });
    setIsBlockModalOpen(true);
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white flex items-center justify-center">
        <Spinner size="lg" className="text-[#E8C7C3]" />
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
            <p className="text-[#8A8A8A]">
              Verwalten Sie Ihre Termine und blockierte Zeiten
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              color="primary"
              className="bg-[#E8C7C3] text-white"
              startContent={<Ban size={18} />}
              onPress={() => setIsBlockModalOpen(true)}
            >
              Zeit blockieren
            </Button>
            <Button
              color="primary"
              className="bg-[#D8B0AC] text-white"
              startContent={<CalendarIcon size={18} />}
              onPress={() => setIsDateRangeModalOpen(true)}
            >
              Zeitraum blockieren
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
        <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-4">
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
              />
            </div>
          </CardBody>
        </Card>

        {/* Legend */}
        <Card className="mt-4 border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {Object.entries(statusLabels).map(([status, label]) => (
                <div key={status} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                  />
                  <span className="text-[#1E1E1E]">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#7f8c8d] border-2 border-dashed border-[#95a5a6]" />
                <span className="text-[#1E1E1E]">Blockierte Zeit</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Booking Details Modal */}
        <Modal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedEvent?.type === 'booking' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Termindetails</h2>
                        <Chip
                          style={{
                            backgroundColor: statusColors[selectedEvent?.status as keyof typeof statusColors],
                            color: "white"
                          }}
                        >
                          {statusLabels[selectedEvent?.status as keyof typeof statusLabels]}
                        </Chip>
                      </div>
                      <p className="text-sm text-[#8A8A8A]">
                        Buchungsnummer: {selectedEvent?.resource.bookingNumber}
                      </p>
                    </>
                  ) : (
                    <h2 className="text-xl font-bold">Blockierte Zeit</h2>
                  )}
                </ModalHeader>
                <ModalBody>
                  {selectedEvent?.type === 'booking' ? (
                    <div className="space-y-6">
                      {/* Booking details */}
                      <div className="bg-[#F5EDEB] p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 text-lg">Service</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[#E8C7C3]" />
                            <span>
                              {moment(selectedEvent.start).format('DD.MM.YYYY')} • {' '}
                              {moment(selectedEvent.start).format('HH:mm')} - {' '}
                              {moment(selectedEvent.end).format('HH:mm')} Uhr
                            </span>
                          </div>
                          <div className="font-medium text-lg">
                            {selectedEvent.resource.serviceName}
                          </div>
                          <div className="text-xl font-bold text-[#E8C7C3]">
                            {selectedEvent.resource.price.toFixed(2)} CHF
                          </div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="bg-[#F5EDEB] p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 text-lg">Kunde</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-[#E8C7C3]" />
                            <span>{selectedEvent.resource.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-[#E8C7C3]" />
                            <a href={`mailto:${selectedEvent.resource.customerEmail}`} className="text-blue-600 hover:underline">
                              {selectedEvent.resource.customerEmail}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-[#E8C7C3]" />
                            <a href={`tel:${selectedEvent.resource.customerPhone}`} className="text-blue-600 hover:underline">
                              {selectedEvent.resource.customerPhone}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {selectedEvent.resource.customerNotes && (
                        <div className="bg-[#F5EDEB] p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Notizen</h3>
                          <p className="text-[#8A8A8A]">{selectedEvent.resource.customerNotes}</p>
                        </div>
                      )}

                      {/* Status Update */}
                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Status aktualisieren</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            style={{ backgroundColor: statusColors.Confirmed }}
                            className="text-white"
                            onPress={() => handleStatusUpdate("Confirmed")}
                            isLoading={updating}
                            isDisabled={selectedEvent.resource.status === "Confirmed"}
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
                          >
                            Nicht erschienen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-[#F5EDEB] p-4 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[#E8C7C3]" />
                            <span>
                              {moment(selectedEvent?.start).format('DD.MM.YYYY')} • {' '}
                              {moment(selectedEvent?.start).format('HH:mm')} - {' '}
                              {moment(selectedEvent?.end).format('HH:mm')} Uhr
                            </span>
                          </div>
                          {selectedEvent?.resource.reason && (
                            <div className="flex items-start gap-2">
                              <AlertCircle size={16} className="text-[#E8C7C3] mt-1" />
                              <span>{selectedEvent.resource.reason}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        color="danger"
                        startContent={<Trash2 size={18} />}
                        onPress={handleDeleteBlockedSlot}
                        isLoading={updating}
                        className="w-full"
                      >
                        Blockierte Zeit entfernen
                      </Button>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Schließen
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Block Single Slot Modal */}
        <Modal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h2 className="text-xl font-bold">Zeit blockieren</h2>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <Input
                      type="date"
                      label="Datum"
                      value={blockForm.blockDate}
                      onChange={(e) => setBlockForm({ ...blockForm, blockDate: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        label="Startzeit"
                        value={blockForm.startTime}
                        onChange={(e) => setBlockForm({ ...blockForm, startTime: e.target.value })}
                      />
                      <Input
                        type="time"
                        label="Endzeit"
                        value={blockForm.endTime}
                        onChange={(e) => setBlockForm({ ...blockForm, endTime: e.target.value })}
                      />
                    </div>
                    <Textarea
                      label="Grund (optional)"
                      placeholder="Warum wird diese Zeit blockiert?"
                      value={blockForm.reason}
                      onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Abbrechen
                  </Button>
                  <Button 
                    color="primary" 
                    className="bg-[#E8C7C3] text-white"
                    onPress={handleCreateBlockedSlot}
                    isLoading={updating}
                  >
                    Blockieren
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Block Date Range Modal */}
        <Modal isOpen={isDateRangeModalOpen} onClose={() => setIsDateRangeModalOpen(false)} size="lg">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h2 className="text-xl font-bold">Zeitraum blockieren</h2>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        label="Von"
                        value={rangeForm.fromDate}
                        onChange={(e) => setRangeForm({ ...rangeForm, fromDate: e.target.value })}
                      />
                      <Input
                        type="date"
                        label="Bis"
                        value={rangeForm.toDate}
                        onChange={(e) => setRangeForm({ ...rangeForm, toDate: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        label="Startzeit"
                        value={rangeForm.startTime}
                        onChange={(e) => setRangeForm({ ...rangeForm, startTime: e.target.value })}
                      />
                      <Input
                        type="time"
                        label="Endzeit"
                        value={rangeForm.endTime}
                        onChange={(e) => setRangeForm({ ...rangeForm, endTime: e.target.value })}
                      />
                    </div>
                    <Textarea
                      label="Grund (optional)"
                      placeholder="Warum wird dieser Zeitraum blockiert?"
                      value={rangeForm.reason}
                      onChange={(e) => setRangeForm({ ...rangeForm, reason: e.target.value })}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Abbrechen
                  </Button>
                  <Button 
                    color="primary" 
                    className="bg-[#E8C7C3] text-white"
                    onPress={handleCreateDateRange}
                    isLoading={updating}
                  >
                    Zeitraum blockieren
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
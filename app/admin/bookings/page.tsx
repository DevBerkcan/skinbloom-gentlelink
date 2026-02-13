// app/admin/bookings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Chip } from "@nextui-org/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Textarea } from "@nextui-org/input";
import { Search, ChevronLeft, ChevronRight, Edit, Filter, X, Calendar } from "lucide-react";
import { getBookings, updateBookingStatus, type BookingListItem, type BookingFilter } from "@/lib/api/admin";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<BookingFilter>({
    page: 1,
    pageSize: 20,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState<BookingListItem | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [filter]);

  async function loadBookings() {
    setLoading(true);
    try {
      const response = await getBookings(filter);
      setBookings(response.items);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(key: keyof BookingFilter, value: string) {
    setFilter((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  }

  function handlePageChange(newPage: number) {
    setFilter((prev) => ({ ...prev, page: newPage }));
  }

  function openStatusModal(booking: BookingListItem) {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setAdminNotes("");
    onOpen();
  }

  async function handleStatusUpdate() {
    if (!selectedBooking) return;

    setUpdating(true);
    try {
      await updateBookingStatus(selectedBooking.id, {
        status: newStatus,
        adminNotes: adminNotes || undefined,
      });

      await loadBookings();
      onClose();
    } catch (err: any) {
      alert("Fehler beim Aktualisieren: " + err.message);
    } finally {
      setUpdating(false);
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

  const statusOptions = [
    { value: "", label: "Alle Status" },
    { value: "Pending", label: "Ausstehend" },
    { value: "Confirmed", label: "Bestätigt" },
    { value: "Completed", label: "Abgeschlossen" },
    { value: "Cancelled", label: "Storniert" },
    { value: "NoShow", label: "Nicht erschienen" },
  ];

  // Mobile Booking Card
  const MobileBookingCard = ({ booking }: { booking: BookingListItem }) => (
    <div className="bg-white border-2 border-[#E8C7C3]/20 rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-mono text-sm font-semibold text-[#1E1E1E]">{booking.bookingNumber}</div>
          <div className="text-xs text-[#8A8A8A]">
            {new Date(booking.createdAt).toLocaleDateString('de-DE')}
          </div>
        </div>
        <Chip color={getStatusColor(booking.status)} size="sm" variant="flat">
          {getStatusLabel(booking.status)}
        </Chip>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#1E1E1E]">
            {new Date(booking.bookingDate).toLocaleDateString('de-DE')}
          </span>
          <span className="text-sm text-[#8A8A8A]">
            {booking.startTime} - {booking.endTime}
          </span>
        </div>
        
        <div>
          <div className="font-semibold text-[#1E1E1E]">{booking.customerName}</div>
          <div className="text-sm text-[#8A8A8A] break-all">{booking.customerEmail}</div>
          <div className="text-sm text-[#8A8A8A]">{booking.customerPhone}</div>
        </div>

        <div>
          <div className="text-[#1E1E1E]">{booking.serviceName}</div>
          {booking.customerNotes && (
            <div className="text-xs text-[#8A8A8A] mt-1 bg-[#F5EDEB] p-2 rounded">
              💬 {booking.customerNotes}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#E8C7C3]/20">
        <div className="font-bold text-[#E8C7C3]">{booking.price.toFixed(2)} CHF</div>
        <Button
          size="sm"
          className="bg-[#E8C7C3]/20 text-[#1E1E1E] hover:bg-[#E8C7C3] hover:text-white"
          startContent={<Edit size={16} />}
          onPress={() => openStatusModal(booking)}
        >
          Status
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1E1E] mb-2">
            Buchungsverwaltung
          </h1>
          <p className="text-sm sm:text-base text-[#8A8A8A]">
            Alle Buchungen verwalten und Status aktualisieren
          </p>
        </div>

        {/* Filter Bar - Desktop */}
        <Card className="hidden md:block mb-6 border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <Input
                placeholder="Suchen..."
                startContent={<Search size={18} className="text-[#8A8A8A]" />}
                value={filter.searchTerm || ""}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                classNames={{
                  input: "text-[#1E1E1E]",
                  inputWrapper: "bg-white border-2 border-[#E8C7C3]/30 hover:border-[#E8C7C3]",
                }}
              />
              <Select
                label="Status"
                selectedKeys={filter.status ? [filter.status] : [""]}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                classNames={{
                  trigger: "bg-white border-2 border-[#E8C7C3]/30 hover:border-[#E8C7C3]",
                  label: "text-[#8A8A8A]",
                }}
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="date"
                label="Von Datum"
                value={filter.fromDate || ""}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                classNames={{
                  input: "text-[#1E1E1E]",
                  inputWrapper: "bg-white border-2 border-[#E8C7C3]/30 hover:border-[#E8C7C3]",
                  label: "text-[#8A8A8A]",
                }}
              />
              <Input
                type="date"
                label="Bis Datum"
                value={filter.toDate || ""}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                classNames={{
                  input: "text-[#1E1E1E]",
                  inputWrapper: "bg-white border-2 border-[#E8C7C3]/30 hover:border-[#E8C7C3]",
                  label: "text-[#8A8A8A]",
                }}
              />
            </div>
          </CardBody>
        </Card>

        {/* Mobile Filter Button & Filters */}
        <div className="md:hidden mb-4">
          <Button
            fullWidth
            className="bg-[#F5EDEB] text-[#1E1E1E] border-2 border-[#E8C7C3]/30"
            startContent={<Filter size={18} />}
            onPress={() => setShowMobileFilters(!showMobileFilters)}
          >
            Filter {showMobileFilters ? 'ausblenden' : 'anzeigen'}
          </Button>

          {showMobileFilters && (
            <Card className="mt-3 border-2 border-[#E8C7C3]/20">
              <CardBody className="p-4 space-y-4">
                <Input
                  placeholder="Suchen..."
                  startContent={<Search size={18} className="text-[#8A8A8A]" />}
                  value={filter.searchTerm || ""}
                  onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                  size="sm"
                />
                <Select
                  label="Status"
                  placeholder="Alle Status"
                  selectedKeys={filter.status ? [filter.status] : [""]}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  size="sm"
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  type="date"
                  label="Von Datum"
                  value={filter.fromDate || ""}
                  onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                  size="sm"
                />
                <Input
                  type="date"
                  label="Bis Datum"
                  value={filter.toDate || ""}
                  onChange={(e) => handleFilterChange("toDate", e.target.value)}
                  size="sm"
                />
                {(filter.searchTerm || filter.status || filter.fromDate || filter.toDate) && (
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    startContent={<X size={16} />}
                    onPress={() => {
                      setFilter({ page: 1, pageSize: 20 });
                      setShowMobileFilters(false);
                    }}
                  >
                    Filter zurücksetzen
                  </Button>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        {/* Bookings List */}
        <Card className="border-2 border-[#E8C7C3]/20 shadow-xl">
          <CardBody className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#E8C7C3]" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-[#8A8A8A]">
                <Calendar className="mx-auto mb-4 text-[#E8C7C3]" size={48} />
                <p className="text-lg">Keine Buchungen gefunden</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F5EDEB] border-b-2 border-[#E8C7C3]/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#1E1E1E]">Buchungsnr.</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#1E1E1E]">Datum & Zeit</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#1E1E1E]">Kunde</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#1E1E1E]">Service</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#1E1E1E]">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#1E1E1E]">Preis</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#1E1E1E]">Aktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => (
                        <tr
                          key={booking.id}
                          className={`border-b border-[#E8C7C3]/10 hover:bg-[#F5EDEB] transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-[#F5EDEB]/30"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="font-mono text-sm text-[#1E1E1E]">{booking.bookingNumber}</div>
                            <div className="text-xs text-[#8A8A8A]">
                              {new Date(booking.createdAt).toLocaleDateString('de-DE')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[#1E1E1E]">
                              {new Date(booking.bookingDate).toLocaleDateString('de-DE')}
                            </div>
                            <div className="text-sm text-[#8A8A8A]">
                              {booking.startTime} - {booking.endTime}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[#1E1E1E]">{booking.customerName}</div>
                            <div className="text-sm text-[#8A8A8A] break-all">{booking.customerEmail}</div>
                            <div className="text-sm text-[#8A8A8A]">{booking.customerPhone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-[#1E1E1E]">{booking.serviceName}</div>
                            {booking.customerNotes && (
                              <div className="text-xs text-[#8A8A8A] mt-1 max-w-xs truncate" title={booking.customerNotes}>
                                💬 {booking.customerNotes}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Chip color={getStatusColor(booking.status)} size="sm" variant="flat">
                              {getStatusLabel(booking.status)}
                            </Chip>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[#E8C7C3]">{booking.price.toFixed(2)} CHF</div>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              size="sm"
                              className="bg-[#E8C7C3]/20 text-[#1E1E1E] hover:bg-[#E8C7C3] hover:text-white"
                              variant="flat"
                              startContent={<Edit size={16} />}
                              onPress={() => openStatusModal(booking)}
                            >
                              Status
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4">
                  {bookings.map((booking) => (
                    <MobileBookingCard key={booking.id} booking={booking} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-[#E8C7C3]/20">
                    <div className="text-sm text-[#8A8A8A] order-2 sm:order-1">
                      Seite {currentPage} von {totalPages}
                    </div>
                    <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center">
                      <Button
                        size="sm"
                        variant="flat"
                        isDisabled={currentPage === 1}
                        onPress={() => handlePageChange(currentPage - 1)}
                        startContent={<ChevronLeft size={16} />}
                        className="bg-[#F5EDEB] text-[#1E1E1E] flex-1 sm:flex-none"
                      >
                        Zurück
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        isDisabled={currentPage === totalPages}
                        onPress={() => handlePageChange(currentPage + 1)}
                        endContent={<ChevronRight size={16} />}
                        className="bg-[#F5EDEB] text-[#1E1E1E] flex-1 sm:flex-none"
                      >
                        Weiter
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>

{/* Status Modal - Centered on All Devices */}
<Modal 
  isOpen={isOpen} 
  onClose={onClose} 
  size="md"
  backdrop="transparent"
  hideCloseButton={true}
  placement="center" // This centers the modal vertically and horizontally
  motionProps={{
    variants: {
      enter: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.2 },
      },
      exit: {
        y: 20,
        opacity: 0,
        transition: { duration: 0.1 },
      },
    }
  }}
  className="bg-white mx-4 sm:mx-auto" // Add horizontal margin on mobile
>
  <ModalContent className="bg-white border-2 border-[#E8C7C3]/30 shadow-2xl">
    <ModalHeader className="text-xl sm:text-2xl font-bold text-[#1E1E1E] border-b border-[#E8C7C3]/20 bg-white">
      <div className="flex items-center justify-between w-full">
        <span>Status aktualisieren</span>
        <Button
          isIconOnly
          variant="light"
          onPress={onClose}
          className="text-[#8A8A8A] hover:bg-[#F5EDEB] rounded-full"
          aria-label="Schließen"
        >
          <X size={20} />
        </Button>
      </div>
    </ModalHeader>
    <ModalBody className="py-6 bg-white">
      {selectedBooking && (
        <div className="space-y-4">
          <div className="bg-[#F5EDEB] p-4 rounded-lg border border-[#E8C7C3]/30">
            <div className="text-sm text-[#8A8A8A] mb-1">Buchung</div>
            <div className="font-semibold text-[#1E1E1E] break-words">{selectedBooking.bookingNumber}</div>
            <div className="text-sm text-[#8A8A8A] mt-2">
              {selectedBooking.customerName} • {selectedBooking.serviceName}
            </div>
            <div className="text-sm text-[#8A8A8A]">
              {new Date(selectedBooking.bookingDate).toLocaleDateString('de-DE')} • {selectedBooking.startTime}
            </div>
          </div>

          <Select
            label="Neuer Status"
            selectedKeys={[newStatus]}
            onChange={(e) => setNewStatus(e.target.value)}
            isRequired
            classNames={{
              trigger: "bg-white border-2 border-[#E8C7C3]/30 hover:border-[#E8C7C3]",
              label: "text-[#8A8A8A]",
            }}
          >
            <SelectItem key="Pending" value="Pending">Ausstehend</SelectItem>
            <SelectItem key="Confirmed" value="Confirmed">Bestätigt</SelectItem>
            <SelectItem key="Completed" value="Completed">Abgeschlossen</SelectItem>
            <SelectItem key="NoShow" value="NoShow">Nicht erschienen</SelectItem>
            <SelectItem key="Cancelled" value="Cancelled">Storniert</SelectItem>
          </Select>

          <Textarea
            label="Admin Notizen (optional)"
            placeholder="z.B. Telefonisch bestätigt, Kunde hat abgesagt..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            minRows={3}
            classNames={{
              inputWrapper: "bg-white border-2 border-[#E8C7C3]/30 hover:border-[#E8C7C3]",
            }}
          />
        </div>
      )}
    </ModalBody>
    <ModalFooter className="border-t border-[#E8C7C3]/20 bg-white">
      <div className="flex gap-2 w-full">
        <Button 
          color="default" 
          variant="flat" 
          onPress={onClose}
          className="bg-[#F5EDEB] text-[#1E1E1E] font-semibold flex-1"
        >
          Abbrechen
        </Button>
        <Button
          className="bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] text-white font-semibold flex-1"
          onPress={handleStatusUpdate}
          isLoading={updating}
          isDisabled={!newStatus}
        >
          Aktualisieren
        </Button>
      </div>
    </ModalFooter>
  </ModalContent>
</Modal>
    </div>
  );
}
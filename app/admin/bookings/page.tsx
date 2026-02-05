"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Chip } from "@nextui-org/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Textarea } from "@nextui-org/input";
import { Search, ChevronLeft, ChevronRight, Edit } from "lucide-react";
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
      page: 1, // Reset to first page on filter change
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

      // Reload bookings
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-barber-black mb-2">Buchungsverwaltung</h1>
          <p className="text-barber-grey-600">Alle Buchungen verwalten und Status aktualisieren</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Suchen..."
                startContent={<Search size={18} />}
                value={filter.searchTerm || ""}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                classNames={{
                  input: "text-barber-black",
                  inputWrapper: "bg-white",
                }}
              />

              <Select
                label="Status"
                selectedKeys={filter.status ? [filter.status] : [""]}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                classNames={{
                  trigger: "bg-white",
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
                  input: "text-barber-black",
                  inputWrapper: "bg-white",
                }}
              />

              <Input
                type="date"
                label="Bis Datum"
                value={filter.toDate || ""}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                classNames={{
                  input: "text-barber-black",
                  inputWrapper: "bg-white",
                }}
              />
            </div>
          </CardBody>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardBody className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-barber-red" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-barber-grey-600">
                Keine Buchungen gefunden
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-barber-cream border-b-2 border-barber-grey-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-barber-black">Buchungsnr.</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-barber-black">Datum & Zeit</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-barber-black">Kunde</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-barber-black">Service</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-barber-black">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-barber-black">Preis</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-barber-black">Aktion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => (
                        <tr
                          key={booking.id}
                          className={`border-b border-barber-grey-100 hover:bg-barber-cream/50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-barber-grey-50/30"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="font-mono text-sm text-barber-black">{booking.bookingNumber}</div>
                            <div className="text-xs text-barber-grey-500">
                              {new Date(booking.createdAt).toLocaleDateString('de-DE')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-barber-black">
                              {new Date(booking.bookingDate).toLocaleDateString('de-DE')}
                            </div>
                            <div className="text-sm text-barber-grey-600">
                              {booking.startTime} - {booking.endTime}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-barber-black">{booking.customerName}</div>
                            <div className="text-sm text-barber-grey-600">{booking.customerEmail}</div>
                            <div className="text-sm text-barber-grey-600">{booking.customerPhone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-barber-black">{booking.serviceName}</div>
                            {booking.customerNotes && (
                              <div className="text-xs text-barber-grey-500 mt-1 max-w-xs truncate">
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
                            <div className="font-semibold text-barber-black">{booking.price.toFixed(2)} €</div>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              size="sm"
                              color="primary"
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-barber-grey-200">
                    <div className="text-sm text-barber-grey-600">
                      Seite {currentPage} von {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        isDisabled={currentPage === 1}
                        onPress={() => handlePageChange(currentPage - 1)}
                        startContent={<ChevronLeft size={16} />}
                      >
                        Zurück
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        isDisabled={currentPage === totalPages}
                        onPress={() => handlePageChange(currentPage + 1)}
                        endContent={<ChevronRight size={16} />}
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

      {/* Status Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Status aktualisieren
          </ModalHeader>
          <ModalBody>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="bg-barber-cream p-4 rounded-lg">
                  <div className="text-sm text-barber-grey-600 mb-1">Buchung</div>
                  <div className="font-semibold text-barber-black">{selectedBooking.bookingNumber}</div>
                  <div className="text-sm text-barber-grey-700 mt-2">
                    {selectedBooking.customerName} • {selectedBooking.serviceName}
                  </div>
                  <div className="text-sm text-barber-grey-700">
                    {new Date(selectedBooking.bookingDate).toLocaleDateString('de-DE')} • {selectedBooking.startTime}
                  </div>
                </div>

                <Select
                  label="Neuer Status"
                  selectedKeys={[newStatus]}
                  onChange={(e) => setNewStatus(e.target.value)}
                  isRequired
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
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Abbrechen
            </Button>
            <Button
              color="primary"
              onPress={handleStatusUpdate}
              isLoading={updating}
              isDisabled={!newStatus}
            >
              Aktualisieren
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

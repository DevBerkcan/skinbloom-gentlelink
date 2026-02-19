// app/admin/bookings/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Chip } from "@nextui-org/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Textarea } from "@nextui-org/input";
import { Search, ChevronLeft, ChevronRight, Edit, Filter, X, Calendar, CheckCircle } from "lucide-react";
import { getBookings, updateBookingStatus, type BookingListItem, type BookingFilter } from "@/lib/api/admin";

const modalClassNames = {
  base: "bg-white border border-[#E8C7C3]/30 shadow-2xl",
  header: "border-b border-[#E8C7C3]/20 bg-gradient-to-r from-[#F5EDEB] to-white",
  footer: "border-t border-[#E8C7C3]/20",
  body: "py-5",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState<BookingFilter>({ page: 1, pageSize: 20 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState<BookingListItem | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => { loadBookings(); }, [filter]);

  async function loadBookings() {
    setLoading(true);
    try {
      const response = await getBookings(filter);
      setBookings(response.items);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  }

  const commitSearch = useCallback(() => {
    setFilter(prev => ({ ...prev, searchTerm: searchInput.trim() || undefined, page: 1 }));
  }, [searchInput]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitSearch();
  };

  function handleFilterChange(key: keyof BookingFilter, value: string) {
    setFilter(prev => ({ ...prev, [key]: value || undefined, page: 1 }));
  }

  function clearAllFilters() {
    setSearchInput("");
    setFilter({ page: 1, pageSize: 20 });
    setShowMobileFilters(false);
  }

  function handlePageChange(newPage: number) {
    setFilter(prev => ({ ...prev, page: newPage }));
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

  const hasActiveFilters = !!(filter.searchTerm || filter.status || filter.fromDate || filter.toDate);

  const inputClassNames = {
    input: "text-[#1E1E1E]",
    inputWrapper: "bg-white border border-[#E8C7C3]/40 hover:border-[#017172] data-[focus=true]:border-[#017172]",
    label: "text-[#8A8A8A]",
  };

  const MobileBookingCard = ({ booking }: { booking: BookingListItem }) => (
    <div className="bg-white border border-[#E8C7C3]/30 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-mono text-xs font-semibold text-[#8A8A8A]">{booking.bookingNumber}</div>
          <div className="font-semibold text-[#1E1E1E] mt-0.5">{booking.customerName}</div>
        </div>
        <Chip color={getStatusColor(booking.status)} size="sm" variant="flat">
          {getStatusLabel(booking.status)}
        </Chip>
      </div>
      <div className="text-sm text-[#8A8A8A] space-y-1 mb-3">
        <div>{new Date(booking.bookingDate).toLocaleDateString("de-DE")} · {booking.startTime} – {booking.endTime}</div>
        <div>{booking.serviceName}</div>
        {booking.customerEmail && <div className="break-all">{booking.customerEmail}</div>}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#E8C7C3]/20">
        <div className="font-bold text-[#017172]">{booking.price.toFixed(2)} CHF</div>
        <Button
          size="sm"
          className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold"
          startContent={<Edit size={13} />}
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

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E]">Buchungsverwaltung</h1>
            {totalCount > 0 && (
              <span className="bg-[#017172]/10 text-[#017172] text-sm font-semibold px-3 py-1 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          <p className="text-sm text-[#8A8A8A]">Buchungen suchen, filtern und Status aktualisieren</p>
        </div>

        {/* ── Desktop filter bar ─────────────────────────────────────────── */}
        <Card className="hidden md:block mb-6 border border-[#E8C7C3]/30 shadow-lg">
          <CardBody className="p-5">
            <div className="grid grid-cols-5 gap-3 items-end">
              <div className="col-span-2 flex gap-2">
                <Input
                  label="Suchen"
                  placeholder="Name, E-Mail, Telefon..."
                  startContent={<Search size={16} className="text-[#8A8A8A]" />}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  classNames={inputClassNames}
                />
                <Button
                  className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold self-end h-14 px-4"
                  onPress={commitSearch}
                >
                  <Search size={16} />
                </Button>
              </div>

              <Select
                label="Status"
                selectedKeys={filter.status ? [filter.status] : [""]}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                classNames={{
                  trigger: "bg-white border border-[#E8C7C3]/40 hover:border-[#017172]",
                  label: "text-[#8A8A8A]",
                }}
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </Select>

              <Input type="date" label="Von" value={filter.fromDate || ""}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)} classNames={inputClassNames} />
              <Input type="date" label="Bis" value={filter.toDate || ""}
                onChange={(e) => handleFilterChange("toDate", e.target.value)} classNames={inputClassNames} />
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8C7C3]/20">
                <span className="text-xs text-[#8A8A8A]">Aktive Filter:</span>
                {filter.searchTerm && (
                  <span className="text-xs bg-[#017172]/10 text-[#017172] px-2 py-0.5 rounded-full font-medium">
                    "{filter.searchTerm}"
                  </span>
                )}
                {filter.status && (
                  <span className="text-xs bg-[#017172]/10 text-[#017172] px-2 py-0.5 rounded-full font-medium">
                    {getStatusLabel(filter.status)}
                  </span>
                )}
                <Button size="sm" variant="flat" className="bg-red-50 text-red-500 text-xs ml-auto"
                  startContent={<X size={12} />} onPress={clearAllFilters}>
                  Filter zurücksetzen
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── Mobile filters ─────────────────────────────────────────────── */}
        <div className="md:hidden mb-4 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Suchen..."
              startContent={<Search size={16} className="text-[#8A8A8A]" />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              classNames={{ inputWrapper: "bg-white border border-[#E8C7C3]/40" }}
              className="flex-1"
            />
            <Button className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold" onPress={commitSearch}>
              <Search size={16} />
            </Button>
            <Button variant="flat" className="bg-[#F5EDEB] text-[#1E1E1E]"
              startContent={<Filter size={16} />} onPress={() => setShowMobileFilters(!showMobileFilters)}>
              Filter
            </Button>
          </div>

          {showMobileFilters && (
            <Card className="border border-[#E8C7C3]/30">
              <CardBody className="p-4 space-y-3">
                <Select label="Status" selectedKeys={filter.status ? [filter.status] : [""]}
                  onChange={(e) => handleFilterChange("status", e.target.value)} size="sm">
                  {statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </Select>
                <Input type="date" label="Von Datum" value={filter.fromDate || ""}
                  onChange={(e) => handleFilterChange("fromDate", e.target.value)} size="sm" />
                <Input type="date" label="Bis Datum" value={filter.toDate || ""}
                  onChange={(e) => handleFilterChange("toDate", e.target.value)} size="sm" />
                {hasActiveFilters && (
                  <Button size="sm" variant="flat" className="bg-red-50 text-red-500 w-full"
                    startContent={<X size={14} />} onPress={clearAllFilters}>
                    Alle Filter zurücksetzen
                  </Button>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        {/* ── Bookings table ─────────────────────────────────────────────── */}
        <Card className="border border-[#E8C7C3]/30 shadow-xl">
          <CardBody className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#017172]" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16 text-[#8A8A8A]">
                <Calendar className="mx-auto mb-4 text-[#E8C7C3]" size={40} />
                <p className="font-medium">Keine Buchungen gefunden</p>
                {hasActiveFilters && (
                  <Button size="sm" className="mt-3 bg-[#F5EDEB] text-[#1E1E1E]" onPress={clearAllFilters}>
                    Filter zurücksetzen
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F5EDEB] border-b border-[#E8C7C3]/30">
                      <tr>
                        {["Buchungsnr.", "Datum & Zeit", "Kunde", "Service", "Status", "Preis", "Aktion"].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-[#8A8A8A] uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8C7C3]/10">
                      {bookings.map((booking, index) => (
                        <tr key={booking.id}
                          className={`hover:bg-[#F5EDEB]/60 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EDEB]/20"}`}>
                          <td className="px-5 py-4">
                            <div className="font-mono text-xs text-[#8A8A8A]">{booking.bookingNumber}</div>
                            <div className="text-xs text-[#8A8A8A] mt-0.5">{new Date(booking.createdAt).toLocaleDateString("de-DE")}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-[#1E1E1E] text-sm">{new Date(booking.bookingDate).toLocaleDateString("de-DE")}</div>
                            <div className="text-xs text-[#8A8A8A]">{booking.startTime} – {booking.endTime}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-[#1E1E1E] text-sm">{booking.customerName}</div>
                            <div className="text-xs text-[#8A8A8A] break-all">{booking.customerEmail}</div>
                            <div className="text-xs text-[#8A8A8A]">{booking.customerPhone}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-sm text-[#1E1E1E]">{booking.serviceName}</div>
                            {booking.customerNotes && (
                              <div className="text-xs text-[#8A8A8A] mt-1 max-w-xs truncate">💬 {booking.customerNotes}</div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <Chip color={getStatusColor(booking.status)} size="sm" variant="flat">
                              {getStatusLabel(booking.status)}
                            </Chip>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-[#017172] text-sm">{booking.price.toFixed(2)} CHF</div>
                          </td>
                          <td className="px-5 py-4">
                            <Button size="sm"
                              className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold shadow-sm"
                              startContent={<Edit size={13} />}
                              onPress={() => openStatusModal(booking)}>
                              Status
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden p-4">
                  {bookings.map(b => <MobileBookingCard key={b.id} booking={b} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-[#E8C7C3]/20">
                    <div className="text-sm text-[#8A8A8A]">Seite {currentPage} von {totalPages}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="flat" isDisabled={currentPage === 1}
                        onPress={() => handlePageChange(currentPage - 1)}
                        startContent={<ChevronLeft size={15} />}
                        className="bg-[#F5EDEB] text-[#1E1E1E] font-semibold">
                        Zurück
                      </Button>
                      <Button size="sm" variant="flat" isDisabled={currentPage === totalPages}
                        onPress={() => handlePageChange(currentPage + 1)}
                        endContent={<ChevronRight size={15} />}
                        className="bg-[#F5EDEB] text-[#1E1E1E] font-semibold">
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

      {/* ── Status update modal ────────────────────────────────────────────── */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center" classNames={modalClassNames}>
        <ModalContent>
          {(onModalClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#017172] flex items-center justify-center">
                    <CheckCircle size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#1E1E1E]">Status aktualisieren</h2>
                    <p className="text-xs text-[#8A8A8A]">{selectedBooking?.bookingNumber}</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                {selectedBooking && (
                  <div className="space-y-4">
                    <div className="bg-[#F5EDEB] p-4 rounded-xl border border-[#E8C7C3]/30">
                      <div className="font-semibold text-[#1E1E1E] text-sm">{selectedBooking.customerName}</div>
                      <div className="text-xs text-[#8A8A8A] mt-1">{selectedBooking.serviceName}</div>
                      <div className="text-xs text-[#8A8A8A]">
                        {new Date(selectedBooking.bookingDate).toLocaleDateString("de-DE")} · {selectedBooking.startTime}
                      </div>
                    </div>

                    <Select
                      label="Neuer Status"
                      selectedKeys={[newStatus]}
                      onChange={(e) => setNewStatus(e.target.value)}
                      isRequired
                      classNames={{
                        trigger: "bg-white border border-[#E8C7C3]/40 hover:border-[#017172]",
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
                      placeholder="z.B. Telefonisch bestätigt..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      minRows={3}
                      classNames={{ inputWrapper: "bg-white border border-[#E8C7C3]/40 hover:border-[#017172]" }}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" className="bg-[#F5EDEB] text-[#1E1E1E] font-semibold" onPress={onModalClose}>
                  Abbrechen
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold shadow-lg shadow-[#017172]/20"
                  onPress={handleStatusUpdate}
                  isLoading={updating}
                  isDisabled={!newStatus}
                >
                  Aktualisieren
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
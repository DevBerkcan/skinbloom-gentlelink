// app/admin/blocked-slots/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { Switch } from "@nextui-org/switch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Trash2, Plus, Calendar, Clock, AlertCircle, CalendarRange } from "lucide-react";

import {
  getBlockedSlots,
  createBlockedSlot,
  createBlockedDateRange,
  deleteBlockedSlot,
  type BlockedTimeSlot,
  type CreateBlockedSlot,
  type CreateBlockedDateRange,
} from "@/lib/api/admin";

export default function BlockedSlotsPage() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [isDateRange, setIsDateRange] = useState(false);

  const [formData, setFormData] = useState<CreateBlockedSlot>({
    blockDate: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  const [rangeFormData, setRangeFormData] = useState<CreateBlockedDateRange>({
    fromDate: "",
    toDate: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  useEffect(() => {
    loadBlockedSlots();
  }, []);

  async function loadBlockedSlots() {
    setLoading(true);
    try {
      const data = await getBlockedSlots();
      setBlockedSlots(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSlot() {
    if (isDateRange) {
      if (!rangeFormData.fromDate || !rangeFormData.toDate || !rangeFormData.startTime || !rangeFormData.endTime) {
        setError("Bitte alle Pflichtfelder ausfüllen");
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        await createBlockedDateRange(rangeFormData);
        await loadBlockedSlots();
        onClose();
        setRangeFormData({ fromDate: "", toDate: "", startTime: "", endTime: "", reason: "" });
        setFormData({ blockDate: "", startTime: "", endTime: "", reason: "" });
        setIsDateRange(false);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!formData.blockDate || !formData.startTime || !formData.endTime) {
        setError("Bitte alle Pflichtfelder ausfüllen");
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        await createBlockedSlot(formData);
        await loadBlockedSlots();
        onClose();
        setFormData({ blockDate: "", startTime: "", endTime: "", reason: "" });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    }
  }

  async function handleDeleteSlot(id: string) {
    if (!confirm("Möchtest du diesen blockierten Zeitslot wirklich löschen?")) {
      return;
    }

    try {
      await deleteBlockedSlot(id);
      await loadBlockedSlots();
    } catch (err: any) {
      setError(err.message);
    }
  }

  const handleModalClose = () => {
    onClose();
    setFormData({ blockDate: "", startTime: "", endTime: "", reason: "" });
    setRangeFormData({ fromDate: "", toDate: "", startTime: "", endTime: "", reason: "" });
    setIsDateRange(false);
    setError(null);
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white flex items-center justify-center">
        <Spinner size="lg" className="text-[#E8C7C3]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1E1E] mb-2">
                Abwesenheiten
              </h1>
              <p className="text-sm sm:text-base text-[#8A8A8A]">
                Blockiere Zeitslots, wenn du außer Haus bist
              </p>
            </div>
            <Button
              onPress={() => {
                setIsDateRange(false);
                onOpen();
              }}
              className="bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] text-white font-semibold w-full sm:w-auto"
              startContent={<Plus size={20} />}
            >
              Zeitslot blockieren
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 bg-red-50 border-2 border-red-200">
            <CardBody className="flex flex-row items-center gap-3 p-4">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <p className="text-red-700 font-medium text-sm sm:text-base break-words flex-1">{error}</p>
            </CardBody>
          </Card>
        )}

        {/* Blocked Slots List */}
        <Card className="shadow-xl border-2 border-[#E8C7C3]/20">
          <CardHeader className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-[#E8C7C3]/20">
            <h2 className="text-lg sm:text-xl font-bold text-[#1E1E1E]">
              Blockierte Zeitslots ({blockedSlots.length})
            </h2>
          </CardHeader>
          <CardBody className="p-4 sm:p-6">
            {blockedSlots.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 bg-[#F5EDEB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-[#E8C7C3]" size={32} />
                </div>
                <p className="text-[#1E1E1E] text-base sm:text-lg font-medium">
                  Keine blockierten Zeitslots vorhanden
                </p>
                <p className="text-[#8A8A8A] text-xs sm:text-sm mt-2 px-4">
                  Erstelle einen neuen blockierten Zeitslot über den Button oben
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F5EDEB] rounded-lg border-2 border-[#E8C7C3] hover:border-[#D8B0AC] transition-colors gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <div className="flex items-center gap-2 text-[#1E1E1E] font-semibold">
                          <Calendar size={18} className="text-[#E8C7C3] flex-shrink-0" />
                          <span className="text-sm sm:text-base truncate">
                            {new Date(slot.blockDate + "T00:00:00").toLocaleDateString("de-DE", {
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8A8A8A]">
                          <Clock size={18} className="flex-shrink-0" />
                          <span className="text-sm sm:text-base whitespace-nowrap">
                            {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)} Uhr
                          </span>
                        </div>
                      </div>
                      {slot.reason && (
                        <p className="text-xs sm:text-sm text-[#6B6B6B] sm:ml-7 break-words">
                          <span className="font-medium">Grund:</span> {slot.reason}
                        </p>
                      )}
                    </div>
                    <Button
                      isIconOnly
                      className="bg-gradient-to-r from-[#D8B0AC] to-[#C09995] text-white self-end sm:self-center"
                      onPress={() => handleDeleteSlot(slot.id)}
                      aria-label="Löschen"
                      size="sm"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Create Modal - Responsive */}
        <Modal 
          isOpen={isOpen} 
          onClose={handleModalClose} 
          size="full"
          className="sm:hidden bg-white m-0"
        >
          <ModalContent className="h-full">
            <ModalHeader className="text-xl font-bold text-[#1E1E1E] border-b border-[#E8C7C3]/20">
              <div className="flex flex-col gap-4">
                <span>Zeitslot blockieren</span>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className={!isDateRange ? "text-[#E8C7C3]" : "text-[#8A8A8A]"} />
                  <Switch
                    isSelected={isDateRange}
                    onValueChange={setIsDateRange}
                    size="sm"
                    color="danger"
                    classNames={{
                      wrapper: "bg-[#E8C7C3]/30",
                    }}
                  />
                  <CalendarRange size={18} className={isDateRange ? "text-[#E8C7C3]" : "text-[#8A8A8A]"} />
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="py-6 overflow-y-auto">
              {/* Mobile Form - Single Column */}
              <div className="space-y-4">
                {!isDateRange ? (
                  <>
                    <Input
                      type="date"
                      label="Datum"
                      labelPlacement="outside"
                      value={formData.blockDate}
                      onChange={(e) => setFormData({ ...formData, blockDate: e.target.value })}
                      min={today}
                      required
                      variant="bordered"
                      classNames={{
                        label: "text-[#1E1E1E] font-medium",
                      }}
                    />
                    <Input
                      type="time"
                      label="Startzeit"
                      labelPlacement="outside"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                      variant="bordered"
                    />
                    <Input
                      type="time"
                      label="Endzeit"
                      labelPlacement="outside"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                      variant="bordered"
                    />
                    <Textarea
                      label="Grund (optional)"
                      labelPlacement="outside"
                      placeholder="z.B. Urlaub, Termin außer Haus..."
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      variant="bordered"
                      minRows={3}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      type="date"
                      label="Von Datum"
                      labelPlacement="outside"
                      value={rangeFormData.fromDate}
                      onChange={(e) => setRangeFormData({ ...rangeFormData, fromDate: e.target.value })}
                      min={today}
                      required
                      variant="bordered"
                    />
                    <Input
                      type="date"
                      label="Bis Datum"
                      labelPlacement="outside"
                      value={rangeFormData.toDate}
                      onChange={(e) => setRangeFormData({ ...rangeFormData, toDate: e.target.value })}
                      min={rangeFormData.fromDate || today}
                      required
                      variant="bordered"
                    />
                    <Input
                      type="time"
                      label="Startzeit"
                      labelPlacement="outside"
                      value={rangeFormData.startTime}
                      onChange={(e) => setRangeFormData({ ...rangeFormData, startTime: e.target.value })}
                      required
                      variant="bordered"
                    />
                    <Input
                      type="time"
                      label="Endzeit"
                      labelPlacement="outside"
                      value={rangeFormData.endTime}
                      onChange={(e) => setRangeFormData({ ...rangeFormData, endTime: e.target.value })}
                      required
                      variant="bordered"
                    />
                    <Textarea
                      label="Grund (optional)"
                      labelPlacement="outside"
                      placeholder="z.B. Urlaub, Termin außer Haus..."
                      value={rangeFormData.reason}
                      onChange={(e) => setRangeFormData({ ...rangeFormData, reason: e.target.value })}
                      variant="bordered"
                      minRows={3}
                    />
                    <p className="text-xs text-[#8A8A8A]">
                      <CalendarRange size={14} className="inline mr-1" />
                      Für jeden Tag im Zeitraum
                    </p>
                  </>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-[#E8C7C3]/20">
              <Button 
                color="default" 
                variant="flat" 
                onPress={handleModalClose}
                className="bg-[#F5EDEB] text-[#1E1E1E] font-semibold"
                fullWidth
              >
                Abbrechen
              </Button>
              <Button
                className="bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] text-white font-semibold"
                onPress={handleCreateSlot}
                isLoading={submitting}
                isDisabled={
                  isDateRange
                    ? !rangeFormData.fromDate || !rangeFormData.toDate || !rangeFormData.startTime || !rangeFormData.endTime
                    : !formData.blockDate || !formData.startTime || !formData.endTime
                }
                fullWidth
              >
                {isDateRange ? "Zeitraum blockieren" : "Zeitslot blockieren"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Tablet/Desktop Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={handleModalClose} 
          size="2xl"
          className="hidden sm:block bg-white"
        >
          <ModalContent>
            <ModalHeader className="text-2xl font-bold text-[#1E1E1E] border-b border-[#E8C7C3]/20">
              <div className="flex items-center justify-between w-full">
                <span>Zeitslot blockieren</span>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className={!isDateRange ? "text-[#E8C7C3]" : "text-[#8A8A8A]"} />
                  <Switch
                    isSelected={isDateRange}
                    onValueChange={setIsDateRange}
                    size="sm"
                    color="danger"
                    classNames={{
                      wrapper: "bg-[#E8C7C3]/30",
                    }}
                  />
                  <CalendarRange size={18} className={isDateRange ? "text-[#E8C7C3]" : "text-[#8A8A8A]"} />
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="py-6">
              {/* Desktop Form - Grid Layout */}
              {!isDateRange ? (
                <div className="space-y-4">
                  <Input
                    type="date"
                    label="Datum"
                    labelPlacement="outside"
                    value={formData.blockDate}
                    onChange={(e) => setFormData({ ...formData, blockDate: e.target.value })}
                    min={today}
                    required
                    variant="bordered"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="time"
                      label="Startzeit"
                      labelPlacement="outside"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                      variant="bordered"
                    />
                    <Input
                      type="time"
                      label="Endzeit"
                      labelPlacement="outside"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                      variant="bordered"
                    />
                  </div>
                  <Textarea
                    label="Grund (optional)"
                    labelPlacement="outside"
                    placeholder="z.B. Urlaub, Termin außer Haus, Krankheit..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    variant="bordered"
                    minRows={3}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Von Datum"
                      labelPlacement="outside"
                      value={rangeFormData.fromDate}
                      onChange={(e) => setRangeFormData({ ...rangeFormData, fromDate: e.target.value })}
                      min={today}
                      required
                      variant="bordered"
                    />
                    <Input
                      type="date"
                      label="Bis Datum"
                      labelPlacement="outside"
                      value={rangeFormData.toDate}
                      onChange={(e) => setRangeFormData({ ...rangeFormData, toDate: e.target.value })}
                      min={rangeFormData.fromDate || today}
                      required
                      variant="bordered"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="time"
                      label="Startzeit"
                      labelPlacement="outside"
                      value={rangeFormData.startTime}
                      onChange={(e) => setRangeFormData({ ...rangeFormData, startTime: e.target.value })}
                      required
                      variant="bordered"
                    />
                    <Input
                      type="time"
                      label="Endzeit"
                      labelPlacement="outside"
                      value={rangeFormData.endTime}
                      onChange={(e) => setRangeFormData({ ...rangeFormData, endTime: e.target.value })}
                      required
                      variant="bordered"
                    />
                  </div>
                  <Textarea
                    label="Grund (optional)"
                    labelPlacement="outside"
                    placeholder="z.B. Urlaub, Termin außer Haus, Krankheit..."
                    value={rangeFormData.reason}
                    onChange={(e) => setRangeFormData({ ...rangeFormData, reason: e.target.value })}
                    variant="bordered"
                    minRows={3}
                  />
                  <p className="text-sm text-[#8A8A8A]">
                    <CalendarRange size={16} className="inline mr-1" />
                    Es werden für jeden Tag im ausgewählten Zeitraum blockierte Zeitslots erstellt.
                  </p>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="border-t border-[#E8C7C3]/20">
              <Button 
                color="default" 
                variant="flat" 
                onPress={handleModalClose}
                className="bg-[#F5EDEB] text-[#1E1E1E] font-semibold"
              >
                Abbrechen
              </Button>
              <Button
                className="bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] text-white font-semibold"
                onPress={handleCreateSlot}
                isLoading={submitting}
                isDisabled={
                  isDateRange
                    ? !rangeFormData.fromDate || !rangeFormData.toDate || !rangeFormData.startTime || !rangeFormData.endTime
                    : !formData.blockDate || !formData.startTime || !formData.endTime
                }
              >
                {isDateRange ? "Zeitraum blockieren" : "Zeitslot blockieren"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Trash2, Plus, Calendar, Clock, AlertCircle } from "lucide-react";

import {
  getBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot,
  type BlockedTimeSlot,
  type CreateBlockedSlot,
} from "@/lib/api/admin";

export default function BlockedSlotsPage() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state
  const [formData, setFormData] = useState<CreateBlockedSlot>({
    blockDate: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  // Load blocked slots
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

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white flex items-center justify-center">
        <Spinner size="lg" color="danger" className="text-[#E8C7C3]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">
                Abwesenheiten
              </h1>
              <p className="text-[#8A8A8A]">
                Blockiere Zeitslots, wenn du außer Haus bist
              </p>
            </div>
            <Button
              onPress={onOpen}
              className="bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] text-white font-semibold"
              startContent={<Plus size={20} />}
            >
              Zeitslot blockieren
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 bg-red-50 border-2 border-red-200">
            <CardBody className="flex flex-row items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <p className="text-red-700 font-medium">{error}</p>
            </CardBody>
          </Card>
        )}

        {/* Blocked Slots List */}
        <Card className="shadow-xl border-2 border-[#E8C7C3]/20">
          <CardHeader className="flex justify-between items-center px-6 py-4 border-b border-[#E8C7C3]/20">
            <h2 className="text-xl font-bold text-[#1E1E1E]">
              Blockierte Zeitslots ({blockedSlots.length})
            </h2>
          </CardHeader>
          <CardBody className="p-6">
            {blockedSlots.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#F5EDEB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-[#E8C7C3]" size={32} />
                </div>
                <p className="text-[#1E1E1E] text-lg font-medium">
                  Keine blockierten Zeitslots vorhanden
                </p>
                <p className="text-[#8A8A8A] text-sm mt-2">
                  Erstelle einen neuen blockierten Zeitslot über den Button oben
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 bg-[#F5EDEB] rounded-lg border-2 border-[#E8C7C3] hover:border-[#D8B0AC] transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2 text-[#1E1E1E] font-semibold">
                          <Calendar size={18} className="text-[#E8C7C3]" />
                          <span>
                            {new Date(slot.blockDate + "T00:00:00").toLocaleDateString("de-DE", {
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8A8A8A]">
                          <Clock size={18} />
                          <span>
                            {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)} Uhr
                          </span>
                        </div>
                      </div>
                      {slot.reason && (
                        <p className="text-sm text-[#6B6B6B] ml-7">
                          <span className="font-medium">Grund:</span> {slot.reason}
                        </p>
                      )}
                    </div>
                    <Button
                      isIconOnly
                      className="bg-gradient-to-r from-[#D8B0AC] to-[#C09995] text-white"
                      onPress={() => handleDeleteSlot(slot.id)}
                      aria-label="Löschen"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Create Modal */}
        <Modal 
          isOpen={isOpen} 
          onClose={onClose} 
          size="2xl"
          className="bg-white"
        >
          <ModalContent>
            <ModalHeader className="text-2xl font-bold text-[#1E1E1E] border-b border-[#E8C7C3]/20">
              Zeitslot blockieren
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="space-y-4">
                <Input
                  type="date"
                  label="Datum"
                  labelPlacement="outside"
                  placeholder="TT.MM.JJJJ"
                  value={formData.blockDate}
                  onChange={(e) =>
                    setFormData({ ...formData, blockDate: e.target.value })
                  }
                  min={today}
                  required
                  variant="bordered"
                  classNames={{
                    label: "text-[#1E1E1E] font-medium",
                    input: "text-[#1E1E1E]",
                    inputWrapper: "border-2 border-[#E8C7C3] hover:border-[#D8B0AC]"
                  }}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="time"
                    label="Startzeit"
                    labelPlacement="outside"
                    placeholder="--:--"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                    variant="bordered"
                    classNames={{
                      label: "text-[#1E1E1E] font-medium",
                      input: "text-[#1E1E1E]",
                      inputWrapper: "border-2 border-[#E8C7C3] hover:border-[#D8B0AC]"
                    }}
                  />
                  <Input
                    type="time"
                    label="Endzeit"
                    labelPlacement="outside"
                    placeholder="--:--"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                    variant="bordered"
                    classNames={{
                      label: "text-[#1E1E1E] font-medium",
                      input: "text-[#1E1E1E]",
                      inputWrapper: "border-2 border-[#E8C7C3] hover:border-[#D8B0AC]"
                    }}
                  />
                </div>
                <Textarea
                  label="Grund (optional)"
                  labelPlacement="outside"
                  placeholder="z.B. Urlaub, Termin außer Haus, Krankheit..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  variant="bordered"
                  minRows={3}
                  classNames={{
                    label: "text-[#1E1E1E] font-medium",
                    input: "text-[#1E1E1E]",
                    inputWrapper: "border-2 border-[#E8C7C3] hover:border-[#D8B0AC]"
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-[#E8C7C3]/20">
              <Button 
                color="default" 
                variant="flat" 
                onPress={onClose}
                className="bg-[#F5EDEB] text-[#1E1E1E] font-semibold"
              >
                Abbrechen
              </Button>
              <Button
                className="bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] text-white font-semibold"
                onPress={handleCreateSlot}
                isLoading={submitting}
                isDisabled={
                  !formData.blockDate || !formData.startTime || !formData.endTime
                }
              >
                Zeitslot blockieren
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
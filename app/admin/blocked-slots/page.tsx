"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
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
      <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white flex items-center justify-center">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-barber-black mb-2">
                Abwesenheiten
              </h1>
              <p className="text-barber-grey-600">
                Blockiere Zeitslots, wenn du außer Haus bist
              </p>
            </div>
            <Button
              onPress={onOpen}
              color="danger"
              startContent={<Plus size={20} />}
              className="font-semibold"
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
        <Card>
          <CardHeader className="flex justify-between items-center px-6 py-4 border-b border-barber-grey-100">
            <h2 className="text-xl font-bold text-barber-black">
              Blockierte Zeitslots ({blockedSlots.length})
            </h2>
          </CardHeader>
          <CardBody className="p-6">
            {blockedSlots.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto mb-4 text-barber-grey-300" size={48} />
                <p className="text-barber-grey-500 text-lg">
                  Keine blockierten Zeitslots vorhanden
                </p>
                <p className="text-barber-grey-400 text-sm mt-2">
                  Erstelle einen neuen blockierten Zeitslot über den Button oben
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 bg-barber-grey-50 rounded-lg border border-barber-grey-200 hover:border-barber-red transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2 text-barber-black font-semibold">
                          <Calendar size={18} />
                          <span>
                            {new Date(slot.blockDate + "T00:00:00").toLocaleDateString("de-DE", {
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-barber-grey-600">
                          <Clock size={18} />
                          <span>
                            {slot.startTime} - {slot.endTime} Uhr
                          </span>
                        </div>
                      </div>
                      {slot.reason && (
                        <p className="text-sm text-barber-grey-500">
                          Grund: {slot.reason}
                        </p>
                      )}
                    </div>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="flat"
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
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            <ModalHeader className="text-2xl font-bold">
              Zeitslot blockieren
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  type="date"
                  label="Datum"
                  value={formData.blockDate}
                  onChange={(e) =>
                    setFormData({ ...formData, blockDate: e.target.value })
                  }
                  min={today}
                  required
                  variant="bordered"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="time"
                    label="Startzeit"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    required
                    variant="bordered"
                  />
                  <Input
                    type="time"
                    label="Endzeit"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    required
                    variant="bordered"
                  />
                </div>
                <Textarea
                  label="Grund (optional)"
                  placeholder="z.B. Urlaub, Termin außer Haus, Krankheit..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  variant="bordered"
                  minRows={3}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Abbrechen
              </Button>
              <Button
                color="danger"
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

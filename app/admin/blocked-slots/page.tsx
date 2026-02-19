// app/admin/blocked-slots/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { Switch } from "@nextui-org/switch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Trash2, Plus, Ban, Clock, ChevronLeft, ChevronRight, AlertCircle, CalendarRange } from "lucide-react";

import {
  getBlockedSlots, createBlockedSlot, createBlockedDateRange, deleteBlockedSlot,
  type BlockedTimeSlot, type CreateBlockedSlot, type CreateBlockedDateRange,
} from "@/lib/api/admin";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

function getMiniCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const days: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  return days;
}

export default function BlockedSlotsPage() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDateRange, setIsDateRange] = useState(false);

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedCalDate, setSelectedCalDate] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateBlockedSlot>({
    blockDate: "", startTime: "", endTime: "", reason: "",
  });
  const [rangeFormData, setRangeFormData] = useState<CreateBlockedDateRange>({
    fromDate: "", toDate: "", startTime: "", endTime: "", reason: "",
  });

  useEffect(() => { loadBlockedSlots(); }, []);

  async function loadBlockedSlots() {
    setLoading(true);
    try {
      const data = await getBlockedSlots();
      setBlockedSlots(data);
      setError(null);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function handleCreateSlot() {
    if (isDateRange) {
      if (!rangeFormData.fromDate || !rangeFormData.toDate || !rangeFormData.startTime || !rangeFormData.endTime) {
        setError("Bitte alle Pflichtfelder ausfüllen"); return;
      }
      setSubmitting(true);
      setError(null);
      try {
        await createBlockedDateRange(rangeFormData);
        await loadBlockedSlots();
        onClose();
        setRangeFormData({ fromDate: "", toDate: "", startTime: "", endTime: "", reason: "" });
      } catch (err: any) { setError(err.message); }
      finally { setSubmitting(false); }
    } else {
      if (!formData.blockDate || !formData.startTime || !formData.endTime) {
        setError("Bitte alle Pflichtfelder ausfüllen"); return;
      }
      setSubmitting(true);
      setError(null);
      try {
        await createBlockedSlot(formData);
        await loadBlockedSlots();
        onClose();
        setFormData({ blockDate: "", startTime: "", endTime: "", reason: "" });
      } catch (err: any) { setError(err.message); }
      finally { setSubmitting(false); }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Diesen blockierten Zeitslot wirklich löschen?")) return;
    try {
      await deleteBlockedSlot(id);
      setBlockedSlots(prev => prev.filter(s => s.id !== id));
    } catch (err: any) { setError(err.message); }
  }

  const blockedDates = useMemo(() => {
    const set = new Set<string>();
    blockedSlots.forEach(s => set.add(s.blockDate));
    return set;
  }, [blockedSlots]);

  const calDays = getMiniCalendar(calYear, calMonth);

  const filteredSlots = selectedCalDate
    ? blockedSlots.filter(s => s.blockDate === selectedCalDate)
    : blockedSlots;

  const handleCalDayClick = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedCalDate(prev => prev === dateStr ? null : dateStr);
  };

  const handleCalDayDblClick = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setFormData(prev => ({ ...prev, blockDate: dateStr }));
    setIsDateRange(false);
    onOpen();
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const modalClassNames = {
    base: "bg-white border border-[#E8C7C3]/30 shadow-2xl",
    header: "border-b border-[#E8C7C3]/20 bg-gradient-to-r from-[#F5EDEB] to-white",
    footer: "border-t border-[#E8C7C3]/20 bg-[#F5EDEB]/30",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-1">Abwesenheiten</h1>
            <p className="text-sm text-[#8A8A8A]">Blockierte Zeitslots verwalten</p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold shadow-lg shadow-[#017172]/20"
            startContent={<Plus size={18} />}
            onPress={() => { setError(null); onOpen(); }}
          >
            Zeitslot blockieren
          </Button>
        </div>

        {/* ── Calendar ───────────────────────────────────────────────────── */}
        <Card className="mb-6 border border-[#E8C7C3]/20 shadow-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-[#F5EDEB] to-white border-b border-[#E8C7C3]/20">
            <div className="flex items-center justify-between w-full">
              <Button isIconOnly variant="flat" className="bg-[#F5EDEB] min-w-8 h-8" onPress={prevMonth}>
                <ChevronLeft size={16} />
              </Button>
              <h2 className="text-base font-bold text-[#1E1E1E]">
                {MONTHS[calMonth]} {calYear}
              </h2>
              <Button isIconOnly variant="flat" className="bg-[#F5EDEB] min-w-8 h-8" onPress={nextMonth}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-[#8A8A8A] py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isBlocked = blockedDates.has(dateStr);
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedCalDate;
                return (
                  <button
                    key={dateStr}
                    onClick={() => handleCalDayClick(day)}
                    onDoubleClick={() => handleCalDayDblClick(day)}
                    title={isBlocked ? "Blockierter Tag – Doppelklick zum Erstellen" : "Doppelklick zum Erstellen"}
                    className={`relative flex flex-col items-center justify-center rounded-xl h-10 text-sm font-medium transition-all
                      ${isSelected
                        ? "bg-[#017172] text-white shadow-md"
                        : isToday
                        ? "ring-2 ring-[#017172] text-[#017172]"
                        : isBlocked
                        ? "bg-[#017172]/10 text-[#017172] hover:bg-[#017172]/20"
                        : "text-[#1E1E1E] hover:bg-[#F5EDEB]"
                      }`}
                  >
                    {day}
                    {isBlocked && !isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#017172]" />
                    )}
                  </button>
                );
              })}
            </div>
            {selectedCalDate && (
              <div className="mt-3 pt-3 border-t border-[#E8C7C3]/20 flex items-center justify-between">
                <p className="text-sm text-[#8A8A8A]">
                  Filter:{" "}
                  <span className="font-semibold text-[#017172]">
                    {new Date(selectedCalDate + "T00:00").toLocaleDateString("de-DE", {
                      day: "2-digit", month: "long", year: "numeric",
                    })}
                  </span>
                </p>
                <Button size="sm" variant="flat" className="bg-[#F5EDEB] text-[#8A8A8A] text-xs" onPress={() => setSelectedCalDate(null)}>
                  Filter entfernen
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── List ───────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#1E1E1E]">
              {selectedCalDate
                ? `Blockierungen am ${new Date(selectedCalDate + "T00:00").toLocaleDateString("de-DE", { day: "2-digit", month: "long" })}`
                : `Alle Blockierungen (${blockedSlots.length})`}
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : error ? (
            <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
              <AlertCircle size={16} />{error}
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#F5EDEB] rounded-full flex items-center justify-center mx-auto mb-4">
                <Ban size={28} className="text-[#E8C7C3]" />
              </div>
              <p className="text-[#8A8A8A] font-medium">
                {selectedCalDate ? "Keine Blockierungen an diesem Tag" : "Noch keine blockierten Zeiten"}
              </p>
              <p className="text-[#8A8A8A] text-sm mt-1">Doppelklick auf einen Kalendertag oder den Button oben</p>
            </div>
          ) : (
            filteredSlots.map((slot) => (
              <Card key={slot.id} className="border border-[#E8C7C3]/20 shadow-sm hover:shadow-md transition-shadow">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#6b7280]/10 flex items-center justify-center shrink-0">
                        <Ban size={18} className="text-[#6b7280]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1E1E1E]">
                          {new Date(slot.blockDate + "T00:00").toLocaleDateString("de-DE", {
                            weekday: "long", day: "2-digit", month: "long", year: "numeric",
                          })}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-[#8A8A8A]">
                          <Clock size={13} />
                          <span>{slot.startTime} – {slot.endTime} Uhr</span>
                        </div>
                        {slot.reason && (
                          <p className="text-sm text-[#8A8A8A] mt-1 italic">"{slot.reason}"</p>
                        )}
                      </div>
                    </div>
                    <Button
                      isIconOnly size="sm" variant="flat"
                      className="bg-red-50 text-red-500 hover:bg-red-100 shrink-0"
                      onPress={() => handleDelete(slot.id)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* ── Create Modal ───────────────────────────────────────────────────── */}
      <Modal isOpen={isOpen} onClose={() => { onClose(); setError(null); }} size="lg" classNames={modalClassNames}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#017172] flex items-center justify-center">
                    <Ban size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1E1E1E]">Zeitslot blockieren</h2>
                    <p className="text-xs text-[#8A8A8A]">Markieren Sie Zeiten als nicht verfügbar</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
                      <AlertCircle size={15} />{error}
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-[#F5EDEB] rounded-xl">
                    <Switch isSelected={isDateRange} onValueChange={setIsDateRange} color="primary" size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-[#1E1E1E]">Datumsbereich</p>
                      <p className="text-xs text-[#8A8A8A]">Mehrere Tage auf einmal blockieren</p>
                    </div>
                    <CalendarRange size={18} className="ml-auto text-[#8A8A8A]" />
                  </div>

                  {!isDateRange ? (
                    <Input type="date" label="Datum" isRequired value={formData.blockDate}
                      onChange={(e) => setFormData({ ...formData, blockDate: e.target.value })}
                      classNames={{ inputWrapper: "bg-[#F5EDEB] border border-[#E8C7C3]/30" }}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="date" label="Von Datum" isRequired value={rangeFormData.fromDate}
                        onChange={(e) => setRangeFormData({ ...rangeFormData, fromDate: e.target.value })}
                        classNames={{ inputWrapper: "bg-[#F5EDEB] border border-[#E8C7C3]/30" }}
                      />
                      <Input type="date" label="Bis Datum" isRequired value={rangeFormData.toDate}
                        onChange={(e) => setRangeFormData({ ...rangeFormData, toDate: e.target.value })}
                        classNames={{ inputWrapper: "bg-[#F5EDEB] border border-[#E8C7C3]/30" }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Input type="time" label="Von Uhrzeit" isRequired
                      value={isDateRange ? rangeFormData.startTime : formData.startTime}
                      onChange={(e) => isDateRange
                        ? setRangeFormData({ ...rangeFormData, startTime: e.target.value })
                        : setFormData({ ...formData, startTime: e.target.value })}
                      classNames={{ inputWrapper: "bg-[#F5EDEB] border border-[#E8C7C3]/30" }}
                    />
                    <Input type="time" label="Bis Uhrzeit" isRequired
                      value={isDateRange ? rangeFormData.endTime : formData.endTime}
                      onChange={(e) => isDateRange
                        ? setRangeFormData({ ...rangeFormData, endTime: e.target.value })
                        : setFormData({ ...formData, endTime: e.target.value })}
                      classNames={{ inputWrapper: "bg-[#F5EDEB] border border-[#E8C7C3]/30" }}
                    />
                  </div>

                  <Input label="Grund (optional)" placeholder="z.B. Urlaub, Fortbildung..."
                    value={isDateRange ? rangeFormData.reason : formData.reason}
                    onChange={(e) => isDateRange
                      ? setRangeFormData({ ...rangeFormData, reason: e.target.value })
                      : setFormData({ ...formData, reason: e.target.value })}
                    classNames={{ inputWrapper: "bg-[#F5EDEB] border border-[#E8C7C3]/30" }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" className="bg-[#F5EDEB] text-[#1E1E1E] font-semibold" onPress={close} isDisabled={submitting}>
                  Abbrechen
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold shadow-lg shadow-[#017172]/20"
                  onPress={handleCreateSlot}
                  isLoading={submitting}
                  startContent={<Ban size={16} />}
                >
                  Blockieren
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
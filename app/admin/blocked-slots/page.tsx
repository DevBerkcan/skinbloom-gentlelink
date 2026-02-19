// app/admin/blocked-slots/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Trash2, Plus, Ban, Clock, ChevronLeft, ChevronRight, AlertCircle, CalendarRange, X } from "lucide-react";
import {
  getBlockedSlots, createBlockedSlot, createBlockedDateRange, deleteBlockedSlot,
  type BlockedTimeSlot, type CreateBlockedSlot, type CreateBlockedDateRange,
} from "@/lib/api/admin";
import { useConfirm } from "@/components/ConfirmDialog";


// ── Constants ─────────────────────────────────────────────────────────────────
const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

function getMiniCalDays(year: number, month: number): (number | null)[] {
  const startDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= total; d++) days.push(d);
  return days;
}

// ── Shared modal styles (same everywhere) ─────────────────────────────────────
const MODAL_CLS = {
  base: "bg-white border border-[#E8C7C3]/30 shadow-2xl",
  header: "border-b border-[#E8C7C3]/20 bg-gradient-to-r from-[#F5EDEB] to-white",
  footer: "border-t border-[#E8C7C3]/20 bg-[#F5EDEB]/30",
  body: "py-4",
};
const INPUT_CLS = { inputWrapper: "bg-[#F5EDEB] border border-[#E8C7C3]/30 hover:border-[#017172] data-[focus=true]:border-[#017172]" };

// ─────────────────────────────────────────────────────────────────────────────
export default function BlockedSlotsPage() {
  const [slots, setSlots] = useState<BlockedTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isRange, setIsRange] = useState(false);
  const [singleForm, setSingleForm] = useState<CreateBlockedSlot>({ blockDate: "", startTime: "", endTime: "", reason: "" });
  const [rangeForm, setRangeForm] = useState<CreateBlockedDateRange>({ fromDate: "", toDate: "", startTime: "", endTime: "", reason: "" });

  // Mini-calendar
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selDate, setSelDate] = useState<string | null>(null);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const { confirm, dialog: confirmDialog } = useConfirm();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true); setError(null);
    try { setSlots(await getBlockedSlots()); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleCreate() {
    if (isRange) {
      if (!rangeForm.fromDate || !rangeForm.toDate || !rangeForm.startTime || !rangeForm.endTime) {
        setError("Bitte alle Pflichtfelder ausfüllen"); return;
      }
      setSubmitting(true); setError(null);
      try { await createBlockedDateRange(rangeForm); await load(); onClose(); setRangeForm({ fromDate: "", toDate: "", startTime: "", endTime: "", reason: "" }); }
      catch (e: any) { setError(e.message); }
      finally { setSubmitting(false); }
    } else {
      if (!singleForm.blockDate || !singleForm.startTime || !singleForm.endTime) {
        setError("Bitte alle Pflichtfelder ausfüllen"); return;
      }
      setSubmitting(true); setError(null);
      try { await createBlockedSlot(singleForm); await load(); onClose(); setSingleForm({ blockDate: "", startTime: "", endTime: "", reason: "" }); }
      catch (e: any) { setError(e.message); }
      finally { setSubmitting(false); }
    }
  }

  async function handleDelete(slot: BlockedTimeSlot) {
    const ok = await confirm({
      title: "Zeitslot löschen",
      message: `${new Date(slot.blockDate + "T00:00").toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long" })} · ${slot.startTime}–${slot.endTime} Uhr wirklich löschen?`,
      confirmLabel: "Löschen", variant: "danger",
    });
    if (!ok) return;
    try { await deleteBlockedSlot(slot.id); setSlots(prev => prev.filter(s => s.id !== slot.id)); }
    catch (e: any) { setError(e.message); }
  }

  // Calendar helpers
  const blockedDates = useMemo(() => { const s = new Set<string>(); slots.forEach(sl => s.add(sl.blockDate)); return s; }, [slots]);
  const calDays = getMiniCalDays(calYear, calMonth);
  const dateStr = (d: number) => `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const prevMonth = () => calMonth === 0 ? (setCalYear(y => y - 1), setCalMonth(11)) : setCalMonth(m => m - 1);
  const nextMonth = () => calMonth === 11 ? (setCalYear(y => y + 1), setCalMonth(0)) : setCalMonth(m => m + 1);

  const filteredSlots = selDate ? slots.filter(s => s.blockDate === selDate) : slots;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-1">Abwesenheiten</h1>
            <p className="text-sm text-[#8A8A8A]">Blockierte Zeitslots verwalten</p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold shadow-lg shadow-[#017172]/20"
            startContent={<Plus size={18} />}
            onPress={() => { setError(null); setIsRange(false); onOpen(); }}
          >
            Zeitslot blockieren
          </Button>
        </div>

        {/* ── Mini-Calendar ─────────────────────────────────────────────── */}
        <Card className="mb-6 border border-[#E8C7C3]/20 shadow-xl">
          {/* FIX: use a plain div instead of CardHeader to avoid NextUI's default justify-center */}
          <div className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-[#F5EDEB] to-white border-b border-[#E8C7C3]/20 rounded-t-xl">
            <Button isIconOnly variant="flat" className="bg-white/60 min-w-8 h-8" onPress={prevMonth}>
              <ChevronLeft size={16} />
            </Button>
            <span className="text-base font-bold text-[#1E1E1E]">{MONTHS[calMonth]} {calYear}</span>
            <Button isIconOnly variant="flat" className="bg-white/60 min-w-8 h-8" onPress={nextMonth}>
              <ChevronRight size={16} />
            </Button>
          </div>
          <CardBody className="p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-[#8A8A8A] py-1">{d}</div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} />;
                const ds = dateStr(day);
                const isBlocked = blockedDates.has(ds);
                const isToday = ds === todayStr;
                const isSel = ds === selDate;
                return (
                  <button key={ds}
                    onClick={() => setSelDate(prev => prev === ds ? null : ds)}
                    onDoubleClick={() => { setSingleForm(f => ({ ...f, blockDate: ds })); setIsRange(false); onOpen(); }}
                    title={isBlocked ? "Blockiert – Doppelklick zum Erstellen" : "Doppelklick zum Erstellen"}
                    className={`relative flex flex-col items-center justify-center rounded-xl h-10 text-sm font-medium transition-all cursor-pointer
                      ${isSel ? "bg-[#017172] text-white shadow-md"
                        : isToday ? "ring-2 ring-[#017172] text-[#017172]"
                          : isBlocked ? "bg-[#017172]/10 text-[#017172] hover:bg-[#017172]/20"
                            : "text-[#1E1E1E] hover:bg-[#F5EDEB]"}`}
                  >
                    {day}
                    {isBlocked && !isSel && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#017172]" />}
                  </button>
                );
              })}
            </div>
            {/* Filter indicator */}
            {selDate && (
              <div className="mt-3 pt-3 border-t border-[#E8C7C3]/20 flex items-center justify-between">
                <p className="text-sm text-[#8A8A8A]">
                  Filter: <span className="font-semibold text-[#017172]">
                    {new Date(selDate + "T00:00").toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                </p>
                <Button size="sm" variant="flat" className="bg-[#F5EDEB] text-[#8A8A8A] text-xs" onPress={() => setSelDate(null)}>
                  Aufheben
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── List ─────────────────────────────────────────────────────────── */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-[#1E1E1E]">
            {selDate
              ? `Blockierungen am ${new Date(selDate + "T00:00").toLocaleDateString("de-DE", { day: "2-digit", month: "long" })}`
              : `Alle Blockierungen (${slots.length})`}
          </h3>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
            <AlertCircle size={15} />{error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#017172]" />
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#F5EDEB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Ban size={28} className="text-[#E8C7C3]" />
            </div>
            <p className="text-[#8A8A8A] font-medium">
              {selDate ? "Keine Blockierungen an diesem Tag" : "Noch keine blockierten Zeiten"}
            </p>
            <p className="text-[#8A8A8A] text-sm mt-1">Doppelklick auf einen Kalendertag oder Button oben</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSlots.map((slot) => (
              <Card key={slot.id} className="border border-[#E8C7C3]/20 shadow-sm hover:shadow-md transition-shadow">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#6b7280]/10 flex items-center justify-center shrink-0">
                        <Ban size={18} className="text-[#6b7280]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1E1E1E]">
                          {new Date(slot.blockDate + "T00:00").toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-[#8A8A8A]">
                          <Clock size={13} />
                          <span>{slot.startTime} – {slot.endTime} Uhr</span>
                        </div>
                        {slot.reason && <p className="text-sm text-[#8A8A8A] mt-1 italic">„{slot.reason}"</p>}
                      </div>
                    </div>
                    <Button isIconOnly size="sm" variant="flat"
                      className="bg-red-50 text-red-500 hover:bg-red-100 shrink-0"
                      onPress={() => handleDelete(slot)}>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── Create Modal ─────────────────────────────────────────────────────── */}
      <Modal isOpen={isOpen} onClose={() => { onClose(); setError(null); }} size="lg" placement="center" classNames={MODAL_CLS}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#017172] flex items-center justify-center">
                    <Ban size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#1E1E1E]">Zeitslot blockieren</h2>
                    <p className="text-xs text-[#8A8A8A]">Zeiten als nicht verfügbar markieren</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
                      <AlertCircle size={14} />{error}
                    </div>
                  )}

                  {/* Range toggle */}
                  <div className="flex items-center gap-3 p-3 bg-[#F5EDEB] rounded-xl border border-[#E8C7C3]/30">
                    <Switch isSelected={isRange} onValueChange={setIsRange} color="primary" size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1E1E1E]">Datumsbereich</p>
                      <p className="text-xs text-[#8A8A8A]">Mehrere Tage auf einmal blockieren</p>
                    </div>
                    <CalendarRange size={18} className="text-[#8A8A8A]" />
                  </div>

                  {/* Date(s) */}
                  {!isRange ? (
                    <Input type="date" label="Datum" isRequired value={singleForm.blockDate}
                      onChange={(e) => setSingleForm(f => ({ ...f, blockDate: e.target.value }))} classNames={INPUT_CLS} />
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="date" label="Von Datum" isRequired value={rangeForm.fromDate}
                        onChange={(e) => setRangeForm(f => ({ ...f, fromDate: e.target.value }))} classNames={INPUT_CLS} />
                      <Input type="date" label="Bis Datum" isRequired value={rangeForm.toDate}
                        onChange={(e) => setRangeForm(f => ({ ...f, toDate: e.target.value }))} classNames={INPUT_CLS} />
                    </div>
                  )}

                  {/* Times */}
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="time" label="Von Uhrzeit" isRequired
                      value={isRange ? rangeForm.startTime : singleForm.startTime}
                      onChange={(e) => isRange ? setRangeForm(f => ({ ...f, startTime: e.target.value })) : setSingleForm(f => ({ ...f, startTime: e.target.value }))}
                      classNames={INPUT_CLS} />
                    <Input type="time" label="Bis Uhrzeit" isRequired
                      value={isRange ? rangeForm.endTime : singleForm.endTime}
                      onChange={(e) => isRange ? setRangeForm(f => ({ ...f, endTime: e.target.value })) : setSingleForm(f => ({ ...f, endTime: e.target.value }))}
                      classNames={INPUT_CLS} />
                  </div>

                  {/* Reason */}
                  <Input label="Grund (optional)" placeholder="z.B. Urlaub, Fortbildung…"
                    value={isRange ? rangeForm.reason : singleForm.reason}
                    onChange={(e) => isRange ? setRangeForm(f => ({ ...f, reason: e.target.value })) : setSingleForm(f => ({ ...f, reason: e.target.value }))}
                    classNames={INPUT_CLS} />
                </div>
              </ModalBody>
              <ModalFooter className="gap-2">
                <Button variant="flat"
                  className="bg-white border border-[#E8C7C3]/40 text-[#1E1E1E] font-semibold"
                  onPress={close} 
                  isDisabled={submitting} 
                  startContent={<X size={14} />}
                  >
                  Abbrechen
                </Button>
                <Button className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold shadow-lg shadow-[#017172]/20"
                  onPress={handleCreate} isLoading={submitting} startContent={!submitting && <Ban size={15} />}>
                  Blockieren
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {confirmDialog}
    </div>
  );
}
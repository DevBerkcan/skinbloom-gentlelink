"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { Chip } from "@nextui-org/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Plus, Edit, Trash2, Users, AlertCircle, X, Save, UserCheck, UserX } from "lucide-react";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, type Employee, type CreateEmployeeDto } from "@/lib/api/employees";
import { useConfirm } from "@/components/ConfirmDialog";

const MODAL_CLS = {
  base: "bg-white border border-[#E8C7C3]/30 shadow-2xl",
  header: "border-b border-[#E8C7C3]/20 bg-gradient-to-r from-[#F5EDEB] to-white",
  footer: "border-t border-[#E8C7C3]/20 bg-[#F5EDEB]/30",
  body: "py-5",
};
const INPUT_CLS = {
  inputWrapper: "bg-[#F5EDEB] border border-[#E8C7C3]/40 hover:border-[#017172] data-[focus=true]:border-[#017172]",
  label: "text-[#8A8A8A] font-medium",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-[#017172]","bg-[#C09995]","bg-[#D8B0AC]","bg-[#6b7280]",
  "bg-emerald-600","bg-amber-600","bg-violet-600",
];
const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
const avatarBg  = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const EMPTY: CreateEmployeeDto = { name: "", role: "", specialty: "" };

export default function EmployeesPage() {
  const [employees, setEmployees]     = useState<Employee[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const { isOpen, onOpen, onClose }   = useDisclosure();
  const [editing, setEditing]         = useState<Employee | null>(null);
  const [form, setForm]               = useState<CreateEmployeeDto>(EMPTY);
  const [formActive, setFormActive]   = useState(true);
  const [modalErr, setModalErr]       = useState<string | null>(null);

  const { confirm, dialog }           = useConfirm();

  useEffect(() => { load(); }, [showInactive]);

  async function load() {
    setLoading(true); setError(null);
    try { setEmployees(await getEmployees(!showInactive)); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  function openCreate() {
    setEditing(null); setForm(EMPTY); setFormActive(true); setModalErr(null); onOpen();
  }
  function openEdit(emp: Employee) {
    setEditing(emp);
    setForm({ name: emp.name, role: emp.role, specialty: emp.specialty ?? "" });
    setFormActive(emp.isActive); setModalErr(null); onOpen();
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.role.trim()) { setModalErr("Name und Rolle sind Pflichtfelder"); return; }
    setSubmitting(true); setModalErr(null);
    try {
      const payload = { ...form, specialty: form.specialty?.trim() || null };
      if (editing) await updateEmployee(editing.id, { ...payload, isActive: formActive });
      else         await createEmployee(payload);
      await load(); onClose();
    } catch (e: any) { setModalErr(e.message); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(emp: Employee) {
    const ok = await confirm({
      title: "Mitarbeiter entfernen",
      message: `„${emp.name}" wirklich entfernen? Die Person wird deaktiviert und erscheint nicht mehr in Buchungen.`,
      confirmLabel: "Entfernen", variant: "danger",
    });
    if (!ok) return;
    try { await deleteEmployee(emp.id); await load(); }
    catch (e: any) { setError(e.message); }
  }

  async function handleToggle(emp: Employee) {
    const ok = await confirm({
      title: emp.isActive ? "Mitarbeiter deaktivieren" : "Mitarbeiter aktivieren",
      message: `„${emp.name}" ${emp.isActive ? "deaktivieren" : "aktivieren"}?`,
      confirmLabel: emp.isActive ? "Deaktivieren" : "Aktivieren",
      variant: emp.isActive ? "warning" : "info",
    });
    if (!ok) return;
    try {
      await updateEmployee(emp.id, { name: emp.name, role: emp.role, specialty: emp.specialty, isActive: !emp.isActive });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  const activeCount   = employees.filter(e => e.isActive).length;
  const inactiveCount = employees.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E] mb-1">Mitarbeiter</h1>
            <p className="text-sm text-[#8A8A8A]">Fachkräfte verwalten und zuweisen</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold shadow-lg shadow-[#017172]/20"
            startContent={<Plus size={18} />} 
            onPress={openCreate}
          >
            Mitarbeiter hinzufügen
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Gesamt",  value: employees.length, cls: "text-[#1E1E1E]" },
            { label: "Aktiv",   value: activeCount,       cls: "text-[#017172]" },
            { label: "Inaktiv", value: inactiveCount,     cls: "text-[#8A8A8A]" },
          ].map(({ label, value, cls }) => (
            <Card key={label} className="border border-[#E8C7C3]/30 shadow-md">
              <CardBody className="p-4">
                <div className={`text-2xl sm:text-3xl font-bold ${cls}`}>{value}</div>
                <div className="text-xs text-[#8A8A8A] mt-0.5">{label}</div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-white border border-[#E8C7C3]/30 rounded-xl shadow-sm w-fit">
          <Switch isSelected={showInactive} onValueChange={setShowInactive} size="sm" color="default" />
          <span className="text-sm text-[#8A8A8A]">Inaktive anzeigen</span>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm mb-4">
            <AlertCircle size={16} />{error}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#017172]" />
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#F5EDEB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-[#E8C7C3]" />
            </div>
            <p className="text-[#8A8A8A] font-medium">Noch keine Mitarbeiter vorhanden</p>
            <Button 
              className="mt-4 bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold"
              startContent={<Plus size={16} />} 
              onPress={openCreate}
            >
              Ersten Mitarbeiter hinzufügen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {employees.map((emp) => (
              <Card key={emp.id}
                className={`border shadow-md transition-all hover:shadow-lg ${emp.isActive ? "border-[#E8C7C3]/30" : "border-[#E8C7C3]/10 opacity-60"}`}>
                <CardBody className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 ${avatarBg(emp.name)}`}>
                      {initials(emp.name)}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-[#1E1E1E]">{emp.name}</span>
                        <Chip size="sm" variant="flat"
                          className={emp.isActive ? "bg-[#017172]/10 text-[#017172]" : "bg-[#6b7280]/10 text-[#6b7280]"}>
                          {emp.isActive ? "Aktiv" : "Inaktiv"}
                        </Chip>
                      </div>
                      <p className="text-sm text-[#8A8A8A] font-medium">{emp.role}</p>
                      {emp.specialty && <p className="text-xs text-[#8A8A8A] mt-1 italic">{emp.specialty}</p>}
                    </div>
                    {/* Actions - All as proper buttons */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="flat"
                        className="bg-[#F5EDEB] text-[#017172] hover:bg-[#017172]/10"
                        onPress={() => openEdit(emp)} 
                        title="Bearbeiten"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="flat"
                        className={emp.isActive ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-[#017172]/10 text-[#017172] hover:bg-[#017172]/20"}
                        onPress={() => handleToggle(emp)} 
                        title={emp.isActive ? "Deaktivieren" : "Aktivieren"}
                      >
                        {emp.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      </Button>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="flat"
                        className="bg-red-50 text-red-500 hover:bg-red-100"
                        startContent={<Trash2 size={14} />}
                        onPress={() => handleDelete(emp)} 
                        title="Löschen"
                      >
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => { onClose(); setModalErr(null); }}
        size="md" placement="center" classNames={MODAL_CLS}>
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#017172] flex items-center justify-center">
                    {editing ? <Edit size={16} className="text-white" /> : <Plus size={18} className="text-white" />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#1E1E1E]">
                      {editing ? "Mitarbeiter bearbeiten" : "Mitarbeiter hinzufügen"}
                    </h2>
                    <p className="text-xs text-[#8A8A8A]">
                      {editing ? `${editing.name} bearbeiten` : "Neue Fachkraft anlegen"}
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {modalErr && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
                      <AlertCircle size={14} />{modalErr}
                    </div>
                  )}
                  <Input 
                    label="Name" 
                    placeholder="z.B. Anna Meier" 
                    value={form.name} 
                    isRequired 
                    isDisabled={submitting}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    classNames={INPUT_CLS} 
                  />
                  <Input 
                    label="Rolle" 
                    placeholder="z.B. Ästhetik-Expertin" 
                    value={form.role} 
                    isRequired 
                    isDisabled={submitting}
                    onChange={(e) => setForm({ ...form, role: e.target.value })} 
                    classNames={INPUT_CLS} 
                  />
                  <Input 
                    label="Spezialgebiet (optional)" 
                    placeholder="z.B. Wimpern, Botox, Filler"
                    value={form.specialty ?? ""} 
                    isDisabled={submitting}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })} 
                    classNames={INPUT_CLS} 
                  />
                  {editing && (
                    <div className="flex items-center gap-3 p-3 bg-[#F5EDEB] rounded-xl border border-[#E8C7C3]/30">
                      <Switch isSelected={formActive} onValueChange={setFormActive} size="sm" color="primary" isDisabled={submitting} />
                      <div>
                        <p className="text-sm font-semibold text-[#1E1E1E]">{formActive ? "Aktiv" : "Inaktiv"}</p>
                        <p className="text-xs text-[#8A8A8A]">
                          {formActive ? "Erscheint in Buchungsformularen" : "Nicht buchbar – versteckt"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter className="gap-2">
                <Button 
                  variant="flat" 
                  className="bg-white border border-[#E8C7C3]/40 text-[#1E1E1E] font-semibold"
                  onPress={close} 
                  isDisabled={submitting} 
                  startContent={<X size={14} />}
                >
                  Abbrechen
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold shadow-lg shadow-[#017172]/20"
                  onPress={handleSubmit} 
                  isLoading={submitting}
                  isDisabled={!form.name.trim() || !form.role.trim()}
                  startContent={!submitting && <Save size={14} />}
                >
                  {editing ? "Speichern" : "Hinzufügen"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {dialog}
    </div>
  );
}
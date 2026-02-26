"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Edit, Trash2, Loader2, Search, X, Check,
    Clock, DollarSign, Eye, EyeOff, Users, Tag,
    ArrowLeft, Save, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import { Button } from "@nextui-org/button";
import {
    getAdminServices,
    getAdminCategories,
    getEmployeesForAssignment,
    createAdminService,
    updateAdminService,
    deleteAdminService,
    toggleServiceActive,
    createAdminCategory,
    updateAdminCategory,
    deleteAdminCategory,
    bulkAssignServicesToEmployee,
    type AdminService,
    type AdminServiceCategory,
    type EmployeeForAssignment,
    type CreateServiceData,
    type UpdateServiceData,
    type CreateCategoryData,
    type UpdateCategoryData
} from "@/lib/api/admin-services";

type ViewMode = "services" | "categories" | "assignments";
type ModalMode = "create" | "edit" | "delete" | "create-category" | "edit-category" | "delete-category" | null;

export default function AdminServicesPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>("services");
    const [services, setServices] = useState<AdminService[]>([]);
    const [categories, setCategories] = useState<AdminServiceCategory[]>([]);
    const [employees, setEmployees] = useState<EmployeeForAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedItem, setSelectedItem] = useState<AdminService | AdminServiceCategory | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeForAssignment | null>(null);
    const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

    // Form state for service
    const [serviceForm, setServiceForm] = useState<Partial<CreateServiceData>>({
        name: "",
        description: "",
        durationMinutes: 30,
        price: 0,
        displayOrder: 0,
        categoryId: "",
        employeeId: null,
    });

    // Form state for category
    const [categoryForm, setCategoryForm] = useState<Partial<CreateCategoryData>>({
        name: "",
        description: "",
        displayOrder: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [servicesData, categoriesData, employeesData] = await Promise.all([
                getAdminServices(),
                getAdminCategories(),
                getEmployeesForAssignment(),
            ]);
            setServices(servicesData);
            setCategories(categoriesData);
            setEmployees(employeesData);
        } catch (err: any) {
            setError(err.message || "Fehler beim Laden der Daten");
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateService = async () => {
        try {
            if (!serviceForm.name || !serviceForm.categoryId) {
                setError("Bitte füllen Sie alle Pflichtfelder aus");
                return;
            }
            const newService = await createAdminService(serviceForm as CreateServiceData);
            setServices([...services, newService]);
            setModalMode(null);
            resetForms();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdateService = async () => {
        try {
            if (!selectedItem || !('categoryId' in selectedItem)) return;
            const updated = await updateAdminService(selectedItem.id, {
                name: serviceForm.name!,
                description: serviceForm.description || null,
                durationMinutes: serviceForm.durationMinutes!,
                price: serviceForm.price!,
                displayOrder: serviceForm.displayOrder!,
                categoryId: serviceForm.categoryId!,
                employeeId: serviceForm.employeeId || null,
                isActive: selectedItem.isActive,
            });
            setServices(services.map(s => s.id === updated.id ? updated : s));
            setModalMode(null);
            resetForms();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteService = async () => {
        try {
            if (!selectedItem || !('categoryId' in selectedItem)) return;
            await deleteAdminService(selectedItem.id);
            setServices(services.filter(s => s.id !== selectedItem.id));
            setModalMode(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleToggleActive = async (service: AdminService) => {
        try {
            const result = await toggleServiceActive(service.id);
            setServices(services.map(s =>
                s.id === service.id ? { ...s, isActive: result.isActive } : s
            ));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCreateCategory = async () => {
        try {
            if (!categoryForm.name) {
                setError("Bitte geben Sie einen Namen ein");
                return;
            }
            const newCategory = await createAdminCategory(categoryForm as CreateCategoryData);
            setCategories([...categories, newCategory]);
            setModalMode(null);
            resetForms();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleUpdateCategory = async () => {
        try {
            if (!selectedItem || !('services' in selectedItem)) return;
            const updated = await updateAdminCategory(selectedItem.id, {
                name: categoryForm.name!,
                description: categoryForm.description || null,
                displayOrder: categoryForm.displayOrder!,
                isActive: selectedItem.isActive,
            });
            setCategories(categories.map(c => c.id === updated.id ? updated : c));
            setModalMode(null);
            resetForms();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            if (!selectedItem || !('services' in selectedItem)) return;
            await deleteAdminCategory(selectedItem.id);
            setCategories(categories.filter(c => c.id !== selectedItem.id));
            setModalMode(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleBulkAssign = async () => {
        try {
            if (!selectedEmployee) return;
            await bulkAssignServicesToEmployee(selectedEmployee.id, Array.from(selectedServices));
            await loadData();
            setSelectedEmployee(null);
            setSelectedServices(new Set());
            setViewMode("services");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const resetForms = () => {
        setServiceForm({
            name: "",
            description: "",
            durationMinutes: 30,
            price: 0,
            displayOrder: 0,
            categoryId: "",
            employeeId: null,
        });
        setCategoryForm({
            name: "",
            description: "",
            displayOrder: 0,
        });
        setSelectedItem(null);
    };

    const openServiceModal = (mode: "create" | "edit", service?: AdminService) => {
        if (mode === "edit" && service) {
            setSelectedItem(service);
            setServiceForm({
                name: service.name,
                description: service.description,
                durationMinutes: service.durationMinutes,
                price: service.price,
                displayOrder: service.displayOrder,
                categoryId: service.categoryId,
                employeeId: service.employeeId,
            });
        }
        setModalMode(mode);
    };

    const openCategoryModal = (mode: "create" | "edit", category?: AdminServiceCategory) => {
        if (mode === "edit" && category) {
            setSelectedItem(category);
            setCategoryForm({
                name: category.name,
                description: category.description,
                displayOrder: category.displayOrder,
            });
        }
        setModalMode(mode);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] via-[#F5EDEB] to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#E8C7C3] animate-spin mx-auto mb-4" />
                    <p className="text-[#8A8A8A]">Daten werden geladen...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] via-[#F5EDEB] to-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="p-2 hover:bg-[#E8C7C3]/20 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={24} className="text-[#8A8A8A]" />
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
                            Service Verwaltung
                        </h1>
                    </div>
                </div>

                {/* View Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
                    <button
                        onClick={() => setViewMode("services")}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${viewMode === "services"
                                ? "bg-[#E8C7C3] text-white"
                                : "text-[#8A8A8A] hover:bg-[#F5EDEB]"
                            }`}
                    >
                        Services
                    </button>
                    <button
                        onClick={() => setViewMode("categories")}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${viewMode === "categories"
                                ? "bg-[#E8C7C3] text-white"
                                : "text-[#8A8A8A] hover:bg-[#F5EDEB]"
                            }`}
                    >
                        Kategorien
                    </button>
                    <button
                        onClick={() => setViewMode("assignments")}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${viewMode === "assignments"
                                ? "bg-[#E8C7C3] text-white"
                                : "text-[#8A8A8A] hover:bg-[#F5EDEB]"
                            }`}
                    >
                        Mitarbeiter-Zuordnung
                    </button>
                </div>

                {/* Search and Add Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Suchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startContent={<Search size={18} className="text-[#8A8A8A]" />}
                            endContent={
                                searchTerm ? (
                                    <button onClick={() => setSearchTerm("")}>
                                        <X size={16} className="text-[#8A8A8A]" />
                                    </button>
                                ) : null
                            }
                            classNames={{
                                inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        />
                    </div>
                    {viewMode === "services" && (
                        <Button
                            onPress={() => openServiceModal("create")}
                            className="bg-[#E8C7C3] text-white font-bold py-6 px-6 rounded-xl hover:bg-[#D8B0AC] transition-all"
                            startContent={<Plus size={20} />}
                        >
                            Neuer Service
                        </Button>
                    )}
                    {viewMode === "categories" && (
                        <Button
                            onPress={() => openCategoryModal("create")}
                            className="bg-[#E8C7C3] text-white font-bold py-6 px-6 rounded-xl hover:bg-[#D8B0AC] transition-all"
                            startContent={<Plus size={20} />}
                        >
                            Neue Kategorie
                        </Button>
                    )}
                </div>

                {/* Error Display */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Services View */}
                {viewMode === "services" && (
                    <div className="space-y-4">
                        {filteredServices.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl">
                                <Tag size={48} className="text-[#8A8A8A] mx-auto mb-3 opacity-50" />
                                <p className="text-[#8A8A8A]">Keine Services gefunden</p>
                            </div>
                        ) : (
                            filteredServices.map((service) => (
                                <Card key={service.id} className="w-full">
                                    <CardBody className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-[#1E1E1E] text-lg">
                                                        {service.name}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.isActive
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {service.isActive ? "Aktiv" : "Inaktiv"}
                                                    </span>
                                                </div>
                                                {service.description && (
                                                    <p className="text-sm text-[#8A8A8A] mb-3">
                                                        {service.description}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-3">
                                                    <span className="flex items-center gap-1 text-xs bg-[#F5EDEB] px-3 py-1.5 rounded-full">
                                                        <Clock size={14} className="text-[#E8C7C3]" />
                                                        {service.durationMinutes} Min
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs bg-[#F5EDEB] px-3 py-1.5 rounded-full">
                                                        <DollarSign size={14} className="text-[#E8C7C3]" />
                                                        {service.price.toFixed(2)} CHF
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs bg-[#F5EDEB] px-3 py-1.5 rounded-full">
                                                        <Tag size={14} className="text-[#E8C7C3]" />
                                                        {service.categoryName}
                                                    </span>
                                                    {service.employeeName && (
                                                        <span className="flex items-center gap-1 text-xs bg-[#F5EDEB] px-3 py-1.5 rounded-full">
                                                            <Users size={14} className="text-[#E8C7C3]" />
                                                            {service.employeeName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleActive(service)}
                                                    className={`p-2 rounded-lg transition-colors ${service.isActive
                                                            ? "hover:bg-yellow-100 text-yellow-600"
                                                            : "hover:bg-green-100 text-green-600"
                                                        }`}
                                                    title={service.isActive ? "Deaktivieren" : "Aktivieren"}
                                                >
                                                    {service.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => openServiceModal("edit", service)}
                                                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                                                    title="Bearbeiten"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(service);
                                                        setModalMode("delete");
                                                    }}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                                    title="Löschen"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {/* Categories View */}
                {viewMode === "categories" && (
                    <div className="space-y-4">
                        {filteredCategories.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl">
                                <Tag size={48} className="text-[#8A8A8A] mx-auto mb-3 opacity-50" />
                                <p className="text-[#8A8A8A]">Keine Kategorien gefunden</p>
                            </div>
                        ) : (
                            filteredCategories.map((category) => (
                                <Card key={category.id} className="w-full">
                                    <CardBody className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-[#1E1E1E] text-lg">
                                                        {category.name}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.isActive
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {category.isActive ? "Aktiv" : "Inaktiv"}
                                                    </span>
                                                    <span className="text-xs bg-[#F5EDEB] px-2 py-1 rounded-full">
                                                        {category.services.length} Services
                                                    </span>
                                                </div>
                                                {category.description && (
                                                    <p className="text-sm text-[#8A8A8A]">
                                                        {category.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openCategoryModal("edit", category)}
                                                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                                                    title="Bearbeiten"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(category);
                                                        setModalMode("delete-category");
                                                    }}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                                                    title="Löschen"
                                                    disabled={category.services.length > 0}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {/* Assignments View */}
                {viewMode === "assignments" && (
                    <div className="space-y-6">
                        {employees.map((employee) => (
                            <Card key={employee.id} className="w-full">
                                <CardBody className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-[#1E1E1E] text-lg">{employee.name}</h3>
                                            <p className="text-sm text-[#8A8A8A]">{employee.role} • {employee.specialty}</p>
                                        </div>
                                        <Button
                                            onPress={() => {
                                                setSelectedEmployee(employee);
                                                setSelectedServices(new Set(
                                                    services
                                                        .filter(s => s.employeeId === employee.id)
                                                        .map(s => s.id)
                                                ));
                                            }}
                                            className="bg-[#E8C7C3] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#D8B0AC] transition-all"
                                        >
                                            Services zuweisen ({employee.serviceCount})
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {services
                                            .filter(s => s.employeeId === employee.id)
                                            .slice(0, 5)
                                            .map(s => (
                                                <span key={s.id} className="text-xs bg-[#F5EDEB] px-3 py-1.5 rounded-full">
                                                    {s.name}
                                                </span>
                                            ))}
                                        {employee.serviceCount > 5 && (
                                            <span className="text-xs bg-[#F5EDEB] px-3 py-1.5 rounded-full">
                                                +{employee.serviceCount - 5} weitere
                                            </span>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modals */}

                {/* Create/Edit Service Modal */}
                <AnimatePresence>
                    {modalMode === "create" && (
                        <ServiceModal
                            mode="create"
                            form={serviceForm}
                            setForm={setServiceForm}
                            categories={categories}
                            employees={employees}
                            onSave={handleCreateService}
                            onClose={() => {
                                setModalMode(null);
                                resetForms();
                            }}
                        />
                    )}
                    {modalMode === "edit" && selectedItem && 'categoryId' in selectedItem && (
                        <ServiceModal
                            mode="edit"
                            form={serviceForm}
                            setForm={setServiceForm}
                            categories={categories}
                            employees={employees}
                            onSave={handleUpdateService}
                            onClose={() => {
                                setModalMode(null);
                                resetForms();
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Create/Edit Category Modal */}
                <AnimatePresence>
                    {modalMode === "create-category" && (
                        <CategoryModal
                            mode="create"
                            form={categoryForm}
                            setForm={setCategoryForm}
                            onSave={handleCreateCategory}
                            onClose={() => {
                                setModalMode(null);
                                resetForms();
                            }}
                        />
                    )}
                    {modalMode === "edit-category" && selectedItem && 'services' in selectedItem && (
                        <CategoryModal
                            mode="edit"
                            form={categoryForm}
                            setForm={setCategoryForm}
                            onSave={handleUpdateCategory}
                            onClose={() => {
                                setModalMode(null);
                                resetForms();
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {modalMode === "delete" && selectedItem && 'categoryId' in selectedItem && (
                        <DeleteModal
                            title="Service löschen"
                            message={`Sind Sie sicher, dass Sie den Service "${selectedItem.name}" löschen möchten?`}
                            warning="Diese Aktion kann nicht rückgängig gemacht werden."
                            onConfirm={handleDeleteService}
                            onClose={() => {
                                setModalMode(null);
                                setSelectedItem(null);
                            }}
                        />
                    )}
                    {modalMode === "delete-category" && selectedItem && 'services' in selectedItem && (
                        <DeleteModal
                            title="Kategorie löschen"
                            message={`Sind Sie sicher, dass Sie die Kategorie "${selectedItem.name}" löschen möchten?`}
                            warning={selectedItem.services.length > 0
                                ? "Diese Kategorie enthält noch Services und kann nicht gelöscht werden."
                                : "Diese Aktion kann nicht rückgängig gemacht werden."}
                            onConfirm={handleDeleteCategory}
                            onClose={() => {
                                setModalMode(null);
                                setSelectedItem(null);
                            }}
                            disabled={selectedItem.services.length > 0}
                        />
                    )}
                </AnimatePresence>

                {/* Assignment Modal */}
                <AnimatePresence>
                    {selectedEmployee && (
                        <AssignmentModal
                            employee={selectedEmployee}
                            services={services}
                            selectedServices={selectedServices}
                            setSelectedServices={setSelectedServices}
                            onAssign={handleBulkAssign}
                            onClose={() => {
                                setSelectedEmployee(null);
                                setSelectedServices(new Set());
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Service Modal Component
function ServiceModal({
    mode, form, setForm, categories, employees, onSave, onClose
}: {
    mode: "create" | "edit";
    form: Partial<CreateServiceData>;
    setForm: (form: any) => void;
    categories: AdminServiceCategory[];
    employees: EmployeeForAssignment[];
    onSave: () => void;
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#1E1E1E] mb-6">
                        {mode === "create" ? "Neuen Service erstellen" : "Service bearbeiten"}
                    </h2>

                    <div className="space-y-4">
                        <Input
                            label="Name *"
                            placeholder="z.B. Medizinisches Microneedling"
                            value={form.name || ""}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            isRequired
                            classNames={{
                                inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        />

                        <Textarea
                            label="Beschreibung"
                            placeholder="Beschreibung des Services..."
                            value={form.description || ""}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            classNames={{
                                inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Dauer (Minuten) *"
                                type="number"
                                min={5}
                                value={form.durationMinutes?.toString() || "30"}
                                onChange={(e) => setForm({ ...form, durationMinutes: parseInt(e.target.value) })}
                                isRequired
                                endContent={<Clock size={18} className="text-[#8A8A8A]" />}
                                classNames={{
                                    inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                                }}
                            />

                            <Input
                                label="Preis (CHF) *"
                                type="number"
                                min={0}
                                step={0.01}
                                value={form.price?.toString() || "0"}
                                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                                isRequired
                                startContent={<DollarSign size={18} className="text-[#8A8A8A]" />}
                                classNames={{
                                    inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                                }}
                            />
                        </div>

                        <Input
                            label="Sortierreihenfolge"
                            type="number"
                            min={0}
                            value={form.displayOrder?.toString() || "0"}
                            onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) })}
                            classNames={{
                                inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        />

                        <Select
                            label="Kategorie *"
                            placeholder="Kategorie auswählen"
                            selectedKeys={form.categoryId ? [form.categoryId] : []}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            isRequired
                            classNames={{
                                trigger: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        >
                            {categories.filter(c => c.isActive).map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="Mitarbeiter (optional)"
                            placeholder="Mitarbeiter auswählen"
                            selectedKeys={form.employeeId ? [form.employeeId] : []}
                            onChange={(e) => setForm({ ...form, employeeId: e.target.value || null })}
                            classNames={{
                                trigger: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        >

                            {[
                                { key: "none", label: "Kein Mitarbeiter", value: "" },
                                ...employees.map((emp) => ({
                                    key: emp.id,
                                    label: `${emp.name} - ${emp.role}`,
                                    value: emp.id
                                }))
                            ].map((item) => (
                                <SelectItem key={item.key} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button
                            onPress={onClose}
                            className="bg-[#F5EDEB] text-[#1E1E1E] font-medium px-6 py-3 rounded-xl hover:bg-[#ede0dd] transition-all"
                        >
                            Abbrechen
                        </Button>
                        <Button
                            onPress={onSave}
                            className="bg-[#E8C7C3] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#D8B0AC] transition-all"
                            startContent={<Save size={18} />}
                        >
                            {mode === "create" ? "Erstellen" : "Speichern"}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Category Modal Component
function CategoryModal({
    mode, form, setForm, onSave, onClose
}: {
    mode: "create" | "edit";
    form: Partial<CreateCategoryData>;
    setForm: (form: any) => void;
    onSave: () => void;
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#1E1E1E] mb-6">
                        {mode === "create" ? "Neue Kategorie erstellen" : "Kategorie bearbeiten"}
                    </h2>

                    <div className="space-y-4">
                        <Input
                            label="Name *"
                            placeholder="z.B. Microneedling"
                            value={form.name || ""}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            isRequired
                            classNames={{
                                inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        />

                        <Textarea
                            label="Beschreibung"
                            placeholder="Beschreibung der Kategorie..."
                            value={form.description || ""}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            classNames={{
                                inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        />

                        <Input
                            label="Sortierreihenfolge"
                            type="number"
                            min={0}
                            value={form.displayOrder?.toString() || "0"}
                            onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) })}
                            classNames={{
                                inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button
                            onPress={onClose}
                            className="bg-[#F5EDEB] text-[#1E1E1E] font-medium px-6 py-3 rounded-xl hover:bg-[#ede0dd] transition-all"
                        >
                            Abbrechen
                        </Button>
                        <Button
                            onPress={onSave}
                            className="bg-[#E8C7C3] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#D8B0AC] transition-all"
                            startContent={<Save size={18} />}
                        >
                            {mode === "create" ? "Erstellen" : "Speichern"}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Delete Confirmation Modal
function DeleteModal({
    title, message, warning, onConfirm, onClose, disabled = false
}: {
    title: string;
    message: string;
    warning: string;
    onConfirm: () => void;
    onClose: () => void;
    disabled?: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1E1E1E] text-center mb-2">{title}</h2>
                    <p className="text-[#8A8A8A] text-center mb-4">{message}</p>
                    <p className="text-sm text-red-600 text-center mb-6">{warning}</p>

                    <div className="flex justify-center gap-3">
                        <Button
                            onPress={onClose}
                            className="bg-[#F5EDEB] text-[#1E1E1E] font-medium px-6 py-3 rounded-xl hover:bg-[#ede0dd] transition-all"
                        >
                            Abbrechen
                        </Button>
                        {!disabled && (
                            <Button
                                onPress={onConfirm}
                                className="bg-red-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-red-700 transition-all"
                            >
                                Löschen
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Assignment Modal
function AssignmentModal({
    employee, services, selectedServices, setSelectedServices, onAssign, onClose
}: {
    employee: EmployeeForAssignment;
    services: AdminService[];
    selectedServices: Set<string>;
    setSelectedServices: (services: Set<string>) => void;
    onAssign: () => void;
    onClose: () => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleService = (serviceId: string) => {
        const newSet = new Set(selectedServices);
        if (newSet.has(serviceId)) {
            newSet.delete(serviceId);
        } else {
            newSet.add(serviceId);
        }
        setSelectedServices(newSet);
    };

    const selectAll = () => {
        setSelectedServices(new Set(filteredServices.map(s => s.id)));
    };

    const deselectAll = () => {
        setSelectedServices(new Set());
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#1E1E1E] mb-2">
                        Services zuweisen
                    </h2>
                    <p className="text-[#8A8A8A] mb-6">
                        {employee.name} • {employee.role}
                    </p>

                    <div className="mb-4">
                        <Input
                            placeholder="Services durchsuchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startContent={<Search size={18} className="text-[#8A8A8A]" />}
                            classNames={{
                                inputWrapper: "bg-white border-2 border-[#E8C7C3]",
                            }}
                        />
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-[#8A8A8A]">
                            {selectedServices.size} von {filteredServices.length} ausgewählt
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={selectAll}
                                className="text-sm text-[#E8C7C3] hover:text-[#D8B0AC] transition-colors"
                            >
                                Alle auswählen
                            </button>
                            <span className="text-[#8A8A8A]">|</span>
                            <button
                                onClick={deselectAll}
                                className="text-sm text-[#8A8A8A] hover:text-[#1E1E1E] transition-colors"
                            >
                                Alle abwählen
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                        {filteredServices.map((service) => (
                            <Card
                                key={service.id}
                                isPressable
                                onPress={() => toggleService(service.id)}
                                className={`w-full transition-all ${selectedServices.has(service.id)
                                        ? "ring-2 ring-[#E8C7C3] ring-offset-2"
                                        : "hover:ring-2 hover:ring-[#E8C7C3]/30 hover:ring-offset-1"
                                    }`}
                            >
                                <CardBody className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedServices.has(service.id)
                                                ? "bg-[#E8C7C3] border-[#E8C7C3]"
                                                : "border-[#8A8A8A]"
                                            }`}>
                                            {selectedServices.has(service.id) && (
                                                <Check size={14} className="text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[#1E1E1E] text-sm">
                                                {service.name}
                                            </h4>
                                            <p className="text-xs text-[#8A8A8A]">
                                                {service.categoryName} • {service.durationMinutes} Min • {service.price.toFixed(2)} CHF
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            onPress={onClose}
                            className="bg-[#F5EDEB] text-[#1E1E1E] font-medium px-6 py-3 rounded-xl hover:bg-[#ede0dd] transition-all"
                        >
                            Abbrechen
                        </Button>
                        <Button
                            onPress={() => {
                                onAssign();
                                onClose();
                            }}
                            className="bg-[#E8C7C3] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#D8B0AC] transition-all"
                        >
                            Zuweisung speichern
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
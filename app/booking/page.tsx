// app/booking/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@nextui-org/button";
import { ChevronLeft, Check, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { EmployeeSelector, type Employee } from "@/components/booking/EmployeeSelector";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { ContactForm } from "@/components/booking/ContactForm";

import {
  getServices,
  getAvailability,
  createBooking,
  type Service,
  type TimeSlot,
  type CustomerInfo,
} from "@/lib/api/booking";
import { BookingEvents, getTrackingData } from "@/lib/tracking";

const STEP_LABELS = ["Service", "Fachkraft", "Termin", "Kontakt"];

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError("Fehler beim Laden der Services");
        console.error(err);
      }
    }
    loadServices();
  }, []);

  const handleLoadSlots = async (date: string) => {
    if (!selectedService) return;
    setLoadingSlots(true);
    setSelectedTime(null);
    try {
      const data = await getAvailability(selectedService.id, date);
      setAvailableSlots(data.availableSlots);
      BookingEvents.dateSelected(date);
    } catch (err) {
      setError("Fehler beim Laden der Verfügbarkeit");
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    BookingEvents.serviceSelected(service.name, service.price);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    BookingEvents.timeSlotSelected(time);
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setError("Bitte alle Felder ausfüllen");
      return;
    }
    if (!privacyAccepted) {
      setError("Bitte stimmen Sie den Datenschutzbestimmungen zu");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const trackingData = getTrackingData();
      const booking = await createBooking({
        serviceId: selectedService.id,
        bookingDate: selectedDate,
        startTime: selectedTime,
        customer: customerInfo,
        ...trackingData,
      });
      BookingEvents.bookingCompleted(
        booking.bookingNumber,
        selectedService.name,
        selectedService.price,
        trackingData
      );
      router.push(`/booking/confirmation/${booking.id}`);
    } catch (err: any) {
      setError(err.message || "Fehler beim Buchen. Bitte versuchen Sie es erneut.");
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedService !== null;
      case 2: return selectedEmployee !== null;
      case 3: return selectedDate !== null && selectedTime !== null;
      case 4: return (
        customerInfo.firstName.trim() !== "" &&
        customerInfo.lastName.trim() !== "" &&
        customerInfo.email.trim() !== "" &&
        customerInfo.phone.trim() !== "" &&
        privacyAccepted
      );
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDEB] via-[#F5EDEB] to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#8A8A8A] hover:text-[#017172] transition-colors mb-6"
        >
          <Home size={20} />
          <span>Zurück zur Startseite</span>
        </Link>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm
                      transition-all duration-300
                      ${currentStep > step
                        ? "bg-[#017172] text-white"
                        : currentStep === step
                          ? "bg-[#017172] text-white ring-4 ring-[#017172]/20"
                          : "bg-[#E8C7C3]/30 text-[#8A8A8A]"
                      }
                    `}
                  >
                    {currentStep > step ? <Check size={16} /> : step}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block ${
                    currentStep >= step ? "text-[#017172]" : "text-[#8A8A8A]"
                  }`}>{STEP_LABELS[step - 1]}</span>
                </div>
                {step < 4 && (
                  <div
                    className={`w-10 h-1 mx-1 rounded transition-all mb-4 ${
                      currentStep > step ? "bg-[#017172]" : "bg-[#E8C7C3]/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-3xl shadow-2xl p-8 ring-1 ring-[#E8C7C3]/20">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ServiceSelector services={services} selectedService={selectedService} onSelect={handleServiceSelect} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <EmployeeSelector selectedEmployee={selectedEmployee} onSelect={setSelectedEmployee} />
              </motion.div>
            )}

            {currentStep === 3 && selectedService && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <DateTimePicker
                  service={selectedService}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  availableSlots={availableSlots}
                  onDateSelect={setSelectedDate}
                  onTimeSelect={handleTimeSelect}
                  onLoadSlots={handleLoadSlots}
                  loading={loadingSlots}
                />
              </motion.div>
            )}

            {currentStep === 4 && selectedService && selectedDate && selectedTime && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {selectedEmployee && (
                  <div className="mb-4 flex items-center gap-3 bg-[#017172]/5 border border-[#017172]/20 rounded-xl px-4 py-3">
                    <div className="w-9 h-9 bg-[#017172] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {selectedEmployee.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs text-[#8A8A8A]">Ihre Fachkraft</span>
                      <p className="text-sm font-semibold text-[#1E1E1E]">{selectedEmployee.name} · {selectedEmployee.role}</p>
                    </div>
                  </div>
                )}
                <ContactForm
                  service={selectedService}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  customerInfo={customerInfo}
                  onCustomerInfoChange={setCustomerInfo}
                  privacyAccepted={privacyAccepted}
                  onPrivacyChange={setPrivacyAccepted}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-8">
          {currentStep > 1 ? (
            <Button
              variant="flat"
              onPress={() => setCurrentStep(currentStep - 1)}
              startContent={<ChevronLeft size={20} />}
              className="bg-[#F5EDEB] font-semibold text-[#1E1E1E] hover:bg-[#E8C7C3]/40"
            >
              Zurück
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <Button
              onPress={() => setCurrentStep(currentStep + 1)}
              isDisabled={!canProceed()}
              className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold px-8 shadow-lg shadow-[#017172]/20"
            >
              Weiter
            </Button>
          ) : (
            <Button
              onPress={handleSubmit}
              isDisabled={!canProceed() || submitting}
              isLoading={submitting}
              className="bg-gradient-to-r from-[#017172] to-[#015f60] text-white font-semibold px-8 shadow-lg shadow-[#017172]/20"
            >
              {submitting ? "Wird gebucht..." : "Termin buchen"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// app/booking/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@nextui-org/button";
import { ChevronLeft, Check, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ServiceSelector } from "@/components/booking/ServiceSelector";
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

export default function BookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (currentStep === 3) {
      BookingEvents.customerDataEntered();
    }
  }, [currentStep]);

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
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
      case 2: return selectedDate !== null && selectedTime !== null;
      case 3: return (
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
          className="inline-flex items-center gap-2 text-[#8A8A8A] hover:text-[#E8C7C3] transition-colors mb-6"
        >
          <Home size={20} />
          <span>Zurück zur Startseite</span>
        </Link>

        <div className="mb-8">
          <div className="flex justify-center items-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold
                    transition-all duration-300
                    ${currentStep > step
                      ? "bg-[#E8C7C3] text-white"
                      : currentStep === step
                        ? "bg-[#E8C7C3] text-white ring-4 ring-[#E8C7C3]/20"
                        : "bg-[#F0E6E4] text-[#8A8A8A]"
                    }
                  `}
                >
                  {currentStep > step ? <Check size={20} /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded transition-all ${
                      currentStep > step ? "bg-[#E8C7C3]" : "bg-[#F0E6E4]"
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
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ServiceSelector
                  services={services}
                  selectedService={selectedService}
                  onSelect={handleServiceSelect}
                />
              </motion.div>
            )}

            {currentStep === 2 && selectedService && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
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

            {currentStep === 3 && selectedService && selectedDate && selectedTime && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
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
              className="bg-[#F5EDEB] font-semibold text-[#1E1E1E]"
            >
              Zurück
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <Button
              onPress={() => setCurrentStep(currentStep + 1)}
              isDisabled={!canProceed()}
              className="bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] text-white font-semibold px-8"
            >
              Weiter
            </Button>
          ) : (
            <Button
              onPress={handleSubmit}
              isDisabled={!canProceed() || submitting}
              isLoading={submitting}
              className="bg-gradient-to-r from-[#E8C7C3] to-[#D8B0AC] text-white font-semibold px-8"
            >
              {submitting ? "Wird gebucht..." : "Termin buchen"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
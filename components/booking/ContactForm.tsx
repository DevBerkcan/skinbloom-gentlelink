"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { MapPin, Sparkles, Calendar, AlertCircle } from "lucide-react";
import type { Service, CustomerInfo } from "@/lib/api/booking";

interface ContactFormProps {
  service: Service;
  selectedDate: string;
  selectedTime: string;
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  privacyAccepted: boolean;
  onPrivacyChange: (accepted: boolean) => void;
  onSubmitAttempt?: boolean; // Add this prop from parent
}

export function ContactForm({
  service,
  selectedDate,
  selectedTime,
  customerInfo,
  onCustomerInfoChange,
  privacyAccepted,
  onPrivacyChange,
  onSubmitAttempt = false
}: ContactFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate all fields and update errors
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    // First name validation
    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = "Vorname ist erforderlich";
    } else if (customerInfo.firstName.length < 2) {
      newErrors.firstName = "Vorname muss mindestens 2 Zeichen lang sein";
    }
    
    // Last name validation
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = "Nachname ist erforderlich";
    } else if (customerInfo.lastName.length < 2) {
      newErrors.lastName = "Nachname muss mindestens 2 Zeichen lang sein";
    }
    
    // Email validation
    if (!customerInfo.email.trim()) {
      newErrors.email = "E-Mail ist erforderlich";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
    }
    
    // Phone validation
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Telefonnummer ist erforderlich";
    } else if (!/^[\d\s\+\-\(\)]{10,}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Ungültige Telefonnummer (mindestens 10 Ziffern)";
    }
    
    setErrors(newErrors);
  }, [customerInfo]);

  const handleBlur = (field: keyof CustomerInfo) => {
    setTouched({ ...touched, [field]: true });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Only show errors if field was touched OR submit was attempted
  const showError = (field: keyof CustomerInfo) => {
    return (touched[field] || onSubmitAttempt) && errors[field];
  };

  const missingFields = [];
  if (!customerInfo.firstName) missingFields.push("Vorname");
  if (!customerInfo.lastName) missingFields.push("Nachname");
  if (!customerInfo.email) missingFields.push("E-Mail");
  if (!customerInfo.phone) missingFields.push("Telefon");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
          Kontaktdaten
        </h2>
        <p className="text-[#8A8A8A]">
          Schritt 4 von 4 – Geben Sie Ihre Kontaktdaten ein
        </p>
      </div>

      {/* Buchungsübersicht */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F5EDEB] rounded-xl p-6 space-y-4"
      >
        <div className="flex items-start gap-3">
          <Calendar className="text-[#E8C7C3] flex-shrink-0 mt-1" size={20} />
          <div>
            <div className="font-semibold text-[#1E1E1E]">
              {formatDate(selectedDate)}
            </div>
            <div className="text-[#8A8A8A] text-sm">
              {selectedTime} Uhr
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Sparkles className="text-[#E8C7C3] flex-shrink-0 mt-1" size={20} />
          <div>
            <div className="font-semibold text-[#1E1E1E]">
              {service.name}
            </div>
            <div className="text-[#8A8A8A] text-sm">
              {service.durationMinutes} Minuten • {service.price.toFixed(2)} CHF
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="text-[#E8C7C3] flex-shrink-0 mt-1" size={20} />
          <div className="text-[#6B6B6B] text-sm">
            Elisabethenstrasse 41, 4051 Basel, Schweiz
          </div>
        </div>
      </motion.div>

      {/* Error Summary - only shown after submit attempt */}
      {onSubmitAttempt && Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="font-semibold text-red-700 text-sm mb-1">
                Bitte korrigieren Sie folgende Fehler:
              </h4>
              <ul className="text-sm text-red-600 list-disc list-inside space-y-0.5">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Missing Fields Warning - only shown after submit attempt */}
      {onSubmitAttempt && Object.keys(errors).length === 0 && missingFields.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-amber-700">
              <span className="font-semibold">Noch nicht ausgefüllt:</span>{' '}
              {missingFields.join(", ")}
            </p>
          </div>
        </motion.div>
      )}

      {/* Kontaktformular */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Vorname*"
              placeholder="Max"
              value={customerInfo.firstName}
              onValueChange={(value) => {
                onCustomerInfoChange({ ...customerInfo, firstName: value });
              }}
              onBlur={() => handleBlur("firstName")}
              errorMessage={showError("firstName") ? errors.firstName : ""}
              isInvalid={!!showError("firstName")}
              isRequired
              classNames={{
                input: "text-[#1E1E1E]",
                inputWrapper: [
                  "border-2",
                  showError("firstName")
                    ? "border-red-500"
                    : "border-[#E8C7C3] focus-within:border-[#E8C7C3]"
                ],
                label: "text-[#8A8A8A] font-medium",
              }}
            />
          </div>

          <div>
            <Input
              label="Nachname*"
              placeholder="Mustermann"
              value={customerInfo.lastName}
              onValueChange={(value) => {
                onCustomerInfoChange({ ...customerInfo, lastName: value });
              }}
              onBlur={() => handleBlur("lastName")}
              errorMessage={showError("lastName") ? errors.lastName : ""}
              isInvalid={!!showError("lastName")}
              isRequired
              classNames={{
                input: "text-[#1E1E1E]",
                inputWrapper: [
                  "border-2",
                  showError("lastName")
                    ? "border-red-500"
                    : "border-[#E8C7C3] focus-within:border-[#E8C7C3]"
                ],
                label: "text-[#8A8A8A] font-medium",
              }}
            />
          </div>
        </div>

        <div>
          <Input
            type="email"
            label="E-Mail*"
            placeholder="max.mustermann@example.com"
            value={customerInfo.email}
            onValueChange={(value) => {
              onCustomerInfoChange({ ...customerInfo, email: value });
            }}
            onBlur={() => handleBlur("email")}
            errorMessage={showError("email") ? errors.email : ""}
            isInvalid={!!showError("email")}
            isRequired
            classNames={{
              input: "text-[#1E1E1E]",
              inputWrapper: [
                "border-2",
                showError("email")
                  ? "border-red-500"
                  : "border-[#E8C7C3] focus-within:border-[#E8C7C3]"
              ],
              label: "text-[#8A8A8A] font-medium",
            }}
          />
        </div>

        <div>
          <Input
            type="tel"
            label="Telefon*"
            placeholder="+41 123 456789"
            value={customerInfo.phone}
            onValueChange={(value) => {
              onCustomerInfoChange({ ...customerInfo, phone: value });
            }}
            onBlur={() => handleBlur("phone")}
            errorMessage={showError("phone") ? errors.phone : ""}
            isInvalid={!!showError("phone")}
            isRequired
            classNames={{
              input: "text-[#1E1E1E]",
              inputWrapper: [
                "border-2",
                showError("phone")
                  ? "border-red-500"
                  : "border-[#E8C7C3] focus-within:border-[#E8C7C3]"
              ],
              label: "text-[#8A8A8A] font-medium",
            }}
          />
        </div>

        <div className="space-y-1">
          <Checkbox
            isSelected={privacyAccepted}
            onValueChange={onPrivacyChange}
            classNames={{
              wrapper: "before:border-[#E8C7C3]",
              icon: "text-white"
            }}
          >
            <span className="text-sm text-[#6B6B6B]">
              Ich habe die{" "}
              <a href="/datenschutz" className="text-[#E8C7C3] underline" target="_blank">
                Datenschutzhinweise
              </a>{" "}
              gelesen und stimme diesen zu. *
            </span>
          </Checkbox>
          {onSubmitAttempt && !privacyAccepted && (
            <p className="text-xs text-red-500 px-1">
              Bitte akzeptieren Sie die Datenschutzhinweise
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
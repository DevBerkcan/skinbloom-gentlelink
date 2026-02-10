"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { MapPin, Scissors, Calendar } from "lucide-react";
import type { Service, CustomerInfo } from "@/lib/api/booking";

interface ContactFormProps {
  service: Service;
  selectedDate: string;
  selectedTime: string;
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  privacyAccepted: boolean;
  onPrivacyChange: (accepted: boolean) => void;
}

export function ContactForm({
  service,
  selectedDate,
  selectedTime,
  customerInfo,
  onCustomerInfoChange,
  privacyAccepted,
  onPrivacyChange
}: ContactFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof CustomerInfo, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          newErrors[field] = "Dieses Feld ist erforderlich";
        } else {
          delete newErrors[field];
        }
        break;
      case "email":
        if (!value.trim()) {
          newErrors[field] = "Email ist erforderlich";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field] = "Ungültige Email-Adresse";
        } else {
          delete newErrors[field];
        }
        break;
      case "phone":
        if (!value.trim()) {
          newErrors[field] = "Telefonnummer ist erforderlich";
        } else if (!/^[\d\s\+\-\(\)]+$/.test(value)) {
          newErrors[field] = "Ungültige Telefonnummer";
        } else {
          delete newErrors[field];
        }
        break;
    }

    setErrors(newErrors);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-barber-black mb-2">
          Kontaktdaten
        </h2>
        <p className="text-barber-grey-600">
          Schritt 3 von 3
        </p>
      </div>

      {/* Buchungsübersicht */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-barber-cream rounded-xl p-6 space-y-4"
      >
        <div className="flex items-start gap-3">
          <Calendar className="text-barber-red flex-shrink-0 mt-1" size={20} />
          <div>
            <div className="font-semibold text-barber-black">
              {formatDate(selectedDate)}
            </div>
            <div className="text-barber-grey-600 text-sm">
              {selectedTime} Uhr
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Scissors className="text-barber-red flex-shrink-0 mt-1" size={20} />
          <div>
            <div className="font-semibold text-barber-black">
              {service.name}
            </div>
            <div className="text-barber-grey-600 text-sm">
              {service.durationMinutes} Minuten • ab {service.price.toFixed(2)} EUR
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="text-barber-red flex-shrink-0 mt-1" size={20} />
          <div className="text-barber-grey-700 text-sm">
            Berliner Allee 43, 40212 Düsseldorf
          </div>
        </div>
      </motion.div>

      {/* Kontaktformular */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Vorname*"
            placeholder="Max"
            value={customerInfo.firstName}
            onValueChange={(value) => {
              onCustomerInfoChange({ ...customerInfo, firstName: value });
              validateField("firstName", value);
            }}
            errorMessage={errors.firstName}
            isInvalid={!!errors.firstName}
            classNames={{
              input: "text-barber-black",
              inputWrapper: [
                "border-2",
                errors.firstName
                  ? "border-red-500"
                  : "border-barber-grey-200 focus-within:border-barber-red"
              ]
            }}
          />

          <Input
            label="Nachname*"
            placeholder="Mustermann"
            value={customerInfo.lastName}
            onValueChange={(value) => {
              onCustomerInfoChange({ ...customerInfo, lastName: value });
              validateField("lastName", value);
            }}
            errorMessage={errors.lastName}
            isInvalid={!!errors.lastName}
            classNames={{
              input: "text-barber-black",
              inputWrapper: [
                "border-2",
                errors.lastName
                  ? "border-red-500"
                  : "border-barber-grey-200 focus-within:border-barber-red"
              ]
            }}
          />
        </div>

        <Input
          type="email"
          label="E-Mail*"
          placeholder="max.mustermann@example.com"
          value={customerInfo.email}
          onValueChange={(value) => {
            onCustomerInfoChange({ ...customerInfo, email: value });
            validateField("email", value);
          }}
          errorMessage={errors.email}
          isInvalid={!!errors.email}
          classNames={{
            input: "text-barber-black",
            inputWrapper: [
              "border-2",
              errors.email
                ? "border-red-500"
                : "border-barber-grey-200 focus-within:border-barber-red"
            ]
          }}
        />

        <Input
          type="tel"
          label="Telefon*"
          placeholder="+49 123 456789"
          value={customerInfo.phone}
          onValueChange={(value) => {
            onCustomerInfoChange({ ...customerInfo, phone: value });
            validateField("phone", value);
          }}
          errorMessage={errors.phone}
          isInvalid={!!errors.phone}
          classNames={{
            input: "text-barber-black",
            inputWrapper: [
              "border-2",
              errors.phone
                ? "border-red-500"
                : "border-barber-grey-200 focus-within:border-barber-red"
            ]
          }}
        />

        <Checkbox
          isSelected={privacyAccepted}
          onValueChange={onPrivacyChange}
          classNames={{
            wrapper: "before:border-barber-grey-300",
            icon: "text-white"
          }}
        >
          <span className="text-sm text-barber-grey-700">
            Ich habe die{" "}
            <a href="/datenschutz" className="text-barber-red underline" target="_blank">
              Datenschutzhinweise
            </a>{" "}
            gelesen und stimme diesen zu.
          </span>
        </Checkbox>
      </div>
    </div>
  );
}

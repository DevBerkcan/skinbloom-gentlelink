// components/booking/EmployeeSelector.tsx
"use client";

import { motion } from "framer-motion";
import { User, Star } from "lucide-react";

export interface Employee {
  id: string;
  name: string;
  role: string;
  specialty: string;
}

export const EMPLOYEES: Employee[] = [
  {
    id: "basel",
    name: "Basel",
    role: "Ästhetik-Expertin",
    specialty: "Gesichtsbehandlungen & Filler",
  },
  {
    id: "frank",
    name: "Frank",
    role: "Behandlungsspezialist",
    specialty: "Botox & Lifting",
  },
];

interface EmployeeSelectorProps {
  selectedEmployee: Employee | null;
  onSelect: (employee: Employee) => void;
}

export function EmployeeSelector({ selectedEmployee, onSelect }: EmployeeSelectorProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1E1E1E] mb-1">Fachkraft wählen</h2>
        <p className="text-[#8A8A8A] text-sm">Schritt 2 von 4 – Wer soll Ihre Behandlung durchführen?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EMPLOYEES.map((emp) => {
          const isSelected = selectedEmployee?.id === emp.id;
          return (
            <motion.button
              key={emp.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(emp)}
              className={`relative text-left rounded-2xl border-2 p-6 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? "border-[#017172] bg-[#017172]/5 shadow-lg shadow-[#017172]/10"
                  : "border-[#E8C7C3]/30 bg-white hover:border-[#017172]/40 hover:shadow-md"
                }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-[#017172] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold
                  ${isSelected ? "bg-[#017172] text-white" : "bg-[#F5EDEB] text-[#017172]"}`}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E1E1E]">{emp.name}</h3>
                  <p className={`text-sm font-medium ${isSelected ? "text-[#017172]" : "text-[#8A8A8A]"}`}>
                    {emp.role}
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-2 text-sm rounded-xl px-3 py-2
                ${isSelected ? "bg-[#017172]/10 text-[#017172]" : "bg-[#F5EDEB] text-[#8A8A8A]"}`}>
                <Star size={13} className={isSelected ? "fill-[#017172]" : ""} />
                <span>{emp.specialty}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

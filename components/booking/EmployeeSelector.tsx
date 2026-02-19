"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { User, Star, Loader2 } from "lucide-react";
import { getEmployees, type Employee } from "@/lib/api/booking";

interface EmployeeSelectorProps {
  selectedEmployee: Employee | null;
  onSelect: (employee: Employee) => void;
}

export function EmployeeSelector({ selectedEmployee, onSelect }: EmployeeSelectorProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#E8C7C3]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-2">
          Fachkraft wählen
        </h2>
        <p className="text-sm sm:text-base text-[#8A8A8A]">
          Schritt 2 von 5 – Wer soll Ihre Behandlung durchführen?
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        {employees.map((emp) => {
          const isSelected = selectedEmployee?.id === emp.id;

          return (
            <Card
              key={emp.id}
              isPressable
              onPress={() => onSelect(emp)}
              className={`w-full transition-all ${
                isSelected
                  ? "ring-2 ring-[#E8C7C3] ring-offset-2"
                  : "hover:ring-2 hover:ring-[#E8C7C3]/30 hover:ring-offset-1"
              }`}
              fullWidth
            >
              <CardBody className="p-3 sm:p-4 w-full">
                <div className="flex items-start gap-3 sm:gap-4 w-full">
                  <div
                    className={`flex-shrink-0 p-2 sm:p-3 rounded-xl transition-colors ${
                      isSelected ? "bg-[#E8C7C3]" : "bg-[#E8C7C3]/10"
                    }`}
                  >
                    <User
                      className={isSelected ? "text-white" : "text-[#E8C7C3]"}
                      size={20}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#1E1E1E] text-sm sm:text-base break-words pr-1">
                          {emp.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1 break-words">
                          {emp.role}
                        </p>
                        {emp.specialty && (
                          <div className="flex items-center gap-2 mt-2">
                            <div
                              className={`flex items-center gap-1 text-xs sm:text-sm rounded-xl px-2 py-1 transition-colors ${
                                isSelected
                                  ? "bg-[#E8C7C3]/10 text-[#E8C7C3]"
                                  : "bg-[#F5EDEB] text-[#8A8A8A]"
                              }`}
                            >
                              <Star
                                size={13}
                                className={isSelected ? "fill-[#E8C7C3]" : ""}
                              />
                              <span className="truncate">{emp.specialty}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#E8C7C3] rounded-full flex items-center justify-center ml-1">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
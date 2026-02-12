"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@nextui-org/button";
import type { Service, TimeSlot } from "@/lib/api/booking";

interface DateTimePickerProps {
  service: Service;
  selectedDate: string | null;
  selectedTime: string | null;
  availableSlots: TimeSlot[];
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onLoadSlots: (date: string) => void;
  loading: boolean;
}

export function DateTimePicker({
  service,
  selectedDate,
  selectedTime,
  availableSlots,
  onDateSelect,
  onTimeSelect,
  onLoadSlots,
  loading
}: DateTimePickerProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday;
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('de-DE', { weekday: 'short' });
  };

  const formatDayNumber = (date: Date) => {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
          Wähle Datum & Uhrzeit
        </h2>
        <p className="text-[#8A8A8A]">
          Schritt 2 von 3 • {service.name}
        </p>
      </div>

      {/* Wochennavigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          isIconOnly
          variant="flat"
          onPress={goToPreviousWeek}
          className="bg-[#F5EDEB]"
        >
          <ChevronLeft size={20} />
        </Button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-[#6B6B6B]">
            <Calendar size={18} />
            <span className="font-semibold">
              {currentWeekStart.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
              {' - '}
              {weekDays[6].toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
          </div>
        </div>

        <Button
          isIconOnly
          variant="flat"
          onPress={goToNextWeek}
          className="bg-[#F5EDEB]"
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Tage-Auswahl */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const dateStr = formatDate(date);
          const isSelected = selectedDate === dateStr;
          const isDisabled = isPast(date);

          return (
            <motion.button
              key={dateStr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                if (!isDisabled) {
                  onDateSelect(dateStr);
                  onLoadSlots(dateStr);
                }
              }}
              disabled={isDisabled}
              className={`
                py-3 px-2 rounded-xl transition-all text-center
                ${isSelected
                  ? 'bg-[#E8C7C3] text-white shadow-lg scale-105'
                  : isDisabled
                    ? 'bg-[#F5EDEB] text-[#8A8A8A] cursor-not-allowed'
                    : 'bg-white border-2 border-[#E8C7C3] hover:border-[#D8B0AC] hover:scale-105'
                }
              `}
            >
              <div className="text-xs font-medium mb-1">
                {formatDayName(date)}
              </div>
              <div className="text-sm font-bold">
                {formatDayNumber(date).split('.')[0]}
              </div>
              {isToday(date) && !isSelected && (
                <div className="w-1.5 h-1.5 bg-[#E8C7C3] rounded-full mx-auto mt-1" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Zeitslots */}
      {selectedDate && (
        <div className="space-y-4">
          <h3 className="font-semibold text-[#1E1E1E]">
            Verfügbare Zeiten am {new Date(selectedDate + 'T00:00:00').toLocaleDateString('de-DE', {
              weekday: 'long',
              day: '2-digit',
              month: 'long'
            })}
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E8C7C3] mx-auto" />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 text-[#8A8A8A]">
              Keine verfügbaren Termine an diesem Tag
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {availableSlots.map((slot, index) => (
                <motion.button
                  key={slot.startTime}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => slot.isAvailable && onTimeSelect(slot.startTime)}
                  disabled={!slot.isAvailable}
                  className={`
                    py-3 px-2 rounded-lg font-semibold text-sm transition-all
                    ${selectedTime === slot.startTime
                      ? 'bg-[#E8C7C3] text-white shadow-lg scale-105'
                      : slot.isAvailable
                        ? 'bg-white border-2 border-[#E8C7C3] hover:border-[#D8B0AC] hover:scale-105'
                        : 'bg-[#F5EDEB] text-[#8A8A8A] cursor-not-allowed'
                    }
                  `}
                >
                  {slot.startTime}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
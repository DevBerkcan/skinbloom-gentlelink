"use client";

import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/card";
import { Scissors, Clock } from "lucide-react";
import type { Service } from "@/lib/api/booking";

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  onSelect: (service: Service) => void;
}

export function ServiceSelector({ services, selectedService, onSelect }: ServiceSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-barber-black mb-2">
          Wähle deine Leistung
        </h2>
        <p className="text-barber-grey-600">
          Schritt 1 von 3
        </p>
      </div>

      <div className="grid gap-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              isPressable
              onPress={() => onSelect(service)}
              className={`
                transition-all cursor-pointer
                ${selectedService?.id === service.id
                  ? 'border-2 border-barber-red bg-barber-cream ring-2 ring-barber-red/20'
                  : 'border-2 border-barber-grey-200 hover:border-barber-red/50'
                }
              `}
            >
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-3 bg-barber-red/10 rounded-xl">
                    <Scissors className="text-barber-red" size={24} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-barber-black">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-barber-grey-600 mt-1">
                        {service.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-sm text-barber-grey-500">
                        <Clock size={16} />
                        {service.durationMinutes} Min
                      </span>
                      <span className="text-lg font-bold text-barber-red">
                        ab {service.price.toFixed(2)} EUR
                      </span>
                    </div>
                  </div>

                  {selectedService?.id === service.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0 w-6 h-6 bg-barber-red rounded-full flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </motion.div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/card";
import { Sparkles, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import type { Service, ServiceCategory } from "@/lib/api/booking";
import { getServiceCategories, getServicesByCategory } from "@/lib/api/booking";

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  onSelect: (service: Service) => void;
}

export function ServiceSelector({ services: fallbackServices, selectedService, onSelect }: ServiceSelectorProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingServices, setLoadingServices] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getServiceCategories();
        setCategories(data);
      } catch {
        const defaultCategory: ServiceCategory = {
          id: "default",
          name: "Alle Services",
          description: null,
          displayOrder: 0,
          isActive: true,
          services: fallbackServices
        };
        setCategories([defaultCategory]);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [fallbackServices]);

  const handleToggleCategory = async (categoryId: string) => {
    if (expandedId === categoryId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(categoryId);

    const category = categories.find(c => c.id === categoryId);
    if (category && category.services.length > 0) {
      return;
    }

    setLoadingServices(prev => ({ ...prev, [categoryId]: true }));
    
    try {
      const services = await getServicesByCategory(categoryId);
      setCategories(prevCategories => 
        prevCategories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, services } 
            : cat
        )
      );
    } catch (error) {
      console.error(`Failed to load services for category ${categoryId}:`, error);
    } finally {
      setLoadingServices(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-[#8A8A8A]">Services werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-2">
          Wähle deine Leistung
        </h2>
        <p className="text-sm sm:text-base text-[#8A8A8A]">
          Schritt 1 von 3
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const isLoading = loadingServices[category.id];
          const isExpanded = expandedId === category.id;
          
          return (
            <div key={category.id} className="border-2 border-[#E8C7C3] rounded-xl overflow-hidden">
              <button
                onClick={() => handleToggleCategory(category.id)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#F5EDEB] hover:bg-[#F0E6E4] transition-colors"
              >
                <div className="text-left flex-1 min-w-0 pr-2">
                  <h3 className="font-bold text-[#1E1E1E] text-sm sm:text-base truncate">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs sm:text-sm text-[#8A8A8A] truncate">
                      {category.description}
                    </p>
                  )}
                </div>
                {isExpanded ? 
                  <ChevronUp size={18} className="flex-shrink-0 text-[#8A8A8A]" /> : 
                  <ChevronDown size={18} className="flex-shrink-0 text-[#8A8A8A]" />
                }
              </button>
              
              {isExpanded && (
                <div className="p-3 sm:p-4 space-y-3">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#E8C7C3] animate-spin" />
                      <span className="ml-2 text-sm text-[#8A8A8A]">Services werden geladen...</span>
                    </div>
                  ) : category.services.length === 0 ? (
                    <p className="text-center py-4 text-sm text-[#8A8A8A]">
                      Keine Services in dieser Kategorie
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 sm:gap-3">
                      {category.services.map((service) => (
                        <Card
                          key={service.id}
                          isPressable
                          onPress={() => onSelect(service)}
                          className="w-full"
                          fullWidth
                        >
                          <CardBody className="p-3 sm:p-4 w-full">
                            <div className="flex items-start gap-3 sm:gap-4 w-full">
                              <div className="flex-shrink-0 p-2 sm:p-3 bg-[#E8C7C3]/10 rounded-xl">
                                <Sparkles className="text-[#E8C7C3]" size={20} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-[#1E1E1E] text-sm sm:text-base break-words pr-1">
                                      {service.name}
                                    </h4>
                                    {service.description && (
                                      <p className="text-xs sm:text-sm text-[#8A8A8A] mt-1 line-clamp-2 break-words">
                                        {service.description}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                                      <span className="flex items-center gap-1 text-xs sm:text-sm text-[#8A8A8A] whitespace-nowrap">
                                        <Clock size={14} />
                                        {service.durationMinutes} Min
                                      </span>
                                      <span className="font-bold text-[#E8C7C3] text-sm sm:text-base whitespace-nowrap">
                                        {service.price.toFixed(2)} CHF
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {selectedService?.id === service.id && (
                                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#E8C7C3] rounded-full flex items-center justify-center ml-1">
                                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
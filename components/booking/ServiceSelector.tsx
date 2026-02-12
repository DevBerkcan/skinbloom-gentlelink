// components/booking/ServiceSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/card";
import { Scissors, Clock, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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
      // Don't set expandedId - start with all categories closed
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
      // Don't set expandedId - start closed
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

    // Check if we already have services for this category
    const category = categories.find(c => c.id === categoryId);
    if (category && category.services.length > 0) {
      return; // Already have services
    }

    // Fetch services for this category
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
        <p className="text-barber-grey-600">Services werden geladen...</p>
      </div>
    );
  }

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

      <div className="space-y-4">
        {categories.map((category) => {
          const isLoading = loadingServices[category.id];
          const isExpanded = expandedId === category.id;
          
          return (
            <div key={category.id} className="border-2 border-barber-grey-200 rounded-xl overflow-hidden">
              <button
                onClick={() => handleToggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 bg-barber-grey-50 hover:bg-barber-grey-100 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-bold text-barber-black">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-barber-grey-600">{category.description}</p>
                  )}
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              {isExpanded && (
                <div className="p-4 space-y-3">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-barber-red animate-spin" />
                      <span className="ml-2 text-barber-grey-600">Services werden geladen...</span>
                    </div>
                  ) : category.services.length === 0 ? (
                    <p className="text-center py-4 text-barber-grey-600">
                      Keine Services in dieser Kategorie
                    </p>
                  ) : (
                    category.services.map((service) => (
                      <Card
                        key={service.id}
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
                        <CardBody className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 p-3 bg-barber-red/10 rounded-xl">
                              <Scissors className="text-barber-red" size={24} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-barber-black">
                                {service.name}
                              </h4>
                              {service.description && (
                                <p className="text-sm text-barber-grey-600 mt-1">
                                  {service.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1 text-sm text-barber-grey-500">
                                  <Clock size={16} />
                                  {service.durationMinutes} Min
                                </span>
                                <span className="font-bold text-barber-red">
                                  {service.price.toFixed(2)} CHF
                                </span>
                              </div>
                            </div>
                            {selectedService?.id === service.id && (
                              <div className="w-6 h-6 bg-barber-red rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    ))
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
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Sparkles, Clock, ChevronDown, ChevronUp, Loader2, Search, X, CheckCircle } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

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
          services: fallbackServices,
        };
        setCategories([defaultCategory]);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [fallbackServices]);

  const allServices = useMemo(() => {
    return categories.flatMap((cat) => cat.services);
  }, [categories]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return allServices.filter(
      (service) =>
        service.name.toLowerCase().includes(term) ||
        (service.description && service.description.toLowerCase().includes(term))
    );
  }, [allServices, searchTerm]);

  const handleToggleCategory = async (categoryId: string) => {
    if (expandedId === categoryId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(categoryId);
    setShowSearchResults(false);
    setSearchTerm("");

    const category = categories.find((c) => c.id === categoryId);
    if (category && category.services.length > 0) return;

    setLoadingServices((prev) => ({ ...prev, [categoryId]: true }));

    try {
      const services = await getServicesByCategory(categoryId);
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === categoryId ? { ...cat, services } : cat
        )
      );
    } catch (error) {
      console.error(`Failed to load services for category ${categoryId}:`, error);
    } finally {
      setLoadingServices((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#E8C7C3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E1E1E] mb-2">
          Wähle deine Leistung
        </h2>
        <p className="text-sm sm:text-base text-[#8A8A8A]">Schritt 1 von 4</p>
      </div>

      {/* Selected Service Display */}
      <AnimatePresence>
        {selectedService && !showSearchResults && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#F5EDEB] border-2 border-[#E8C7C3] rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#E8C7C3] p-2 rounded-lg">
                <CheckCircle className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#8A8A8A]">Ausgewählte Leistung</p>
                <p className="font-bold text-[#1E1E1E]">{selectedService.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-[#8A8A8A]">
                    <Clock size={12} />
                    {selectedService.durationMinutes} Min
                  </span>
                  <span className="text-xs font-bold text-[#E8C7C3]">
                    {selectedService.price.toFixed(2)} CHF
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Services suchen..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSearchResults(true);
            if (expandedId) setExpandedId(null);
          }}
          startContent={<Search size={18} className="text-[#8A8A8A]" />}
          endContent={
            searchTerm ? (
              <button
                onClick={clearSearch}
                className="text-[#8A8A8A] hover:text-[#1E1E1E] transition-colors"
              >
                <X size={16} />
              </button>
            ) : null
          }
          classNames={{
            inputWrapper:
              "bg-white border-2 border-[#E8C7C3] hover:border-[#017172] focus-within:border-[#017172]",
            input: "text-[#1E1E1E]",
          }}
        />
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showSearchResults && searchTerm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {searchResults.length > 0 ? (
              <>
                <p className="text-sm text-[#8A8A8A]">
                  {searchResults.length} Service{searchResults.length !== 1 ? "s" : ""} gefunden
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {searchResults.map((service) => (
                    <Card
                      key={service.id}
                      isPressable
                      onPress={() => {
                        onSelect(service);
                        setShowSearchResults(false);
                        setSearchTerm("");
                      }}
                      className={`w-full transition-all ${
                        selectedService?.id === service.id
                          ? "ring-2 ring-[#E8C7C3] ring-offset-2"
                          : "hover:ring-2 hover:ring-[#E8C7C3]/30 hover:ring-offset-1"
                      }`}
                      fullWidth
                    >
                      <CardBody className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 p-2 rounded-xl transition-colors ${
                              selectedService?.id === service.id
                                ? "bg-[#E8C7C3]"
                                : "bg-[#E8C7C3]/10"
                            }`}
                          >
                            <Sparkles
                              className={
                                selectedService?.id === service.id
                                  ? "text-white"
                                  : "text-[#E8C7C3]"
                              }
                              size={18}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-[#1E1E1E] text-sm">
                                  {service.name}
                                </h4>
                                {service.description && (
                                  <p className="text-xs text-[#8A8A8A] mt-0.5 line-clamp-1">
                                    {service.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-1.5">
                                  <span className="flex items-center gap-1 text-xs text-[#8A8A8A]">
                                    <Clock size={12} />
                                    {service.durationMinutes} Min
                                  </span>
                                  <span className="text-xs font-bold text-[#E8C7C3]">
                                    {service.price.toFixed(2)} CHF
                                  </span>
                                </div>
                              </div>
                              {selectedService?.id === service.id && (
                                <CheckCircle size={16} className="text-[#E8C7C3] flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 bg-[#F5EDEB] rounded-xl">
                <p className="text-sm text-[#8A8A8A]">
                  Keine Services gefunden für &quot;{searchTerm}&quot;
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories - only show when not searching */}
      {(!searchTerm || !showSearchResults) && (
        <div className="space-y-4">
          {categories.map((category) => {
            const isLoading = loadingServices[category.id];
            const isExpanded = expandedId === category.id;

            return (
              <div
                key={category.id}
                className="border-2 border-[#E8C7C3] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => handleToggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#F5EDEB] hover:bg-[#E8C7C3]/20 transition-colors"
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
                  {isExpanded ? (
                    <ChevronUp size={18} className="flex-shrink-0 text-[#8A8A8A]" />
                  ) : (
                    <ChevronDown size={18} className="flex-shrink-0 text-[#8A8A8A]" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-3 sm:p-4 space-y-3">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-[#E8C7C3] animate-spin" />
                        <span className="ml-2 text-sm text-[#8A8A8A]">
                          Services werden geladen...
                        </span>
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
                            className={`w-full transition-all ${
                              selectedService?.id === service.id
                                ? "ring-2 ring-[#E8C7C3] ring-offset-2"
                                : "hover:ring-2 hover:ring-[#E8C7C3]/30 hover:ring-offset-1"
                            }`}
                            fullWidth
                          >
                            <CardBody className="p-3 sm:p-4 w-full">
                              <div className="flex items-start gap-3 sm:gap-4 w-full">
                                <div
                                  className={`flex-shrink-0 p-2 sm:p-3 rounded-xl transition-colors ${
                                    selectedService?.id === service.id
                                      ? "bg-[#E8C7C3]"
                                      : "bg-[#E8C7C3]/10"
                                  }`}
                                >
                                  <Sparkles
                                    className={
                                      selectedService?.id === service.id
                                        ? "text-white"
                                        : "text-[#E8C7C3]"
                                    }
                                    size={20}
                                  />
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
                                        <CheckCircle size={14} className="text-white" />
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
      )}
    </div>
  );
}
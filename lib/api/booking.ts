// lib/api/booking.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7020/api";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  displayOrder: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AvailabilityResponse {
  date: string;
  serviceId: string;
  serviceDuration: number;
  availableSlots: TimeSlot[];
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// ── Employee ──────────────────────────────────────────────────────────────────

export interface Employee {
  id: string;
  name: string;
  role: string;
  specialty: string | null;
  isActive: boolean;
}

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${API_BASE_URL}/employees?activeOnly=true`);
  if (!response.ok) throw new Error("Fehler beim Laden der Mitarbeiter");
  return response.json();
}

// ── Booking ───────────────────────────────────────────────────────────────────

export interface CreateBookingRequest {
  serviceId: string;
  bookingDate: string;
  startTime: string;
  customer: CustomerInfo;
  customerNotes?: string;
  employeeId?: string | null;  // NEW
}

export interface BookingResponse {
  id: string;
  bookingNumber: string;
  status: string;
  confirmationSent: boolean;
  booking: {
    serviceId: string;
    serviceName: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    price: number;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string | null;
  };
  employee?: {           // NEW – optional
    id: string;
    name: string;
    role: string;
    specialty: string | null;
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  services: Service[];
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const response = await fetch(`${API_BASE_URL}/services/categories`);
  if (!response.ok) throw new Error("Fehler beim Laden der Kategorien");
  return response.json();
}

export async function getServicesByCategory(categoryId: string): Promise<Service[]> {
  const response = await fetch(`${API_BASE_URL}/services/services/${categoryId}`);
  if (!response.ok) throw new Error("Fehler beim Laden der Services für diese Kategorie");
  return response.json();
}

export async function getServices(): Promise<Service[]> {
  const response = await fetch(`${API_BASE_URL}/services`);
  if (!response.ok) throw new Error("Fehler beim Laden der Services");
  return response.json();
}

export async function getAvailability(
  serviceId: string,
  date: string
): Promise<AvailabilityResponse> {
  const response = await fetch(`${API_BASE_URL}/availability/${serviceId}?date=${date}`);
  if (!response.ok) throw new Error("Fehler beim Laden der Verfügbarkeit");
  return response.json();
}

export async function createBooking(data: CreateBookingRequest): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Fehler beim Buchen");
  }
  return response.json();
}

export async function getBookingsByEmail(email: string): Promise<BookingResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/bookings/by-email/${encodeURIComponent(email)}`
  );
  if (!response.ok) throw new Error("Fehler beim Laden der Buchungen");
  return response.json();
}

export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reason: reason || "Vom Kunden storniert",
      notifyCustomer: true,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Fehler beim Stornieren");
  }
  return response.json();
}
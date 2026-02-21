// lib/api/booking.ts
// Public-facing booking API.
// credentials: "include" is set on all calls so the JWT cookie is forwarded
// when the user is authenticated (e.g. an employee using the admin UI).
// Anonymous callers simply have no cookie and the server treats them as guests.

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7020/api";

  export const bookingApi = {
  getEmployees,
  getServiceCategories,
  getServicesByCategory,
  getServices,
  getAvailability,
  createBooking,
  getBookingsByEmail,
  cancelBooking,
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  displayOrder: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  services: Service[];
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

export interface Employee {
  id: string;
  name: string;
  role: string;
  specialty: string | null;
  isActive: boolean;
}

export interface CreateBookingRequest {
  serviceId: string;
  bookingDate: string;
  startTime: string;
  customer: CustomerInfo;
  customerNotes?: string;
  employeeId?: string | null;
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
  employee?: {
    id: string;
    name: string;
    role: string;
    specialty: string | null;
  } | null;
}

// ── Employees ─────────────────────────────────────────────────────────────────

/**
 * Fetch active employees for the booking widget.
 * The /employees endpoint is [AllowAnonymous] for public use.
 * credentials:include so the JWT cookie is forwarded when present.
 */
export async function getEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE_URL}/employees?activeOnly=true`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Mitarbeiter");
  return res.json();
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const res = await fetch(`${API_BASE_URL}/services/categories`);
  if (!res.ok) throw new Error("Fehler beim Laden der Kategorien");
  return res.json();
}

export async function getServicesByCategory(
  categoryId: string
): Promise<Service[]> {
  const res = await fetch(`${API_BASE_URL}/services/services/${categoryId}`);
  if (!res.ok)
    throw new Error("Fehler beim Laden der Services für diese Kategorie");
  return res.json();
}

export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE_URL}/services`);
  if (!res.ok) throw new Error("Fehler beim Laden der Services");
  return res.json();
}

// lib/api/booking.ts - Update getAvailability

export async function getAvailability(
  serviceId: string,
  date: string,
  employeeId?: string  // Add optional employeeId parameter
): Promise<AvailabilityResponse> {
  let url = `${API_BASE_URL}/availability/${serviceId}?date=${date}`;
  
  // Add employeeId to query params if provided
  if (employeeId) {
    url += `&employeeId=${employeeId}`;
  }
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fehler beim Laden der Verfügbarkeit");
  return res.json();
}

// ── Bookings ──────────────────────────────────────────────────────────────────

/**
 * Create a booking.
 * credentials:include forwards the JWT cookie so the backend can
 * auto-assign the authenticated employee when no employeeId is specified.
 */
export async function createBooking(
  data: CreateBookingRequest
): Promise<BookingResponse> {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Fehler beim Buchen");
  }
  return res.json();
}

export async function getBookingsByEmail(
  email: string
): Promise<BookingResponse[]> {
  const res = await fetch(
    `${API_BASE_URL}/bookings/by-email/${encodeURIComponent(email)}`
  );
  if (!res.ok) throw new Error("Fehler beim Laden der Buchungen");
  return res.json();
}

export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reason: reason || "Vom Kunden storniert",
      notifyCustomer: true,
    }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Fehler beim Stornieren");
  }
  return res.json();
}
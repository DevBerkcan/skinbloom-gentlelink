// API Client für Booking-Endpunkte

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5067/api";

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

export interface CreateBookingRequest {
  serviceId: string;
  bookingDate: string;
  startTime: string;
  customer: CustomerInfo;
  customerNotes?: string;
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
    email: string;
  };
}

export async function getServices(): Promise<Service[]> {
  const response = await fetch(`${API_BASE_URL}/services`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Services");
  }
  return response.json();
}

export async function getAvailability(
  serviceId: string,
  date: string
): Promise<AvailabilityResponse> {
  const response = await fetch(
    `${API_BASE_URL}/availability/${serviceId}?date=${date}`
  );
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Verfügbarkeit");
  }
  return response.json();
}

export async function createBooking(
  data: CreateBookingRequest
): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Fehler beim Buchen");
  }

  return response.json();
}

export async function getBookingsByEmail(
  email: string
): Promise<BookingResponse[]> {
  const response = await fetch(`${API_BASE_URL}/bookings/by-email/${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Buchungen");
  }
  return response.json();
}

export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
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

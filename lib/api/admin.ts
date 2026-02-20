// lib/api/admin.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7020/api";

const ADMIN_SECRET =
  process.env.NEXT_PUBLIC_ADMIN_SECRET || "skinbloom-admin-bootstrap-2026";

// ── Auth helpers ──────────────────────────────────────────────────────────────

function authHeaders(extra?: Record<string, string>): HeadersInit {
  return { "Content-Type": "application/json", ...extra };
}

/** Use for endpoints that require the X-Admin-Secret header (cross-employee views etc.) */
function adminHeaders(): HeadersInit {
  return authHeaders({ "X-Admin-Secret": ADMIN_SECRET });
}

export const adminApi = {
  getDashboard,
  getStatistics,
  getBookings,
  updateBookingStatus,
  deleteBooking,
  createManualBooking,
  getServices,
  getAvailability,
  getBlockedSlots,
  createBlockedSlot,
  createBlockedDateRange,
  updateBlockedSlot,
  deleteBlockedSlot,
  getTrackingStatistics,
  getRevenueStatistics,
  trackLinkClick,
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardOverview {
  today: TodayOverview;
  nextBooking: UpcomingBooking | null;
  statistics: DashboardStatistics;
}

export interface TodayOverview {
  date: string;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  bookings: BookingListItem[];
}

export interface UpcomingBooking {
  id: string;
  bookingNumber: string;
  serviceName: string;
  customerName: string;
  date: string;
  startTime: string;
  endTime: string;
  minutesUntil: number;
}

export interface DashboardStatistics {
  totalBookingsThisMonth: number;
  totalBookingsLastMonth: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  averageBookingValue: number;
  popularServices: PopularService[];
}

export interface PopularService {
  serviceName: string;
  bookingCount: number;
  revenue: number;
}

export interface BookingListItem {
  id: string;
  bookingNumber: string;
  status: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  price: number;
  customerNotes: string | null;
  createdAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BookingFilter {
  status?: string;
  fromDate?: string;
  toDate?: string;
  serviceId?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface UpdateBookingStatus {
  status: string;
  adminNotes?: string;
}

export interface BlockedTimeSlot {
  id: string;
  blockDate: string;
  startTime: string;
  endTime: string;
  reason?: string;
  createdAt: string;
  employeeId?: string | null;
}

export interface CreateBlockedSlot {
  blockDate: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface CreateBlockedDateRange {
  fromDate: string;
  toDate: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface UpdateBlockedSlot {
  blockDate: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface CreateManualBookingDto {
  serviceId: string;
  bookingDate: string;
  startTime: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  employeeId?: string | null;
  customerNotes: string | null;
}

export interface ManualBookingResponse {
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
  employee?: {
    id: string;
    name: string;
    role: string;
    specialty: string | null;
  } | null;
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

export interface SimplifiedTrackingStatistics {
  totalBookings: number;
  totalPageViews: number;
  totalLinkClicks: number;
  totalRevenue: number;
  averageBookingValue: number;
  linkClicks: LinkClickStatistic[];
}

export interface LinkClickStatistic {
  linkName: string;
  clickCount: number;
  percentage: number;
}

export interface RevenueStatistics {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getDashboard(): Promise<DashboardOverview> {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    credentials: "include",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Fehler beim Laden des Dashboards");
  return res.json();
}

export async function getStatistics(): Promise<DashboardStatistics> {
  const res = await fetch(`${API_BASE_URL}/admin/statistics`, {
    credentials: "include",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Statistiken");
  return res.json();
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export async function getBookings(
  filter: BookingFilter = {}
): Promise<PagedResponse<BookingListItem>> {
  const params = new URLSearchParams();
  if (filter.status) params.append("status", filter.status);
  if (filter.fromDate) params.append("fromDate", filter.fromDate);
  if (filter.toDate) params.append("toDate", filter.toDate);
  if (filter.serviceId) params.append("serviceId", filter.serviceId);
  if (filter.searchTerm) params.append("searchTerm", filter.searchTerm);
  if (filter.page) params.append("page", filter.page.toString());
  if (filter.pageSize) params.append("pageSize", filter.pageSize.toString());
  // ?all=true so the admin sees all employees' bookings
  params.append("all", "true");

  const res = await fetch(`${API_BASE_URL}/admin/bookings?${params}`, {
    credentials: "include",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Buchungen");
  return res.json();
}

export async function updateBookingStatus(
  bookingId: string,
  data: UpdateBookingStatus
): Promise<BookingListItem> {
  const res = await fetch(
    `${API_BASE_URL}/admin/bookings/${bookingId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: adminHeaders(),
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Fehler beim Aktualisieren des Status");
  }
  return res.json();
}

export async function deleteBooking(
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}`, {
    method: "DELETE",
    credentials: "include",
    headers: adminHeaders(),
    body: JSON.stringify({ reason: reason || "Manuell gelöscht" }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Fehler beim Löschen der Buchung");
  }
  return res.json();
}

// ── Manual booking ────────────────────────────────────────────────────────────

export async function createManualBooking(
  data: CreateManualBookingDto
): Promise<ManualBookingResponse> {
  const res = await fetch(`${API_BASE_URL}/admin/manual/booking`, {
    method: "POST",
    credentials: "include",
    headers: adminHeaders(),
    body: JSON.stringify({
      ...data,
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      customerNotes: data.customerNotes?.trim() || null,
    }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Fehler beim Erstellen der Buchung");
  }
  return res.json();
}

// ── Services & Availability ───────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE_URL}/services`);
  if (!res.ok) throw new Error("Fehler beim Laden der Services");
  return res.json();
}

export async function getAvailability(
  serviceId: string,
  date: string
): Promise<AvailabilityResponse> {
  const res = await fetch(
    `${API_BASE_URL}/availability/${serviceId}?date=${date}`
  );
  if (!res.ok) throw new Error("Fehler beim Laden der Verfügbarkeit");
  return res.json();
}

// ── Blocked time slots ────────────────────────────────────────────────────────

/**
 * Fetch blocked slots.
 * JWT cookie is sent automatically. X-Admin-Secret + ?all=true so admin
 * sees slots from ALL employees, not just the authenticated one.
 */
export async function getBlockedSlots(
  fromDate?: string,
  toDate?: string
): Promise<BlockedTimeSlot[]> {
  const params = new URLSearchParams();
  if (fromDate) params.append("startDate", fromDate);
  if (toDate) params.append("endDate", toDate);
  params.append("all", "true");

  const res = await fetch(
    `${API_BASE_URL}/BlockedTimeSlots?${params}`,
    {
      credentials: "include",
      headers: adminHeaders(),
    }
  );
  if (!res.ok) throw new Error("Fehler beim Laden der blockierten Zeitslots");
  return res.json();
}

export async function createBlockedSlot(
  data: CreateBlockedSlot
): Promise<BlockedTimeSlot> {
  const res = await fetch(`${API_BASE_URL}/BlockedTimeSlots`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || "Fehler beim Erstellen des blockierten Zeitslots"
    );
  }
  return res.json();
}

export async function createBlockedDateRange(
  data: CreateBlockedDateRange
): Promise<BlockedTimeSlot[]> {
  const res = await fetch(`${API_BASE_URL}/BlockedTimeSlots/range`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || "Fehler beim Erstellen der blockierten Zeitslots"
    );
  }
  return res.json();
}

export async function updateBlockedSlot(
  id: string,
  data: UpdateBlockedSlot
): Promise<BlockedTimeSlot> {
  const res = await fetch(`${API_BASE_URL}/BlockedTimeSlots/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Fehler beim Aktualisieren");
  }
  return res.json();
}

export async function deleteBlockedSlot(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/BlockedTimeSlots/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || "Fehler beim Löschen des blockierten Zeitslots"
    );
  }
}

// ── Tracking ──────────────────────────────────────────────────────────────────

export async function getTrackingStatistics(
  fromDate?: string,
  toDate?: string
): Promise<SimplifiedTrackingStatistics> {
  const params = new URLSearchParams();
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);

  const res = await fetch(
    `${API_BASE_URL}/admin/tracking${params.toString() ? `?${params}` : ""}`,
    { credentials: "include", headers: adminHeaders() }
  );
  if (!res.ok) {
    throw new Error(
      `Fehler beim Laden der Tracking-Statistiken: ${res.status}`
    );
  }
  return res.json();
}

export async function getRevenueStatistics(): Promise<RevenueStatistics> {
  const res = await fetch(`${API_BASE_URL}/admin/tracking/revenue`, {
    credentials: "include",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error("Fehler beim Laden der Umsatzstatistiken");
  return res.json();
}

export async function trackLinkClick(data: {
  linkName: string;
  linkUrl: string;
  sessionId?: string;
}): Promise<void> {
  await fetch(`${API_BASE_URL}/admin/tracking/click`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).catch(() => {});
}
// API Client für Admin-Endpunkte

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5067/api";

// Types
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

// API Functions
export async function getDashboard(): Promise<DashboardOverview> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden des Dashboards");
  }
  return response.json();
}

export async function getStatistics(): Promise<DashboardStatistics> {
  const response = await fetch(`${API_BASE_URL}/admin/statistics`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Statistiken");
  }
  return response.json();
}

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

  const response = await fetch(`${API_BASE_URL}/admin/bookings?${params}`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Buchungen");
  }
  return response.json();
}

export async function updateBookingStatus(
  bookingId: string,
  data: UpdateBookingStatus
): Promise<BookingListItem> {
  const response = await fetch(
    `${API_BASE_URL}/admin/bookings/${bookingId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Fehler beim Aktualisieren des Status");
  }

  return response.json();
}

// Tracking Statistics Types
export interface TrackingStatistics {
  totalBookings: number;
  bookingsWithTracking: number;
  utmSources: SourceStatistic[];
  utmMediums: SourceStatistic[];
  utmCampaigns: SourceStatistic[];
  topReferrers: ReferrerStatistic[];
  totalRevenue: number;
  averageBookingValue: number;
}

export interface SourceStatistic {
  name: string;
  bookingCount: number;
  revenue: number;
  percentage: number;
}

export interface ReferrerStatistic {
  referrer: string;
  count: number;
}

// Get Tracking Statistics
export async function getTrackingStatistics(
  fromDate?: string,
  toDate?: string
): Promise<TrackingStatistics> {
  const params = new URLSearchParams();
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/admin/tracking${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Tracking-Statistiken");
  }

  return response.json();
}

// Blocked Time Slots Types
export interface BlockedTimeSlot {
  id: string;
  blockDate: string;
  startTime: string;
  endTime: string;
  reason?: string;
  createdAt: string;
}

export interface CreateBlockedSlot {
  blockDate: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

// Get Blocked Time Slots
export async function getBlockedSlots(
  fromDate?: string,
  toDate?: string
): Promise<BlockedTimeSlot[]> {
  const params = new URLSearchParams();
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/admin/blocked-slots${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Fehler beim Laden der blockierten Zeitslots");
  }

  return response.json();
}

// Create Blocked Time Slot
export async function createBlockedSlot(
  data: CreateBlockedSlot
): Promise<BlockedTimeSlot> {
  const response = await fetch(`${API_BASE_URL}/admin/blocked-slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Fehler beim Erstellen des blockierten Zeitslots");
  }

  return response.json();
}

// Delete Blocked Time Slot
export async function deleteBlockedSlot(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/blocked-slots/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Fehler beim Löschen des blockierten Zeitslots");
  }
}

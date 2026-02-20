// lib/api/employees.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7020/api";

const ADMIN_SECRET =
  process.env.NEXT_PUBLIC_ADMIN_SECRET || "skinbloom-admin-bootstrap-2026";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Employee {
  id: string;
  name: string;
  role: string;
  specialty?: string | null;
  isActive: boolean;
  createdAt: string;
  /** Username for JWT login — may be null for employees not yet set up */
  username?: string | null;
  /** Whether this employee already has a password set */
  hasPassword: boolean;
}

export interface CreateEmployeeDto {
  name: string;
  role: string;
  specialty?: string | null;
  /** Set username at creation time (optional) */
  username?: string | null;
  /** Set initial password at creation time (optional) */
  password?: string | null;
}

export interface UpdateEmployeeDto {
  name: string;
  role: string;
  specialty?: string | null;
  isActive: boolean;
  /**
   * Pass newPassword here to reset this employee's password.
   * Requires X-Admin-Secret header — this function adds it automatically.
   */
  newPassword?: string | null;
}

// ── Shared header helpers ─────────────────────────────────────────────────────

function jsonHeaders(): HeadersInit {
  return { "Content-Type": "application/json" };
}

function adminJsonHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-Admin-Secret": ADMIN_SECRET,
  };
}

// ── Functions ─────────────────────────────────────────────────────────────────

/**
 * List employees.
 * activeOnly = false returns inactive employees too (admin use).
 */
export async function getEmployees(activeOnly = true): Promise<Employee[]> {
  const res = await fetch(
    `${API_BASE_URL}/employees?activeOnly=${activeOnly}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Fehler beim Laden der Mitarbeiter");
  return res.json();
}

/**
 * Create a new employee.
 * Optionally set username + initial password in one call.
 */
export async function createEmployee(
  data: CreateEmployeeDto
): Promise<Employee> {
  const res = await fetch(`${API_BASE_URL}/employees`, {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || "Fehler beim Erstellen");
  }
  return res.json();
}

/**
 * Update an employee.
 * If data.newPassword is set the request is sent with X-Admin-Secret
 * so the backend allows the password reset.
 */
export async function updateEmployee(
  id: string,
  data: UpdateEmployeeDto
): Promise<Employee> {
  const needsAdminSecret = !!data.newPassword;
  const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: needsAdminSecret ? adminJsonHeaders() : jsonHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || "Fehler beim Aktualisieren");
  }
  return res.json();
}

/**
 * Delete (or soft-delete) an employee.
 * The backend will reject if the employee has active bookings.
 */
export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: jsonHeaders(),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || "Fehler beim Löschen");
  }
}

/**
 * Bootstrap: set an initial password for an employee by username.
 * Uses X-Admin-Secret — intended for first-time setup or admin password reset.
 */
export async function setEmployeePassword(
  username: string,
  password: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/employee-auth/set-password`, {
    method: "POST",
    headers: adminJsonHeaders(),
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.message || "Fehler beim Setzen des Passworts");
  }
}
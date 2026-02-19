// lib/api/employees.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7020/api";

export interface Employee {
  id: string;
  name: string;
  role: string;
  specialty?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateEmployeeDto {
  name: string;
  role: string;
  specialty?: string | null;
}

export interface UpdateEmployeeDto {
  name: string;
  role: string;
  specialty?: string | null;
  isActive: boolean;
}

export async function getEmployees(activeOnly = true): Promise<Employee[]> {
  const res = await fetch(`${API_BASE_URL}/employees?activeOnly=${activeOnly}`);
  if (!res.ok) throw new Error("Fehler beim Laden der Mitarbeiter");
  return res.json();
}

export async function createEmployee(data: CreateEmployeeDto): Promise<Employee> {
  const res = await fetch(`${API_BASE_URL}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Fehler beim Erstellen"); }
  return res.json();
}

export async function updateEmployee(id: string, data: UpdateEmployeeDto): Promise<Employee> {
  const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Fehler beim Aktualisieren"); }
  return res.json();
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/employees/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Fehler beim Löschen");
}
// lib/api/admin-services.ts
import api, { extractData } from './client';

export interface AdminService {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  displayOrder: number;
  categoryId: string;
  categoryName: string;
  employeeId: string | null;
  employeeName: string | null;
  isActive: boolean;
}

export interface AdminServiceCategory {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
  services: AdminService[];
}

export interface CreateServiceData {
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  displayOrder: number;
  categoryId: string;
  employeeId?: string | null;
}

export interface UpdateServiceData {
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  displayOrder: number;
  categoryId: string;
  employeeId?: string | null;
  isActive: boolean;
}

export interface CreateCategoryData {
  name: string;
  description?: string | null;
  displayOrder: number;
}

export interface UpdateCategoryData {
  name: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface EmployeeForAssignment {
  id: string;
  name: string;
  role: string;
  specialty: string | null;
  serviceCount: number;
}

// Get all services for admin
export async function getAdminServices(): Promise<AdminService[]> {
  const response = await api.get('/admin/services');
  return extractData<AdminService[]>(response, true);
}

// Get service by ID
export async function getAdminService(id: string): Promise<AdminService> {
  const response = await api.get(`/admin/services/${id}`);
  return extractData<AdminService>(response, false);
}

// Create new service
export async function createAdminService(data: CreateServiceData): Promise<AdminService> {
  const response = await api.post('/admin/services', data);
  return extractData<AdminService>(response, false);
}

// Update service
export async function updateAdminService(id: string, data: UpdateServiceData): Promise<AdminService> {
  const response = await api.put(`/admin/services/${id}`, data);
  return extractData<AdminService>(response, false);
}

// Delete service
export async function deleteAdminService(id: string): Promise<void> {
  await api.delete(`/admin/services/${id}`);
}

// Toggle service active status
export async function toggleServiceActive(id: string): Promise<{ isActive: boolean }> {
  const response = await api.patch(`/admin/services/${id}/toggle-active`);
  return extractData<{ isActive: boolean }>(response, false);
}

// Get all categories for admin
export async function getAdminCategories(): Promise<AdminServiceCategory[]> {
  const response = await api.get('/admin/services/categories');
  return extractData<AdminServiceCategory[]>(response, true);
}

// Get category by ID
export async function getAdminCategory(id: string): Promise<AdminServiceCategory> {
  const response = await api.get(`/admin/services/categories/${id}`);
  return extractData<AdminServiceCategory>(response, false);
}

// Create new category
export async function createAdminCategory(data: CreateCategoryData): Promise<AdminServiceCategory> {
  const response = await api.post('/admin/services/categories', data);
  return extractData<AdminServiceCategory>(response, false);
}

// Update category
export async function updateAdminCategory(id: string, data: UpdateCategoryData): Promise<AdminServiceCategory> {
  const response = await api.put(`/admin/services/categories/${id}`, data);
  return extractData<AdminServiceCategory>(response, false);
}

// Delete category
export async function deleteAdminCategory(id: string): Promise<void> {
  await api.delete(`/admin/services/categories/${id}`);
}

// Get employees for assignment
export async function getEmployeesForAssignment(): Promise<EmployeeForAssignment[]> {
  const response = await api.get('/admin/services/employees');
  return extractData<EmployeeForAssignment[]>(response, true);
}

// Get services by employee
export async function getServicesByEmployee(employeeId: string): Promise<AdminService[]> {
  const response = await api.get(`/admin/services/employees/${employeeId}/services`);
  return extractData<AdminService[]>(response, true);
}

// Bulk assign services to employee
export async function bulkAssignServicesToEmployee(
  employeeId: string, 
  serviceIds: string[]
): Promise<void> {
  await api.post(`/admin/services/employees/${employeeId}/services/bulk`, serviceIds);
}
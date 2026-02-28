/**
 * Aura Drive — API Client
 * Handles all communication with the FastAPI backend.
 * Uses dynamic credentials from the auth context.
 */

const API_BASE = "http://localhost:8000";

/** Get the stored auth header from sessionStorage */
function getAuthHeader(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("aura_auth") || "";
}

/** Set auth credentials in sessionStorage */
export function setAuthCredentials(username: string, password: string): void {
  const header = "Basic " + btoa(`${username}:${password}`);
  sessionStorage.setItem("aura_auth", header);
}

/** Clear stored credentials */
export function clearAuthCredentials(): void {
  sessionStorage.removeItem("aura_auth");
}

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const authHeader = getAuthHeader();
  if (!authHeader && typeof window !== "undefined") {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthCredentials();
      throw new Error("Invalid credentials");
    }
    if (res.status === 403) {
      throw new Error("Access denied — Manager privileges required");
    }
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body.detail) {
        detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
      }
    } catch { /* ignore parse errors */ }
    throw new Error(detail);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

// ── Types ──────────────────────────────────

export interface Vehicle {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  purchase_price: number;
  status: "Available" | "Sold" | "In-Transit";
}

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  lifetime_value: number;
  vip_tier: "Standard" | "Gold" | "Platinum" | "Black";
}

export interface Sale {
  id: number;
  vehicle_id: number;
  client_id: number;
  sale_price: number;
  sale_date: string;
  commission: number;
}

export interface QuarterlyAggregate {
  quarter: string;
  total_units_sold: number;
  total_revenue: number;
  average_price: number;
}

export interface Insights {
  max_quarter: string;
  max_revenue: number;
  min_quarter: string;
  min_revenue: number;
  quarters: QuarterlyAggregate[];
}

export interface HealthInfo {
  status: string;
  database: string;
  total_vehicles: number;
  total_clients: number;
  total_sales: number;
  database_size_bytes: number;
  schema_tables: string[];
}

export interface AuthUser {
  username: string;
  display_name: string;
  role: "manager" | "salesman";
}

// ── API Functions ──────────────────────────

export const api = {
  // Auth
  login: (username: string, password: string): Promise<AuthUser> => {
    setAuthCredentials(username, password);
    return apiFetch<AuthUser>("/api/auth/me").catch((err) => {
      clearAuthCredentials();
      throw err;
    });
  },
  getMe: () => apiFetch<AuthUser>("/api/auth/me"),

  // Vehicles
  getVehicles: (params?: { status?: string; make?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.make) qs.set("make", params.make);
    const query = qs.toString() ? `?${qs}` : "";
    return apiFetch<Vehicle[]>(`/api/vehicles/${query}`);
  },
  createVehicle: (data: Omit<Vehicle, "id">) =>
    apiFetch<Vehicle>("/api/vehicles/", { method: "POST", body: JSON.stringify(data) }),
  deleteVehicle: (id: number) =>
    apiFetch<void>(`/api/vehicles/${id}`, { method: "DELETE" }),

  // Clients
  getClients: (params?: { vip_tier?: string }) => {
    const qs = new URLSearchParams();
    if (params?.vip_tier) qs.set("vip_tier", params.vip_tier);
    const query = qs.toString() ? `?${qs}` : "";
    return apiFetch<Client[]>(`/api/clients/${query}`);
  },
  createClient: (data: Omit<Client, "id">) =>
    apiFetch<Client>("/api/clients/", { method: "POST", body: JSON.stringify(data) }),
  deleteClient: (id: number) =>
    apiFetch<void>(`/api/clients/${id}`, { method: "DELETE" }),

  // Sales
  getSales: () => apiFetch<Sale[]>("/api/sales/"),
  createSale: (data: Omit<Sale, "id">) =>
    apiFetch<Sale>("/api/sales/", { method: "POST", body: JSON.stringify(data) }),

  // Analytics
  getQuarterly: () => apiFetch<QuarterlyAggregate[]>("/api/analytics/quarterly"),
  getInsights: () => apiFetch<Insights>("/api/analytics/insights"),

  // System
  getHealth: () => apiFetch<HealthInfo>("/api/system/health"),
};

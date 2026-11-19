import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ProfileData,
  DashboardData,
  PersonalInfo,
  ChecklistProgress,
} from "../types/onboarding";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (isJson && data) {
      if (data.message) {
        throw new Error(data.message);
      }
    }
    throw new Error(
      typeof data === "string" && data
        ? data
        : "Network or server error occured",
    );
  }

  return data as T;
}

export const api = {
  // Auth Endpoints
  register: (payload: RegisterRequest) =>
    apiRequest<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginRequest) =>
    apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Onboarding & Profile endpoints (protected)
  getDashboard: () => apiRequest<DashboardData>("/onboarding/dashboard"),

  getProfile: () => apiRequest<ProfileData>("/onboarding/profile"),

  getPersonalInfo: () => apiRequest<PersonalInfo>("/onboarding/personal-info"),

  savePersonalInfo: (payload: PersonalInfo) =>
    apiRequest("/onboarding/personal-info", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  getCompanyIntro: () => apiRequest<string>("/onboarding/company-intro"),

  markCompanyIntroRead: () =>
    apiRequest<boolean>("/onboarding/company-intro", {
      method: "PUT",
    }),

  getCompanyPolicy: () => apiRequest<string>("/onboarding/company-policy"),

  acknowledgeCompanyPolicy: () =>
    apiRequest<boolean>("/onboarding/company-policy", {
      method: "PUT",
    }),

  getJoiningChecklist: () =>
    apiRequest<ChecklistProgress>("/onboarding/joining-checklist"),

  saveJoiningChecklist: (payload: ChecklistProgress) =>
    apiRequest<ChecklistProgress>("/onboarding/joining-checklist", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  confirmOnboarding: () =>
    apiRequest<string>("/onboarding/final-confirmation", {
      method: "POST",
    }),
};

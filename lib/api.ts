"use client";

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("nt_access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 — clear token and redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("nt_access_token");
      localStorage.removeItem("nt_user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (employeeId: string, password: string) =>
    apiClient.post("/auth/login", { employeeId, password }),

  getMe: () => apiClient.get("/auth/me"),

  refreshToken: () => apiClient.post("/auth/refresh-token"),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post("/auth/change-password", { oldPassword, newPassword }),
};

// ─── Reports ───────────────────────────────────────────────────────────────
export const reportsAPI = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get("/reports", { params }),

  getById: (id: string) => apiClient.get(`/reports/${id}`),

  create: (data: {
    reportedEmployeeName: string;
    reportedEmployeeId?: string;
    description?: string;
    severity?: string;
  }) => apiClient.post("/reports", data),
};

// ─── Comments ──────────────────────────────────────────────────────────────
export const commentsAPI = {
  getByReport: (reportId: string, params?: Record<string, any>) =>
    apiClient.get(`/reports/${reportId}/comments`, { params }),

  create: (reportId: string, content: string) =>
    apiClient.post(`/reports/${reportId}/comments`, { reportId, content }),
};

// ─── Votes ─────────────────────────────────────────────────────────────────
export const votesAPI = {
  cast: (reportId: string, voteType: "UPVOTE" | "DOWNVOTE") =>
    apiClient.post(`/reports/${reportId}/vote`, { voteType }),

  remove: (reportId: string) => apiClient.delete(`/reports/${reportId}/vote`),
};

// ─── Leaderboard ─────────────────────────────────────────────────────────
export const leaderboardAPI = {
  get: (params?: { range?: string; month?: string }) =>
    apiClient.get("/leaderboard", { params }),

  getEmployeeProfile: (employeeId: string) =>
    apiClient.get(`/leaderboard/employees/${employeeId}/profile`),
};

// ─── Public Users Search (any authenticated user) ────────────────────────
export const publicUsersAPI = {
  search: (query: string) =>
    apiClient.get('/admin/employees/search', { params: { search: query } }),
};

// ─── Admin — Employees ────────────────────────────────────────────────────
export const adminEmployeesAPI = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get("/admin/employees", { params }),

  getById: (id: string) => apiClient.get(`/admin/employees/${id}`),

  create: (data: any) => apiClient.post("/admin/employees", data),

  update: (id: string, data: Record<string, any>) =>
    apiClient.patch(`/admin/employees/${id}`, data),

  delete: (id: string) => apiClient.delete(`/admin/employees/${id}`),

  previewUpload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/admin/employees/preview-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  confirmUpload: (users: any[]) => {
    return apiClient.post("/admin/employees/confirm-upload", { users });
  },
};

// ─── Admin — Reports ──────────────────────────────────────────────────────
export const adminReportsAPI = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get("/reports", {
      params: { ...params, status: params?.status || "all" },
    }),

  approve: (id: string) => apiClient.patch(`/reports/admin/${id}/approve`, {}),

  update: (id: string, data: Record<string, any>) =>
    apiClient.patch(`/reports/admin/${id}`, data),

  delete: (id: string) => apiClient.delete(`/reports/admin/${id}`),
};

export default apiClient;

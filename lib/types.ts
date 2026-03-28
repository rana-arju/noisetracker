/**
 * Core TypeScript types for Noise Tracker application
 */

export type UserRole = "user" | "admin";
export type ReportStatus = "pending" | "approved" | "deleted";
export type SeverityLevel = "low" | "medium" | "high";

export interface User {
  id: string;
  name: string;
  email?: string;
  employeeId?: string;
  password: string; // mock only
  role: UserRole;
  createdAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  email?: string;
  phone?: string;
  designation?: string;
  createdAt: Date;
}

export interface EmployeeUploadPreview extends Partial<Employee> {
  status: "valid" | "missing_data" | "duplicate" | "invalid_id";
  errors?: string[];
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  employeeId: string;
  employeeName: string;
  description: string;
  severity: SeverityLevel;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
  commentCount: number;
}

export interface Vote {
  reportId: string;
  userId: string;
  voteType: "upvote" | "downvote" | null;
}

export interface Comment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  upvotes?: number;
}

export interface AdminSession {
  id: string;
  adminEmail: string;
  adminName: string;
  loginTime: Date;
}

export interface LeaderboardEntry {
  employeeId: string;
  employeeName: string;
  reportCount: number;
  upvotes: number;
  rank: number;
}

export interface SearchFilters {
  query: string;
  severity?: SeverityLevel[];
  status?: ReportStatus;
  sortBy: "recent" | "top-voted" | "most-discussed";
  page: number;
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  approvedReports: number;
  deletedReports: number;
}

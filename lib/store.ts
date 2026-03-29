"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import {
  authAPI,
  reportsAPI,
  commentsAPI,
  votesAPI,
  adminEmployeesAPI,
  leaderboardAPI,
  adminReportsAPI,
} from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────
export type UserRole = "EMPLOYEE" | "ADMIN" | "SUPERADMIN";

export interface AuthUser {
  id: string;
  employeeId: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
}

export interface ReportItem {
  id: string;
  reportedEmployeeName: string;
  reportedEmployeeId?: string | null;
  description?: string | null;
  severity: string;
  status: string;
  anonymousReporterName: string;
  totalUpvotes: number;
  totalDownvotes: number;
  totalComments: number;
  currentUserVote: "UPVOTE" | "DOWNVOTE" | null;
  createdAt: string;
  updatedAt: string;
  // Admin-only
  createdBy?: {
    id: string;
    employeeId: string;
    name?: string | null;
  };
}

export interface CommentItem {
  id: string;
  reportId: string;
  content: string;
  anonymousCommenterName: string;
  createdAt: string;
  user?: { id: string; employeeId: string; name?: string | null };
}

export interface EmployeeItem {
  id: string;
  employeeId: string;
  name: string;
  email?: string | null;
  designation?: string | null;
  department?: string | null;
  role: UserRole;
  status: string;
  createdAt: string;
}

// ─── Context Interface ────────────────────────────────────────────────────
interface AppContextType {
  currentUser: AuthUser | null;
  isLoading: boolean;

  login: (employeeId: string, password: string) => Promise<boolean>;
  logout: () => void;

  reports: ReportItem[];
  reportsMeta: any;
  fetchReports: (params?: Record<string, any>) => Promise<void>;
  createReport: (data: {
    reportedEmployeeName: string;
    reportedEmployeeId?: string;
    description?: string;
    severity?: string;
  }) => Promise<void>;
  vote: (reportId: string, voteType: "UPVOTE" | "DOWNVOTE") => Promise<void>;
  removeVote: (reportId: string) => Promise<void>;

  // Admin moderation
  approveReport: (id: string) => Promise<void>;
  rejectReport: (id: string) => Promise<void>; // mapped to delete for simplicity or status update

  comments: Record<string, CommentItem[]>;
  fetchComments: (reportId: string) => Promise<void>;
  addComment: (reportId: string, content: string) => Promise<void>;

  // Admin
  employees: EmployeeItem[];
  fetchEmployees: (params?: Record<string, any>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addEmployees: (users: any[]) => Promise<void>;
  updateEmployee: (id: string, data: any) => Promise<void>;
  previewUploadEmployees: (file: File) => Promise<any>;
  confirmUploadEmployees: (users: any[]) => Promise<void>;

  // Profile
  currentProfile: any | null;
  fetchEmployeeProfile: (employeeId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [reportsMeta, setReportsMeta] = useState<any>(null);
  const [comments, setComments] = useState<Record<string, CommentItem[]>>({});
  const [currentProfile, setCurrentProfile] = useState<any | null>(null);

  // Restore user session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("nt_access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        setCurrentUser(res.data.data);
      } catch {
        localStorage.removeItem("nt_access_token");
        localStorage.removeItem("nt_user");
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(
    async (employeeId: string, password: string): Promise<boolean> => {
      try {
        const res = await authAPI.login(employeeId, password);
        const { accessToken, user } = res.data.data;
        localStorage.setItem("nt_access_token", accessToken);
        localStorage.setItem("nt_user", JSON.stringify(user));
        setCurrentUser(user);
        return true;
      } catch (err) {
        return false;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("nt_access_token");
    localStorage.removeItem("nt_user");
    setCurrentUser(null);
  }, []);

  const fetchReports = useCallback(async (params?: Record<string, any>) => {
    try {
      const res = await reportsAPI.getAll(params);
      setReports(res.data.data);
      setReportsMeta(res.data.meta);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  }, []);

  const createReport = useCallback(
    async (data: {
      reportedEmployeeName: string;
      reportedEmployeeId?: string;
      description?: string;
      severity?: string;
    }) => {
      await reportsAPI.create(data);
      // Refresh reports after creation
      await fetchReports();
    },
    [fetchReports],
  );

  const approveReport = useCallback(
    async (id: string) => {
      try {
        await adminReportsAPI.approve(id);
        await fetchReports(); // Refresh list
      } catch (err) {
        console.error("Failed to approve report", err);
        throw err;
      }
    },
    [fetchReports],
  );

  const rejectReport = useCallback(
    async (id: string) => {
      try {
        await adminReportsAPI.delete(id);
        await fetchReports(); // Refresh list
      } catch (err) {
        console.error("Failed to reject report", err);
        throw err;
      }
    },
    [fetchReports],
  );

  const vote = useCallback(
    async (reportId: string, voteType: "UPVOTE" | "DOWNVOTE") => {
      try {
        const res = await votesAPI.cast(reportId, voteType);
        const { currentUserVote } = res.data.data;
        // Optimistically update local state
        setReports((prev) =>
          prev.map((r) => {
            if (r.id !== reportId) return r;
            const old = r.currentUserVote;
            let up = r.totalUpvotes;
            let down = r.totalDownvotes;
            if (old === "UPVOTE") up -= 1;
            if (old === "DOWNVOTE") down -= 1;
            if (currentUserVote === "UPVOTE") up += 1;
            if (currentUserVote === "DOWNVOTE") down += 1;
            return {
              ...r,
              currentUserVote,
              totalUpvotes: up,
              totalDownvotes: down,
            };
          }),
        );
      } catch (err) {
        console.error("Vote failed", err);
      }
    },
    [],
  );

  const removeVote = useCallback(async (reportId: string) => {
    try {
      await votesAPI.remove(reportId);
      setReports((prev) =>
        prev.map((r) => {
          if (r.id !== reportId) return r;
          const old = r.currentUserVote;
          const up = old === "UPVOTE" ? r.totalUpvotes - 1 : r.totalUpvotes;
          const down =
            old === "DOWNVOTE" ? r.totalDownvotes - 1 : r.totalDownvotes;
          return {
            ...r,
            currentUserVote: null,
            totalUpvotes: up,
            totalDownvotes: down,
          };
        }),
      );
    } catch (err) {
      console.error("Remove vote failed", err);
    }
  }, []);

  const fetchComments = useCallback(async (reportId: string) => {
    try {
      const res = await commentsAPI.getByReport(reportId);
      setComments((prev) => ({ ...prev, [reportId]: res.data.data }));
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  }, []);

  const addComment = useCallback(
    async (reportId: string, content: string) => {
      await commentsAPI.create(reportId, content);
      await fetchComments(reportId);
      // Increment comment count locally
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, totalComments: r.totalComments + 1 } : r,
        ),
      );
    },
    [fetchComments],
  );

  // ─── Admin — Employees ──────────────────────────────────────────────────
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);

  const fetchEmployees = useCallback(async (params?: Record<string, any>) => {
    try {
      const res = await adminEmployeesAPI.getAll(params);
      setEmployees(res.data.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    try {
      await adminEmployeesAPI.delete(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete employee", err);
      throw err;
    }
  }, []);

  const addEmployees = useCallback(async (users: any[]) => {
    try {
      // For now the API probably only supports one at a time or we use bulk-upload
      // But the New page calls addEmployees([formData])
      for (const user of users) {
        await adminEmployeesAPI.create(user);
      }
      await fetchEmployees();
    } catch (err) {
      console.error("Failed to add employee", err);
      throw err;
    }
  }, [fetchEmployees]);

  const updateEmployee = useCallback(async (id: string, data: any) => {
    try {
      await adminEmployeesAPI.update(id, data);
      await fetchEmployees();
    } catch (err) {
      console.error("Failed to update employee", err);
      throw err;
    }
  }, [fetchEmployees]);

  const previewUploadEmployees = useCallback(
    async (file: File) => {
      try {
        const res = await adminEmployeesAPI.previewUpload(file);
        return res.data.data;
      } catch (err) {
        console.error("Failed to preview upload", err);
        throw err;
      }
    },
    [],
  );

  const confirmUploadEmployees = useCallback(
    async (users: any[]) => {
      try {
        await adminEmployeesAPI.confirmUpload(users);
        await fetchEmployees();
      } catch (err) {
        console.error("Failed to confirm upload", err);
        throw err;
      }
    },
    [fetchEmployees],
  );

  // ─── Profile ────────────────────────────────────────────────────────────
  const fetchEmployeeProfile = useCallback(async (employeeId: string) => {
    try {
      const res = await leaderboardAPI.getEmployeeProfile(employeeId);
      const profile = res.data.data;
      setCurrentProfile(profile);

      // Merge profile reports into global reports list if not present
      if (profile?.reports) {
        setReports((prev) => {
          const newReports = [...prev];
          profile.reports.forEach((pr: any) => {
            if (!newReports.find((r) => r.id === pr.id)) {
              // Convert backend profile report to standard ReportItem if needed
              // The profile reports might be summary-only, but let's try to normalize
              newReports.push({
                ...pr,
                reportedEmployeeId: profile.user.employeeId,
                reportedEmployeeName: profile.user.name,
                totalUpvotes: pr.upvotes || 0,
                totalDownvotes: pr.downvotes || 0,
                totalComments: pr.commentCount || 0,
                status: "APPROVED", // Since profile only shows approved
              });
            }
          });
          return newReports;
        });
      }
    } catch (err) {
      console.error("Failed to fetch employee profile", err);
      setCurrentProfile(null);
    }
  }, []);

  const value: AppContextType = {
    currentUser,
    isLoading,
    login,
    logout,
    reports,
    reportsMeta,
    fetchReports,
    createReport,
    vote,
    removeVote,
    approveReport,
    rejectReport,
    comments,
    fetchComments,
    addComment,
    employees,
    fetchEmployees,
    deleteEmployee,
    addEmployees,
    updateEmployee,
    previewUploadEmployees,
    confirmUploadEmployees,
    currentProfile,
    fetchEmployeeProfile,
  };

  return React.createElement(AppContext.Provider, { value }, children);
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}

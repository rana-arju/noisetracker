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
  Report,
  User,
  Vote,
  Comment,
  AdminSession,
  ReportStatus,
  Employee,
} from "@/lib/types";
import { mockReports, mockComments, mockUsers, mockAdmin, mockEmployees } from "@/lib/mock-data";

interface AppContextType {
  currentUser: User | null;
  adminSession: AdminSession | null;
  login: (employeeId: string, password: string) => boolean;
  adminLogin: (email: string, password: string) => boolean;
  logout: () => void;

  reports: Report[];
  createReport: (report: Omit<Report, "id" | "createdAt" | "updatedAt">) => void;
  updateReportStatus: (reportId: string, status: ReportStatus) => void;
  deleteReport: (reportId: string) => void;

  votes: Vote[];
  vote: (reportId: string, voteType: "upvote" | "downvote" | null) => void;
  getVoteForReport: (reportId: string) => Vote | undefined;

  comments: Comment[];
  addComment: (reportId: string, content: string) => void;
  getCommentsForReport: (reportId: string) => Comment[];

  approveReport: (reportId: string) => void;
  rejectReport: (reportId: string) => void;
  
  employees: Employee[];
  addEmployees: (newEmployees: Omit<Employee, "id" | "createdAt">[]) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  // Persistence logic
  useEffect(() => {
    const savedUser = localStorage.getItem("nt_user");
    const savedAdmin = localStorage.getItem("nt_admin");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedAdmin) setAdminSession(JSON.parse(savedAdmin));
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("nt_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("nt_user");
    }
  }, [currentUser]);

  useEffect(() => {
    if (adminSession) {
      localStorage.setItem("nt_admin", JSON.stringify(adminSession));
    } else {
      localStorage.removeItem("nt_admin");
    }
  }, [adminSession]);

  const login = useCallback((employeeId: string, password: string): boolean => {
    // In our mock, if employee exists and password matches '123456'
    const employee = employees.find((e) => e.employeeId === employeeId);
    
    if (employee && password === "123456") {
      const user: User = {
        id: employee.id,
        name: employee.name,
        employeeId: employee.employeeId,
        email: employee.email,
        password: "123456",
        role: "user",
        createdAt: employee.createdAt,
      };
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [employees]);

  const adminLogin = useCallback((email: string, password: string): boolean => {
    if (email === mockAdmin.email && password === mockAdmin.password) {
      setAdminSession({
        id: "ADMIN-SESSION-1",
        adminEmail: mockAdmin.email,
        adminName: mockAdmin.name,
        loginTime: new Date(),
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setAdminSession(null);
  }, []);

  const createReport = useCallback(
    (report: Omit<Report, "id" | "createdAt" | "updatedAt">) => {
      const newReport: Report = {
        ...report,
        id: `RPT-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setReports((prev) => [newReport, ...prev]);
    },
    []
  );

  const updateReportStatus = useCallback((reportId: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, status, updatedAt: new Date() }
          : report
      )
    );
  }, []);

  const deleteReport = useCallback((reportId: string) => {
    setReports((prev) =>
      prev.filter((report) => report.id !== reportId)
    );
  }, []);

  const vote = useCallback(
    (reportId: string, voteType: "upvote" | "downvote" | null) => {
      if (!currentUser && !adminSession) return;

      const userId = currentUser?.id || adminSession?.id || "guest";

      setVotes((prev) => {
        const existingVote = prev.find(
          (v) => v.reportId === reportId && v.userId === userId
        );

        if (existingVote) {
          if (existingVote.voteType === voteType) {
            return prev.filter((v) => v !== existingVote);
          }
          return prev.map((v) =>
            v === existingVote ? { ...v, voteType } : v
          );
        }

        return [...prev, { reportId, userId, voteType }];
      });

      setReports((prev) =>
        prev.map((report) => {
          if (report.id === reportId) {
            const existingVote = votes.find(
              (v) => v.reportId === reportId && v.userId === userId
            );

            let newUpvotes = report.upvotes;
            let newDownvotes = report.downvotes;

            if (existingVote?.voteType === "upvote") newUpvotes -= 1;
            if (existingVote?.voteType === "downvote") newDownvotes -= 1;

            if (voteType === "upvote") newUpvotes += 1;
            if (voteType === "downvote") newDownvotes += 1;

            return {
              ...report,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
            };
          }
          return report;
        })
      );
    },
    [currentUser, adminSession, votes]
  );

  const getVoteForReport = useCallback(
    (reportId: string): Vote | undefined => {
      const userId = currentUser?.id || adminSession?.id || "guest";
      return votes.find((v) => v.reportId === reportId && v.userId === userId);
    },
    [currentUser, adminSession, votes]
  );

  const addComment = useCallback(
    (reportId: string, content: string) => {
      if (!currentUser && !adminSession) return;

      const newComment: Comment = {
        id: `COM-${Date.now()}`,
        reportId,
        userId: currentUser?.id || adminSession?.id || "guest",
        userName: currentUser?.name || adminSession?.adminName || "Guest",
        content,
        createdAt: new Date(),
        upvotes: 0,
      };

      setComments((prev) => [newComment, ...prev]);

      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? { ...report, commentCount: report.commentCount + 1 }
            : report
        )
      );
    },
    [currentUser, adminSession]
  );

  const getCommentsForReport = useCallback(
    (reportId: string): Comment[] => {
      return comments.filter((c) => c.reportId === reportId);
    },
    [comments]
  );

  const approveReport = useCallback((reportId: string) => {
    updateReportStatus(reportId, "approved");
  }, [updateReportStatus]);

  const rejectReport = useCallback((reportId: string) => {
    updateReportStatus(reportId, "deleted");
  }, [updateReportStatus]);

  const addEmployees = useCallback((newEmployees: Omit<Employee, "id" | "createdAt">[]) => {
    const formatted: Employee[] = newEmployees.map((emp) => ({
      ...emp,
      id: `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }));
    setEmployees((prev) => [...prev, ...formatted]);
  }, []);

  const updateEmployee = useCallback((id: string, data: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...data } : emp))
    );
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  }, []);

  const value: AppContextType = {
    currentUser,
    adminSession,
    login,
    adminLogin,
    logout,
    reports,
    createReport,
    updateReportStatus,
    deleteReport,
    votes,
    vote,
    getVoteForReport,
    comments,
    addComment,
    getCommentsForReport,
    approveReport,
    rejectReport,
    employees,
    addEmployees,
    updateEmployee,
    deleteEmployee,
  };

  return React.createElement(
    AppContext.Provider,
    { value: value },
    children
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

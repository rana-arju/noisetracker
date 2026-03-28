/**
 * Helper functions for formatting, filtering, and sorting
 */

import { Report, LeaderboardEntry, SearchFilters, DashboardStats, Employee } from "@/lib/types";
import { calculateLeaderboard } from "@/lib/mock-data";
import { 
  formatDistanceToNow, 
  format, 
  startOfMonth, 
  endOfMonth, 
  subDays, 
  isWithinInterval, 
  startOfDay,
  endOfDay,
  differenceInMonths
} from "date-fns";

export function formatDate(date: Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDateFull(date: Date): string {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
}

export function getSeverityColor(
  severity: string
): "bg-green-100 text-green-800" | "bg-yellow-100 text-yellow-800" | "bg-red-100 text-red-800" | "bg-gray-100 text-gray-800" {
  switch (severity) {
    case "low":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusColor(
  status: string
): "bg-blue-100 text-blue-800" | "bg-green-100 text-green-800" | "bg-red-100 text-red-800" | "bg-gray-100 text-gray-800" {
  switch (status) {
    case "pending":
      return "bg-blue-100 text-blue-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "deleted":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getRankBadge(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export function filterAndSortReports(
  reports: Report[],
  filters: SearchFilters
): Report[] {
  let filtered = [...reports];

  // Filter by query (employee name or description)
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.employeeName.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.employeeId.toLowerCase().includes(query)
    );
  }

  // Filter by severity
  if (filters.severity && filters.severity.length > 0) {
    filtered = filtered.filter((r) => filters.severity?.includes(r.severity));
  }

  // Filter by status
  if (filters.status && (filters.status as string) !== "all") {
    filtered = filtered.filter((r) => r.status === filters.status);
  }

  // Sort
  switch (filters.sortBy) {
    case "recent":
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "top-voted":
      filtered.sort((a, b) => b.upvotes - a.upvotes);
      break;
    case "most-discussed":
      filtered.sort((a, b) => b.commentCount - a.commentCount);
      break;
  }

  return filtered;
}

export function getPaginatedReports(
  reports: Report[],
  page: number,
  pageSize: number = 10
): Report[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return reports.slice(startIndex, endIndex);
}

export function getTotalPages(totalItems: number, pageSize: number = 10): number {
  return Math.ceil(totalItems / pageSize);
}

export function getLeaderboard(
  reports: Report[],
  dateRange?: { start: Date; end: Date }
): LeaderboardEntry[] {
  let filteredReports = reports;
  if (dateRange) {
    filteredReports = reports.filter((r) =>
      isWithinInterval(new Date(r.createdAt), {
        start: startOfDay(dateRange.start),
        end: endOfDay(dateRange.end),
      })
    );
  }
  return calculateLeaderboard(filteredReports);
}

export function getCurrentMonthRange() {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}

export function getLastMonthRange() {
  const now = new Date();
  const lastMonth = subDays(startOfMonth(now), 1);
  return {
    start: startOfMonth(lastMonth),
    end: endOfMonth(lastMonth),
  };
}

export function getLast3MonthsRange() {
  const now = new Date();
  const threeMonthsAgo = subDays(startOfMonth(now), 60); // simplified for mock
  return {
    start: startOfMonth(threeMonthsAgo),
    end: endOfMonth(now),
  };
}

export function filterReportsByDateRange(
  reports: Report[],
  start: Date,
  end: Date
): Report[] {
  return reports.filter((r) =>
    isWithinInterval(new Date(r.createdAt), {
      start: startOfDay(start),
      end: endOfDay(end),
    })
  );
}

export function calculateEmployeeStats(employeeId: string, reports: Report[]) {
  const employeeReports = reports.filter((r) => r.employeeId === employeeId);
  const now = new Date();
  
  const thisMonthReports = employeeReports.filter((r) =>
    isWithinInterval(new Date(r.createdAt), {
      start: startOfMonth(now),
      end: endOfMonth(now),
    })
  );
  
  const last7DaysReports = employeeReports.filter((r) =>
    isWithinInterval(new Date(r.createdAt), {
      start: subDays(now, 7),
      end: now,
    })
  );

  const sortedReports = [...employeeReports].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  const firstReported = sortedReports.length > 0 ? sortedReports[0].createdAt : null;
  const lastReported = sortedReports.length > 0 ? sortedReports[sortedReports.length - 1].createdAt : null;

  // Calculate average reports per month
  let avgPerMonth = 0;
  if (firstReported) {
    const monthsActive = Math.max(1, differenceInMonths(now, new Date(firstReported)) + 1);
    avgPerMonth = employeeReports.length / monthsActive;
  }

  return {
    lifetimeCount: employeeReports.length,
    thisMonthCount: thisMonthReports.length,
    last7DaysCount: last7DaysReports.length,
    avgPerMonth: parseFloat(avgPerMonth.toFixed(1)),
    firstReported,
    lastReported,
    totalUpvotes: employeeReports.reduce((sum, r) => sum + r.upvotes, 0),
    totalComments: employeeReports.reduce((sum, r) => sum + r.commentCount, 0),
  };
}

export function getTopLeaderboard(
  reports: Report[],
  count: number = 5
): LeaderboardEntry[] {
  return getLeaderboard(reports).slice(0, count);
}

export function getDashboardStats(reports: Report[]) {
  return {
    totalReports: reports.length,
    pendingReports: reports.filter((r) => r.status === "pending").length,
    approvedReports: reports.filter((r) => r.status === "approved").length,
    deletedReports: reports.filter((r) => r.status === "deleted").length,
  };
}

export function searchEmployeeByNameOrId(
  query: string,
  reports: Report[]
): Report[] {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return reports.filter(
    (r) =>
      r.employeeName.toLowerCase().includes(lowerQuery) ||
      r.employeeId.toLowerCase().includes(lowerQuery)
  );
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

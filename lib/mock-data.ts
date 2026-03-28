/**
 * Mock data for Noise Tracker
 * Realistic Bangladeshi employees and sample reports
 */

import {
  User,
  Employee,
  Report,
  Comment,
  LeaderboardEntry,
} from "./types";

// Mock Bangladeshi Employees
export const mockEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Rahim Ahmed",
    employeeId: "BD-001",
    designation: "ইঞ্জিনিয়ারিং",
    email: "rahim.ahmed@smtechnology.com",
    phone: "01711223344",
    createdAt: new Date("2026-01-10"),
  },
  {
    id: "EMP-002",
    name: "Fatima Khan",
    employeeId: "BD-002",
    designation: "মার্কেটিং",
    email: "fatima.khan@smtechnology.com",
    phone: "01811223344",
    createdAt: new Date("2026-01-12"),
  },
  {
    id: "EMP-003",
    name: "Karim Hassan",
    employeeId: "BD-003",
    designation: "সেলস",
    email: "karim.hassan@smtechnology.com",
    phone: "01911223344",
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "EMP-004",
    name: "Aisha Rahman",
    employeeId: "BD-004",
    designation: "এইচআর",
    email: "aisha.rahman@smtechnology.com",
    phone: "01611223344",
    createdAt: new Date("2026-01-18"),
  },
  {
    id: "EMP-005",
    name: "Samir Hussain",
    employeeId: "BD-005",
    designation: "ইঞ্জিনিয়ারিং",
    email: "samir.hussain@smtechnology.com",
    phone: "01511223344",
    createdAt: new Date("2026-01-20"),
  },
  {
    id: "EMP-006",
    name: "Nazia Begum",
    employeeId: "BD-006",
    designation: "ফিন্যান্স",
    email: "nazia.begum@smtechnology.com",
    phone: "01411223344",
    createdAt: new Date("2026-01-22"),
  },
  {
    id: "EMP-007",
    name: "Arif Hossain",
    employeeId: "BD-007",
    designation: "অপারেশনস",
    email: "arif.hossain@smtechnology.com",
    phone: "01311223344",
    createdAt: new Date("2026-01-25"),
  },
  {
    id: "EMP-008",
    name: "Saranya Dey",
    employeeId: "BD-008",
    designation: "ইঞ্জিনিয়ারিং",
    email: "saranya.dey@smtechnology.com",
    phone: "01211223344",
    createdAt: new Date("2026-01-28"),
  },
  {
    id: "EMP-009",
    name: "Jamal Khan",
    employeeId: "BD-009",
    designation: "সেলস",
    email: "jamal.khan@smtechnology.com",
    phone: "01111223344",
    createdAt: new Date("2026-02-01"),
  },
  {
    id: "EMP-010",
    name: "Priya Sharma",
    employeeId: "BD-010",
    designation: "মার্কেটিং",
    email: "priya.sharma@smtechnology.com",
    phone: "01011223344",
    createdAt: new Date("2026-02-05"),
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: "USER-001",
    name: "Current User",
    email: "user@example.com",
    password: "password123",
    role: "user",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "USER-002",
    name: "Guest Reporter",
    email: "guest@example.com",
    password: "demo",
    role: "user",
    createdAt: new Date("2024-02-10"),
  },
];

// Mock Admin
export const mockAdmin: User = {
  id: "ADMIN-001",
  name: "Admin Panel",
  email: "admin@smtechnology.com",
  password: "admin123",
  role: "admin",
  createdAt: new Date("2024-01-01"),
};

// Mock Reports spanning multiple months in 2026
export const mockReports: Report[] = [
  {
    id: "RPT-001",
    reporterId: "USER-001",
    reporterName: "বর্তমান ব্যবহারকারী",
    employeeId: "EMP-001",
    employeeName: "রহিম আহমেদ (BD-001)",
    description: "অফিসের কাজ চলাকালীন ব্যক্তিগত ফোনে উচ্চস্বরে কথা বলে পুরো টিমের কাজে ব্যাঘাত ঘটানো",
    severity: "high",
    status: "pending",
    createdAt: new Date("2026-03-25T10:00:00"),
    updatedAt: new Date("2026-03-25T10:00:00"),
    upvotes: 12,
    downvotes: 1,
    commentCount: 5,
  },
  {
    id: "RPT-002",
    reporterId: "USER-002",
    reporterName: "অতিথি রিপোর্টার",
    employeeId: "EMP-002",
    employeeName: "ফাতিমা খান (BD-002)",
    description: "ডেস্কে বসে দীর্ঘক্ষণ হেডফোন ছাড়াই গান বাজানো",
    severity: "medium",
    status: "approved",
    createdAt: new Date("2026-03-20T14:30:00"),
    updatedAt: new Date("2026-03-22T14:30:00"),
    upvotes: 8,
    downvotes: 0,
    commentCount: 3,
  },
  {
    id: "RPT-003",
    reporterId: "USER-001",
    reporterName: "বর্তমান ব্যবহারকারী",
    employeeId: "EMP-003",
    employeeName: "করিম হাসান (BD-003)",
    description: "চেয়ারের অতিরিক্ত শব্দ এবং নড়াচড়া, যা মিটিংয়ের সময় মনঃসংযোগে ব্যাঘাত ঘটায়",
    severity: "low",
    status: "approved",
    createdAt: new Date("2026-03-18T11:15:00"),
    updatedAt: new Date("2026-03-19T11:15:00"),
    upvotes: 5,
    downvotes: 2,
    commentCount: 2,
  },
  {
    id: "RPT-004",
    reporterId: "USER-002",
    reporterName: "অতিথি রিপোর্টার",
    employeeId: "EMP-005",
    employeeName: "সমীর হোসেন (BD-005)",
    description: "গভীর রাতে কিবোর্ডে উচ্চশব্দে টাইপ করা, যা ওপেন অফিসে শব্দের সৃষ্টি করে",
    severity: "medium",
    status: "pending",
    createdAt: new Date("2026-03-23T23:45:00"),
    updatedAt: new Date("2026-03-23T23:45:00"),
    upvotes: 15,
    downvotes: 3,
    commentCount: 7,
  },
  {
    id: "RPT-005",
    reporterId: "USER-001",
    reporterName: "বর্তমান ব্যবহারকারী",
    employeeId: "EMP-001",
    employeeName: "রহিম আহমেদ (BD-001)",
    description: "কাজ করার সময় গান গাওয়া, যা অন্যদের মনঃসংযোগে ব্যাঘাত ঘটায়",
    severity: "medium",
    status: "approved",
    createdAt: new Date("2026-02-15T15:20:00"),
    updatedAt: new Date("2026-02-15T15:20:00"),
    upvotes: 3,
    downvotes: 1,
    commentCount: 1,
  },
  {
    id: "RPT-006",
    reporterId: "USER-002",
    reporterName: "অতিথি রিপোর্টার",
    employeeId: "EMP-006",
    employeeName: "নাজিয়া বেগম (BD-006)",
    description: "সারাদিন ধরে ডেস্কের ড্রয়ার বারবার জোরে বন্ধ করা খুব বিরক্তিকর",
    severity: "high",
    status: "pending",
    createdAt: new Date("2026-03-26T09:30:00"),
    updatedAt: new Date("2026-03-26T09:30:00"),
    upvotes: 18,
    downvotes: 2,
    commentCount: 8,
  },
  {
    id: "RPT-007",
    reporterId: "USER-001",
    reporterName: "বর্তমান ব্যবহারকারী",
    employeeId: "EMP-007",
    employeeName: "আরিফ হোসেন (BD-007)",
    description: "অনবরত গুনগুন করা, যা কাজে মনোযোগ দেওয়া কঠিন করে তোলে",
    severity: "low",
    status: "approved",
    createdAt: new Date("2026-01-20T13:10:00"),
    updatedAt: new Date("2026-01-21T13:10:00"),
    upvotes: 7,
    downvotes: 1,
    commentCount: 2,
  },
  {
    id: "RPT-008",
    reporterId: "USER-002",
    reporterName: "অতিথি রিপোর্টার",
    employeeId: "EMP-001",
    employeeName: "রহিম আহমেদ (BD-001)",
    description: "মিটিংয়ের সময় জোরে হাসাহাসি করা",
    severity: "medium",
    status: "approved",
    createdAt: new Date("2026-03-05T11:00:00"),
    updatedAt: new Date("2026-03-05T11:00:00"),
    upvotes: 10,
    downvotes: 0,
    commentCount: 2,
  },
  {
    id: "RPT-009",
    reporterId: "USER-001",
    reporterName: "বর্তমান ব্যবহারকারী",
    employeeId: "EMP-009",
    employeeName: "জামাল খান (BD-009)",
    description: "কোনো সতর্কতা ছাড়াই স্পিকারফোনে কথা বলা, খুব উচ্চশব্দ এবং বিরক্তিকর",
    severity: "high",
    status: "pending",
    createdAt: new Date("2026-03-27T16:45:00"),
    updatedAt: new Date("2026-03-27T16:45:00"),
    upvotes: 22,
    downvotes: 1,
    commentCount: 10,
  },
  {
    id: "RPT-010",
    reporterId: "USER-002",
    reporterName: "অতিথি রিপোর্টার",
    employeeId: "EMP-001",
    employeeName: "রহিম আহমেদ (BD-001)",
    description: "লাঞ্চ ব্রেকে ডেস্কে উচ্চশব্দে ভিডিও দেখা",
    severity: "low",
    status: "approved",
    createdAt: new Date("2026-02-28T13:30:00"),
    updatedAt: new Date("2026-02-28T13:30:00"),
    upvotes: 4,
    downvotes: 1,
    commentCount: 0,
  },
  {
    id: "RPT-011",
    reporterId: "USER-001",
    reporterName: "বর্তমান ব্যবহারকারী",
    employeeId: "EMP-002",
    employeeName: "ফাতিমা খান (BD-002)",
    description: "সহকর্মীদের সাথে চিৎকার করে কথা বলা",
    severity: "medium",
    status: "approved",
    createdAt: new Date("2026-03-01T10:00:00"),
    updatedAt: new Date("2026-03-01T10:00:00"),
    upvotes: 6,
    downvotes: 0,
    commentCount: 1,
  },
  {
    id: "RPT-012",
    reporterId: "USER-002",
    reporterName: "অতিথি রিপোর্টার",
    employeeId: "EMP-004",
    employeeName: "আয়েশা রহমান (BD-004)",
    description: "অফিসে কুকুর নিয়ে আসা যা খুব শব্দ করে",
    severity: "medium",
    status: "approved",
    createdAt: new Date("2026-02-10T09:00:00"),
    updatedAt: new Date("2026-02-10T09:00:00"),
    upvotes: 15,
    downvotes: 2,
    commentCount: 4,
  },
];

// Mock Comments for 2026
export const mockComments: Comment[] = [
  {
    id: "COM-001",
    reportId: "RPT-001",
    userId: "USER-002",
    userName: "অতিথি রিপোর্টার",
    content: "আমি একমত, এটা কয়েক সপ্তাহ ধরে চলছে",
    createdAt: new Date("2026-03-25T14:30:00"),
    upvotes: 3,
  },
  {
    id: "COM-002",
    reportId: "RPT-001",
    userId: "USER-001",
    userName: "বর্তমান ব্যবহারকারী",
    content: "বিশেষ করে সকালে এটি খুব উচ্চশব্দ হয়",
    createdAt: new Date("2026-03-25T15:45:00"),
    upvotes: 5,
  },
  {
    id: "COM-003",
    reportId: "RPT-004",
    userId: "USER-001",
    userName: "বর্তমান ব্যবহারকারী",
    content: "হ্যাঁ, গভীর রাতে টাইপ করা নাইট শিফটের কর্মীদের জন্য খুব বিরক্তিকর",
    createdAt: new Date("2026-03-23T16:20:00"),
    upvotes: 2,
  },
  {
    id: "COM-004",
    reportId: "RPT-004",
    userId: "USER-002",
    userName: "অতিথি রিপোর্টার",
    content: "হয়তো হেডফোন ব্যবহার করা এই সমস্যার সমাধান হতে পারে",
    createdAt: new Date("2026-03-23T17:10:00"),
    upvotes: 7,
  },
  {
    id: "COM-005",
    reportId: "RPT-006",
    userId: "USER-001",
    userName: "বর্তমান ব্যবহারকারী",
    content: "এটি আমার কাজের প্রোডাক্টিভিটি কয়েকবার প্রভাবিত করেছে",
    createdAt: new Date("2026-03-26T10:00:00"),
    upvotes: 1,
  },
];

// Calculate Leaderboard
export const calculateLeaderboard = (reports: Report[]): LeaderboardEntry[] => {
  const employeeStats = new Map<
    string,
    { name: string; reportCount: number; upvotes: number }
  >();

  reports.forEach((report) => {
    if (report.status !== "deleted") {
      const key = report.employeeId;
      const current = employeeStats.get(key) || {
        name: report.employeeName,
        reportCount: 0,
        upvotes: 0,
      };
      current.reportCount += 1;
      current.upvotes += report.upvotes;
      employeeStats.set(key, current);
    }
  });

  const entries = Array.from(employeeStats.entries())
    .map(([id, stats], index) => ({
      employeeId: id,
      employeeName: stats.name,
      reportCount: stats.reportCount,
      upvotes: stats.upvotes,
      rank: index + 1,
    }))
    .sort((a, b) => b.upvotes - a.upvotes)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return entries;
};

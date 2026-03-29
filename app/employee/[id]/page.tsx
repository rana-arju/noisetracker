"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EmployeeProfileHeaderSkeleton,
  EmployeeStatsSkeleton,
  EmployeeReportGridSkeleton,
} from "@/components/shared/employee-skeleton";
import { 
  Calendar, 
  ChevronLeft, 
  MessageSquare, 
  ThumbsUp, 
  AlertTriangle,
  Filter,
  BarChart3,
  Clock,
  History
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { 
  calculateEmployeeStats, 
  formatDate, 
  formatDateFull, 
  getSeverityColor, 
  getStatusColor,
  filterReportsByDateRange 
} from "@/lib/helpers";
import { StatusBadge, SeverityBadge } from "@/components/shared/badges";
import { ReportCard } from "@/components/reports/report-card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EmployeeProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { reports, employees, currentProfile, fetchEmployeeProfile } = useApp();
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  // Fetch profile on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLocalLoading(true);
      await fetchEmployeeProfile(id);
      setIsLocalLoading(false);
    };
    loadData();
  }, [id, fetchEmployeeProfile]);

  const employee = currentProfile?.user || employees.find((e: any) => e.id === id || e.employeeId === id);
  const employeeId = employee?.employeeId || id;
  const employeeName = employee?.name || "অজানা কর্মচারী";
  
  const [timeFilter, setTimeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const stats = useMemo(() => {
    if (currentProfile?.stats && !reports.some(r => r.reportedEmployeeId === employeeId)) {
        return {
            lifetimeCount: currentProfile.stats.totalReports,
            thisMonthCount: currentProfile.stats.totalReports,
            last7DaysCount: 0,
            avgPerMonth: 0,
            firstReported: null,
            lastReported: null,
            totalUpvotes: 0,
            totalComments: 0
        };
    }
    return calculateEmployeeStats(employeeId, reports);
  }, [employeeId, reports, currentProfile]);
  
  const filteredReports = useMemo(() => {
    let list = reports.filter(r => r.reportedEmployeeId === employeeId);
    
    const now = new Date();
    if (timeFilter === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      list = list.filter(r => new Date(r.createdAt) >= start);
    } else if (timeFilter === "week") {
      const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(r => new Date(r.createdAt) >= start);
    }
    
    if (severityFilter !== "all") {
      list = list.filter(r => r.severity?.toLowerCase() === severityFilter.toLowerCase());
    }
    
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [employeeId, reports, timeFilter, severityFilter]);

  if (!isLocalLoading && !employee && filteredReports.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">কর্মচারী খুঁজে পাওয়া যায়নি</h1>
          <Link href="/">
            <Button className="mt-4">হোমে ফিরে যান</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Navigation */}
        <Link href="/leaderboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition">
          <ChevronLeft className="h-4 w-4 mr-1" />
          তালিকায় ফিরে যান
        </Link>

        {/* Header Section — shows skeleton while loading */}
        {isLocalLoading ? (
          <EmployeeProfileHeaderSkeleton />
        ) : (
          <Card className="p-6 md:p-8 border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400">
                {employeeName.charAt(0)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{employeeName}</h1>
                  <Badge variant="outline" className="text-xs">{employee?.employeeId || id}</Badge>
                  {stats.lifetimeCount > 10 && (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">উচ্চ সতর্কতা</Badge>
                  )}
                </div>
                <p className="text-muted-foreground flex items-center gap-4 text-sm flex-wrap">
                  <span className="flex items-center gap-1.5"><History className="h-4 w-4" /> প্রথম রিপোর্ট: {stats.firstReported ? formatDateFull(new Date(stats.firstReported)) : "নেই"}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> শেষ রিপোর্ট: {stats.lastReported ? formatDateFull(new Date(stats.lastReported)) : "নেই"}</span>
                </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
                <div className="text-center px-4">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalUpvotes}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">সহমত</p>
                </div>
                <div className="text-center px-4 border-l border-slate-100 dark:border-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalComments}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">আলোচনা</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Grid — shows skeleton while loading */}
        {isLocalLoading ? (
          <EmployeeStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="সর্বমোট রিপোর্ট" 
              value={stats.lifetimeCount} 
              sub="পুরো সময়কাল" 
              icon={<BarChart3 className="h-5 w-5 text-blue-500" />} 
            />
            <StatCard 
              label="এই মাসের রিপোর্ট" 
              value={stats.thisMonthCount} 
              sub="মার্চ ২০২৬" 
              icon={<Calendar className="h-5 w-5 text-amber-500" />} 
            />
            <StatCard 
              label="গত ৭ দিনের রিপোর্ট" 
              value={stats.last7DaysCount} 
              sub="সাম্প্রতিক" 
              icon={<Clock className="h-5 w-5 text-red-500" />} 
            />
            <StatCard 
              label="মাসিক গড় রিপোর্ট" 
              value={stats.avgPerMonth} 
              sub="ফ্রিকোয়েন্সি" 
              icon={<AlertTriangle className="h-5 w-5 text-slate-500" />} 
            />
          </div>
        )}

        {/* Timeline & Filters */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm py-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              রিপোর্ট টাইমলাইন
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900">
                  <SelectValue placeholder="সময়কাল" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব সময়</SelectItem>
                  <SelectItem value="month">এই মাস</SelectItem>
                  <SelectItem value="week">গত ৭ দিন</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900">
                  <SelectValue placeholder="তীব্রতা" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">সব তীব্রতা</SelectItem>
                  <SelectItem value="low">কম</SelectItem>
                  <SelectItem value="medium">মাঝারি</SelectItem>
                  <SelectItem value="high">উচ্চ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reports Grid — shows skeleton while loading */}
          {isLocalLoading ? (
            <EmployeeReportGridSkeleton count={4} />
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-dashed border-2">
              <div className="flex justify-center mb-4 text-muted-foreground/30">
                <Filter className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium">কোনো রিপোর্ট পাওয়া যায়নি</h3>
              <p className="text-muted-foreground mt-1">আপনার ফিল্টার পরিবর্তন করে দেখুন অথবা পরে আবার চেষ্টা করুন।</p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ label, value, sub, icon }: { label: string, value: number | string, sub: string, icon: React.ReactNode }) {
  return (
    <Card className="p-5 border-none shadow-sm bg-white dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">{value}</h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">{sub}</p>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
          {icon}
        </div>
      </div>
    </Card>
  );
}

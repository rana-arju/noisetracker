"use client";

import { useState, useEffect } from "react";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { AdminStatsGridSkeleton, AdminQuickActionsSkeleton } from "@/components/admin/admin-skeleton";
import { useApp } from "@/lib/store";
import { getDashboardStats } from "@/lib/helpers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { reports, employees, currentUser, fetchReports, fetchEmployees } = useApp();
  const [loading, setLoading] = useState(true);
  const stats = getDashboardStats(reports);

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPERADMIN";

  // Fetch data on mount
  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      Promise.all([fetchReports(), fetchEmployees()]).finally(() => setLoading(false));
    }
  }, [fetchReports, fetchEmployees, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">আপনাকে অবশ্যই অ্যাডমিন হিসেবে লগইন করতে হবে</p>
          <Link href="/auth/login">
            <Button>অ্যাডমিন লগইনে যান</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <main className="md:ml-64">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">ড্যাশবোর্ড</h1>
            <p className="text-muted-foreground mt-2">
              মডারেশন ওভারভিউ এবং সংক্ষিপ্ত পরিসংখ্যান
            </p>
          </div>

          {/* Stats Section — loads independently */}
          {loading ? (
            <AdminStatsGridSkeleton />
          ) : (
            <AdminStatsGrid stats={stats} />
          )}

          {/* Quick Actions Section — loads independently */}
          {loading ? (
            <AdminQuickActionsSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-border rounded-lg p-6 bg-card flex flex-col">
                <h3 className="font-semibold mb-2">পেন্ডিং রিভিউ</h3>
                <p className="text-3xl font-bold text-primary mb-4">
                  {stats.pendingReports}
                </p>
                <div className="mt-auto">
                  <Link href="/admin/dashboard/reports">
                    <Button className="w-full">রিপোর্ট রিভিউ করুন</Button>
                  </Link>
                </div>
              </div>
              
              <div className="border border-border rounded-lg p-6 bg-card flex flex-col">
                <h3 className="font-semibold mb-2">কর্মচারী ব্যবস্থাপনা</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {employees.length}
                </p>
                <div className="mt-auto">
                  <Link href="/admin/employees">
                    <Button variant="outline" className="w-full">তালিকায় যান</Button>
                  </Link>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 bg-card flex flex-col">
                <h3 className="font-semibold mb-2">অনুমোদিত রিপোর্ট</h3>
                <p className="text-3xl font-bold text-green-600 mb-4">
                  {stats.approvedReports}
                </p>
                <div className="mt-auto">
                  <Link href="/admin/dashboard/reports?status=approved">
                    <Button variant="outline" className="w-full">
                      ইতিহাস দেখুন
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

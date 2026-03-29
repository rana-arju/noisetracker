"use client";

import { useState, useMemo, useEffect } from "react";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminTableSkeleton } from "@/components/admin/admin-skeleton";
import { AdminReportRow } from "@/components/admin/admin-report-row";
import { ConfirmDeleteModal } from "@/components/admin/confirm-delete-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/store";
import { Search } from "lucide-react";
import Link from "next/link";

export default function AdminReportsPage() {
  const { reports, currentUser, fetchReports, approveReport, rejectReport } = useApp();
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPERADMIN";

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      fetchReports().finally(() => setLoading(false));
    }
  }, [fetchReports, isAdmin]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "deleted">("pending");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    reportId: string;
    employeeName: string;
  } | null>(null);

  // Filter and search
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        (report.reportedEmployeeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.reportedEmployeeId || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || report.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchQuery, statusFilter]);

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

  const handleApprove = (reportId: string) => {
    approveReport(reportId);
  };

  const handleDeleteClick = (reportId: string, employeeName: string) => {
    setDeleteConfirm({ reportId, employeeName });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      rejectReport(deleteConfirm.reportId);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <main className="md:ml-64">
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">মডারেশন প্যানেল</h1>
            <p className="text-muted-foreground mt-2">
              শব্দ দূষণের রিপোর্ট পর্যালোচনা এবং পরিচালনা করুন
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="কর্মচারীর নাম, আইডি বা বিবরণ দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(val) =>
                setStatusFilter(val as "all" | "pending" | "approved" | "deleted")
              }
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                <SelectItem value="pending">পেন্ডিং</SelectItem>
                <SelectItem value="approved">অনুমোদিত</SelectItem>
                <SelectItem value="deleted">বাতিল</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List — shows skeleton while loading */}
          <div className="space-y-4">
            {loading ? (
              <AdminTableSkeleton rows={6} />
            ) : filteredReports.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">কোন রিপোর্ট পাওয়া যায়নি</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {filteredReports.length} টি রিপোর্ট
                </p>
                {filteredReports.map((report) => (
                  <AdminReportRow
                    key={report.id}
                    report={report}
                    onApprove={() => handleApprove(report.id)}
                    onDelete={() =>
                      handleDeleteClick(report.id, report.reportedEmployeeName)
                    }
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <ConfirmDeleteModal
          isOpen={!!deleteConfirm}
          reportId={deleteConfirm.reportId}
          employeeName={deleteConfirm.employeeName}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

"use client";

import { Report } from "@/lib/types";
import { ReportCard } from "./report-card";

interface ReportFeedProps {
  reports: Report[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ReportFeed({
  reports,
  isLoading,
  emptyMessage = "কোন রিপোর্ট পাওয়া যায়নি",
}: ReportFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}

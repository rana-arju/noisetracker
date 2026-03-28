"use client";

import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/shared/stats-card";
import { DashboardStats } from "@/lib/types";

interface AdminStatsGridProps {
  stats: DashboardStats;
}

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        label="Total Reports"
        value={stats.totalReports}
        description="All-time reports"
      />
      <StatsCard
        label="Pending"
        value={stats.pendingReports}
        description="Awaiting review"
      />
      <StatsCard
        label="Approved"
        value={stats.approvedReports}
        description="Confirmed issues"
      />
      <StatsCard
        label="Deleted"
        value={stats.deletedReports}
        description="Closed reports"
      />
    </div>
  );
}

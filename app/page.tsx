"use client";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StatsCard } from "@/components/shared/stats-card";
import { StatsSectionSkeleton } from "@/components/shared/stats-skeleton";
import { ReportFeed } from "@/components/reports/report-feed";
import { ReportFeedSkeleton } from "@/components/reports/report-skeleton";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { LeaderboardListSkeleton } from "@/components/leaderboard/leaderboard-skeleton";
import { SearchFilterBar } from "@/components/shared/search-filter-bar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { getDashboardStats, getTopLeaderboard, getPaginatedReports, filterAndSortReports } from "@/lib/helpers";
import { SearchFilters } from "@/lib/types";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

export default function HomePage() {
  const { reports, fetchReports, isLoading } = useApp();
  const [reportsLoading, setReportsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    severity: [],
    sortBy: "recent",
    page: 1,
  });

  // Fetch reports on mount
  useEffect(() => {
    setReportsLoading(true);
    fetchReports().finally(() => setReportsLoading(false));
  }, [fetchReports]);

  const stats = useMemo(() => getDashboardStats(reports), [reports]);
  const topLeaderboard = useMemo(() => getTopLeaderboard(reports, 5), [reports]);
  
  const filteredReports = useMemo(() => {
    const activeReports = reports.filter(r => r.status?.toLowerCase() !== "deleted");
    return filterAndSortReports(activeReports, filters);
  }, [reports, filters]);
  
  const paginatedReports = useMemo(() => 
    getPaginatedReports(filteredReports, page, 5),
    [filteredReports, page]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Stats Section — loads independently */}
        <section>
          <h2 className="text-2xl font-bold mb-6">ড্যাশবোর্ড ওভারভিউ</h2>
          {reportsLoading ? (
            <StatsSectionSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard label="মোট রিপোর্ট" value={stats.totalReports} description="সব সময়ের রিপোর্ট" />
              <StatsCard label="পেন্ডিং" value={stats.pendingReports} description="পর্যালোচনার জন্য অপেক্ষমান" />
              <StatsCard label="অনুমোদিত" value={stats.approvedReports} description="নিশ্চিতকৃত সমস্যা" />
              <StatsCard label="সমাধান হয়েছে" value={stats.deletedReports} description="বন্ধ করা কেস" />
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports Feed Section — loads independently */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">সাম্প্রতিক রিপোর্ট</h2>
              <Link href="/create-report">
                <Button>নতুন রিপোর্ট</Button>
              </Link>
            </div>
            <SearchFilterBar onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }} />

            {reportsLoading ? (
              <ReportFeedSkeleton count={5} />
            ) : (
              <ReportFeed reports={paginatedReports} />
            )}

            {/* Pagination */}
            {!reportsLoading && (
              <div className="flex justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  আগের
                </Button>
                <span className="flex items-center px-4">পৃষ্ঠা {page}</span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={paginatedReports.length < 5}
                >
                  পরের
                </Button>
              </div>
            )}
          </section>

          {/* Leaderboard Sidebar — loads independently */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">মনোযোগ আকর্ষণ</h2>
              <Link href="/leaderboard">
                <Button variant="ghost" size="sm">সব দেখুন</Button>
              </Link>
            </div>
            {reportsLoading ? (
              <LeaderboardListSkeleton count={5} />
            ) : (
              <LeaderboardList entries={topLeaderboard} />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

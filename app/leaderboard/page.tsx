"use client";

import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { LeaderboardListSkeleton } from "@/components/leaderboard/leaderboard-skeleton";
import { useApp } from "@/lib/store";
import {
  getLeaderboard,
  getCurrentMonthRange,
  getLastMonthRange,
  getLast3MonthsRange,
} from "@/lib/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function LeaderboardPage() {
  const { reports, fetchReports } = useApp();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("this-month");

  useEffect(() => {
    setLoading(true);
    fetchReports().finally(() => setLoading(false));
  }, [fetchReports]);

  const leaderboard = useMemo(() => {
    let range;
    if (timeRange === "this-month") range = getCurrentMonthRange();
    else if (timeRange === "last-month") range = getLastMonthRange();
    else if (timeRange === "last-3-months") range = getLast3MonthsRange();

    return getLeaderboard(
      reports.filter((r) => r.status !== "deleted"),
      range,
    );
  }, [reports, timeRange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="max-w-2xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                মনোযোগ আকর্ষণ: যারা একটু বেশি শব্দ করছেন
              </h1>
              <p className="text-muted-foreground mt-2">
                রিপোর্ট সংখ্যা এবং সহমতের ভিত্তিতে যাদের দিকে বিশেষ নজর দেওয়া
                প্রয়োজন
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="সময়কাল" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">এই মাস</SelectItem>
                  <SelectItem value="last-month">গত মাস</SelectItem>
                  <SelectItem value="last-3-months">গত ৩ মাস</SelectItem>
                  <SelectItem value="all">সব সময়</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Leaderboard Section — shows skeleton while loading */}
          {loading ? (
            <LeaderboardListSkeleton count={8} />
          ) : (
            <LeaderboardList entries={leaderboard} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

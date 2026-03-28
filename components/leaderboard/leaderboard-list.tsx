"use client";

import { Card } from "@/components/ui/card";
import { LeaderboardEntry } from "@/lib/types";
import { AlertTriangle, VolumeX, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-800 font-bold border border-red-200">
        <AlertTriangle className="h-4 w-4" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-bold border border-amber-200">
        <VolumeX className="h-4 w-4" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-800 font-bold border border-orange-100">
        <div className="text-xs">!</div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 font-bold text-muted-foreground bg-muted rounded-lg border border-border text-xs">
      #{rank}
    </div>
  );
}

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
}

export function LeaderboardCard({ entry }: LeaderboardCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="p-4 border border-border hover:border-amber-400 transition bg-card/50 cursor-pointer">
            <Link href={`/employee/${entry.employeeId}`}>
              <div className="flex items-center gap-4">
                <RankBadge rank={entry.rank} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{entry.employeeName}</p>
                    {entry.rank <= 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">
                        সতর্কতা লেভেল {entry.rank}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {entry.reportCount} টি শব্দ অভিযোগ পাওয়া গেছে
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700 dark:text-slate-300">{entry.upvotes}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">সহমত</p>
                </div>
              </div>
            </Link>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px] text-xs">
          এই তালিকাটি সহকর্মীদের কাজের পরিবেশ রক্ষার জন্য তৈরি। আওয়াজ কমিয়ে আনুন।
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export function LeaderboardList({ entries, isLoading }: LeaderboardListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center border-dashed">
        <div className="flex justify-center mb-3">
          <Info className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p className="text-muted-foreground">এখনো কেউ এই তালিকায় অন্তর্ভুক্ত হয়নি। সবাই শান্তিতে কাজ করছেন।</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <LeaderboardCard key={entry.employeeId} entry={entry} />
      ))}
    </div>
  );
}

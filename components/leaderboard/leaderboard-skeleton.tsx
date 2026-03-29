import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function LeaderboardCardSkeleton() {
  return (
    <Card className="p-4 border border-border bg-card/50">
      <div className="flex items-center gap-4">
        {/* Rank badge */}
        <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
        {/* Score */}
        <div className="text-right space-y-1">
          <Skeleton className="h-5 w-8 ml-auto" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </Card>
  );
}

export function LeaderboardListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <LeaderboardCardSkeleton key={i} />
      ))}
    </div>
  );
}

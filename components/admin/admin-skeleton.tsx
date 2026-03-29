import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function AdminStatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-6 border border-border bg-card">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-3 w-32 mt-1" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminQuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6 border border-border bg-card">
          <div className="flex flex-col gap-3 h-36">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-full mt-auto" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 border-b border-border last:border-0 flex gap-4 items-center">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function EmployeeProfileHeaderSkeleton() {
  return (
    <Card className="p-6 md:p-8 border-none shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Avatar */}
        <Skeleton className="h-24 w-24 rounded-2xl flex-shrink-0" />
        {/* Details */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        {/* Stats */}
        <div className="flex gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-8">
          <div className="text-center px-4 space-y-1">
            <Skeleton className="h-7 w-8 mx-auto" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="text-center px-4 border-l border-slate-100 dark:border-slate-800 space-y-1">
            <Skeleton className="h-7 w-8 mx-auto" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function EmployeeStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-5 border-none shadow-sm bg-white dark:bg-slate-900">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function EmployeeReportGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="p-5 border border-border">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-44" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

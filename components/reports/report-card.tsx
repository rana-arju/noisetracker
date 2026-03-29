"use client";

import { Card } from "@/components/ui/card";
import { Report } from "@/lib/types";
import { formatDate } from "@/lib/helpers";
import { VoteButtons } from "@/components/shared/vote-buttons";
import { StatusBadge, SeverityBadge } from "@/components/shared/badges";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const router = useRouter();
  
  return (
    <Card 
      className="p-5 border border-border hover:border-primary transition cursor-pointer group"
      onClick={() => router.push(`/reports/${report.id}`)}
    >
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p 
                className="font-semibold text-foreground hover:text-primary transition inline-block"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/employee/${report.reportedEmployeeId || report.id}`);
                }}
              >
                {report.reportedEmployeeName || "অজ্ঞাত কর্মচারী"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(new Date(report.createdAt))} রিপোর্ট করা হয়েছে
              </p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={report.status as any} />
              <SeverityBadge severity={report.severity as any} />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground line-clamp-2">
            {report.description || "কোনো বিবরণ প্রদান করা হয়নি"}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-4">
              <VoteButtons
                reportId={report.id}
                upvotes={report.totalUpvotes}
                downvotes={report.totalDownvotes}
              />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{report.totalComments}</span>
            </div>
          </div>
        </div>
      </Card>
  );
}

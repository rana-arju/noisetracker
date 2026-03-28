"use client";

import { Card } from "@/components/ui/card";
import { Report } from "@/lib/types";
import { formatDate } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { StatusBadge, SeverityBadge } from "@/components/shared/badges";
import { CheckCircle, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface AdminReportRowProps {
  report: Report;
  onApprove: () => void;
  onDelete: () => void;
}

export function AdminReportRow({
  report,
  onApprove,
  onDelete,
}: AdminReportRowProps) {
  return (
    <Card className="p-4 border border-border hover:border-primary/50 transition">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Report Info */}
        <div className="flex-1">
          <p className="font-semibold">{report.employeeName}</p>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {report.description}
          </p>
          <div className="flex gap-2 mt-3">
            <StatusBadge status={report.status} />
            <SeverityBadge severity={report.severity} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDate(report.createdAt)}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-center sm:text-right">
          <div>
            <p className="text-lg font-bold text-primary">{report.upvotes}</p>
            <p className="text-xs text-muted-foreground">আপভোট</p>
          </div>
          <div>
            <p className="text-lg font-bold">{report.commentCount}</p>
            <p className="text-xs text-muted-foreground">কমেন্ট</p>
          </div>
        </div>

          <div className="flex gap-2">
            <Link href={`/reports/${report.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 border-primary/20 hover:bg-primary/5"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">বিস্তারিত</span>
              </Button>
            </Link>
            {report.status === "pending" && (
              <>
                <Button
                  onClick={onApprove}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">অনুমোদন</span>
                </Button>
                <Button
                  onClick={onDelete}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">মুছে ফেলুন</span>
                </Button>
              </>
            )}
          </div>
      </div>
    </Card>
  );
}

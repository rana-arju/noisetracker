"use client";

import { Badge } from "@/components/ui/badge";
import { getSeverityColor, getStatusColor } from "@/lib/helpers";

interface StatusBadgeProps {
  status: "pending" | "approved" | "deleted";
}

interface SeverityBadgeProps {
  severity: "low" | "medium" | "high";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const labels = {
    pending: "পেন্ডিং",
    approved: "অনুমোদিত",
    deleted: "সমাধান করা",
  };
  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {labels[status]}
    </Badge>
  );
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const labels = {
    low: "স্বল্প",
    medium: "মাঝারি",
    high: "উচ্চ",
  };
  return (
    <Badge variant="outline" className={getSeverityColor(severity)}>
      {labels[severity]}
    </Badge>
  );
}

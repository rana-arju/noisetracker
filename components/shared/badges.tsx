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
  if (!status || status === ("undefined" as any)) return null;
  
  const labels: Record<string, string> = {
    pending: "পেন্ডিং",
    approved: "অনুমোদিত",
    deleted: "সমাধান করা",
    rejected: "প্রত্যাখ্যাত",
  };

  const label = labels[status.toLowerCase()];
  if (!label) return null;

  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {label}
    </Badge>
  );
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  if (!severity || severity === ("undefined" as any)) return null;

  const labels: Record<string, string> = {
    low: "স্বল্প",
    medium: "মাঝারি",
    high: "উচ্চ",
  };

  const label = labels[severity.toLowerCase()];
  if (!label) return null;

  return (
    <Badge variant="outline" className={getSeverityColor(severity)}>
      {label}
    </Badge>
  );
}

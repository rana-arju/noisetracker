"use client";

import { Card } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: number | string;
  description?: string;
}

export function StatsCard({ label, value, description }: StatsCardProps) {
  return (
    <Card className="p-6 border border-border bg-card">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </Card>
  );
}

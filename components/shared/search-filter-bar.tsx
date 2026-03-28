"use client";

import { useState, useCallback } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFilters } from "@/lib/types";

interface SearchFilterBarProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export function SearchFilterBar({ onFilterChange }: SearchFilterBarProps) {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"recent" | "top-voted" | "most-discussed">("recent");

  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);
      onFilterChange({
        query: value,
        severity: severity as any,
        sortBy,
        page: 1,
      });
    },
    [severity, sortBy, onFilterChange]
  );

  const handleSortChange = (value: string) => {
    setSortBy(value as "recent" | "top-voted" | "most-discussed");
    onFilterChange({
      query,
      severity: severity as any,
      sortBy: value as "recent" | "top-voted" | "most-discussed",
      page: 1,
    });
  };

  return (
    <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 p-4 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-sm sticky top-2 z-10">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="কর্মচারীর নাম বা আইডি দিয়ে খুঁজুন..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="recent">সাম্প্রতিক</SelectItem>
          <SelectItem value="top-voted">বেশি সহমত</SelectItem>
          <SelectItem value="most-discussed">সবচেয়ে বেশি আলোচিত</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

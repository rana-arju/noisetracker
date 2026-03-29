"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { publicUsersAPI } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserOption {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  designation?: string | null;
}

interface EmployeeSelectProps {
  value: string;
  onValueChange: (id: string, name: string) => void;
  error?: boolean;
}

export function EmployeeSelect({ value, onValueChange, error }: EmployeeSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [users, setUsers] = React.useState<UserOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<UserOption | null>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load all users when the popover opens
  React.useEffect(() => {
    if (open) {
      fetchUsers(query);
    }
  }, [open]);

  // Debounced search on query change
  React.useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  const fetchUsers = async (search: string) => {
    setLoading(true);
    try {
      const res = await publicUsersAPI.search(search);
      setUsers(res.data.data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (user: UserOption) => {
    setSelected(user);
    onValueChange(user.id, user.name);
    setOpen(false);
  };

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN" || role === "SUPERADMIN") {
      return (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
          <ShieldCheck className="h-2.5 w-2.5" />
          {role === "SUPERADMIN" ? "Super Admin" : "Admin"}
        </Badge>
      );
    }
    return null;
  };

  const triggerLabel = selected
    ? `${selected.name} (${selected.employeeId})`
    : "একজন কর্মচারী নির্বাচন করুন...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white dark:bg-slate-900 font-normal",
            !value && "text-muted-foreground",
            error && "border-destructive"
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 shadow-lg"
        align="start"
      >
        {/* Search input */}
        <div className="flex items-center border-b border-border px-3 py-2 gap-2">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-8 bg-transparent text-sm"
            autoFocus
          />
          {loading && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />}
        </div>

        {/* Results list */}
        <ScrollArea className="max-h-72">
          {users.length === 0 && !loading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
              কোনো কর্মচারী খুঁজে পাওয়া যায়নি
            </div>
          ) : (
            <div className="py-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors cursor-pointer",
                    value === user.id && "bg-accent"
                  )}
                >
                  {/* Avatar initial */}
                  <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
                    {(user.name || "?").charAt(0).toUpperCase()}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-sm truncate">{user.name}</span>
                      {getRoleBadge(user.role)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="font-mono">{user.employeeId}</span>
                      {user.designation && (
                        <>
                          <span>·</span>
                          <span className="truncate">{user.designation}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {value === user.id && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

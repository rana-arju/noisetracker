"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mockEmployees } from "@/lib/mock-data";

interface EmployeeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  error?: boolean;
}

export function EmployeeSelect({ value, onValueChange, error }: EmployeeSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedEmployee = mockEmployees.find((emp) => emp.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white dark:bg-slate-900",
            !value && "text-muted-foreground",
            error && "border-destructive"
          )}
        >
          {value
            ? `${selectedEmployee?.name} (${selectedEmployee?.employeeId})`
            : "একজন কর্মচারী নির্বাচন করুন..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command className="bg-white dark:bg-slate-900">
          <CommandInput placeholder="নাম বা আইডি দিয়ে খুঁজুন..." className="h-9" />
          <CommandList>
            <CommandEmpty>কোনো কর্মচারী খুঁজে পাওয়া যায়নি।</CommandEmpty>
            <CommandGroup>
              {mockEmployees.map((emp) => (
                <CommandItem
                  key={emp.id}
                  value={`${emp.name} ${emp.employeeId} ${emp.id}`}
                  onSelect={() => {
                    onValueChange(emp.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === emp.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{emp.name}</span>
                    <span className="text-xs text-muted-foreground">{emp.employeeId}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

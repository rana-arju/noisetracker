"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeSelect } from "@/components/reports/employee-select";
import { useApp } from "@/lib/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateReportPage() {
  const router = useRouter();
  const { currentUser, createReport } = useApp();
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!employeeId || !description.trim()) {
      setError("অনুগ্রহ করে সব আবশ্যক ক্ষেত্র পূরণ করুন");
      return;
    }

    if (description.length < 10) {
      setError("বিবরণ অন্তত ১০ অক্ষরের হতে হবে");
      return;
    }

    setIsSubmitting(true);

    try {
      await createReport({
        reportedEmployeeName: employeeName || "Unknown",
        reportedEmployeeId: employeeId,
        description: description.trim(),
        severity: severity.toUpperCase(),
      });
      router.push("/");
    } catch (err) {
      setError("রিপোর্ট সাবমিট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          রিপোর্টে ফিরে যান
        </Link>

        {/* Form */}
        <Card className="p-8 border border-border">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">শব্দ দূষণের রিপোর্ট করুন</h1>
            <p className="text-muted-foreground mt-2">
              শব্দ সংক্রান্ত সমস্যা রিপোর্ট করে আমাদের কর্মপরিবেশ উন্নত করতে সাহায্য করুন।
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Selection */}
            <div className="space-y-2">
              <Label htmlFor="employee">কর্মচারী (আবশ্যক)</Label>
              <EmployeeSelect 
                value={employeeId} 
                onValueChange={(id, name) => {
                  setEmployeeId(id);
                  setEmployeeName(name);
                }}
                error={!!error && !employeeId}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">বিবরণ (আবশ্যক)</Label>
              <Textarea
                id="description"
                placeholder="শব্দ দূষণের সমস্যাটি বিস্তারিত বর্ণনা করুন..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}টি অক্ষর (অন্তত ১০টি আবশ্যক)
              </p>
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <Label htmlFor="severity">তীব্রতার মাত্রা</Label>
              <Select value={severity} onValueChange={(val) => setSeverity(val as "low" | "medium" | "high")}>
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">স্বল্প - সামান্য বিরক্তি</SelectItem>
                  <SelectItem value="medium">মাঝারি - উল্লেখযোগ্য প্রভাব</SelectItem>
                  <SelectItem value="high">উচ্চ - গুরুতর ব্যাঘাত</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4 border-t border-border">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !employeeId || !description.trim()}
              >
                {isSubmitting ? "সাবমিট করা হচ্ছে..." : "রিপোর্ট সাবমিট করুন"}
              </Button>
              <Link href="/">
                <Button type="button" variant="outline" className="flex-1">
                  বাতিল
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}

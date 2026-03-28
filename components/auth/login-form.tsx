"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const { login } = useApp();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!employeeId || !password) {
      setError("সবগুলো ঘর পূরণ করুন");
      setIsLoading(false);
      return;
    }

    const success = login(employeeId, password);
    if (success) {
      router.push("/");
    } else {
      setError("ভুল এমপ্লয়ী আইডি বা পাসওয়ার্ড");
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md p-8 border border-border">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">লগইন</h1>
          <p className="text-sm text-muted-foreground mt-2">
            আপনার নয়েজ ট্র্যাকার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">এমপ্লয়ী আইডি</Label>
            <Input
              id="employeeId"
              type="text"
              placeholder="BD-001"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "লগইন হচ্ছে..." : "লগইন"}
          </Button>
        </form>

        <div className="border-t border-border pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            অ্যাকাউন্ট না থাকলে অ্যাডমিনের সাথে যোগাযোগ করুন
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-2">ডেমো ক্রেডেনশিয়াল:</p>
          <p className="text-xs font-mono">ID: BD-001 / Pass: 123456</p>
        </div>
      </div>
    </Card>
  );
}

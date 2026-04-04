"use client";

import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPERADMIN"))) {
      router.push("/");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPERADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-destructive/5 p-4 text-center">
      <div className="space-y-6 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 flex items-center justify-center bg-destructive/10 rounded-2xl text-destructive rotate-3 hover:rotate-0 transition-transform">
          <AlertTriangle className="w-10 h-10" />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">কিছু একটা ভুল হয়েছে!</h1>
          <p className="text-muted-foreground text-balance">
            দুঃখিত, অ্যাপ্লিকেশনটি একটি সমস্যার সম্মুখীন হয়েছে। আমরা এটি সমাধান করার চেষ্টা করছি।
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground/50 mt-4 uppercase tracking-widest">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
          <Button
            onClick={() => reset()}
            variant="default"
            size="lg"
            className="gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            আবার চেষ্টা করুন
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              হোম পেজে ফিরে যান
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 text-xs text-muted-foreground/30 font-medium italic">
        "Silence is a source of great strength."
      </div>
    </div>
  );
}

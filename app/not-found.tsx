"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VolumeX, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 text-center">
      <div className="space-y-6 max-w-md animate-in fade-in zoom-in duration-500">
        {/* Animated Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center bg-primary/10 rounded-full text-primary">
          <VolumeX className="w-12 h-12" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-7xl font-black tracking-tighter text-primary">404</h1>
          <h2 className="text-2xl font-bold tracking-tight">রাস্তা হারিয়েছেন?</h2>
          <p className="text-muted-foreground text-balance">
            দুঃখিত, আপনি যে পাতাটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি। সম্ভবত এটি সরিয়ে ফেলা হয়েছে অথবা লিংকটি ভুল।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              হোম পেজে ফিরে যান
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
             <button>
                <ArrowLeft className="w-4 h-4" />
                আগের পাতায় ফিরুন
             </button>
          </Button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
}

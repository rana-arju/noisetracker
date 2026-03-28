"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                NT
              </div>
              <span className="font-bold">নয়েজ ট্র্যাকার</span>
            </div>
            <p className="text-sm text-muted-foreground">
              কর্মক্ষেত্রের শব্দ দূষণ রিপোর্টিং এবং মডারেশন প্ল্যাটফর্ম।
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">দ্রুত লিঙ্কগুলি</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-muted-foreground hover:text-primary transition">
                  লিডারবোর্ড
                </Link>
              </li>
              <li>
                <Link href="/create-report" className="text-muted-foreground hover:text-primary transition">
                  রিপোর্ট
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h3 className="font-semibold mb-3">অ্যাডমিন</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin/login" className="text-muted-foreground hover:text-primary transition">
                  অ্যাডমিন পোর্টাল
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} এসএম টেকনোলজি। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}

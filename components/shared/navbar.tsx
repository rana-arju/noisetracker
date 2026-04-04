"use client";

import Link from "next/link";
import { Menu, Home, AlertTriangle, FileText, LogIn, LogOut, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useApp } from "@/lib/store";
import { useState } from "react";

export function Navbar() {
  const { currentUser, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            NT
          </div>
          <span className="font-bold text-lg hidden sm:inline">নয়েজ ট্র্যাকার</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-primary transition">
            হোম
          </Link>
          <Link href="/leaderboard" className="text-sm hover:text-primary transition">
            সতর্কতা জোন
          </Link>
          <Link href="/create-report" className="text-sm hover:text-primary transition">
            রিপোর্ট
          </Link>
          {currentUser && (
            <Link href="/employee/settings" className="text-sm hover:text-primary transition">
              সেটিংস
            </Link>
          )}
          {(currentUser?.role === "ADMIN" || currentUser?.role === "SUPERADMIN") && (
            <Link href="/admin/dashboard" className="text-sm hover:text-primary transition font-semibold text-primary">
              অ্যাডমিন
            </Link>
          )}
        </div>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              <span className="text-sm">{currentUser.name}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                লগ আউট
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  লগইন
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 border-l-0 w-full sm:w-[350px]">
              <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 px-6 py-8">
                <SheetHeader className="mb-8 p-0">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      NT
                    </div>
                    <span className="font-bold text-lg">নয়েজ ট্র্যাকার</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2">
                  <MobileNavLink 
                    href="/" 
                    icon={<Home className="h-5 w-5" />} 
                    label="হোম" 
                    onClick={() => setIsOpen(false)} 
                  />
                  <MobileNavLink 
                    href="/leaderboard" 
                    icon={<AlertTriangle className="h-5 w-5" />} 
                    label="সতর্কতা জোন" 
                    onClick={() => setIsOpen(false)} 
                  />
                  <MobileNavLink 
                    href="/create-report" 
                    icon={<FileText className="h-5 w-5" />} 
                    label="রিপোর্ট" 
                    onClick={() => setIsOpen(false)} 
                  />
                  {currentUser && (
                    <MobileNavLink 
                      href="/employee/settings" 
                      icon={<User className="h-5 w-5" />} 
                      label="সেটিংস" 
                      onClick={() => setIsOpen(false)} 
                    />
                  )}
                  {(currentUser?.role === "ADMIN" || currentUser?.role === "SUPERADMIN") && (
                    <MobileNavLink 
                      href="/admin/dashboard" 
                      icon={<FileText className="h-5 w-5" />} 
                      label="অ্যাডমিন ড্যাশবোর্ড" 
                      onClick={() => setIsOpen(false)} 
                    />
                  )}
                </div>

                <div className="mt-auto space-y-4">
                  <hr className="border-slate-200 dark:border-slate-800" />
                  {currentUser ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-semibold">
                          {(currentUser.name || 'U').charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{currentUser.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                        </div>
                      </div>
                      <Button onClick={handleLogout} variant="destructive" className="w-full flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        লগ আউট
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)} className="w-full">
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <LogIn className="h-4 w-4" />
                          লগইন
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
function MobileNavLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors group"
      onClick={onClick}
    >
      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    </Link>
  );
}

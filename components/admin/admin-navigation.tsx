"use client";

import { LayoutDashboard, FileText, LogOut, Menu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useApp } from "@/lib/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    {
      label: "ড্যাশবোর্ড",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "কর্মচারী",
      href: "/admin/employees",
      icon: Users,
    },
    {
      label: "রিপোর্ট",
      href: "/admin/dashboard/reports",
      icon: FileText,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card h-screen fixed left-0 top-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              A
            </div>
            <span className="font-bold text-lg">অ্যাডমিন</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            লগ আউট
          </Button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b border-border bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            A
          </div>
          <span className="font-bold">অ্যাডমিন</span>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <hr className="my-2" />
              <Button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                variant="outline"
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                লগ আউট
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

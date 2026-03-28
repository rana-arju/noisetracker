"use client";

import { useState } from "react";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, X, Loader2, UserPlus } from "lucide-react";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function NewEmployeePage() {
  const router = useRouter();
  const { employees, addEmployees } = useApp();
  
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    designation: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "নাম আবশ্যক";
    if (!formData.employeeId.trim()) newErrors.employeeId = "এমপ্লয়ী আইডি আবশ্যক";
    
    // Check for duplicate employeeId
    const duplicate = employees.find(e => e.employeeId === formData.employeeId);
    if (duplicate) newErrors.employeeId = "এই আইডি ইতিমধ্যেই বিদ্যমান";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      addEmployees([formData]);
      setIsSaving(false);
      toast.success("নতুন কর্মচারী সফলভাবে যুক্ত করা হয়েছে");
      router.push("/admin/employees");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminNavigation />
      
      <main className="md:ml-64 p-4 md:p-8 max-w-3xl mx-auto">
        <Link href="/admin/employees" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          তালিকায় ফিরে যান
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 italic tracking-tight">Add New Employee</h1>
          </div>
          <p className="text-muted-foreground">সিস্টেমে নতুন কর্মচারী যুক্ত করতে নিচের তথ্যগুলো পূরণ করুন</p>
        </div>

        <Card className="p-6 md:p-8 border-none shadow-sm bg-white dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">নাম (আবশ্যক)</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="উদা: আনিসুর রহমান"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Employee ID */}
              <div className="space-y-2">
                <Label htmlFor="employeeId">এমপ্লয়ী আইডি (আবশ্যক)</Label>
                <Input 
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  className={errors.employeeId ? "border-red-500" : ""}
                  placeholder="উদা: BD-101"
                />
                {errors.employeeId && <p className="text-xs text-red-500">{errors.employeeId}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল (ঐচ্ছিক)</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="anis@smtechnology.com"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নম্বর (ঐচ্ছিক)</Label>
                <Input 
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="017XXXXXXXX"
                />
              </div>

              {/* Designation */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="designation">পদবী</Label>
                <Input 
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  placeholder="উদা: এক্সিকিউটিভ, অপারেশনস, ইত্যাদি"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Button type="submit" className="flex-1 md:flex-none md:min-w-[150px]" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    যুক্ত হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    সংরক্ষণ করুন
                  </>
                )}
              </Button>
              <Link href="/admin/employees" className="flex-1 md:flex-none">
                <Button variant="outline" type="button" className="w-full">
                  <X className="mr-2 h-4 w-4" />
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

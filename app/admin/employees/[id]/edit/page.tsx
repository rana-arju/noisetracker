"use client";

import { useState, useEffect } from "react";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, X, Loader2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { employees, updateEmployee } = useApp();
  
  const employee = employees.find(e => e.id === id);
  
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    designation: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        employeeId: employee.employeeId || "",
        email: employee.email || "",
        phone: employee.phone || "",
        designation: employee.designation || ""
      });
    }
  }, [employee]);

  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AdminNavigation />
        <main className="md:ml-64 p-8 text-center">
          <h2 className="text-xl font-bold">কর্মচারী খুঁজে পাওয়া যায়নি</h2>
          <Link href="/admin/employees">
            <Button className="mt-4">তালিকায় ফিরে যান</Button>
          </Link>
        </main>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "নাম আবশ্যক";
    if (!formData.employeeId.trim()) newErrors.employeeId = "এমপ্লয়ী আইডি আবশ্যক";
    
    // Check for duplicate employeeId (excluding current employee)
    const duplicate = employees.find(e => e.employeeId === formData.employeeId && e.id !== id);
    if (duplicate) newErrors.employeeId = "এই আইডি ইতিমধ্যেই অন্য কর্মচারীর জন্য ব্যবহৃত হচ্ছে";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      updateEmployee(id, formData);
      setIsSaving(false);
      toast.success("কর্মচারীর তথ্য সফলভাবে আপডেট করা হয়েছে");
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 italic tracking-tight underline decoration-primary/30 underline-offset-8">Edit Employee</h1>
          <p className="text-muted-foreground mt-2">কর্মচারীর ব্যক্তিগত এবং প্রাতিষ্ঠানিক তথ্য সংশোধন করুন</p>
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
                  placeholder="উদা: রহিম আহমেদ"
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
                  placeholder="উদা: BD-001"
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
                  placeholder="example@company.com"
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
                  placeholder="উদা: সফটওয়্যার ইঞ্জিনিয়ার, একাউন্ট্যান্ট, ইত্যাদি"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Button type="submit" className="flex-1 md:flex-none md:min-w-[150px]" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    সেভ হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    তথ্য সংরক্ষণ
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

        {/* Form Meta Info */}
        <div className="mt-8 p-4 rounded-xl border border-amber-100 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 flex gap-4">
          <div className="text-amber-600 font-bold text-xl leading-none">!</div>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <strong>লক্ষ্য করুন:</strong> কর্মচারীর নাম বা আইডি পরিবর্তন করলে তা সিস্টেমে বিদ্যমান সকল পুরনো রিপোর্ট এবং ড্যাশবোর্ড ডেটাতে প্রতিফলিত হবে। এই পরিবর্তন অত্যন্ত সংবেদনশীল।
          </p>
        </div>
      </main>
    </div>
  );
}

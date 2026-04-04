"use client";

import { useApp } from "@/lib/store";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { User, Lock, Phone, Save, Loader2, Mail, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const { currentUser, isLoading, updateMe } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || "",
        employeeId: currentUser.employeeId || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      }));
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      await updateMe(updateData);
      
      toast.success("Profile updated successfully");
      
      // Clear password fields
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">সেটিংস</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                ব্যক্তিগত তথ্য
              </CardTitle>
              <CardDescription>
                আপনার ব্যক্তিগত তথ্য এখান থেকে পরিবর্তন করতে পারেন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">নাম</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="আপনার নাম"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="employeeId">Emp Id (পরিবর্তনযোগ্য নয়)</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="employeeId"
                      name="employeeId"
                      value={formData.employeeId}
                      readOnly
                      disabled
                      className="pl-10 bg-slate-100 dark:bg-slate-900 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="আপনার ইমেইল"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">ফোন নম্বর</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="আপনার ফোন নম্বর"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    পাসওয়ার্ড পরিবর্তন (ঐচ্ছিক)
                  </h3>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="নতুন পাসওয়ার্ড (মাথা থাকলে লিখুন)"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="পাসওয়ার্ডটি পুনরায় লিখুন"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      সেভ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      সেভ করুন
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

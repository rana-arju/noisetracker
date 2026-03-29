"use client";

import { useState, useCallback } from "react";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  ChevronLeft,
  FileSpreadsheet
} from "lucide-react";
import { useApp } from "@/lib/store";
import { EmployeeUploadPreview, Employee } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function EmployeeUploadPage() {
  const router = useRouter();
  const { uploadEmployees } = useApp();
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<"upload" | "success">("upload");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".csv"))) {
      setFile(droppedFile);
    } else {
      toast.error("অনুগ্রহ করে .xlsx বা .csv ফাইল আপলোড করুন");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      await uploadEmployees(file);
      setIsUploading(false);
      setStep("success");
      toast.success("কর্মচারীদের তথ্য সফলভাবে আমদানি করা হয়েছে");
    } catch (err: any) {
      setIsUploading(false);
      const errorMsg = err.response?.data?.message || "আপলোড করতে সমস্যা হয়েছে";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminNavigation />
      
      <main className="md:ml-64 p-4 md:p-8 max-w-5xl mx-auto">
        <Link href="/admin/employees" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          তালিকায় ফিরে যান
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 italic tracking-tight">Excel Bulk Onboarding</h1>
          <p className="text-muted-foreground">একসাথে অনেক কর্মচারীর তথ্য ইনপুট করুন</p>
        </div>

        {step === "upload" && (
          <Card className="p-12 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-6 bg-white dark:bg-slate-900">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            
            <div className="space-y-2 max-w-sm">
              <h3 className="text-xl font-bold">ফাইল আপলোড করুন</h3>
              <p className="text-sm text-muted-foreground">
                আপনার .xlsx অথবা .csv ফাইলটি এখানে ড্র্যাগ করে ছেড়ে দিন অথবা ব্রাউজ করুন।
              </p>
            </div>

            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "w-full max-w-md p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer",
                file ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-800 hover:border-primary/50"
              )}
            >
              {file ? (
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer w-full h-full block">
                  <input type="file" className="hidden" accept=".xlsx,.csv" onChange={handleFileChange} />
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">ক্লিক করে ফাইল ইনপুট দিন</span>
                  </div>
                </label>
              )}
            </div>

            <Button 
              className="px-8 py-6 text-lg font-bold rounded-xl"
              disabled={!file || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ফাইল প্রসেস হচ্ছে...
                </>
              ) : (
                <>
                  এগিয়ে যান
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </Card>
        )}

        {step === "success" && (
          <Card className="p-12 flex flex-col items-center justify-center text-center space-y-6 bg-white dark:bg-slate-900">
            <div className="h-20 w-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="h-10 w-10 animate-in zoom-in duration-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">অভিনন্দন!</h3>
              <p className="text-muted-foreground">
                নতুন কর্মচারীদের তথ্য সফলভাবে সিস্টেমে যুক্ত করা হয়েছে। তারা এখন থেকে তাদের সিস্টেম আইডি ব্যবহার করে লগইন করতে পারবেন।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-4">
              <Link href="/admin/employees">
                <Button variant="outline" className="w-full">তালিকায় যান</Button>
              </Link>
              <Button onClick={() => { setFile(null); setStep("upload"); }} className="w-full">আরও আপলোড</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

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
import { BulkUploadPreviewResponse } from "@/lib/types";
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
  const { previewUploadEmployees, confirmUploadEmployees } = useApp();
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "success">("upload");
  const [previewData, setPreviewData] = useState<BulkUploadPreviewResponse | null>(null);

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
      const data = await previewUploadEmployees(file);
      setPreviewData(data);
      setIsUploading(false);
      setStep("preview");
      toast.success("প্রিভিউ সফলভাবে সম্পন্ন হয়েছে");
    } catch (err: any) {
      setIsUploading(false);
      const errorMsg = err.response?.data?.message || "আপলোড করতে সমস্যা হয়েছে";
      toast.error(errorMsg);
    }
  };

  const handleConfirm = async () => {
    if (!previewData?.previewData) return;
    
    const validUsers = previewData.previewData.filter(u => u.status === "NEW");
    if (validUsers.length === 0) {
      toast.error("সিস্টেমে যুক্ত করার মতো কোনো নতুন কর্মচারী নেই");
      return;
    }

    setIsConfirming(true);
    try {
      await confirmUploadEmployees(validUsers);
      setIsConfirming(false);
      setStep("success");
      toast.success("কর্মচারীদের তথ্য সফলভাবে সিস্টেমে সংরক্ষণ করা হয়েছে");
    } catch (err: any) {
      setIsConfirming(false);
      const errorMsg = err.response?.data?.message || "সংরক্ষণ করতে সমস্যা হয়েছে";
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

        {step === "preview" && previewData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card className="p-3 md:p-4 text-center">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">মোট কর্মচারী</p>
                <p className="text-xl md:text-2xl font-bold">{previewData.summary.total}</p>
              </Card>
              <Card className="p-3 md:p-4 text-center border-l-4 border-l-green-500">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">নতুন</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{previewData.summary.new}</p>
              </Card>
              <Card className="p-3 md:p-4 text-center border-l-4 border-l-orange-500">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">পূর্বের বিদ্যমান</p>
                <p className="text-xl md:text-2xl font-bold text-orange-600">{previewData.summary.existing}</p>
              </Card>
              <Card className="p-3 md:p-4 text-center border-l-4 border-l-red-500">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">ত্রুটিপূর্ণ</p>
                <p className="text-xl md:text-2xl font-bold text-red-600">{previewData.summary.invalid}</p>
              </Card>
            </div>

            <Card className="bg-white dark:bg-slate-900 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Employee ID</TableHead>
                      <TableHead className="whitespace-nowrap">Name</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">Designation</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.previewData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs md:text-sm">{row.employeeId}</TableCell>
                        <TableCell className="text-xs md:text-sm">{row.name}</TableCell>
                        <TableCell className="text-xs md:text-sm hidden md:table-cell">{row.designation || "N/A"}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              row.status === "NEW" ? "default" : 
                              row.status === "EXISTING" ? "secondary" : "destructive"
                            }
                            className={cn(
                              "text-[10px] md:text-xs",
                              row.status === "NEW" && "bg-green-100 text-green-700 hover:bg-green-100",
                              row.status === "EXISTING" && "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            )}
                          >
                            {row.status === "NEW" ? "নতুন" : 
                             row.status === "EXISTING" ? "বিদ্যমান" : "ত্রুটি"}
                          </Badge>
                          {row.message && (
                            <span className="ml-2 text-[10px] text-muted-foreground hidden sm:inline">{row.message}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setStep("upload")}
                disabled={isConfirming}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                ফাইল পরিবর্তন করুন
              </Button>
              <Button 
                className="px-8 font-bold w-full sm:w-auto order-1 sm:order-2"
                onClick={handleConfirm}
                disabled={previewData.summary.new === 0 || isConfirming}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : (
                  <>
                    সিস্টেমে যুক্ত করুন
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
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

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-4">
              <Link href="/admin/employees" className="w-full">
                <Button variant="outline" className="w-full py-6">তালিকায় যান</Button>
              </Link>
              <Button 
                onClick={() => { setFile(null); setStep("upload"); }} 
                className="w-full py-6"
              >
                আরও আপলোড
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

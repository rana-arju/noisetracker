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
  const { employees, addEmployees } = useApp();
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "success">("upload");
  const [previewData, setPreviewData] = useState<EmployeeUploadPreview[]>([]);

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

  const simulateParsing = useCallback(() => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate parsing delay
    setTimeout(() => {
      const mockData: EmployeeUploadPreview[] = [
        {
          name: "Sabbir Hussain",
          employeeId: "BD-101",
          email: "sabbir.h@smtechnology.com",
          phone: "01722334455",
          designation: "ইঞ্জিনিয়ারিং",
          status: "valid"
        },
        {
          name: "Mousumi Akter",
          employeeId: "BD-102",
          email: "mousumi.a@smtechnology.com",
          phone: "01822334455",
          designation: "মার্কেটিং",
          status: "valid"
        },
        {
          name: "Rahim Ahmed", // Duplicate name
          employeeId: "BD-001", // Duplicate ID
          email: "rahim.ahmed@smtechnology.com",
          status: "duplicate",
          errors: ["এমপ্লয়ী আইডি ইতিমধ্যেই বিদ্যমান"]
        },
        {
          name: "", // Missing name
          employeeId: "BD-103",
          status: "missing_data",
          errors: ["নাম ফিল্ডটি আবশ্যক"]
        },
        {
          name: "Unknown Employee",
          employeeId: "INVALID", // Invalid ID format
          status: "invalid_id",
          errors: ["আইডি ফরম্যাট সঠিক নয়"]
        }
      ];
      
      setPreviewData(mockData);
      setIsUploading(false);
      setStep("preview");
    }, 1500);
  }, [file]);

  const handleConfirmImport = () => {
    const validEmployees = previewData
      .filter(item => item.status === "valid")
      .map(item => ({
        name: item.name!,
        employeeId: item.employeeId!,
        email: item.email,
        phone: item.phone,
        designation: item.designation,
      }));
    
    if (validEmployees.length === 0) {
      toast.error("আমদানি করার মতো কোনো বৈধ কর্মচারী পাওয়া যায়নি");
      return;
    }

    setIsUploading(true);
    
    // Simulate import delay
    setTimeout(() => {
      addEmployees(validEmployees);
      setIsUploading(false);
      setStep("success");
      toast.success(`${validEmployees.length} জন কর্মচারীকে সফলভাবে আমদানি করা হয়েছে`);
    }, 2000);
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
              onClick={simulateParsing}
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

        {step === "preview" && (
          <div className="space-y-6">
            <Card className="p-1 border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">প্রিভিউ এবং যাচাই</h2>
                  <p className="text-sm text-muted-foreground">তথ্য আমদানি করার আগে একবার যাচাই করে নিন</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("upload")}>আবার আপলোড করুন</Button>
                  <Button onClick={handleConfirmImport} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        আমদানি হচ্ছে...
                      </>
                    ) : (
                      <>ইনপুট নিশ্চিত করুন</>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>নাম</TableHead>
                      <TableHead>এমপ্লয়ী আইডি</TableHead>
                      <TableHead>ইমেইল/ফোন</TableHead>
                      <TableHead>অবস্থা</TableHead>
                      <TableHead>ত্রুটি</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, idx) => (
                      <TableRow key={idx} className={cn(row.status !== "valid" && "bg-slate-50/50 dark:bg-slate-900/50")}>
                        <TableCell>
                          {row.name || (
                            <span className="text-red-500 italic text-xs">অপুর্ণাঙ্গ তথ্য</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{row.employeeId || "—"}</span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {row.designation || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.email && <div>{row.email}</div>}
                          {row.phone && <div>{row.phone}</div>}
                          {!row.email && !row.phone && "—"}
                        </TableCell>
                        <TableCell>
                          {row.status === "valid" ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">বৈধ</Badge>
                          ) : row.status === "duplicate" ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">ডুপ্লিকেট</Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-none">ত্রুটি</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          {row.errors?.map((err, i) => (
                            <div key={i} className="text-[10px] text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {err}
                            </div>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex gap-4">
              <AlertCircle className="h-6 w-6 text-blue-500 shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-bold mb-1">সতর্কতা নোট:</p>
                <p>শুধুমাত্র "বৈধ" স্ট্যাটাস প্রাপ্ত আলোগুলো আমদানির সময় প্রসেস করা হবে। ডুপ্লিকেট বা ত্রুটিযুক্ত তথ্যগুলো বাদ দেওয়া হবে।</p>
              </div>
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

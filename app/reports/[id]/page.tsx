"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoteButtons } from "@/components/shared/vote-buttons";
import { StatusBadge, SeverityBadge } from "@/components/shared/badges";
import { useApp } from "@/lib/store";
import { formatDateFull } from "@/lib/helpers";
import { ReportDetailSkeleton, CommentsSkeleton } from "@/components/reports/report-skeleton";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  const { reports, addComment, comments, fetchComments, isLoading } = useApp();
  const report = reports.find((r) => r.id === reportId);
  const reportComments = comments[reportId] || [];
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);

  // Fetch comments on mount
  useEffect(() => {
    setCommentsLoading(true);
    fetchComments(reportId).finally(() => setCommentsLoading(false));
  }, [fetchComments, reportId]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment(reportId, commentText);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          রিপোর্টে ফিরে যান
        </Link>

        {/* Report Details Section — shows skeleton while loading */}
        {isLoading || !report ? (
          <ReportDetailSkeleton />
        ) : (
          <Card className="p-8 border border-border mb-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{report.reportedEmployeeName}</h1>
                  <p className="text-muted-foreground mt-2">
                    {formatDateFull(new Date(report.createdAt))} রিপোর্ট করা হয়েছে
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <StatusBadge status={report.status as any} />
                  <SeverityBadge severity={report.severity as any} />
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold mb-2">বিবরণ</h2>
                <p className="text-foreground leading-relaxed">{report.description}</p>
              </div>

              {/* Reporter Info */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>রিপোর্ট করেছেন:</strong> {report.anonymousReporterName}
                </p>
              </div>

              {/* Vote Section */}
              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold mb-4">কমিউনিটির প্রতিক্রিয়া</h2>
                <div className="flex items-center gap-4">
                  <VoteButtons
                    reportId={report.id}
                    upvotes={report.totalUpvotes}
                    downvotes={report.totalDownvotes}
                  />
                  <p className="text-sm text-muted-foreground">
                    {report.totalComments} টি কমেন্ট
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Comments Section — loads independently */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">কমেন্ট</h2>

          {/* Add Comment Form */}
          <Card className="p-6 border border-border">
            <div className="space-y-4">
              <Textarea
                placeholder="এই সমস্যাটি নিয়ে আপনার মতামত বা অভিজ্ঞতা শেয়ার করুন..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                disabled={isSubmitting}
              />
              <Button
                onClick={handleAddComment}
                disabled={!commentText.trim() || isSubmitting}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "পোস্ট করা হচ্ছে..." : "কমেন্ট পোস্ট করুন"}
              </Button>
            </div>
          </Card>

          {/* Comments List — shows skeleton while loading */}
          <div className="space-y-4">
            {commentsLoading ? (
              <CommentsSkeleton count={3} />
            ) : reportComments.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">এখনো কোনো কমেন্ট নেই। প্রথম কমেন্টটি আপনিই করুন!</p>
              </div>
            ) : (
              reportComments.map((comment) => (
                <Card key={comment.id} className="p-4 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{comment.anonymousCommenterName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateFull(new Date(comment.createdAt))}
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground">{comment.content}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

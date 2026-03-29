"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

interface VoteButtonsProps {
  reportId: string;
  upvotes: number;
  downvotes: number;
}

export function VoteButtons({ reportId, upvotes, downvotes }: VoteButtonsProps) {
  const { vote, removeVote, reports } = useApp();
  const report = reports.find(r => r.id === reportId);
  const currentVote = report?.currentUserVote;

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentVote === "UPVOTE") {
      await removeVote(reportId);
    } else {
      await vote(reportId, "UPVOTE");
    }
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentVote === "DOWNVOTE") {
      await removeVote(reportId);
    } else {
      await vote(reportId, "DOWNVOTE");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={currentVote === "UPVOTE" ? "default" : "ghost"}
        size="sm"
        onClick={handleUpvote}
        className="gap-1"
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="text-xs">{upvotes}</span>
      </Button>
      <Button
        variant={currentVote === "DOWNVOTE" ? "default" : "ghost"}
        size="sm"
        onClick={handleDownvote}
        className="gap-1"
      >
        <ThumbsDown className="h-4 w-4" />
        <span className="text-xs">{downvotes}</span>
      </Button>
    </div>
  );
}

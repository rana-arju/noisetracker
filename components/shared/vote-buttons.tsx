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
  const { vote, getVoteForReport } = useApp();
  const currentVote = getVoteForReport(reportId);

  const handleUpvote = () => {
    vote(reportId, currentVote?.voteType === "upvote" ? null : "upvote");
  };

  const handleDownvote = () => {
    vote(reportId, currentVote?.voteType === "downvote" ? null : "downvote");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={currentVote?.voteType === "upvote" ? "default" : "ghost"}
        size="sm"
        onClick={handleUpvote}
        className="gap-1"
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="text-xs">{upvotes}</span>
      </Button>
      <Button
        variant={currentVote?.voteType === "downvote" ? "default" : "ghost"}
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

"use client";
import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/intercation.action";
import {
  downVoteQuestion,
  upVoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDividerNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import React, { useEffect } from "react";

type VotesProps = {
  type: string;
  itemId: string;
  userId: string | null;
  upVotes: number;
  hasUpVoted: boolean | null;
  downVotes: number;
  hasDownVoted: boolean | null;
  hasSaved?: boolean | null;
};

const Votes = ({
  type,
  itemId,
  userId,
  upVotes,
  hasUpVoted,
  downVotes,
  hasDownVoted,
  hasSaved,
}: VotesProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const handleSave = async () => {
    if (!userId) {
      return;
    }

    await toggleSaveQuestion({
      userId,
      questionId: JSON.parse(itemId),
      path: pathName,
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }

    if (action === "upVote") {
      if (type === "Question") {
        await upVoteQuestion({
          userId,
          hasDownVoted: hasDownVoted!,
          hasUpVoted: hasUpVoted!,
          path: pathName,
          questionId: JSON.parse(itemId),
        });
      } else if (type === "Answer") {
        await upVoteAnswer({
          userId,
          hasDownVoted: hasDownVoted!,
          hasUpVoted: hasUpVoted!,
          path: pathName,
          answerId: JSON.parse(itemId),
        });
      }
      return;
    }
    if (action === "downVote") {
      if (type === "Question") {
        await downVoteQuestion({
          userId,
          hasDownVoted: hasDownVoted!,
          hasUpVoted: hasUpVoted!,
          path: pathName,
          questionId: JSON.parse(itemId),
        });
      } else if (type === "Answer") {
        await downVoteAnswer({
          userId,
          hasDownVoted: hasDownVoted!,
          hasUpVoted: hasUpVoted!,
          path: pathName,
          answerId: JSON.parse(itemId),
        });
      }
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId || undefined,
    });
    console.log(userId);
  }, [itemId, userId, pathName, router]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            className="cursor-pointer"
            alt={hasUpVoted ? "Up Voted" : "Up Vote"}
            onClick={() => handleVote("upVote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDividerNumber(upVotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            className="cursor-pointer "
            alt={hasDownVoted ? "Down Voted" : "Down Vote"}
            onClick={() => handleVote("downVote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDividerNumber(downVotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          className="cursor-pointer "
          alt={hasDownVoted ? "Down Voted" : "Down Vote"}
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;

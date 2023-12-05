"use client";
import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import {
  downVoteQuestion,
  upVoteQuestion,
} from "@/lib/actions/question.action";
import { formatAndDividerNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

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

  const handleSave = () => console.log("Save");
  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }

    if (action === "upVote") {
      if (type === "Question") {
        await upVoteQuestion({
          userId: JSON.parse(userId),
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
          userId: JSON.parse(userId),
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
          src={"/assets/icons/star-red.svg"}
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

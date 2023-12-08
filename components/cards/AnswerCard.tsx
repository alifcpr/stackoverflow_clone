import React from "react";
import Metric from "../shared/Metric";
import { formatAndDividerNumber, getTimestamp } from "@/lib/utils";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

type AnswerCardProps = {
  _id: string;
  question: { _id: string; title: string };
  author: { _id: number; name: string; picture: string };
  createdAt: Date;
  upvotes: string[];
  clerkId?: string | null;
};

const AnswerCard = ({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: AnswerCardProps) => {
    
  const showActionButton = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11 ">
      <div className="flex flex-col-reverse items-start justify-between gap-1 sm:flex-row">
        <Link href={`/question/${question._id}`}>
          <h3 className="sm:h3-semibold base-semibold text-dark400_light700 line-clamp-1 flex-1 font-inter">
            {question.title}
          </h3>
        </Link>
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {getTimestamp(createdAt)}
        </span>
        <SignedIn>
          <EditDeleteAction type="Answer" itemId={_id} />
        </SignedIn>
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={`- asked ${getTimestamp(createdAt)}`}
          textStyle="body-medium text-dark400_light800"
          href={`/profile/${author._id}`}
          isAuthor
        />
        <div className="flex gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatAndDividerNumber(upvotes.length)}
            title="Votes"
            textStyle="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;

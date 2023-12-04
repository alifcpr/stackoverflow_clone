import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatAndDividerNumber, getTimestamp } from "@/lib/utils";

type QuestionCardProps = {
  _id: number;
  title: string;
  tags: { _id: number; name: string }[];
  author: { _id: number; name: string; picture: string };
  views: number;
  answers: Array<object>;
  createdAt: Date;
  upVote: number;
};

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upVote,
  views,
  answers,
  createdAt,
}: QuestionCardProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11 ">
      <div className="flex flex-col-reverse items-start justify-between gap-1 sm:flex-row">
        <Link href={`/question/${_id}`}>
          <h3 className="sm:h3-semibold base-semibold text-dark400_light700 line-clamp-1 flex-1 font-inter">
            {title}
          </h3>
        </Link>
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {getTimestamp(createdAt)}
        </span>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} name={tag.name} _id={tag._id} />
        ))}
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
            value={formatAndDividerNumber(upVote)}
            title="Votes"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            value={formatAndDividerNumber(answers.length)}
            title="Answers"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDividerNumber(views)}
            title="Views"
            textStyle="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

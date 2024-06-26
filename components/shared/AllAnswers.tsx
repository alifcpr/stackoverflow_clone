import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filter";
import { getAnswers } from "@/lib/actions/answer.action";
import ParseHTML from "./ParseHTML";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import Votes from "./Votes";
import Pagination from "./Pagination";

type AllAnswersProps = {
  questionId: string;
  userId: string | null;
  totalAnswers: number;
  page?: number;
  filter?: string;
};
const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: AllAnswersProps) => {
  const result = await getAnswers({
    questionId: JSON.parse(questionId),
    sortBy: filter,
    page,
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {result.answers.map((answer: any) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="flex items-center justify-between">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex  flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt="profile"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>
                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      <span className="max-sm:hidden">
                        - answered {getTimestamp(answer.createdAt)}
                      </span>
                    </p>
                  </div>
                </Link>
                <Votes
                  type="Answer"
                  itemId={JSON.stringify(answer._id)}
                  userId={userId ? JSON.parse(userId) : null}
                  upVotes={answer.upvotes.length}
                  hasUpVoted={
                    userId ? answer.upvotes.includes(JSON.parse(userId)) : null
                  }
                  downVotes={answer.downvotes.length}
                  hasDownVoted={
                    userId
                      ? answer.downvotes.includes(JSON.parse(userId))
                      : null
                  }
                />
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <div className="mt-10 w-full">
        <Pagination pageNumber={page || 1} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default AllAnswers;

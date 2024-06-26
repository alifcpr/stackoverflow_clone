import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import getUserById from "@/lib/actions/user.action";
import { formatAndDividerNumber, getTimestamp } from "@/lib/utils";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Metadata } from "next";

const QuestionDetail = async ({ params: { id }, searchParams }: URLProps) => {
  const result = await getQuestionById({ questionId: id });
  const { userId: clerkId } = auth();

  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  } else {
    mongoUser = null;
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={
                mongoUser !== null
                  ? JSON.parse(JSON.stringify(mongoUser._id))
                  : null
              }
              upVotes={result.upvotes.length}
              hasUpVoted={
                mongoUser !== null
                  ? result.upvotes.includes(mongoUser._id)
                  : null
              }
              downVotes={result.downvotes.length}
              hasDownVoted={
                mongoUser !== null
                  ? result.downvotes.includes(mongoUser.id)
                  : null
              }
              hasSaved={
                mongoUser !== null ? mongoUser.saved.includes(result._id) : null
              }
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-4 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(result.createdAt)}`}
          title="Asked"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Message"
          value={formatAndDividerNumber(result.answers.length)}
          title="Answers"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDividerNumber(result.views)}
          title="Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.content} />
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {result.tags.map((tag: { _id: number; name: string }) => (
          <RenderTag _id={tag._id} key={tag._id} name={tag.name} />
        ))}
      </div>

      <AllAnswers
        questionId={JSON.stringify(result._id)}
        userId={mongoUser !== null ? JSON.stringify(mongoUser._id) : null}
        totalAnswers={result.answers.length}
        filter={searchParams?.filter}
        page={searchParams.page ? +searchParams.page : 1}
      />

      <Answer
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={mongoUser !== null ? JSON.stringify(mongoUser._id) : null}
      />
    </>
  );
};

export default QuestionDetail;

type metaInput = {
  params: { id: string };
};

export const generateMetadata = async ({
  params: { id },
}: metaInput): Promise<Metadata> => {
  const data = await getQuestionById({ questionId: id });

  return {
    title: data.title,
    description: data.content,
    authors: data.author.name,
  };
};

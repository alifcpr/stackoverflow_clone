import { getUserQuestins } from "@/lib/actions/user.action";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import { SearchParamsProps } from "@/types";
import Pagination from "./Pagination";

interface QuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const result = await getUserQuestins({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        {result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            clerkId={clerkId}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
            upVote={question.upvotes}
          />
        ))}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default QuestionTab;
import { getUserAsnwers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface AnswersTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({
  userId,
  clerkId,
  searchParams,
}: AnswersTabProps) => {
  const result = await getUserAsnwers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <div className="mt-4 flex flex-col gap-4">
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes}
          createdAt={answer.createdAt}
        />
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default AnswersTab;

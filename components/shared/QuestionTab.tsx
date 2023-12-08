import { getUserQuestins } from "@/lib/actions/user.action";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import { SearchParamsProps } from "@/types";

interface QuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const result = await getUserQuestins({ userId });

  return (
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
  );
};

export default QuestionTab;

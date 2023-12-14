import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constants/filter";
import Filter from "@/components/shared/Filter";
import React from "react";
import { auth } from "@clerk/nextjs";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

const Collection = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const questions = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 font-inter sm:flex-row ">
        <h1 className="h1-bold text-dark100_light900">All Collections</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchBar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for collection"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions!.savedQuestion.length > 0 ? (
          questions!.savedQuestion.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
              upVote={question.upvotes}
            />
          ))
        ) : (
          <NoResult
            title="There is no question saved to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams.page ? +searchParams.page : 1}
          isNext={questions.isNext}
        />
      </div>
    </>
  );
};

export default Collection;

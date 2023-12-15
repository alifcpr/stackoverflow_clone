import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { HomePageFilters } from "@/constants/filter";
import { getQuestionByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import React from "react";
import type { Metadata } from "next";

const TagDetail = async ({ params: { id }, searchParams }: URLProps) => {
  const result = await getQuestionByTagId({
    tagId: id,
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 font-inter sm:flex-row ">
        <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchBar
          route="/tags/id"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for tag questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
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
            title="There is no tag question to show"
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
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default TagDetail;

type metaInput = {
  params: { id: string };
};

export const generateMetadata = async ({
  params: { id },
}: metaInput): Promise<Metadata> => {
  const data = await getQuestionByTagId({
    tagId: id,
  });

  return {
    title: data.tagTitle,
    description: `${data.tagTitle} questions page`,
  };
};

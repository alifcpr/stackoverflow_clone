import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import Link from "next/link";
import React from "react";

type Question = {
  _id: number;
  title: string;
  tags: { _id: number; name: string }[];
  author: { _id: number; name: string; picture: string };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}[];

const Home = () => {
  const questions: Question = [
    {
      _id: 1,
      title:
        "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
      tags: [
        { _id: 1, name: "Next.js" },
        { _id: 2, name: "React" },
      ],
      author: {
        _id: 1,
        name: "Jhon Doe",
        picture: "test.png",
      },
      upvotes: 10,
      views: 500000,
      answers: [],
      createdAt: new Date("2021-09-01T12:00:00.000Z"),
    },
    {
      _id: 2,
      title: "How To Center A Div",
      tags: [
        { _id: 1, name: "HTML" },
        { _id: 2, name: "CSS" },
      ],
      author: {
        _id: 1,
        name: "Jhon Doe",
        picture: "test.png",
      },
      upvotes: 1,
      views: 120,
      answers: [],
      createdAt: new Date("2021-09-01T12:00:00.000Z"),
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 font-inter sm:flex-row ">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Qestion
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
          containerClasses={"hidden max-md:flex"}
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
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
            title="There is no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;

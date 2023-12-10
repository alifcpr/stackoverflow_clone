import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filter";
import Filter from "@/components/shared/Filter";
import React from "react";
import { getAllTags } from "@/lib/actions/tag.action";
import NoResult from "@/components/shared/NoResult";
import Link from "next/link";
import { SearchParamsProps } from "@/types";

const Tags = async ({ searchParams }: SearchParamsProps) => {
  const allTags = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });

  return (
    <div className="font-inter">
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {allTags.length > 0 ? (
          allTags.map((tag) => (
            <Link
              className="overflow-hidden rounded-2xl shadow-md dark:shadow-none"
              href={`/tags/${tag._id}`}
              key={tag._id}
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col  border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light900 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags Found"
            description="it looks like there no any tags found"
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </section>
    </div>
  );
};

export default Tags;

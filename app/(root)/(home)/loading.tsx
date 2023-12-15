import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">All Questions</h1>
      <div className="relative mt-11 flex w-full flex-wrap gap-5 max-md:mb-12">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28 md:hidden" />
      </div>

      <div className="my-6  gap-3 max-md:hidden md:flex">
        {[1, 2, 3, 4].map((item: number) => (
          <Skeleton key={item} className="h-12 w-28" />
        ))}
      </div>

      <div className="flex flex-col gap-y-5">
        {[1, 2, 3].map((item: number) => (
          <Skeleton key={item} className="h-48 w-full rounded-md" />
        ))}
      </div>
    </section>
  );
};

export default Loading;

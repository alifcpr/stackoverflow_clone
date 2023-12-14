import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      {/* top of propfile */}
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="flex justify-end">
          <Skeleton className=" h-10 w-32 rounded-md" />
        </div>
        <div className="order-last flex flex-col sm:order-first md:flex-row md:gap-x-5">
          <Skeleton className="h-36 w-36 rounded-full" />
          <div className="mt-10 flex flex-col gap-y-1">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="mt-4 h-5 w-28 rounded-md" />
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="mt-10">
        <h3 className="h3-bold text-dark100_light900">Stats</h3>
        <div className="mt-3 flex gap-x-5">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28 flex-1" />
          ))}
        </div>
      </div>
      {/* answers and questions */}
      <Skeleton className="mt-10 h-10 w-32" />

      <div className="mt-4 flex flex-col gap-y-7">
        {[1, 2].map((item) => (
          <Skeleton key={item} className="h-36 w-full" />
        ))}
      </div>
    </>
  );
};

export default Loading;

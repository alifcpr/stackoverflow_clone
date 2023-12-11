"use client";
import { GlobalSearchFilters } from "@/constants/filter";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");

  const [active, setActive] = useState(typeParams || "");

  const handleTypeClick = (value: string) => {
    if (value === typeParams) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(value);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type: </p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map(
          (filter: { name: string; value: string }, index: number) => (
            <button
              type="button"
              key={index}
              onClick={() => handleTypeClick(filter.value)}
              className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize hover:text-primary-500 dark:text-light-800 dark:hover:text-primary-500 ${
                active === filter.value
                  ? "bg-primary-500 text-light-900 hover:text-light-900 dark:hover:text-light-900"
                  : "bg-light-700 text-dark-400  dark:bg-dark-500"
              }`}
            >
              {filter.name}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default GlobalFilters;

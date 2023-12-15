"use client";
import { HomePageFilters } from "@/constants/filter";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const HomeFilters = () => {
  const searchParmas = useSearchParams();
  const router = useRouter();
  const query = searchParmas.get("filter");
  const [active, setActive] = useState(query || "");

  const handleTypeClick = (item: string): void => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParmas.toString(),
        key: "filter",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParmas.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10  flex-wrap gap-3 font-inter max-md:hidden md:flex">
      {HomePageFilters.map((filter: any, index: number) => (
        <Button
          key={index}
          onClick={() => handleTypeClick(filter.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none  ${
            active === filter.value
              ? "bg-primary-100 text-primary-500 dark:bg-dark-500"
              : " bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300 "
          }`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;

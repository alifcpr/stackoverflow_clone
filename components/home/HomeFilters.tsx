"use client";
import { HomePageFilters } from "@/constants/filter";
import React, { useState } from "react";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const [active, setActive] = useState("");


  return (
    <div className="mt-10  flex-wrap gap-3 font-inter md:flex">
      {HomePageFilters.map((filter, index) => (
        <Button
          key={index}
          onClick={() => setActive(filter.value)}
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

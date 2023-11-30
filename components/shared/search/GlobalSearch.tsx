"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";

const GlobalSearch = () => {
  const [value, setValue] = useState<string>("");

  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src={"/assets/icons/search.svg"}
          width={24}
          height={24}
          alt="search"
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="paragraph-regular focus:text-dark400_light700  border-none shadow-none outline-none placeholder:text-light-400 focus-visible:ring-0 focus-visible:ring-transparent dark:bg-dark-300 dark:placeholder:text-light-400"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;

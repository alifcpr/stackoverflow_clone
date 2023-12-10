"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type CustomInputProps = {
  route: string;
  iconPosition: "left" | "right";
  placeHolder: string;
  imgSrc: string;
  otherClasses?: string;
};

const  LocalSearchBar = ({
  route,
  placeHolder,
  iconPosition,
  imgSrc,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");


  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else if (pathName === route) {
        const newUrl = removeKeyFromQuery({
          params: searchParams.toString(),
          keys: ["q"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(debounceFn);
    
  }, [search, router, searchParams, pathName, route]);

  return (
    <div className="background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4">
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="Search Icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeHolder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`paragraph-regular background-light800_darkgradient !border-none text-dark-400 shadow-none !outline-none focus:border-none focus:outline-none dark:text-light-700 ${otherClasses}`}
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="Search Icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchBar;

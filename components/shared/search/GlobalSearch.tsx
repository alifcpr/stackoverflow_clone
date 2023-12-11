"use client";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import GlobalResult from "../GlobalResult";

const GlobalSearch = () => {
  const searchParams = useSearchParams();
  const globalQuery = searchParams.get("global");
  const pathName = usePathname();
  const router = useRouter();
  const searchContainerRef = useRef<null | HTMLDivElement>(null);

  const [value, setValue] = useState<string>(globalQuery || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    setIsOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathName]);

  useEffect(() => {
    const debounceFn = setTimeout(() => {
      if (value) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value,
        });
        router.push(newUrl, { scroll: false });
      }
      if (value.length === 0) {
        const newUrl = removeKeyFromQuery({
          params: searchParams.toString(),
          keys: ["global", "type"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(debounceFn);
  }, [value, router, searchParams, globalQuery]);

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (!isOpen) setIsOpen(true);
    if (e.target.value === "") setIsOpen(false);
  };

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
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
          onChange={(e) => inputHandler(e)}
          className="paragraph-regular text-dark400_light700  border-none shadow-none outline-none placeholder:text-light-400 focus-visible:ring-0 focus-visible:ring-transparent dark:bg-dark-300 dark:placeholder:text-light-400"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;

"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

type CustomInputProps = {
  route: string;
  iconPosition: "left" | "right";
  placeHolder: string;
  imgSrc: string;
  otherClasses?: string;
};

const LocalSearchBar = ({
  route,
  placeHolder,
  iconPosition,
  imgSrc,
  otherClasses,
}: CustomInputProps) => {
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
        value={""}
        onChange={() => {}}
        className={`paragraph-regular background-light800_darkgradient !border-none text-light-700 shadow-none !outline-none focus:border-none focus:outline-none dark:text-dark-400 ${otherClasses}`}
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

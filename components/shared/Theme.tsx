"use client";

import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import { themes } from "@/constants";

const Theme = () => {
  const { mode, setMode } = useTheme();

  const handleChange = (value: string) => {
    setMode(value);
    if (value !== "system") {
      localStorage.setItem("theme", value);
    } else {
      localStorage.removeItem("theme");
    }
  };

  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className=" focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=close]:bg-dark-200">
          {mode === "dark" ? (
            <Image
              src={"/assets/icons/moon.svg"}
              width={20}
              height={20}
              alt="moon"
              className="active-theme"
            />
          ) : (
            <Image
              src={"/assets/icons/sun.svg"}
              width={20}
              height={20}
              alt="sun"
              className="active-theme"
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-3rem] mt-2 min-w-[120px] rounded border bg-white py-2 dark:border-dark-400 dark:bg-dark-300">
          {themes.map((theme) => (
            <MenubarItem
              key={theme.value}
              className="flex items-center gap-4 px-2.5 py-2 hover:bg-light-700 dark:focus:bg-dark-400"
              onClick={() => handleChange(theme.value)}
            >
              <Image
                src={theme.icon}
                width={20}
                height={20}
                alt={theme.label}
                className={mode === theme.value ? "active-theme" : ""}
              />
              <span
                className={`body-semibold text-light-500 ${
                  mode === theme.value
                    ? "text-primary-500"
                    : "text-dark100_light900"
                }`}
              >
                {theme.value}
              </span>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;

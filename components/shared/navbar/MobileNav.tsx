"use client";

import React from "react";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "../../ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";

const NavContent = () => {
  const pathName = usePathname();
  return (
    <section className="flex h-full flex-col gap-6 pt-16 font-inter">
      {sidebarLinks.map((item, index) => {
        const isActive = pathName === item.route;
        return (
          <SheetClose key={index}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark-300_light500"
              } flex w-full items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                width={20}
                height={20}
                alt={item.label}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p>{item.label}</p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src={"/assets/icons/hamburger.svg"}
          width={36}
          height={36}
          className="invert-colors sm:hidden"
          alt="HamburgerMenu"
        />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="background-light900_dark200 border-none"
      >
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src={"/assets/images/site-logo.svg"}
            width={23}
            height={23}
            alt="DevFlow"
          />
          <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900">
            Dev <span className="text-primary-500">OverFlow</span>
          </p>
        </Link>
        <div>
          <SheetClose>
            <NavContent />
          </SheetClose>
          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose>
                <Link href={"/sign-in"} className="">
                  <Button className="small-medium btn-secondary w-full rounded-lg px-4 py-2">
                    <span className="primary-text-gradient">Login</span>
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose>
                <Link href={"/sign-up"} className="">
                  <Button className="small-medium light-border btn-tertiary text-dark400_light800 w-full rounded-lg px-4 py-2">
                    <span className="primary-text-gradient">Sign Up</span>
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

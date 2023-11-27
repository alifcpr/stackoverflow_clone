import React from "react";
import NavBar from "@/components/shared/NavBar";

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="background-light850_dark100 relative">
      <NavBar />
      <div className="flex">
        LeftSideBar
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl bg-red-500">{children}</div>
        </section>
        RightSideBar
      </div>
    </main>
  );
};

export default Layout;

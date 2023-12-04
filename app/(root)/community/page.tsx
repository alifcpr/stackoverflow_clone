import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { UserFilters } from "@/constants/filter";
import Filter from "@/components/shared/Filter";
import React from "react";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import UserCard from "@/components/cards/UserCard";

const Community = async () => {
  const allUsers = await getAllUsers({});

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 font-inter sm:flex-row ">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses={"min-h-[56px] sm:min-w-[170px]"}
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {allUsers.length > 0 ? (
          allUsers.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No Users Yet</p>
            <Link className="mt-2 font-bold text-accent-blue" href={"/sign-up"}>
              Join to be the frist!
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Community;

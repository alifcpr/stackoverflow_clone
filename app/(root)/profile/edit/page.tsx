import Profile from "@/components/forms/Profile";
import getUserById from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Profile | DevOverflow",
};

const EditProfile = async ({ params: { id } }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile clerkId={mongoUser._id} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default EditProfile;

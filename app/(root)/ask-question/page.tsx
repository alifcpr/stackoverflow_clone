import Question from "@/components/forms/Question";
import getUserById from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Ask Question | DevOverflow",
};

const AskQuestion = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-up");

  const userInfo = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <Question userId={JSON.parse(JSON.stringify(userInfo._id))} />
      </div>
    </div>
  );
};

export default AskQuestion;

import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import getUserById from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Question | DevOverflow",
};

const QuestionEdit = async ({ params: { id } }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: id });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          mongoUserId={JSON.parse(JSON.stringify(mongoUser._id))}
          type="Edit"
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default QuestionEdit;

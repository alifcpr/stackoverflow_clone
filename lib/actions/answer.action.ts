"use server";

import Answer from "@/database/models/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/models/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/models/user.model";

const createAnswer = async (params: CreateAnswerParams) => {
  try {
    await connectToDatabase();
    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    revalidatePath(path);
  } catch (err) {
    console.log("error from createAnswer", err);
    throw err;
  }
};

const getAnswers = async (params: GetAnswersParams) => {
  try {
    await connectToDatabase();

    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .sort({ createdAt: -1 });

    return answers;
  } catch (err) {
    console.log("error from getAnswers : ", err);
    throw err;
  }
};

export { createAnswer, getAnswers };

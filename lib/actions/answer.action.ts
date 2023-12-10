"use server";

import Answer from "@/database/models/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Question from "@/database/models/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/models/user.model";
import Interaction from "@/database/models/interaction.model";

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

    const { questionId, sortBy } = params;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestupvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .sort(sortOptions);

    return answers;
  } catch (err) {
    console.log("error from getAnswers : ", err);
    throw err;
  }
};

const upVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectToDatabase();

    const { answerId, userId, hasDownVoted, hasUpVoted, path } = params;

    let updateQuery = {};

    // upVote
    if (hasUpVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (err) {
    console.log("error from upVoteAnswer : ", err);
    throw err;
  }
};

const downVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectToDatabase();

    const { answerId, userId, hasDownVoted, hasUpVoted, path } = params;

    let updateQuery = {};

    // downVote
    if (hasDownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $push: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (err) {
    console.log("error from downVoteAnswer : ", err);
    throw err;
  }
};

const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    await connectToDatabase();
    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answer: answerId } }
    );

    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (err) {
    console.log("error from DeleteQueston : ", err);
    throw err;
  }
};

export { createAnswer, getAnswers, upVoteAnswer, downVoteAnswer, deleteAnswer };

"use server";

import Question from "@/database/models/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/models/tag.model";
import User from "@/database/models/user.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";

const getQuestions = async (params: GetQuestionsParams) => {
  try {
    await connectToDatabase();
    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return questions;
  } catch (err) {}
};

const createQuestion = async (params: CreateQuestionParams) => {
  try {
    await connectToDatabase();
    const { title, content, tags, author, path } = params;
    const question = await Question.create({ title, content, author });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findOneAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (error) {}
};

const getQuestionById = async (params: GetQuestionByIdParams) => {
  try {
    await connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (err) {
    console.log("error from getQuestionById : ", getQuestionById);
    throw err;
  }
};

const upVoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectToDatabase();

    const { questionId, userId, hasDownVoted, hasUpVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (err) {
    console.log("error from upVoteQuestion : ", err);
    throw err;
  }
};

const downVoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectToDatabase();

    const { questionId, userId, hasDownVoted, hasUpVoted, path } = params;

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (err) {
    console.log("error from upVoteQuestion : ", err);
    throw err;
  }
};

export {
  createQuestion,
  getQuestions,
  getQuestionById,
  upVoteQuestion,
  downVoteQuestion,
};
"use server";

import Question from "@/database/models/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/models/tag.model";
import User from "@/database/models/user.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Answer from "@/database/models/answer.model";
import Interaction from "@/database/models/interaction.model";
import { FilterQuery } from "mongoose";

const getQuestions = async (params: GetQuestionsParams) => {
  try {
    await connectToDatabase();

    const { searchQuery, filter } = params;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "recommended":
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;

      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User })
      .sort(sortOptions);

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

const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    await connectToDatabase();
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questoins: questionId } }
    );

    revalidatePath(path);
  } catch (err) {
    console.log("error from DeleteQueston : ", err);
    throw err;
  }
};

const editQuestion = async (params: EditQuestionParams) => {
  try {
    await connectToDatabase();
    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;

    await question.save();
    revalidatePath(path);
  } catch (err) {
    console.log("error from editQuestion : ", err);
    throw err;
  }
};

const getHotQuestions = async () => {
  try {
    await connectToDatabase();

    const hotQuestions = await Question.find({})
      .sort({ view: -1, uptoves: -1 })
      .limit(5);

    return hotQuestions;
  } catch (err) {
    console.log("error from getHotQuestions : ", err);
    throw err;
  }
};

const getTopPopularTags = async () => {
  try {
    await connectToDatabase();

    const tags = Tag.aggregate([
      { $project: { name: 1, numberOfquestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return tags;
  } catch (err) {
    console.log("error from getTopPopularTags", err);
    throw err;
  }
};

export {
  createQuestion,
  getQuestions,
  getQuestionById,
  upVoteQuestion,
  downVoteQuestion,
  deleteQuestion,
  editQuestion,
  getHotQuestions,
  getTopPopularTags,
};

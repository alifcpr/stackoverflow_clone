"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/models/user.model";
import { revalidatePath } from "next/cache";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import Question from "@/database/models/question.model";
import Tag from "@/database/models/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/models/answer.model";

const getUserById = async (params: any) => {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (err) {
    console.log("error in user action : ", err);
  }
};

const createUser = async (userData: CreateUserParams) => {
  try {
    await connectToDatabase();
    console.log("creatUser Run");
    console.log("userData All Info : ", userData);
    const newUser = await User.create(userData);
    return newUser;
  } catch (err) {
    console.log("error from createUser", err);
    throw err;
  }
};

const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectToDatabase();

    const { clerkId, updateData, path } = params;
    console.log("updateUser Run");
    const newUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
    return newUser;
  } catch (err) {
    console.log("error from updateUser : ", err);
    throw err;
  }
};

const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDatabase();

    const { clerkId } = params;
    console.log("deleteUser Run");
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User Not Found");
    }

    // const userQuestions = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (err) {
    console.log("error from deleteUser : ", err);
    throw err;
  }
};

const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    await connectToDatabase();
    const users = await User.find({}).sort({ createdAt: -1 });
    return users;
  } catch (err) {
    console.log("error from getAllUsers : ", err);
    throw err;
  }
};

const toggleSaveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    await connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User Not Found");
    }

    const isSavedQuestion = await user.saved.includes(questionId);

    if (isSavedQuestion) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (err) {
    console.log("error from toggleSaveQuestion : ", err);
    throw err;
  }
};

const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    await connectToDatabase();

    const { clerkId, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!user) {
      throw new Error("User Not Found");
    }

    const savedQuestion = user.saved;

    return { savedQuestion };
  } catch (err) {
    console.log("error from getSavedQuestions : ", err);
    throw err;
  }
};

const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User Not Found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (err) {
    console.log("error from getUserInfo : ", err);
    throw err;
  }
};

const getUserQuestins = async (params: GetUserStatsParams) => {
  try {
    await connectToDatabase();

    const { userId } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({
        view: -1,
        upvotes: -1,
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .populate({ path: "tags", model: Tag, select: "_id name" });

    return { totalQuestions, questions: userQuestions };
  } catch (err) {
    console.log("error from getUserQuestion : ", err);
    throw err;
  }
};

const getUserAsnwers = async (params: GetUserStatsParams) => {
  try {
    await connectToDatabase();

    const { userId } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .populate({ path: "question", model: Question, select: "_id title" });

    return { totalAnswers, answers: userAnswers };
  } catch (err) {
    console.log("error from getUserQuestion : ", err);
    throw err;
  }
};

export {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getSavedQuestions,
  toggleSaveQuestion,
  getUserInfo,
  getUserQuestins,
  getUserAsnwers,
};
export default getUserById;

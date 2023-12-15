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
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

const getUserById = async (params: GetUserByIdParams) => {
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

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { username: { $regex: new RegExp(searchQuery, "i") } },
        { name: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;

      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;

      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);

    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
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

    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvoted: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    const isNext = user.saved.length > pageSize;

    if (!user) {
      throw new Error("User Not Found");
    }

    const savedQuestion = user.saved;

    return { savedQuestion, isNext };
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

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpVotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },

      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpVotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (err) {
    console.log("error from getUserInfo : ", err);
    throw err;
  }
};

const getUserQuestins = async (params: GetUserStatsParams) => {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 5 } = params;
    const skipAmounts = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({
        createdAt: -1,
        view: -1,
        upvotes: -1,
      })
      .skip(skipAmounts)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .populate({ path: "tags", model: Tag, select: "_id name" });

    const isNext = totalQuestions > skipAmounts + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNext };
  } catch (err) {
    console.log("error from getUserQuestion : ", err);
    throw err;
  }
};

const getUserAsnwers = async (params: GetUserStatsParams) => {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .populate({ path: "question", model: Question, select: "_id title" });

    const isNext = totalAnswers > skipAmount + userAnswers.length;

    return { totalAnswers, answers: userAnswers, isNext };
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

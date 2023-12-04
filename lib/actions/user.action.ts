"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/models/user.model";
import { revalidatePath } from "next/cache";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
} from "./shared.types";
import Question from "@/database/models/question.model";

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

export { createUser, updateUser, deleteUser, getAllUsers };
export default getUserById;

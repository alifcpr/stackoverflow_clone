"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/models/user.model";
import { revalidatePath } from "next/cache";
import {
  CreateUserParams,
  DeleteUserParams,
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
    const newUser = await User.create(userData);
    return newUser;
  } catch (err) {
    console.log(err);
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
    console.log(err);
    throw err;
  }
};

const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDatabase();

    const { clerkId } = params;
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
    console.log(err);
    throw err;
  }
};

export { createUser, updateUser, deleteUser };
export default getUserById;

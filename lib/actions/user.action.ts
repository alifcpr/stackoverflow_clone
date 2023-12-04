"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/models/user.model";

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

export default getUserById;

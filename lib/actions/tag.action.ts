"use server";

import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/models/user.model";

const getTopInteractedTags = async (params: GetTopInteractedTagsParams) => {
  try {
    await connectToDatabase();

    const { userId, limit = 3 } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User Not Found");

    return [
      { _id: 1, name: "Tag" },
      { _id: 2, name: "TAG_1" },
    ];
  } catch (error) {}
};

export { getTopInteractedTags };

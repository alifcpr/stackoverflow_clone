"use server";

import Tag from "@/database/models/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/models/user.model";

const getTopInteractedTags = async (params: GetTopInteractedTagsParams) => {
  try {
    await connectToDatabase();

    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User Not Found");

    return [
      { _id: 1, name: "TAG_1" },
      { _id: 2, name: "TAG_2" },
      { _id: 3, name: "TAG_2" },
    ];
  } catch (error) {}
};

const getAllTags = async (params: GetAllTagsParams) => {
  const tags = await Tag.find({});
  return tags;
};

export { getTopInteractedTags, getAllTags };

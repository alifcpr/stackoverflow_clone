"use server";

import Tag, { ITag } from "@/database/models/tag.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import User from "@/database/models/user.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/models/question.model";

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

const getQuestionByTagId = async (params: GetQuestionsByTagIdParams) => {
  try {
    await connectToDatabase();

    const { tagId, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!tag) {
      throw new Error("User Not Found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (err) {
    console.log("error from getQuestionByTagId : ", err);
    throw err;
  }
};

export { getTopInteractedTags, getAllTags, getQuestionByTagId };

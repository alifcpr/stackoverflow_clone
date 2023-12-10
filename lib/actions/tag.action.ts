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
  const { searchQuery, filter, page = 1, pageSize = 10 } = params;

  const skipAmount = (page - 1) * pageSize;

  const query: FilterQuery<typeof Tag> = {};

  if (searchQuery) {
    query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
  }

  let sortOptions = {};

  switch (filter) {
    case "popular":
      sortOptions = { questions: -1 };
      break;
    case "recent":
      sortOptions = { createdAt: -1 };
      break;
    case "name":
      sortOptions = { name: -1 };
      break;
    case "old":
      sortOptions = { createdAt: 1 };
      break;
  }

  const totalTags = await Tag.countDocuments(query);

  const tags = await Tag.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);

  const isNext = totalTags > skipAmount + tags.length;
  return { tags, isNext };
};

const getQuestionByTagId = async (params: GetQuestionsByTagIdParams) => {
  try {
    await connectToDatabase();

    const { tagId, searchQuery, page = 1, pageSize = 1 } = params;

    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!tag) {
      throw new Error("User Not Found");
    }

    const isNext = tag.questions.length > pageSize;
    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (err) {
    console.log("error from getQuestionByTagId : ", err);
    throw err;
  }
};

export { getTopInteractedTags, getAllTags, getQuestionByTagId };

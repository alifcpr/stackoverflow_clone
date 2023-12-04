"use server";

import Question from "@/database/models/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/models/tag.model";

export const createQuestion = async (params: any) => {
  try {
    await connectToDatabase();
    const { title, content, tags, author, path } = params;
    const question = await Question.create({ title, content, author });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findOneAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    

  } catch (error) {}
};

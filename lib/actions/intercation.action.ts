"use server";

import Question from "@/database/models/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/models/interaction.model";

const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });
      if (existingInteraction) return console.log("User has already viewed.");
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (err) {
    console.log("error from viewQuestion : ", err);
    throw err;
  }
};

export { viewQuestion };

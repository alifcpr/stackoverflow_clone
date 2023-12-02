"use server";

import { connectToDatabase } from "../mongoose";

export const createQuestion = async (params: any ) => {
  try {
    await connectToDatabase();
  } catch (error) {}
};

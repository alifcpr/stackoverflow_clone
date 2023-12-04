import mongoose from "mongoose";

export const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return console.log("Already Connected");
  }
  await mongoose.connect(process.env.MONGODB_URL!, { dbName: "devflow" });
  console.log("Connected To Db");
};

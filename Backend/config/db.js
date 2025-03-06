import mongoose from "mongoose";
import 'dotenv/config';

export const connectDB = async () => {
  const uri = process.env.DB_URI;
  await mongoose.connect(uri)
    .then(() => console.log("DB Connected"))
    .catch((error) => console.error("DB Connection Error: ", error));
};

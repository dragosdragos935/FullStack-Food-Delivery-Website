import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://dragos68:Frumusete4.@cluster0.y5ary.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}
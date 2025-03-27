import mongoose from "mongoose";

const foodSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
    category:{type:String,required:true}
})


const foodModel=mongoose.models.food || mongoose.model("food",foodSchema);
foodSchema.index({ name: 'text' }); // Index pentru căutare text
foodSchema.index({ name: 1 });     // Index pentru autocomplete
export default foodModel;
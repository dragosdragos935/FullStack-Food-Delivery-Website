import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    category: {type: String, required: true},
    calories: {type: Number, default: 0},
    ingredients: {type: [String], default: []},
    nutritionFacts: {
        protein: {type: Number, default: 0},
        carbs: {type: Number, default: 0},
        fat: {type: Number, default: 0},
        fiber: {type: Number, default: 0}
    },
    preparationTime: {type: Number, default: 0},
    allergens: {type: [String], default: []},
    isVegan: {type: Boolean, default: false},
    isVegetarian: {type: Boolean, default: false},
    isGlutenFree: {type: Boolean, default: false},
    spicyLevel: {type: Number, min: 0, max: 5, default: 0}
});


const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

foodSchema.index({ name: 'text', description: 'text', category: 'text', ingredients: 'text' });
foodSchema.index({ name: 1 });     // Index pentru autocomplete

export default foodModel;
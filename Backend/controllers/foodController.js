import foodModel from "../models/foodModel.js";
import fs from 'fs';
import multer from "multer";

// Configurare Multer
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Adăugare produs
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const newFood = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.file.filename,
        });

        await newFood.save();
        res.json({ success: true, message: "Food Added", data: newFood });
    } catch (error) {
        console.error("Add Food Error:", error);
        res.status(500).json({ success: false, message: "Error adding food" });
    }
};

// Listare toate produsele
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("List Food Error:", error);
        res.status(500).json({ success: false, message: "Error fetching foods" });
    }
};

// Ștergere produs
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        fs.unlink(`uploads/${food.image}`, () => {});
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error("Remove Food Error:", error);
        res.status(500).json({ success: false, message: "Error removing food" });
    }
};
// Căutare produse
const searchFood = async (req, res) => {
    try {
      const searchTerm = req.query.q;
      console.log("Search term received:", searchTerm); // Log pentru depanare
      
      if (!searchTerm || searchTerm.trim().length < 2) {
        return res.status(400).json({ 
          success: false, 
          message: "Termenul de căutare trebuie să conțină minim 2 caractere" 
        });
      }
  
      const foods = await foodModel.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      }).lean();
  
      console.log("Found foods:", foods); // Log pentru verificare
      
      res.json({ 
        success: true,
        count: foods.length,
        data: foods 
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ 
        success: false,
        message: "Eroare la căutare",
        error: error.message 
      });
    }
  };
  
  // Autocomplete
  const autocompleteFood = async (req, res) => {
    try {
      const searchTerm = req.query.q;
      
      if (!searchTerm || searchTerm.length < 2) {
        return res.json({ 
          success: true, 
          data: [] 
        });
      }
  
      const foods = await foodModel.find(
        { name: { $regex: `^${searchTerm}`, $options: 'i' } },
        { _id: 1, name: 1, image: 1 }
      ).limit(5);
  
      res.json({ 
        success: true, 
        data: foods 
      });
    } catch (error) {
      console.error("Autocomplete Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Eroare la căutare predictivă" 
      });
    }
  };
  
  // Detalii produs
  const getFoodById = async (req, res) => {
    try {
      const food = await foodModel.findById(req.params.id);
      if (!food) {
        return res.status(404).json({ 
          success: false, 
          message: "Produsul nu a fost găsit" 
        });
      }
      res.json({ 
        success: true, 
        data: food 
      });
    } catch (error) {
      console.error("Get Food Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Eroare la obținerea produsului" 
      });
    }
  };

export { 
    addFood, 
    listFood, 
    removeFood, 
    searchFood, 
    autocompleteFood, 
    upload 
};
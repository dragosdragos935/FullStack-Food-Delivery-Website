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
// Căutare produse
const searchFood = async (req, res) => {
    try {
        // Verificăm dacă există termenul de căutare
        const searchTerm = req.query.q;
        console.log("Căutare produs pentru termenul:", searchTerm);  // Verificăm termenul de căutare

        // Validăm că termenul de căutare există
        if (!searchTerm || searchTerm.trim() === '') {
            console.log("Termenul de căutare este gol.");
            return res.status(400).json({
                success: false,
                message: "Termenul de căutare nu poate fi gol.",
            });
        }

        // Interogarea în baza de date
        const foods = await foodModel.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } }
            ]
        }).lean();

        // Mesaj pentru a vedea ce produse am primit
        console.log("Produse găsite (din MongoDB):", foods);  // Verificăm ce date au fost returnate

        // Dacă sunt produse, le returnăm
        if (foods && foods.length > 0) {
            res.json({
                success: true,
                data: foods,
            });
        } else {
            // Dacă nu sunt produse, returnăm un mesaj corespunzător
            console.log(`Nu s-au găsit produse pentru "${searchTerm}".`);
            res.status(404).json({
                success: false,
                message: `Nu s-au găsit produse pentru "${searchTerm}"`,
            });
        }
    } catch (error) {
        // Dacă apare o eroare în proces, o logăm
        console.error("Eroare la căutare:", error);
        res.status(500).json({
            success: false,
            message: "Eroare la căutarea produselor",
        });
    }
};

const searchFoodAutocomplete = async (req, res) => {
    try {
      const searchTerm = req.query.q;
      const foods = await foodModel.find({
        name: { $regex: searchTerm, $options: 'i' }
      }).limit(5); // Limităm rezultatele pentru a nu returna prea multe
  
      if (foods.length > 0) {
        res.json({
          success: true,
          data: foods,
        });
      } else {
        res.json({
          success: false,
          data: [],
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Eroare la autocomplete' });
    }
  };

// Autocomplete
const autocompleteFood = async (req, res) => {
    try {
        const searchTerm = req.query.q;  // Obține termenul de căutare din query string
        if (!searchTerm || searchTerm.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Termenul de căutare trebuie să aibă cel puțin 2 caractere."
            });
        }

        // Căutăm produse care se potrivesc cu termenul de căutare în nume, descriere sau categorie
        const foods = await foodModel.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },  // Căutare în câmpul 'name'
                { description: { $regex: searchTerm, $options: 'i' } },  // Căutare în câmpul 'description'
                { category: { $regex: searchTerm, $options: 'i' } }  // Căutare în câmpul 'category'
            ]
        }).limit(5)  // Limitează numărul de sugestii la 5
          .lean();  // Optimizare pentru performanță, evită să returnezi documente Mongoose

        // Răspuns dacă au fost găsite produse
        if (foods && foods.length > 0) {
            return res.json({
                success: true,
                data: foods  // Returnează produsele găsite
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Nu au fost găsite produse pentru termenul introdus."
            });
        }
    } catch (error) {
        console.error("Eroare la autocomplete:", error);
        return res.status(500).json({
            success: false,
            message: "Eroare la căutarea produselor."
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
    upload ,
    searchFoodAutocomplete
};

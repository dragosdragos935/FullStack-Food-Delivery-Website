import foodModel from "../models/foodModel.js";
import fs from 'fs';
import multer from "multer";

// Configurarea multer pentru stocarea imaginilor
const storage = multer.diskStorage({
    destination: "uploads", // Folderul unde se salvează fișierele
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Creează un nume unic pentru fiecare fișier
    }
});
const upload = multer({ storage: storage });

// Adăugarea unui element alimentar
const addFood = async (req, res) => {
    try {
        // Verificăm dacă există un fișier în cerere
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        let image_filename = `${req.file.filename}`;
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding food" });
    }
};

//all food list

const listFood = async(req,res)=>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//remove food item

const removeFood = async(req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{

        })
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


// Exportarea funcției și middleware-ului multer
export { addFood,listFood,removeFood };

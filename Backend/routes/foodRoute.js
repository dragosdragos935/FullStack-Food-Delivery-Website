import express from "express";
import { 
    addFood,
    listFood,
    removeFood,
    searchFood,
    autocompleteFood 
} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Route pentru adăugarea unui aliment
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

// Căutare produse (punctul c)
foodRouter.get("/search", searchFood);

// Căutare predictivă (punctul d)
foodRouter.get("/autocomplete", autocompleteFood);

export default foodRouter;
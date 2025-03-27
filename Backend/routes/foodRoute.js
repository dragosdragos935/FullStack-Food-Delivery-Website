import express from "express";
import { 
    addFood,
    listFood,
    removeFood,
    searchFood,
    autocompleteFood 
} from "../controllers/foodController.js";
import multer from "multer";

const router = express.Router();

// Configurare storage pentru imagini
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Definirea rutelor
router.post("/add", upload.single("image"), addFood);      // POST /api/food/add
router.get("/list", listFood);                            // GET /api/food/list
router.post("/remove", removeFood);                       // POST /api/food/remove
router.get("/search", searchFood);                       // GET /api/food/search
router.get("/autocomplete", autocompleteFood);          // GET /api/food/autocomplete

export default router;
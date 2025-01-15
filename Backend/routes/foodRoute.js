import express from "express";
import { addFood ,listFood,removeFood} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Fix utilizarea lui cb
    }
});
const upload = multer({ storage: storage });

// Route pentru adăugarea unui aliment
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood);
export default foodRouter;

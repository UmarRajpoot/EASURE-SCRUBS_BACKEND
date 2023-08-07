import express from "express";
import Colors from "../Controllers/Colors.js";
const router = express.Router();

router.post("/Colors", Colors.addColor);
router.delete("/Colors", Colors.deleteColor);
router.get("/Colors", Colors.getallColors);

export default router;

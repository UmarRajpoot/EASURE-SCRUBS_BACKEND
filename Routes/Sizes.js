import express from "express";
import Size from "../Controllers/Sizes.js";
const router = express.Router();

router.post("/Sizes", Size.addSize);
router.delete("/Sizes", Size.deleteSize);
router.get("/Sizes", Size.getallSizes);

export default router;

import express from "express";
import Type from "../Controllers/Type.js";
const router = express.Router();

router.post("/Type", Type.addType);
router.delete("/Type", Type.deleteType);
router.get("/Type", Type.getallType);

export default router;

import express from "express";
import PCateg from "../Controllers/PCateg.js";
const router = express.Router();

router.post("/PCateg", PCateg.addPCateg);
router.delete("/PCateg", PCateg.deletePCateg);
router.get("/PCateg", PCateg.getallPCateg);

export default router;

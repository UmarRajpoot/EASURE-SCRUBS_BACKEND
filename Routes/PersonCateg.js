import express from "express";
import PersonCateg from "../Controllers/PersonCateg.js";
const router = express.Router();

router.post("/PersonCateg", PersonCateg.addPersonCateg);
router.delete("/PersonCateg", PersonCateg.deletePersonCateg);
router.get("/PersonCateg", PersonCateg.getallPersonCateg);

export default router;

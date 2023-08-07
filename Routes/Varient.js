import express from "express";
import Varient from "../Controllers/Varient.js";
const router = express.Router();

router.post("/Varient", Varient.addVarient);
router.delete("/Varient", Varient.deleteVarient);
router.get("/Varient", Varient.getallVarients);

export default router;

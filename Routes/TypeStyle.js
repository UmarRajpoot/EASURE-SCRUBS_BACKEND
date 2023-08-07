import express from "express";
import TypeStyle from "../Controllers/TypeStyle.js";
const router = express.Router();

router.post("/TypeStyle", TypeStyle.addTypeStyle);
router.delete("/TypeStyle", TypeStyle.deleteTypeStyle);
router.get("/TypeStyle", TypeStyle.getallTypeStyle);

export default router;

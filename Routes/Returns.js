import express from "express";
import Returns from "../Controllers/ReturnController.js";
const router = express.Router();

router.post("/returns", Returns.addReturn);
router.get("/returns", Returns.getReturns);
router.post("/returnsDetail", Returns.getReturnDetail);
// router.delete("/returns", Returns.);

export default router;

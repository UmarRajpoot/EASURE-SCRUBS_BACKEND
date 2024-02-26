import express from "express";
import Cart from "../Controllers/Cart.js";
const router = express.Router();

router.post("/addCartItems", Cart.addCartItems);
router.put("/updateCart", Cart.updateCart);
router.delete("/deleteCart", Cart.deleteCart);
router.post("/allCartItems", Cart.getAllCartItems);
router.put("/updateAllCart", Cart.updateAll);

export default router;

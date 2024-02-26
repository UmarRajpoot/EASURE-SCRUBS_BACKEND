import express from "express";
import Orders from "../Controllers/Orders.js";
const router = express.Router();

router.post("/Order", Orders.addOrder);
router.delete("/Order", Orders.deleteColor);
router.get("/Order", Orders.getallOrders);
router.post("/Orderdetail", Orders.getOrderById);

export default router;
